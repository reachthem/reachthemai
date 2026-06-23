'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { copyAssessmentToRemovalRequest } from '@/app/actions/admin-assessment-requests';
import { Button } from '@/components/ui/button';
import { Loader2, Copy } from 'lucide-react';

interface CopyToRemovalButtonProps {
  assessmentId: string;
}

export default function CopyToRemovalButton({ assessmentId }: CopyToRemovalButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCopy = async () => {
    setLoading(true);
    setError(null);
    try {
      const { removalRequestId } = await copyAssessmentToRemovalRequest(assessmentId);
      router.push(`/app/admin/removal-requests/${removalRequestId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to copy to removal request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
        Convert to Removal Request
      </h3>
      <p className="text-xs text-slate-400 mb-4">
        Copy all information to a new removal request with status Ready for Payment. You will be
        taken to the new request.
      </p>
      <Button onClick={handleCopy} disabled={loading} className="w-full" size="sm">
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Copy className="mr-2 h-4 w-4" />
        )}
        Copy to Removal Requests
      </Button>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
