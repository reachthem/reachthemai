'use client';

import { type UseFormRegister, type FieldErrors } from 'react-hook-form';
import { REMOVAL_REASONS, REMOVAL_REASON_LABELS, type ReviewCaseIntakeData } from '@/lib/schemas/review-case';
import {
  AlertTriangle,
  FileX,
  Users,
  Trash2,
  MessageSquareX,
  HelpCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const REASON_CONFIG: Record<string, { label: string; description: string; icon: typeof AlertTriangle }> = {
  fake_review: { label: 'Fake Review / Not a Real Customer', description: 'The review was not written by a real customer', icon: AlertTriangle },
  pii: { label: 'Contains Personal Information (PII)', description: 'The review exposes private or personal data', icon: FileX },
  harassment: { label: 'Harassment, Hate Speech, or Threats', description: 'The review contains harassment or threats', icon: MessageSquareX },
  competitor: { label: 'Posted by a Competitor or Conflict of Interest', description: 'The review was posted by a competitor', icon: Users },
  spam: { label: 'Spam or Off-Topic', description: 'The review is spam or irrelevant content', icon: Trash2 },
  violates_tos: { label: 'Violates Platform Terms of Service', description: 'The review violates the platform\'s terms of service', icon: FileX },
  not_sure: { label: "I'm Not Sure — Let AI Analyze", description: 'I am not sure what to report', icon: HelpCircle },
};

interface StepContextProps {
  register: UseFormRegister<ReviewCaseIntakeData>;
  errors: FieldErrors<ReviewCaseIntakeData>;
  selectedReasons: string[];
  onReasonToggle: (reason: string) => void;
  hasResponded: boolean;
  onHasRespondedChange: (value: boolean) => void;
}

export default function StepContext({
  register,
  errors,
  selectedReasons,
  onReasonToggle,
  hasResponded,
  onHasRespondedChange,
}: StepContextProps) {
  return (
    <div className="space-y-5">
      <h3 className="mb-1 text-lg font-semibold">Context for AI Analysis</h3>
      <p className="mb-4 text-sm text-secondary-500">
        Help our AI identify the strongest removal grounds.
      </p>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Why should this review be removed? <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {REMOVAL_REASONS.map((reason) => {
            const config = REASON_CONFIG[reason] ?? { label: REMOVAL_REASON_LABELS[reason], description: '', icon: HelpCircle };
            const Icon = config.icon;
            const isSelected = selectedReasons.includes(reason);
            return (
              <button
                key={reason}
                type="button"
                onClick={() => onReasonToggle(reason)}
                className={cn(
                  'flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all',
                  isSelected
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-1 ring-primary-500'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                )}
              >
                <Icon className={cn('h-5 w-5 mt-0.5 shrink-0', isSelected ? 'text-primary-600' : 'text-gray-400')} />
                <div>
                  <p className={cn('text-sm font-semibold', isSelected ? 'text-primary-700 dark:text-primary-400' : 'text-slate-900 dark:text-white')}>
                    {config.label}
                  </p>
                  {config.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {config.description}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        {errors.removal_reasons && (
          <p className="mt-1 text-xs text-red-500">{errors.removal_reasons.message}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onHasRespondedChange(!hasResponded)}
          className={`relative h-6 w-11 rounded-full transition-colors ${
            hasResponded ? 'bg-primary-600' : 'bg-gray-300'
          }`}
        >
          <span
            className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
              hasResponded ? 'translate-x-5' : ''
            }`}
          />
        </button>
        <label className="text-sm font-medium">Have you responded to this review?</label>
      </div>

      {hasResponded && (
        <div>
          <label className="mb-1 block text-sm font-medium">Your Response</label>
          <textarea
            {...register('user_response')}
            rows={3}
            placeholder="Paste your response to the review..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium">Any additional context? (optional)</label>
        <textarea
          {...register('reviewer_context')}
          rows={3}
          placeholder="Do you know who left this? Any relevant background..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
        />
      </div>
    </div>
  );
}
