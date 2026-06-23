import { z } from 'zod';

/** Primary platforms shown as top-level options on Review Details step */
export const PRIMARY_PLATFORMS = [
  'google',
  'yelp',
  'facebook',
  'trustpilot',
  'tripadvisor',
] as const;

/** Additional platforms shown in the "Other" accordion (same as home page banner) */
export const OTHER_PLATFORMS = [
  'bbb',
  'glassdoor',
  'amazon',
  'angi',
  'homeadvisor',
  'healthgrades',
  'avvo',
  'cars_com',
  'dealer_rater',
  'zocdoc',
  'vitals',
] as const;

/** All valid platform values (other = legacy/generic, prefer specific from OTHER_PLATFORMS) */
export const PLATFORMS = [...PRIMARY_PLATFORMS, ...OTHER_PLATFORMS, 'other'] as const;

export const REMOVAL_REASONS = [
  'fake_review',
  'violates_tos',
  'competitor',
  'spam',
  'harassment',
  'not_sure',
  'other',
] as const;

export const step1Schema = z.object({
  contact_email: z.string().email('Please enter a valid email address'),
  contact_phone: z.string().min(7, 'Phone number must be at least 7 digits'),
});

export const step2Schema = z.object({
  platform: z.enum(PLATFORMS, { message: 'Please select a platform' }),
  review_url: z.string().url('Please enter a valid URL'),
  review_content: z.string().optional(),
  review_author: z.string().optional(),
  review_rating: z.number().int().min(1).max(5).optional(),
  review_date: z.string().min(1, 'Please enter the review date'),
});

export const step3Schema = z.object({
  description: z.string().min(20, 'Description must be at least 20 characters'),
});

export const step4Schema = z.object({
  evidence_urls: z.array(z.string()).optional(),
});

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type Step4Data = z.infer<typeof step4Schema>;
