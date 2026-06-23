import { z } from 'zod';

export const contactSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  email_address: z.string().email('Please enter a valid email address'),
  phone_number: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type ContactFormData = z.infer<typeof contactSchema>;
