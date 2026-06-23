'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import StatusBadge from './StatusBadge';
import { ExternalLink, CreditCard, Loader2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PLATFORM_LABELS: Record<string, string> = {
  google: 'Google',
  yelp: 'Yelp',
  facebook: 'Facebook',
  trustpilot: 'Trustpilot',
  tripadvisor: 'TripAdvisor',
  other: 'Other',
};

function formatLabel(str: string): string {
  return str.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function firstNWords(text: string | null | undefined, n: number): string {
  if (!text || typeof text !== 'string') return '';
  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.slice(0, n).join(' ') + (words.length > n ? '...' : '');
}

interface RemovalRequestCardProps {
  request: {
    id: string;
    platform: string | null;
    review_url: string | null;
    review_content: string | null;
    review_author: string | null;
    removal_reason: string | null;
    status: string;
    created_at: string;
  };
  onSelect: (id: string) => void;
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString));
}

export default function RemovalRequestCard({ request, onSelect }: RemovalRequestCardProps) {
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const isReadyForPayment = request.status === 'ready_for_payment';

  async function handlePay(e: React.MouseEvent) {
    e.stopPropagation();
    setCheckoutLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ removal_request_id: request.id }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setCheckoutLoading(false);
      }
    } catch {
      setCheckoutLoading(false);
    }
  }

  return (
    <Card
      className="p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      onClick={() => onSelect(request.id)}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="shrink-0 w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm font-semibold text-slate-600 dark:text-slate-300">
              {(PLATFORM_LABELS[request.platform ?? ''] ?? 'N/A').charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {PLATFORM_LABELS[request.platform ?? ''] ?? request.platform ?? 'Unknown'}
              </p>
              {request.review_author && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  by {request.review_author}
                </p>
              )}
              {request.removal_reason && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {formatLabel(request.removal_reason)}
                </p>
              )}
              {request.review_url && (
                <a
                  href={request.review_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 text-xs text-primary-600 hover:underline truncate max-w-[200px]"
                >
                  <ExternalLink className="h-3 w-3 shrink-0" />
                  <span className="truncate">{request.review_url}</span>
                </a>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-slate-400 hidden sm:block">
              {formatDate(request.created_at)}
            </span>
            <StatusBadge status={request.status} />
          </div>
        </div>
        {request.review_content && (
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
            {firstNWords(request.review_content, 45)}
          </p>
        )}
        <div className="flex flex-col gap-2 pt-1">
          {isReadyForPayment && (
            <button
              onClick={handlePay}
              disabled={checkoutLoading}
              className="flex items-center justify-center gap-1.5 rounded-lg bg-primary-600 px-3 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors disabled:opacity-50 w-full sm:w-auto sm:min-w-[120px]"
            >
              {checkoutLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CreditCard className="h-3.5 w-3.5" />
              )}
              Pay $299
            </button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="w-full max-w-[350px] mx-auto flex items-center justify-center gap-1.5"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(request.id);
            }}
          >
            <FileText className="h-3.5 w-3.5" />
            View Status
          </Button>
        </div>
      </div>
    </Card>
  );
}
