'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step1Schema, type Step1Data } from '@/lib/schemas/removal-request';
import { createDraftRequest, updateRequestStep1 } from '@/app/actions/removal-requests';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Mail, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Step1Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  draftData: Record<string, any> | null;
  /** From user_data (+ auth email) for signed-in users when the draft has no contact saved yet. */
  contactPrefill?: { contact_email: string; contact_phone: string } | null;
  onNext: (data?: { draftKey: string; id: string }) => void;
}

function mergeStep1Contact(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  draftData: Record<string, any> | null,
  contactPrefill: { contact_email: string; contact_phone: string } | null | undefined
) {
  const emailDraft = String(draftData?.contact_email ?? '').trim();
  const phoneDraft = String(draftData?.contact_phone ?? '').trim();
  const emailPref = contactPrefill?.contact_email?.trim() ?? '';
  const phonePref = contactPrefill?.contact_phone?.trim() ?? '';
  return {
    contact_email: emailDraft || emailPref,
    contact_phone: phoneDraft || phonePref,
  };
}

export default function Step1ContactInfo({ draftData, contactPrefill, onNext }: Step1Props) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: mergeStep1Contact(draftData, contactPrefill),
  });

  // Sync when draft loads (e.g. scan prefill) or profile prefill applies to empty draft
  useEffect(() => {
    reset(mergeStep1Contact(draftData, contactPrefill));
  }, [draftData, contactPrefill, reset]);

  const onSubmit = async (data: Step1Data) => {
    setSubmitting(true);
    setError(null);
    try {
      if (draftData?.draft_key) {
        await updateRequestStep1(draftData.draft_key, data);
        onNext();
      } else {
        const result = await createDraftRequest(data);
        onNext({ draftKey: result.draft_key, id: result.id });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          Contact Information
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          We&apos;ll use this to follow up on your removal case.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="contact_email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="contact_email"
              type="email"
              placeholder="you@company.com"
              className="pl-10"
              {...register('contact_email')}
            />
          </div>
          {errors.contact_email && (
            <p className="mt-1 text-sm text-red-600">{errors.contact_email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="contact_phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="contact_phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              className="pl-10"
              {...register('contact_phone')}
            />
          </div>
          {errors.contact_phone && (
            <p className="mt-1 text-sm text-red-600">{errors.contact_phone.message}</p>
          )}
          <p className="mt-1 text-xs text-slate-400">
            We only use this to follow up on your removal case.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save &amp; Continue
        </Button>
      </div>
    </form>
  );
}
