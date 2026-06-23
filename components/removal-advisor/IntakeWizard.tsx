'use client';

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, ArrowRight, Brain } from 'lucide-react';
import {
  reviewCaseIntakeSchema,
  type ReviewCaseIntakeData,
} from '@/lib/schemas/review-case';
import { createReviewCase } from '@/app/actions/removal-advisor';
import StepPlatform from '@/components/removal-advisor/steps/StepPlatform';
import StepReviewDetails from '@/components/removal-advisor/steps/StepReviewDetails';
import StepContext from '@/components/removal-advisor/steps/StepContext';

const STEP_LABELS = ['Platform', 'Review Details', 'Context'];

export type IntakeWizardPrefill = {
  platform?: string | null;
  review_url?: string | null;
  review_text?: string | null;
  reviewer_name?: string | null;
  review_rating?: number | null;
  review_date?: string | null;
};

export default function IntakeWizard({ initialPrefill }: { initialPrefill?: IntakeWizardPrefill | null }) {
  const router = useRouter();
  const hasReviewPrefill = Boolean(
    initialPrefill?.review_url || initialPrefill?.review_text
  );
  const initialStep = hasReviewPrefill ? 2 : 1;
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultValues = useMemo<Partial<ReviewCaseIntakeData>>(() => ({
    platform: (initialPrefill?.platform as ReviewCaseIntakeData['platform']) ?? undefined,
    review_url: initialPrefill?.review_url ?? '',
    review_text: initialPrefill?.review_text ?? '',
    reviewer_name: initialPrefill?.reviewer_name ?? '',
    review_rating: initialPrefill?.review_rating ?? undefined,
    review_date: initialPrefill?.review_date ?? '',
    removal_reasons: [],
    has_responded: false,
  }), [initialPrefill]);

  const form = useForm<ReviewCaseIntakeData>({
    resolver: zodResolver(reviewCaseIntakeSchema),
    defaultValues,
    mode: 'onSubmit',
  });

  const { register, setValue, watch, formState: { errors }, trigger } = form;

  const platform = watch('platform');
  const reviewUrl = watch('review_url') || '';
  const rating = watch('review_rating');
  const selectedReasons = watch('removal_reasons') || [];
  const hasResponded = watch('has_responded');

  const STEP1_FIELDS: (keyof ReviewCaseIntakeData)[] = ['platform'];
  const STEP2_FIELDS: (keyof ReviewCaseIntakeData)[] = [
    'review_url', 'review_text', 'review_rating', 'review_date', 'reviewer_name',
  ];

  async function handleNext() {
    const fields = currentStep === 1 ? STEP1_FIELDS : STEP2_FIELDS;
    const isValid = await trigger(fields);
    if (isValid) setCurrentStep((s) => s + 1);
  }

  function handleBack() {
    setCurrentStep((s) => Math.max(1, s - 1));
  }

  async function onSubmit(data: ReviewCaseIntakeData) {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await createReviewCase(data);
      router.push(`/app/removal-advisor/${result.caseId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
      setIsSubmitting(false);
    }
  }

  function handlePlatformChange(value: string) {
    setValue('platform', value as ReviewCaseIntakeData['platform'], { shouldValidate: true });
    setTimeout(() => setCurrentStep(2), 200);
  }

  function handleRatingChange(value: number) {
    setValue('review_rating', value);
  }

  function handleReasonToggle(reason: string) {
    const current = selectedReasons;
    const updated = current.includes(reason as ReviewCaseIntakeData['removal_reasons'][number])
      ? current.filter((r) => r !== reason)
      : [...current, reason as ReviewCaseIntakeData['removal_reasons'][number]];
    setValue('removal_reasons', updated, { shouldValidate: true });
  }

  function handleHasRespondedChange(value: boolean) {
    setValue('has_responded', value);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto max-w-2xl">
      {/* Step indicator */}
      <div className="mb-8 flex items-center justify-center gap-3">
        {STEP_LABELS.map((label, i) => {
          const stepNum = i + 1;
          const isActive = currentStep === stepNum;
          const isCompleted = currentStep > stepNum;
          return (
            <div key={label} className="flex items-center gap-2">
              {i > 0 && <div className={`h-px w-8 ${isCompleted ? 'bg-[var(--color-primary)]' : 'bg-gray-300'}`} />}
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : isCompleted
                        ? 'bg-primary-100 text-primary-600'
                        : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {stepNum}
                </span>
                <span className={`text-sm ${isActive ? 'font-semibold' : 'text-secondary-500'}`}>
                  {label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {currentStep === 1 && (
          <StepPlatform value={platform} onChange={handlePlatformChange} />
        )}
        {currentStep === 2 && (
          <StepReviewDetails
            register={register}
            errors={errors}
            rating={rating}
            onRatingChange={handleRatingChange}
            reviewUrl={reviewUrl}
          />
        )}
        {currentStep === 3 && (
          <StepContext
            register={register}
            errors={errors}
            selectedReasons={selectedReasons}
            onReasonToggle={handleReasonToggle}
            hasResponded={hasResponded}
            onHasRespondedChange={handleHasRespondedChange}
          />
        )}
      </div>

      {error && (
        <p className="mt-3 text-center text-sm text-red-500">{error}</p>
      )}

      {/* Navigation buttons */}
      <div className="mt-6 flex justify-between">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        ) : (
          <div />
        )}

        {currentStep < 3 ? (
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
          >
            Continue <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing...</>
            ) : (
              <><Brain className="h-4 w-4" /> Analyze My Review</>
            )}
          </button>
        )}
      </div>
    </form>
  );
}
