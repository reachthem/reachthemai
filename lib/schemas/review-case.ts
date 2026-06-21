import { z } from 'zod';

export const reviewCaseSchema = z.object({
  platform: z.string().min(1),
  review_url: z.string().url(),
  review_text: z.string().optional(),
  review_rating: z.number().min(1).max(5).optional(),
  review_date: z.string().optional(),
  reviewer_name: z.string().optional(),
  removal_reasons: z.array(z.string()).optional(),
  has_responded: z.boolean().optional(),
  user_response: z.string().optional(),
  reviewer_context: z.string().optional(),
});

export type ReviewCaseInput = z.infer<typeof reviewCaseSchema>;
