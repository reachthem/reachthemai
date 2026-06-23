'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Loader2, CheckCircle2, XCircle, Search, RefreshCw } from 'lucide-react';

type ScanStatus = 'pending' | 'processing' | 'reviews_received' | 'analyzing' | 'analyzed' | 'failed';

interface ScanProgressProps {
  scanId: string;
  scrapeId?: string | null;
  onComplete: (result: { status: string; reviewsFound: number; threatsFound: number }) => void;
  onError: (message?: string) => void;
  statusApiUrl?: string;
}

const STEPS = [
  { key: 'processing', label: 'Processing Reviews', description: 'Pulling all Google reviews for your business', icon: Search },
  { key: 'reviews_received', label: 'Reviews Analyzed', description: 'All reviews have been collected', icon: CheckCircle2 },
] as const;

function getStepStatus(stepKey: string, currentStatus: ScanStatus): 'pending' | 'active' | 'complete' | 'failed' {
  const order: ScanStatus[] = ['pending', 'processing', 'reviews_received', 'analyzing', 'analyzed'];
  const currentIdx = order.indexOf(currentStatus);

  if (currentStatus === 'failed') return 'failed';

  if (stepKey === 'processing') {
    if (currentIdx <= 1) return currentIdx === 1 ? 'active' : 'pending';
    return 'complete';
  }
  if (stepKey === 'reviews_received') {
    if (currentIdx < 2) return 'pending';
    return 'complete';
  }
  return 'pending';
}

export default function ScanProgress({ scanId, scrapeId: initialScrapeId, onComplete, onError, statusApiUrl = '/api/scanner/scrape-status' }: ScanProgressProps) {
  const [status, setStatus] = useState<ScanStatus>('pending');
  const [reviewsFound, setReviewsFound] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [scrapeId, setScrapeId] = useState<string | null>(initialScrapeId ?? null);
  /** Only fire onComplete once, when AI analysis is done — not when reviews are only scraped. */
  const completionReportedRef = useRef(false);

  const pollStatus = useCallback(async () => {
    try {
      const separator = statusApiUrl.includes('?') ? '&' : '?';
      const res = await fetch(`${statusApiUrl}${separator}scanId=${scanId}`);
      if (!res.ok) return;

      const data = await res.json();
      setStatus(data.status);
      if (data.dataforseoTaskId) setScrapeId(data.dataforseoTaskId);

      if (data.reviewsFound) setReviewsFound(data.reviewsFound);

      if (data.status === 'analyzed') {
        if (!completionReportedRef.current) {
          completionReportedRef.current = true;
          onComplete({
            status: 'analyzed',
            reviewsFound: data.reviewsFound ?? 0,
            threatsFound: data.threatsFound ?? 0,
          });
        }
      } else if (data.status === 'failed') {
        onError(data.errorMessage ?? data.error);
      }
    } catch (err) {
      console.error('Poll error:', err);
    }
  }, [scanId, statusApiUrl, onComplete, onError]);

  const handleRefresh = useCallback(async () => {
    if (status === 'analyzed' || status === 'failed') return;
    setIsRefreshing(true);
    try {
      await pollStatus();
    } finally {
      setIsRefreshing(false);
    }
  }, [status, pollStatus]);

  useEffect(() => {
    if (initialScrapeId) setScrapeId(initialScrapeId);
  }, [initialScrapeId]);

  useEffect(() => {
    if (status === 'analyzed' || status === 'failed') return;

    const interval = setInterval(pollStatus, 30000);
    pollStatus();

    return () => clearInterval(interval);
  }, [status, pollStatus]);

  return (
    <div className="bg-white border border-secondary-200 rounded-2xl p-8">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-secondary-900">Scanning in Progress</h3>
          <p className="text-sm text-secondary-500 mt-1">Review retrieval typically takes 1 to 2 minutes. You can check back on this page at any time.</p>
          {scrapeId && (
            <p className="text-xs text-secondary-400 mt-2 font-mono">Scrape ID: {scrapeId}</p>
          )}
        </div>
        {status !== 'analyzed' && status !== 'failed' && (
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-secondary-200 text-secondary-700 text-sm font-medium hover:bg-secondary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        )}
      </div>

      <div className="space-y-6">
        {STEPS.map((step, idx) => {
          const stepStatus = getStepStatus(step.key, status);
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex items-start gap-4">
              <div className="relative flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  stepStatus === 'complete'
                    ? 'bg-green-100 text-green-600'
                    : stepStatus === 'active'
                    ? 'bg-primary-100 text-primary-600'
                    : stepStatus === 'failed'
                    ? 'bg-red-100 text-red-600'
                    : 'bg-secondary-100 text-secondary-400'
                }`}>
                  {stepStatus === 'complete' ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : stepStatus === 'active' ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : stepStatus === 'failed' ? (
                    <XCircle className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`w-0.5 h-8 mt-1 ${
                    stepStatus === 'complete' ? 'bg-green-200' : 'bg-secondary-200'
                  }`} />
                )}
              </div>
              <div className="pt-1.5">
                <p className={`font-semibold ${
                  stepStatus === 'active'
                    ? 'text-primary-700'
                    : stepStatus === 'complete'
                    ? 'text-green-700'
                    : 'text-secondary-600'
                }`}>
                  {step.label}
                  {step.key === 'processing' && reviewsFound > 0 && stepStatus === 'complete' && (
                    <span className="ml-2 text-sm font-normal text-secondary-500">
                      ({reviewsFound} reviews found)
                    </span>
                  )}
                </p>
                <p className="text-sm text-secondary-500">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
