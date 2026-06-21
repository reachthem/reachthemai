import type { Tables } from '@/lib/types';

type ReviewCase = Tables<'review_cases'>;
type KnowledgeBaseRow = Tables<'removal_knowledge_base'>;

const SHORTCODE_KEYS = [
  'platform',
  'review_text',
  'review_url',
  'review_rating',
  'review_date',
  'reviewer_name',
  'removal_reasons',
  'has_responded',
  'user_response',
  'reviewer_context',
] as const;

export function replaceShortcodes(
  template: string,
  reviewCase: ReviewCase
): string {
  const reasons = reviewCase.removal_reasons ?? [];
  const replacements: Record<string, string> = {
    platform: reviewCase.platform ?? '',
    review_text: reviewCase.review_text ?? 'Not provided',
    review_url: reviewCase.review_url ?? '',
    review_rating: reviewCase.review_rating
      ? `Star Rating: ${reviewCase.review_rating}/5`
      : '',
    review_date: reviewCase.review_date ? `Date Posted: ${reviewCase.review_date}` : '',
    reviewer_name: reviewCase.reviewer_name ? `Reviewer Name: ${reviewCase.reviewer_name}` : '',
    removal_reasons: reasons.join(', ') || 'None specified',
    has_responded: reviewCase.has_responded ? 'Yes' : 'No',
    user_response: reviewCase.user_response ?? '',
    reviewer_context: reviewCase.reviewer_context ?? '',
  };
  let out = template;
  for (const key of SHORTCODE_KEYS) {
    out = out.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), replacements[key]);
  }
  return out;
}

export function buildRemovalAdvisorSystemPrompt(
  reviewCase: ReviewCase,
  knowledgeBase: KnowledgeBaseRow[],
  isFollowUp: boolean = false
): string {
  const parts: string[] = [];

  parts.push(`You are an expert review removal advisor with deep knowledge of platform policies across Google, Yelp, Facebook, Trustpilot, and other major review platforms.

Your job is to:
- Analyze the review details provided
- Identify the strongest grounds for removal based on platform policy
- Give the user clear, numbered step-by-step instructions to submit a removal request themselves
- Be direct, specific, and actionable — avoid vague advice

You are NOT a general chatbot. Stay focused on review removal guidance only.`);

  parts.push(`## The Review to Be Removed

Platform: ${reviewCase.platform}
Review URL: ${reviewCase.review_url}
Review Text: "${reviewCase.review_text ?? 'Not provided'}"${
    reviewCase.review_rating ? `\nStar Rating: ${reviewCase.review_rating}/5` : ''
  }${
    reviewCase.review_date ? `\nDate Posted: ${reviewCase.review_date}` : ''
  }${
    reviewCase.reviewer_name ? `\nReviewer Name: ${reviewCase.reviewer_name}` : ''
  }`);

  const reasons = reviewCase.removal_reasons ?? [];
  parts.push(`## User's Context
Possible removal reasons identified by user: ${reasons.join(', ') || 'None specified'}
Has the user responded to the review: ${reviewCase.has_responded ? 'Yes' : 'No'}${
    reviewCase.user_response ? `\nUser's response: "${reviewCase.user_response}"` : ''
  }${
    reviewCase.reviewer_context ? `\nAdditional context: ${reviewCase.reviewer_context}` : ''
  }`);

  const platformEntries = knowledgeBase.filter(
    (e) => e.platform === reviewCase.platform && e.is_active !== false
  );

  if (platformEntries.length > 0) {
    let kbSection = `## Platform Removal Policy Reference (${reviewCase.platform})\n`;
    for (const entry of platformEntries) {
      kbSection += `
### ${entry.ground_label}
Qualifies when: ${entry.qualification_criteria}
Required information: ${entry.required_info}
Removal steps: ${entry.removal_steps}${
        entry.escalation_note ? `\nIf rejected: ${entry.escalation_note}` : ''
      }${
        entry.expected_timeline ? `\nExpected timeline: ${entry.expected_timeline}` : ''
      }${
        entry.success_rate ? `\nSuccess rate: ${entry.success_rate}` : ''
      }
`;
    }
    parts.push(kbSection);
  } else {
    parts.push(`## Platform Policy Note
No specific knowledge base entries are available for ${reviewCase.platform}. Use your training knowledge of ${reviewCase.platform}'s review policies to provide the best guidance possible.`);
  }

  parts.push(`## Your Response Format

For an initial analysis, structure your response as:

**Strongest Removal Ground:** [ground name]
**Confidence:** [High / Medium / Low]
**Why This Applies:** [2-3 sentences explaining why this review meets the removal criteria]

**Step-by-Step Instructions:**
1. [step]
2. [step]
...

**Expected Timeline:** [timeline]
**Success Rate on These Grounds:** [rate]

**If This Doesn't Work:**
[escalation advice — end with: "If you'd like our professional team to handle this for you, we offer a $299 guaranteed removal service."]

For follow-up questions, answer directly without repeating the full analysis structure.`);

  if (isFollowUp && reviewCase.ai_strategy) {
    parts.push(`## Previous Analysis (for context continuity)
${reviewCase.ai_strategy}`);
  }

  return parts.join('\n\n');
}
