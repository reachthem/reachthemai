'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step3Schema, type Step3Data } from '@/lib/schemas/removal-request';
import { updateRequestStep3 } from '@/app/actions/removal-requests';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

interface Step3Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  draftData: Record<string, any> | null;
  draftKey: string;
  onNext: () => void;
  onBack: () => void;
}

export default function Step3RemovalReason({ draftData, draftKey, onNext, onBack }: Step3Props) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      description: draftData?.description ?? '',
    },
  });

  const descriptionValue = watch('description') ?? '';

  const onSubmit = async (data: Step3Data) => {
    setSubmitting(true);
    setError(null);
    try {
      await updateRequestStep3(draftKey, data);
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
          Removal details
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Why should this review be removed?
        </p>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Describe the situation
        </label>
        <textarea
          id="description"
          rows={5}
          placeholder="Provide details about why this review should be removed (minimum 20 characters)..."
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          {...register('description')}
        />
        <div className="flex justify-between mt-1">
          {errors.description ? (
            <p className="text-sm text-red-600">{errors.description.message}</p>
          ) : (
            <span />
          )}
          <span className="text-xs text-slate-400">{descriptionValue.length} characters</span>
        </div>
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
