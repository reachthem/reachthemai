'use client';

import { type UseFormRegister, type FieldErrors } from 'react-hook-form';
import { ExternalLink, Star } from 'lucide-react';
import type { ReviewCaseIntakeData } from '@/lib/schemas/review-case';

interface StepReviewDetailsProps {
  register: UseFormRegister<ReviewCaseIntakeData>;
  errors: FieldErrors<ReviewCaseIntakeData>;
  rating: number | undefined;
  onRatingChange: (rating: number) => void;
  reviewUrl: string;
}

export default function StepReviewDetails({
  register,
  errors,
  rating,
  onRatingChange,
  reviewUrl,
}: StepReviewDetailsProps) {
  return (
    <div className="space-y-5">
      <h3 className="mb-1 text-lg font-semibold">Review Details</h3>
      <p className="mb-4 text-sm text-secondary-500">
        Provide the review information so our AI can analyze it.
      </p>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Link to the Review <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <input
            {...register('review_url')}
            type="url"
            placeholder="https://..."
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          {reviewUrl && (
            <a
              href={reviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-lg border px-3 py-2 text-sm text-[var(--color-primary)] hover:bg-gray-50"
            >
              <ExternalLink className="h-4 w-4" /> Open
            </a>
          )}
        </div>
        <p className="mt-1 text-xs text-secondary-500">
          Paste the direct URL to the review on the platform
        </p>
        {errors.review_url && (
          <p className="mt-1 text-xs text-red-500">{errors.review_url.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Review Text <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('review_text')}
          rows={4}
          placeholder="Paste the full review here..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
        {errors.review_text && (
          <p className="mt-1 text-xs text-red-500">{errors.review_text.message}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Star Rating (optional)</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onRatingChange(star)}
              className="p-0.5"
            >
              <Star
                className={`h-6 w-6 ${
                  (rating ?? 0) >= star
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Date Posted <span className="text-red-500">*</span>
          </label>
          <input
            {...register('review_date')}
            type="date"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          {errors.review_date && (
            <p className="mt-1 text-xs text-red-500">{errors.review_date.message}</p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Reviewer Name (optional)</label>
          <input
            {...register('reviewer_name')}
            type="text"
            placeholder="Who left the review?"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
      </div>
    </div>
  );
}
