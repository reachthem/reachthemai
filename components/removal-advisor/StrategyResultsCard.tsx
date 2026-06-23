'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Brain, ExternalLink, ChevronDown, ChevronUp, Star, Loader2, CheckCircle2, ListOrdered, AlertTriangle } from 'lucide-react';
import { updateReviewCaseStatus } from '@/app/actions/removal-advisor';
import type { ReviewCase } from '@/app/actions/removal-advisor';
import { PLATFORM_LABELS } from '@/lib/schemas/review-case';
import type { Components } from 'react-markdown';

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  active: 'bg-blue-100 text-blue-700',
  analyzed: 'bg-teal-100 text-teal-700',
  reported: 'bg-yellow-100 text-yellow-700',
  pending_platform: 'bg-orange-100 text-orange-700',
  removed: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  escalated: 'bg-purple-100 text-purple-700',
};

const PLATFORM_BADGE_COLORS: Record<string, string> = {
  google: 'bg-blue-100 text-blue-700',
  yelp: 'bg-red-100 text-red-700',
  facebook: 'bg-indigo-100 text-indigo-700',
  trustpilot: 'bg-green-100 text-green-700',
  other: 'bg-gray-100 text-gray-700',
};

const CONFIDENCE_COLORS: Record<string, { badge: string; dot: string }> = {
  high:   { badge: 'bg-green-100 text-green-700 border-green-200',  dot: 'bg-green-500' },
  medium: { badge: 'bg-yellow-100 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500' },
  low:    { badge: 'bg-red-100 text-red-700 border-red-200',         dot: 'bg-red-500' },
};

// Custom markdown components for a polished AI response layout
const markdownComponents: Components = {
  // Headings — treated as section dividers
  h1: ({ children }) => (
    <h2 className="mt-6 mb-2 flex items-center gap-2 text-base font-bold text-slate-800 first:mt-0">
      <span className="h-1 w-4 rounded bg-primary-600 inline-block flex-shrink-0" />
      {children}
    </h2>
  ),
  h2: ({ children }) => (
    <h3 className="mt-5 mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-primary-700 first:mt-0">
      {children}
    </h3>
  ),
  h3: ({ children }) => (
    <h4 className="mt-4 mb-1.5 text-sm font-semibold text-slate-700 first:mt-0">{children}</h4>
  ),

  // Paragraphs — proper spacing
  p: ({ children }) => (
    <p className="mb-3 text-sm leading-relaxed text-slate-700 last:mb-0">{children}</p>
  ),

  // Bold — highlighted labels like "Strongest Removal Ground:", "Confidence:"
  strong: ({ children }) => (
    <strong className="font-semibold text-slate-900">{children}</strong>
  ),

  // Ordered list — numbered steps
  ol: ({ children }) => (
    <ol className="mb-3 mt-1 space-y-2 last:mb-0">{children}</ol>
  ),

  // Unordered list — bullet points
  ul: ({ children }) => (
    <ul className="mb-3 mt-1 space-y-1.5 last:mb-0">{children}</ul>
  ),

  // List items — custom numbering for ol, custom bullets for ul
  li: ({ children, ...props }) => {
    const isOrdered = (props as { ordered?: boolean }).ordered;
    return isOrdered ? (
      <li className="flex gap-3 text-sm text-slate-700">
        <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
          {(props as { index?: number }).index != null ? ((props as { index?: number }).index ?? 0) + 1 : '•'}
        </span>
        <span className="flex-1 leading-relaxed">{children}</span>
      </li>
    ) : (
      <li className="flex gap-2.5 text-sm text-slate-700">
        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary-500" />
        <span className="flex-1 leading-relaxed">{children}</span>
      </li>
    );
  },

  // Blockquote — highlighted callout
  blockquote: ({ children }) => (
    <blockquote className="my-3 rounded-r-lg border-l-4 border-primary-400 bg-primary-50 px-4 py-2.5 text-sm italic text-slate-600">
      {children}
    </blockquote>
  ),

  // Horizontal rule — visual separator between sections
  hr: () => <hr className="my-4 border-slate-200" />,
};

interface StrategyResultsCardProps {
  reviewCase: ReviewCase;
  isAnalyzing?: boolean;
  streamingContent?: string;
  analysisError?: string | null;
}

export default function StrategyResultsCard({
  reviewCase,
  isAnalyzing,
  streamingContent,
  analysisError,
}: StrategyResultsCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState(reviewCase.status);
  const [updating, setUpdating] = useState(false);

  const displayContent = streamingContent || reviewCase.ai_strategy;
  const confidence = reviewCase.ai_confidence?.toLowerCase() as keyof typeof CONFIDENCE_COLORS | undefined;
  const confidenceStyle = confidence ? CONFIDENCE_COLORS[confidence] : null;

  async function handleStatusChange(newStatus: string) {
    setUpdating(true);
    try {
      await updateReviewCaseStatus(reviewCase.id, newStatus);
      setStatus(newStatus);
    } catch {
      // silently fail
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-2.5 border-b border-slate-200 bg-slate-50 px-5 py-3.5">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${PLATFORM_BADGE_COLORS[reviewCase.platform] ?? PLATFORM_BADGE_COLORS.other}`}>
          {PLATFORM_LABELS[reviewCase.platform as keyof typeof PLATFORM_LABELS] ?? reviewCase.platform}
        </span>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLORS[status] ?? STATUS_COLORS.draft}`}>
          {status.replace(/_/g, ' ')}
        </span>

        {reviewCase.ai_removal_ground && (
          <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">
            {reviewCase.ai_removal_ground}
          </span>
        )}

        {confidenceStyle && (
          <span className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${confidenceStyle.badge}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${confidenceStyle.dot}`} />
            {confidence!.charAt(0).toUpperCase() + confidence!.slice(1)} Confidence
          </span>
        )}

        <a
          href={reviewCase.review_url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 hover:underline"
        >
          <ExternalLink className="h-3.5 w-3.5" /> Open Review
        </a>
      </div>

      {/* Review being analyzed */}
      <div className="border-b border-slate-200 bg-slate-50/60 px-5 py-3.5">
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400">
          Review being analyzed
        </p>
        <blockquote className="border-l-2 border-slate-300 pl-3 text-sm italic text-slate-600 leading-relaxed">
          {expanded
            ? reviewCase.review_text
            : (reviewCase.review_text?.slice(0, 200) + (reviewCase.review_text && reviewCase.review_text.length > 200 ? '…' : ''))}
        </blockquote>
        {reviewCase.review_text && reviewCase.review_text.length > 200 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-1.5 flex items-center gap-1 text-xs font-medium text-primary-600 hover:underline"
          >
            {expanded
              ? <><ChevronUp className="h-3 w-3" /> Show less</>
              : <><ChevronDown className="h-3 w-3" /> Show more</>}
          </button>
        )}
        {reviewCase.review_rating && (
          <div className="mt-2 flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`h-3.5 w-3.5 ${s <= reviewCase.review_rating! ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* AI Analysis */}
      <div className="px-5 py-5">
        {/* Error state */}
        {analysisError && !displayContent && (
          <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-600" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Analysis failed</p>
              <p className="text-xs text-amber-700">{analysisError}</p>
            </div>
          </div>
        )}

        {/* Loading state */}
        {isAnalyzing && !displayContent && !analysisError && (
          <div className="flex items-center gap-3 rounded-xl border border-primary-200 bg-primary-50 px-4 py-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100">
              <Brain className="h-5 w-5 animate-pulse text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary-700">Analyzing your review…</p>
              <p className="text-xs text-primary-500">This usually takes 10–20 seconds.</p>
            </div>
          </div>
        )}

        {/* Streaming / completed analysis */}
        {displayContent && (
          <div className="rounded-xl border border-slate-200 bg-white">
            {/* Analysis header bar */}
            <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100">
                <Brain className="h-4 w-4 text-primary-600" />
              </div>
              <span className="text-sm font-semibold text-slate-800">AI Removal Strategy</span>
              {isAnalyzing && (
                <Loader2 className="ml-auto h-3.5 w-3.5 animate-spin text-primary-500" />
              )}
            </div>

            {/* Section tabs */}
            <div className="grid grid-cols-3 border-b border-slate-100 text-center text-xs font-medium text-slate-500">
              <div className="flex items-center justify-center gap-1.5 border-r border-slate-100 py-2.5">
                <Brain className="h-3.5 w-3.5 text-primary-500" />
                Analysis
              </div>
              <div className="flex items-center justify-center gap-1.5 border-r border-slate-100 py-2.5">
                <ListOrdered className="h-3.5 w-3.5 text-primary-500" />
                Instructions
              </div>
              <div className="flex items-center justify-center gap-1.5 py-2.5">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                Escalation
              </div>
            </div>

            {/* Markdown body */}
            <div className="px-5 py-5">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={markdownComponents}
              >
                {displayContent}
              </ReactMarkdown>
            </div>

            {/* Footer note */}
            <div className="flex items-center gap-2 rounded-b-xl border-t border-slate-100 bg-slate-50 px-4 py-2.5">
              <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-green-500" />
              <p className="text-xs text-slate-500">
                Follow the steps above in order. Stripe&apos;s success rates are best-effort estimates.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Status update */}
      {status !== 'removed' && displayContent && (
        <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 bg-slate-50 px-5 py-3.5">
          <span className="text-sm font-medium text-slate-700">Update status:</span>
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={updating}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:opacity-50"
          >
            <option value="analyzed">Analyzed</option>
            <option value="active">Not yet (Active)</option>
            <option value="reported">Yes, submitted (Reported)</option>
            <option value="rejected">Platform rejected it</option>
            <option value="removed">Review was removed!</option>
          </select>
          {updating && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
        </div>
      )}
    </div>
  );
}
