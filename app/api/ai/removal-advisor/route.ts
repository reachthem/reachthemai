import { NextResponse } from 'next/server';
import { createSSRSassClient } from '@/lib/supabase/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import {
  buildRemovalAdvisorSystemPrompt,
  buildRemovalAdvisorSystemPromptFromCustom,
} from '@/lib/removal-advisor-prompt';

export async function POST(request: Request) {
  try {
    const sassClient = await createSSRSassClient();
    const supabase = sassClient.getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const adminClient = (await createServerAdminClient()) as any;

    const { data: userData } = await adminClient
      .from('user_data')
      .select('subscription_tier, user_role')
      .eq('user_id', user.id)
      .single();

    if (userData?.subscription_tier !== 'removal_advisor' && userData?.user_role !== 'admin') {
      return NextResponse.json({ error: 'Subscription required' }, { status: 403 });
    }

    const body = await request.json();
    const { caseId, messages, sessionId: incomingSessionId } = body;

    if (!caseId) {
      return NextResponse.json({ error: 'caseId is required' }, { status: 400 });
    }

    const { data: reviewCase, error: caseError } = await adminClient
      .from('review_cases')
      .select('*')
      .eq('id', caseId)
      .eq('user_id', user.id)
      .single();

    if (caseError || !reviewCase) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    const { data: knowledgeBase } = await adminClient
      .from('removal_knowledge_base')
      .select('*')
      .eq('platform', reviewCase.platform)
      .eq('is_active', true);

    const { data: customPromptRow } = await adminClient
      .from('admin_settings')
      .select('option_value')
      .eq('option_key', 'ai.advisor_prompt')
      .single();

    const currentSessionId = incomingSessionId || reviewCase.ai_session_id || crypto.randomUUID();
    const isFollowUp = Array.isArray(messages) && messages.length > 1;
    const userMessage = messages?.[messages.length - 1]?.content || 'Analyze this review and provide removal instructions.';

    await adminClient.from('user_messages').insert({
      user_id: user.id,
      session_id: currentSessionId,
      role: 'user',
      content: userMessage,
      chat_type: 'removal_advisor',
    });

    const customPrompt = customPromptRow?.option_value?.trim();
    const systemPrompt =
      customPrompt
        ? buildRemovalAdvisorSystemPromptFromCustom(
            customPrompt,
            reviewCase,
            knowledgeBase ?? [],
            isFollowUp
          )
        : buildRemovalAdvisorSystemPrompt(
            reviewCase,
            knowledgeBase ?? [],
            isFollowUp
          );

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

    const aiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      },
      body: JSON.stringify({
        model,
        stream: true,
        messages: [
          { role: 'system', content: systemPrompt },
          ...(messages ?? [{ role: 'user', content: userMessage }]),
        ],
      }),
    });

    if (!aiResponse.ok || !aiResponse.body) {
      const errorText = await aiResponse.text().catch(() => 'Unknown error');
      console.error('OpenRouter error:', errorText);
      return NextResponse.json({ error: 'AI service error' }, { status: 502 });
    }

    let fullContent = '';
    const reader = aiResponse.body.getReader();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (!line.startsWith('data: ')) continue;
              const data = line.slice(6).trim();
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  fullContent += content;
                  controller.enqueue(new TextEncoder().encode(content));
                }
              } catch {
                // skip unparseable chunks
              }
            }
          }
        } catch (e) {
          console.error('Stream processing error:', e);
        } finally {
          await adminClient.from('user_messages').insert({
            user_id: user.id,
            session_id: currentSessionId,
            role: 'assistant',
            content: fullContent,
            chat_type: 'removal_advisor',
          });

          if (!isFollowUp && fullContent) {
            let ground = null;
            let confidence = null;
            const groundMatch = fullContent.match(/\*\*Strongest Removal Ground:\*\*\s*(.+)/);
            const confidenceMatch = fullContent.match(/\*\*Confidence:\*\*\s*(\w+)/);
            if (groundMatch) ground = groundMatch[1].trim();
            if (confidenceMatch) confidence = confidenceMatch[1].trim().toLowerCase();

            await adminClient
              .from('review_cases')
              .update({
                ai_strategy: fullContent,
                ai_session_id: currentSessionId,
                ai_analyzed_at: new Date().toISOString(),
                ai_removal_ground: ground,
                ai_confidence: confidence,
                status: 'analyzed',
                updated_at: new Date().toISOString(),
              })
              .eq('id', caseId);
          }

          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'X-Session-Id': currentSessionId,
      },
    });
  } catch (error) {
    console.error('Removal advisor API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
