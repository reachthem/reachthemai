'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEP_LABELS = [
  'Contact Info',
  'Review Details',
  'Removal details',
  'Confirm & Pay',
];

const TOTAL_STEPS = 4;

interface StepIndicatorProps {
  currentStep: number;
  completedSteps: number[];
}

export default function StepIndicator({ currentStep, completedSteps }: StepIndicatorProps) {
  return (
    <>
      <div className="md:hidden text-center py-4">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          Step {currentStep} of {TOTAL_STEPS} — {STEP_LABELS[currentStep - 1]}
        </p>
        <div className="mt-2 h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-600 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      <div className="hidden md:flex items-center justify-between py-6 px-4">
        {STEP_LABELS.map((label, index) => {
          const step = index + 1;
          const isCompleted = completedSteps.includes(step);
          const isCurrent = step === currentStep;
          const isFuture = !isCompleted && !isCurrent;

          return (
            <div key={step} className="flex items-center flex-1 last:flex-initial">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all',
                    isCompleted && 'bg-primary-600 text-white',
                    isCurrent && 'border-2 border-primary-600 text-primary-600 ring-4 ring-primary-100 dark:ring-primary-900/30 animate-pulse',
                    isFuture && 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                  )}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : step}
                </div>
                <span
                  className={cn(
                    'mt-2 text-xs font-medium whitespace-nowrap',
                    isCompleted && 'text-primary-600',
                    isCurrent && 'text-primary-600 font-semibold',
                    isFuture && 'text-slate-400 dark:text-slate-500'
                  )}
                >
                  {label}
                </span>
              </div>

              {step < TOTAL_STEPS && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-3 mt-[-1.25rem]',
                    isCompleted ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
