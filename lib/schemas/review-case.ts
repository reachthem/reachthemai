import { z } from 'zod';

export const PLATFORMS = [
  'google', 'yelp', 'facebook', 'trustpilot', 'tripadvisor', 'bbb', 'glassdoor', 'amazon', 'other',
] as const;
export const REMOVAL_REASONS = [
  'fake_review', 'pii', 'harassment', 'competitor', 'spam', 'violates_tos', 'not_sure',
] as const;

export const REMOVAL_REASON_LABELS: Record<typeof REMOVAL_REASONS[number], string> = {
  fake_review: 'Fake Review / Not a Real Customer',
  pii: 'Contains Personal Information (PII)',
  harassment: 'Harassment, Hate Speech, or Threats',
  competitor: 'Posted by a Competitor or Conflict of Interest',
  spam: 'Spam or Off-Topic',
  violates_tos: 'Violates Platform Terms of Service',
  not_sure: "I'm Not Sure — Let AI Analyze",
};

export const PLATFORM_LABELS: Record<typeof PLATFORMS[number], string> = {
  google: 'Google',
  yelp: 'Yelp',
  facebook: 'Facebook',
  trustpilot: 'Trustpilot',
  tripadvisor: 'TripAdvisor',
  bbb: 'BBB',
  glassdoor: 'Glassdoor',
  amazon: 'Amazon',
  other: 'Other Platform',
};

export const reviewCaseIntakeSchema = z.object({
  platform: z.enum(PLATFORMS, { message: 'Please select a platform' }),
  review_url: z.string().url('Please enter a valid URL to the review'),
  review_text: z.string().min(10, 'Please paste at least a portion of the review text'),
  review_rating: z.number().int().min(1).max(5).optional(),
  review_date: z.string().min(1, 'Please enter the review date'),
  reviewer_name: z.string().optional(),
  removal_reasons: z.array(z.enum(REMOVAL_REASONS)).min(1, 'Select at least one reason'),
  has_responded: z.boolean(),
  user_response: z.string().optional(),
  reviewer_context: z.string().optional(),
});

export type ReviewCaseIntakeData = z.infer<typeof reviewCaseIntakeSchema>;

export const step1Schema = reviewCaseIntakeSchema.pick({ platform: true });
export const step2Schema = reviewCaseIntakeSchema.pick({
  review_url: true,
  review_text: true,
  review_rating: true,
  review_date: true,
  reviewer_name: true,
});
export const step3Schema = reviewCaseIntakeSchema.pick({
  removal_reasons: true,
  has_responded: true,
  user_response: true,
  reviewer_context: true,
});

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
