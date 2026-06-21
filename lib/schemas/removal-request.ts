import { z } from 'zod';

export const removalRequestSchema = z.object({
  platformSelect: z.string().min(1, 'Platform is required'),
  reviewURL: z.string().url('Valid review URL is required'),
  reviewContent: z.string().min(10, 'Review content must be at least 10 characters'),
  reviewAuthor: z.string().optional(),
  reviewRating: z.number().min(1).max(5).optional(),
  reviewDate: z.string().optional(),
  removalReasons: z.array(z.string()),
  hasResponded: z.boolean().optional(),
  userResponse: z.string().optional(),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  additionalContext: z.string().optional(),
});

export type RemovalRequestInput = z.infer<typeof removalRequestSchema>;
