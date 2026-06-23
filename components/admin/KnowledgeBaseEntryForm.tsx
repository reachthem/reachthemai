'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { upsertKnowledgeBaseEntry } from '@/app/actions/admin-knowledge-base';
import type { Tables } from '@/lib/types';

type Entry = Tables<'removal_knowledge_base'>;

interface KnowledgeBaseEntryFormProps {
  entry?: Entry;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormData {
  platform: string;
  ground: string;
  ground_label: string;
  qualification_criteria: string;
  required_info: string;
  removal_steps: string;
  escalation_note: string;
  expected_timeline: string;
  success_rate: string;
  last_verified: string;
  is_active: boolean;
}

export default function KnowledgeBaseEntryForm({ entry, onSuccess, onCancel }: KnowledgeBaseEntryFormProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      platform: entry?.platform ?? 'google',
      ground: entry?.ground ?? '',
      ground_label: entry?.ground_label ?? '',
      qualification_criteria: entry?.qualification_criteria ?? '',
      required_info: entry?.required_info ?? '',
      removal_steps: entry?.removal_steps ?? '',
      escalation_note: entry?.escalation_note ?? '',
      expected_timeline: entry?.expected_timeline ?? '',
      success_rate: entry?.success_rate ?? '',
      last_verified: entry?.last_verified ?? new Date().toISOString().split('T')[0],
      is_active: entry?.is_active ?? true,
    },
  });

  async function onSubmit(data: FormData) {
    setSaving(true);
    setError(null);
    try {
      await upsertKnowledgeBaseEntry({
        id: entry?.id,
        ...data,
        is_active: data.is_active,
      });
      onSuccess();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Platform</label>
          <select
            {...register('platform', { required: 'Required' })}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          >
            <option value="google">Google</option>
            <option value="yelp">Yelp</option>
            <option value="facebook">Facebook</option>
            <option value="trustpilot">Trustpilot</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Ground</label>
          <select
            {...register('ground', { required: 'Required' })}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          >
            <option value="fake_review">Fake Review</option>
            <option value="pii">PII / Private Info</option>
            <option value="harassment">Harassment</option>
            <option value="competitor">Competitor</option>
            <option value="spam">Spam</option>
            <option value="violates_tos">Violates TOS</option>
            <option value="conflict_of_interest">Conflict of Interest</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Ground Label</label>
        <input
          {...register('ground_label', { required: 'Required' })}
          className="w-full rounded-lg border px-3 py-2 text-sm"
          placeholder="Human-readable label"
        />
        {errors.ground_label && <p className="mt-1 text-xs text-red-500">{errors.ground_label.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Qualification Criteria</label>
        <textarea
          {...register('qualification_criteria', { required: 'Required' })}
          rows={3}
          className="w-full rounded-lg border px-3 py-2 text-sm"
        />
        {errors.qualification_criteria && <p className="mt-1 text-xs text-red-500">{errors.qualification_criteria.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Required Info</label>
        <textarea
          {...register('required_info', { required: 'Required' })}
          rows={3}
          className="w-full rounded-lg border px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Removal Steps</label>
        <textarea
          {...register('removal_steps', { required: 'Required' })}
          rows={5}
          className="w-full rounded-lg border px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Escalation Note (optional)</label>
        <textarea
          {...register('escalation_note')}
          rows={2}
          className="w-full rounded-lg border px-3 py-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Expected Timeline</label>
          <input
            {...register('expected_timeline')}
            className="w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="e.g., 3-7 business days"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Success Rate</label>
          <input
            {...register('success_rate')}
            className="w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="e.g., ~65%"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Last Verified</label>
          <input
            {...register('last_verified')}
            type="date"
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input {...register('is_active')} type="checkbox" id="is_active" className="rounded" />
        <label htmlFor="is_active" className="text-sm">Active</label>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex justify-end gap-3 border-t pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {entry ? 'Update Entry' : 'Create Entry'}
        </button>
      </div>
    </form>
  );
}
