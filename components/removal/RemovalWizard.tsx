'use client';

import { useState, useEffect, useCallback } from 'react';
import StepIndicator from './StepIndicator';
import Step1ContactInfo from './steps/Step1ContactInfo';
import Step2PlatformReview from './steps/Step2PlatformReview';
import Step3RemovalReason from './steps/Step3RemovalReason';
import Step5Confirm from './steps/Step5Confirm';
import { getDraft, createDraftWithPrefill } from '@/app/actions/removal-requests';
import { Loader2 } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DraftData = Record<string, any> | null;

export type RemovalWizardPrefill = {
  prefill_platform?: string | null;
  prefill_url?: string | null;
  prefill_text?: string | null;
  prefill_reviewer?: string | null;
  prefill_rating?: string | null;
  prefill_date?: string | null;
};

interface RemovalWizardProps {
  /** When true, step 4 shows Submit for Review (no auth/payment) and redirects to /confirmation */
  freeAssessment?: boolean;
  /** Prefill from URL (e.g. from scanner Request Removal). Creates draft with user + review data and opens at step 2. */
  initialPrefill?: RemovalWizardPrefill | null;
  /** Signed-in user: email/phone from user_data (and auth email fallback) when draft has no contact yet. */
  contactPrefill?: { contact_email: string; contact_phone: string } | null;
}

const LAST_STEP = 4;

function normalizeWizardStepFromDraft(dbStep: number): number {
  if (dbStep >= 5) return LAST_STEP;
  return Math.min(Math.max(1, dbStep), LAST_STEP);
}

export default function RemovalWizard({
  freeAssessment = false,
  initialPrefill,
  contactPrefill = null,
}: RemovalWizardProps = {}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [draftKey, setDraftKey] = useState<string | null>(null);
  const [draftData, setDraftData] = useState<DraftData>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initDraft() {
      try {
        const hasPrefill = initialPrefill && (
          initialPrefill.prefill_platform
          || initialPrefill.prefill_url
          || initialPrefill.prefill_text
          || initialPrefill.prefill_reviewer
          || initialPrefill.prefill_rating
          || initialPrefill.prefill_date
        );

        if (hasPrefill) {
          localStorage.removeItem('removal_draft_key');
          const reviewRating = initialPrefill.prefill_rating != null && initialPrefill.prefill_rating !== ''
            ? parseInt(initialPrefill.prefill_rating, 10)
            : null;
          const result = await createDraftWithPrefill({
            platform: initialPrefill.prefill_platform ?? 'google',
            review_url: initialPrefill.prefill_url ?? null,
            review_content: initialPrefill.prefill_text ?? null,
            review_author: initialPrefill.prefill_reviewer ?? null,
            review_rating: reviewRating != null && Number.isInteger(reviewRating) && reviewRating >= 1 && reviewRating <= 5 ? reviewRating : null,
            review_date: initialPrefill.prefill_date ?? null,
          });
          setDraftKey(result.draft_key);
          localStorage.setItem('removal_draft_key', result.draft_key);
          document.cookie = `removal_draft_key=${result.draft_key}; path=/; max-age=${60 * 60 * 24 * 7}`;
          const draft = await getDraft(result.draft_key);
          if (draft) {
            setDraftData(draft);
            setCurrentStep(1);
          }
          setLoading(false);
          return;
        }

        const savedKey = localStorage.getItem('removal_draft_key');
        if (savedKey) {
          const draft = await getDraft(savedKey);
          if (draft) {
            setDraftKey(savedKey);
            setDraftData(draft);
            setCurrentStep(normalizeWizardStepFromDraft(draft.current_step ?? 1));
            setLoading(false);
            return;
          }
          localStorage.removeItem('removal_draft_key');
        }
      } catch {
        localStorage.removeItem('removal_draft_key');
      } finally {
        setLoading(false);
      }
    }
    initDraft();
  }, [initialPrefill]);

  useEffect(() => {
    if (!draftKey || loading) return;
    const key: string = draftKey;
    async function refreshDraft() {
      const draft = await getDraft(key);
      if (draft) setDraftData(draft);
    }
    refreshDraft();
  }, [draftKey, currentStep, loading]);

  const completedSteps = Array.from(
    { length: Math.max(0, currentStep - 1) },
    (_, i) => i + 1
  );

  const handleNext = useCallback((data?: Partial<{ draftKey: string; id: string }>) => {
    if (data?.draftKey) {
      setDraftKey(data.draftKey);
      localStorage.setItem('removal_draft_key', data.draftKey);
      document.cookie = `removal_draft_key=${data.draftKey}; path=/; max-age=${60 * 60 * 24 * 7}`;
    }
    setCurrentStep((prev) => Math.min(prev + 1, LAST_STEP));
  }, []);

  const handleBack = useCallback((toStep?: number) => {
    if (typeof toStep === 'number' && toStep >= 1 && toStep <= LAST_STEP) {
      setCurrentStep(toStep);
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 1));
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <StepIndicator currentStep={currentStep} completedSteps={completedSteps} />

      <div className="mt-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
        {currentStep === 1 && (
          <Step1ContactInfo
            key="step1"
            draftData={draftData}
            contactPrefill={contactPrefill}
            onNext={handleNext}
          />
        )}
        {currentStep === 2 && (
          <Step2PlatformReview
            key={`step2-${draftData ? 'ready' : 'pending'}`}
            draftData={draftData}
            draftKey={draftKey!}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {currentStep === 3 && (
          <Step3RemovalReason
            key={`step3-${draftData ? 'ready' : 'pending'}`}
            draftData={draftData}
            draftKey={draftKey!}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {currentStep === 4 && (
          <Step5Confirm
            key={`step4-confirm-${draftData ? 'ready' : 'pending'}`}
            draftData={draftData}
            draftKey={draftKey!}
            onBack={handleBack}
            freeAssessment={freeAssessment}
          />
        )}
      </div>
    </div>
  );
}
