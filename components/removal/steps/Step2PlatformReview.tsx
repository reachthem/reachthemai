'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step2Schema, type Step2Data, PRIMARY_PLATFORMS, OTHER_PLATFORMS } from '@/lib/schemas/removal-request';
import { updateRequestStep2 } from '@/app/actions/removal-requests';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Loader2, ChevronDown, ChevronUp, ArrowLeft, ExternalLink, Star } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const PLATFORM_CONFIG: Record<string, { label: string; color: string }> = {
  google: { label: 'Google', color: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' },
  yelp: { label: 'Yelp', color: 'border-red-500 bg-red-50 dark:bg-red-900/20' },
  facebook: { label: 'Facebook', color: 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' },
  trustpilot: { label: 'Trustpilot', color: 'border-green-600 bg-green-50 dark:bg-green-900/20' },
  tripadvisor: { label: 'TripAdvisor', color: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' },
  bbb: { label: 'BBB', color: 'border-cyan-700 bg-cyan-50 dark:bg-cyan-900/20' },
  glassdoor: { label: 'Glassdoor', color: 'border-green-600 bg-green-50 dark:bg-green-900/20' },
  amazon: { label: 'Amazon', color: 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' },
  angi: { label: 'Angi', color: 'border-red-500 bg-red-50 dark:bg-red-900/20' },
  homeadvisor: { label: 'HomeAdvisor', color: 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' },
  healthgrades: { label: 'Healthgrades', color: 'border-sky-600 bg-sky-50 dark:bg-sky-900/20' },
  avvo: { label: 'Avvo', color: 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' },
  cars_com: { label: 'Cars.com', color: 'border-violet-500 bg-violet-50 dark:bg-violet-900/20' },
  dealer_rater: { label: 'DealerRater', color: 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' },
  zocdoc: { label: 'Zocdoc', color: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' },
  vitals: { label: 'Vitals', color: 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' },
  other: { label: 'Other', color: 'border-slate-400 bg-slate-50 dark:bg-slate-800' },
};

interface Step2Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  draftData: Record<string, any> | null;
  draftKey: string;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2PlatformReview({ draftData, draftKey, onNext, onBack }: Step2Props) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      platform: (draftData?.platform as Step2Data['platform']) ?? undefined,
      review_url: draftData?.review_url ?? '',
      review_content: draftData?.review_content ?? '',
      review_author: draftData?.review_author ?? '',
      review_rating: draftData?.review_rating != null ? Number(draftData.review_rating) : undefined,
      review_date: draftData?.review_date ?? '',
    },
  });

  const selectedPlatform = watch('platform');
  const reviewUrl = watch('review_url') ?? '';
  const reviewRating = watch('review_rating');
  const isValidReviewUrl = typeof reviewUrl === 'string' && /^https?:\/\/.+/.test(reviewUrl.trim());

  const onSubmit = async (data: Step2Data) => {
    setSubmitting(true);
    setError(null);
    try {
      await updateRequestStep2(draftKey, data);
      onNext();
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
          Review Details
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Tell us where the review was posted.
        </p>
      </div>

      {/* Platform selector */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
          Platform
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {PRIMARY_PLATFORMS.map((platform) => {
            const config = PLATFORM_CONFIG[platform];
            const isSelected = selectedPlatform === platform;
            return (
              <button
                key={platform}
                type="button"
                onClick={() => setValue('platform', platform, { shouldValidate: true })}
                className={cn(
                  'flex items-center justify-center p-4 rounded-xl border-2 text-sm font-medium transition-all',
                  isSelected
                    ? `${config.color} ring-2 ring-primary-500`
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                )}
              >
                {config.label}
              </button>
            );
          })}
        </div>

        <Accordion
          type="single"
          collapsible
          defaultValue={OTHER_PLATFORMS.includes(selectedPlatform as (typeof OTHER_PLATFORMS)[number]) || selectedPlatform === 'other' ? 'other' : undefined}
          className="mt-3 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden"
        >
          <AccordionItem value="other" className="border-none">
            <AccordionTrigger className="px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:no-underline [&[data-state=open]]:border-b [&[data-state=open]]:border-slate-200 dark:[&[data-state=open]]:border-slate-700">
              Other
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 px-4 pb-4 pt-1">
                {OTHER_PLATFORMS.map((platform) => {
                  const config = PLATFORM_CONFIG[platform];
                  const isSelected = selectedPlatform === platform;
                  return (
                    <button
                      key={platform}
                      type="button"
                      onClick={() => setValue('platform', platform, { shouldValidate: true })}
                      className={cn(
                        'flex items-center justify-center p-4 rounded-xl border-2 text-sm font-medium transition-all',
                        isSelected
                          ? `${config.color} ring-2 ring-primary-500`
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      )}
                    >
                      {config.label}
                    </button>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {errors.platform && (
          <p className="mt-2 text-sm text-red-600">{errors.platform.message}</p>
        )}
      </div>

      {/* Review URL */}
      <div>
        <label htmlFor="review_url" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Review URL
        </label>
        <div className="flex gap-2 items-start">
          <Input
            id="review_url"
            type="url"
            placeholder="https://..."
            className="flex-1 min-w-0"
            {...register('review_url')}
          />
          {isValidReviewUrl && (
            <a
              href={reviewUrl.trim()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 shrink-0 px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              View review
            </a>
          )}
        </div>
        {errors.review_url && (
          <p className="mt-1 text-sm text-red-600">{errors.review_url.message}</p>
        )}

        <button
          type="button"
          onClick={() => setShowHint(!showHint)}
          className="mt-2 flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700"
        >
          How to find your review URL
          {showHint ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
        {showHint && (
          <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <p><strong>Google:</strong> Find the review in Google Maps, click the three dots, then &quot;Share review&quot;.</p>
            <p><strong>Yelp:</strong> Open the review on Yelp and copy the URL from your browser.</p>
            <p><strong>Facebook:</strong> Click the timestamp on the review to get a direct link.</p>
            <p><strong>Trustpilot:</strong> Open the review and copy the URL from your browser.</p>
          </div>
        )}
      </div>

      {/* Review Author */}
      <div>
        <label htmlFor="review_author" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Review Author <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <Input
          id="review_author"
          type="text"
          placeholder="Name of the person who wrote the review"
          {...register('review_author')}
        />
      </div>

      {/* Review Content */}
      <div>
        <label htmlFor="review_content" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Review Content <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <textarea
          id="review_content"
          rows={4}
          placeholder="Paste the review text here..."
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          {...register('review_content')}
        />
      </div>

      {/* Star rating (optional) */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Star Rating <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <div className="flex gap-1">
          {([1, 2, 3, 4, 5] as const).map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setValue('review_rating', star, { shouldValidate: true })}
              className="p-0.5"
            >
              <Star
                className={`h-6 w-6 ${
                  (reviewRating ?? 0) >= star
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-slate-300 dark:text-slate-600'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Review date (required) */}
      <div>
        <label htmlFor="review_date" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Review Date <span className="text-red-500">*</span>
        </label>
        <Input
          id="review_date"
          type="date"
          {...register('review_date')}
        />
        {errors.review_date && (
          <p className="mt-1 text-sm text-red-600">{errors.review_date.message}</p>
        )}
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="flex justify-between">
        <Button type="button" variant="ghost" onClick={() => onBack()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save &amp; Continue
        </Button>
      </div>
    </form>
  );
}
