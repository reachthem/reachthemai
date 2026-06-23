import { NextRequest, NextResponse } from 'next/server';
import { createSSRSassClient } from '@/lib/supabase/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';

const VIOLATION_TYPES = [
  'spam_fake',
  'off_topic',
  'restricted',
  'illegal',
  'sexually_explicit',
  'conflict',
  'impersonation',
  'harassment',
  'clean',
] as const;

function buildClassificationPrompt(reviews: { id: string; text: string; rating: number | null }[]): string {
  const reviewBlock = reviews
    .map((r, i) => `[Review ${i + 1} | ID: ${r.id}]\nRating: ${r.rating ?? 'N/A'}/5\nText: "${r.text || '(no text)'}"`)
    .join('\n\n');

  return `You are an expert Google Review policy analyst. Classify each review below against Google's Maps User Contributed Content Policy.

For EACH review, return a JSON object with these fields:
- "review_id": the ID provided
- "violation_type": one of: ${VIOLATION_TYPES.join(', ')}
- "confidence_score": 0-100 integer (how confident you are this violates the policy)
- "policy_citation": the specific Google policy section violated (null if clean)
- "removal_ground": brief label for the removal ground (null if clean)
- "ai_explanation": 1-2 sentence explanation of why this review violates or doesn't violate the policy

Classification rules:
- "spam_fake": Fake reviews, paid reviews, bot-generated, competitor reviews, reviews from people who never visited
- "off_topic": Not about the actual customer experience at this business
- "restricted": Content about regulated goods/services (alcohol, gambling, tobacco, firearms, health supplements)
- "illegal": Reviews promoting illegal activity
- "sexually_explicit": Contains sexual or obscene content
- "conflict": Reviewer has a conflict of interest (employee, competitor, ex-employee)
- "impersonation": Reviewer pretending to be someone else
- "harassment": Threats, personal attacks, discrimination, hate speech, doxxing
- "clean": Legitimate review that does not violate any policy

Important:
- Be conservative. Only flag reviews where there is genuine evidence of a violation.
- A negative review is NOT a violation by itself. Bad experiences are legitimate.
- Rating alone (1-star) does NOT make a review fake or spam.
- Look for specific linguistic signals: vagueness suggesting no visit, copy-paste patterns, threats, irrelevant content.

Return ONLY a valid JSON array. No markdown fences, no extra text.

${reviewBlock}`;
}

export async function POST(request: NextRequest) {
  try {
    const sassClient = await createSSRSassClient();
    const supabase = sassClient.getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { scanId } = body;

    if (!scanId) {
      return NextResponse.json({ error: 'scanId is required' }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const adminClient = (await createServerAdminClient()) as any;

    const { data: scan, error: scanError } = await adminClient
      .from('business_scans')
      .select('*')
      .eq('id', scanId)
      .eq('user_id', user.id)
      .single();

    if (scanError || !scan) {
      return NextResponse.json({ error: 'Scan not found' }, { status: 404 });
    }

    if (scan.status !== 'scraped') {
      return NextResponse.json({ error: 'Scan must be in scraped status to analyze' }, { status: 400 });
    }

    await adminClient
      .from('business_scans')
      .update({ status: 'analyzing', updated_at: new Date().toISOString() })
      .eq('id', scanId);

    const { data: reviews, error: reviewsError } = await adminClient
      .from('scanned_reviews')
      .select('id, review_text, rating')
      .eq('scan_id', scanId)
      .order('created_at', { ascending: true });

    if (reviewsError || !reviews || reviews.length === 0) {
      await adminClient
        .from('business_scans')
        .update({ status: 'analyzed', threats_found: 0, updated_at: new Date().toISOString() })
        .eq('id', scanId);

      return NextResponse.json({ scanId, status: 'analyzed', threatsFound: 0 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 500 });
    }

    const { data: modelRow } = await adminClient
      .from('admin_settings')
      .select('option_value')
      .eq('option_key', 'ai.default_model')
      .single();
    const model = modelRow?.option_value ?? 'anthropic/claude-3.5-sonnet';

    const BATCH_SIZE = 15;
    let totalThreats = 0;

    for (let i = 0; i < reviews.length; i += BATCH_SIZE) {
      const batch = reviews.slice(i, i + BATCH_SIZE);
      const prompt = buildClassificationPrompt(
        batch.map((r: { id: string; review_text: string | null; rating: number | null }) => ({
          id: r.id,
          text: r.review_text ?? '',
          rating: r.rating,
        }))
      );

      const aiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: 'You are a JSON-only API. Return only valid JSON arrays.' },
            { role: 'user', content: prompt },
          ],
          temperature: 0.1,
          max_tokens: 4096,
        }),
      });

      if (!aiResponse.ok) {
        console.error('OpenRouter error during analysis batch', i);
        continue;
      }

      const aiData = await aiResponse.json();
      const rawContent = aiData.choices?.[0]?.message?.content?.trim() ?? '';

      let classifications: Array<{
        review_id: string;
        violation_type: string;
        confidence_score: number;
        policy_citation: string | null;
        removal_ground: string | null;
        ai_explanation: string | null;
      }>;

      try {
        const cleaned = rawContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        classifications = JSON.parse(cleaned);
      } catch {
        console.error('Failed to parse AI classification response for batch', i);
        continue;
      }

      for (const cls of classifications) {
        const violationType = VIOLATION_TYPES.includes(cls.violation_type as typeof VIOLATION_TYPES[number])
          ? cls.violation_type
          : 'clean';

        const isThreat = violationType !== 'clean';
        if (isThreat) totalThreats++;

        await adminClient.from('review_threat_analysis').upsert(
          {
            scanned_review_id: cls.review_id,
            violation_type: violationType,
            confidence_score: Math.min(100, Math.max(0, Math.round(cls.confidence_score))),
            policy_citation: cls.policy_citation ?? null,
            removal_ground: cls.removal_ground ?? null,
            ai_explanation: cls.ai_explanation ?? null,
            is_threat: isThreat,
            analyzed_at: new Date().toISOString(),
          },
          { onConflict: 'scanned_review_id' }
        );
      }
    }

    await adminClient
      .from('business_scans')
      .update({
        status: 'analyzed',
        threats_found: totalThreats,
        updated_at: new Date().toISOString(),
      })
      .eq('id', scanId);

    return NextResponse.json({
      scanId,
      status: 'analyzed',
      reviewsAnalyzed: reviews.length,
      threatsFound: totalThreats,
    });
  } catch (error) {
    console.error('Analyze API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
