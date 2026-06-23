'use server';

import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { contactSchema, type ContactFormData } from '@/lib/schemas/contact';
import type { Database } from '@/lib/types';

export async function submitContactForm(data: ContactFormData): Promise<{ success: true }> {
  const parsed = contactSchema.parse(data);

  const supabase = await createServerAdminClient();

  const row: Database['public']['Tables']['submissions']['Insert'] = {
    first_name: parsed.first_name,
    last_name: parsed.last_name,
    email_address: parsed.email_address,
    phone_number: parsed.phone_number ?? null,
    message: parsed.message,
  };

  const { error } = await supabase
    .from('submissions')
    .insert(row as never);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}

export async function deleteSubmission(id: string): Promise<{ success: true }> {
  const supabase = await createServerAdminClient();

  const { error } = await supabase
    .from('submissions')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}
