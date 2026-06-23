'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ExternalLink, Trash2, Star } from 'lucide-react';
import { deleteReviewCase, type ReviewCase } from '@/app/actions/removal-advisor';
import { PLATFORM_LABELS } from '@/lib/schemas/review-case';
import { formatDistanceToNow } from 'date-fns';
import { ConfirmModal } from '@/components/ui/confirm-modal';

const STATUS_COLORS: Record<string, string> = {
  draft:            'bg-gray-100 text-gray-700',
  active:           'bg-blue-100 text-blue-700',
  analyzed:         'bg-green-600 text-white',
  reported:         'bg-blue-600 text-white',
  pending_platform: 'bg-orange-100 text-orange-700',
  removed:          'bg-green-100 text-green-700',
  rejected:         'bg-red-100 text-red-700',
  escalated:        'bg-purple-100 text-purple-700',
};

const PLATFORM_BADGE_COLORS: Record<string, string> = {
  google:     'bg-blue-100 text-blue-700',
  yelp:       'bg-red-100 text-red-700',
  facebook:   'bg-indigo-100 text-indigo-700',
  trustpilot: 'bg-green-100 text-green-700',
  other:      'bg-gray-100 text-gray-700',
};

function formatStatus(status: string) {
  return status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

interface ReviewCasesTableProps {
  cases: ReviewCase[];
  /** When false (e.g. free tier), empty state does not show the Analyze a Review button */
  showAnalyzeEmptyState?: boolean;
}

export default function ReviewCasesTable({ cases: initialCases, showAnalyzeEmptyState = true }: ReviewCasesTableProps) {
  const router = useRouter();
  const [cases, setCases] = useState(initialCases);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmCaseId, setDeleteConfirmCaseId] = useState<string | null>(null);

  function handleDelete(e: React.MouseEvent, caseId: string) {
    e.stopPropagation();
    setDeleteConfirmCaseId(caseId);
  }

  async function handleConfirmDelete() {
    const caseId = deleteConfirmCaseId;
    if (!caseId) return;
    setDeletingId(caseId);
    try {
      await deleteReviewCase(caseId);
      setCases((prev) => prev.filter((c) => c.id !== caseId));
      setDeleteConfirmCaseId(null);
    } catch {
      // silently fail
    } finally {
      setDeletingId(null);
    }
  }

  if (cases.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
        <ShieldCheck className="mx-auto mb-3 h-12 w-12 text-gray-300" />
        <h3 className="mb-1 text-lg font-semibold">No review cases yet</h3>
        {showAnalyzeEmptyState ? (
          <>
            <p className="mb-4 text-sm text-secondary-500">
              Add your first negative review to get AI-guided removal instructions.
            </p>
            <Link
              href="/app/removal-advisor/new"
              className="inline-flex rounded-lg bg-primary-600 px-5 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
            >
              Analyze a Review
            </Link>
          </>
        ) : (
          <p className="text-sm text-secondary-500">
            Subscribe to the AI Removal Advisor to analyze reviews and get removal instructions.
          </p>
        )}
      </div>
    );
  }

  return (
    <>
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50 text-left">
            <tr>
              <th className="min-w-[200px] px-4 py-3 font-medium">Platform</th>
              <th className="min-w-[200px] px-4 py-3 font-medium">Review</th>
              <th className="min-w-[200px] px-4 py-3 font-medium">AI Ground</th>
              <th className="min-w-[200px] px-4 py-3 font-medium">Status</th>
              <th className="min-w-[200px] px-4 py-3 font-medium">Added</th>
              <th className="min-w-[200px] px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {cases.map((c) => (
              <tr
                key={c.id}
                onClick={() => router.push(`/app/removal-advisor/${c.id}`)}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <td className="min-w-[200px] px-4 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${PLATFORM_BADGE_COLORS[c.platform] ?? PLATFORM_BADGE_COLORS.other}`}>
                    {PLATFORM_LABELS[c.platform as keyof typeof PLATFORM_LABELS] ?? c.platform}
                  </span>
                </td>
                <td className="min-w-[200px] max-w-[200px] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-xs text-gray-700">
                      {c.review_text?.slice(0, 80) || 'No text'}
                      {c.review_text && c.review_text.length > 80 ? '…' : ''}
                    </span>
                    {c.review_rating && (
                      <span className="flex items-center gap-0.5 text-xs text-yellow-500">
                        <Star className="h-3 w-3 fill-yellow-400" /> {c.review_rating}
                      </span>
                    )}
                  </div>
                </td>
                <td className="min-w-[200px] px-4 py-3">
                  {c.ai_removal_ground ? (
                    <span className="rounded bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700">
                      {c.ai_removal_ground}
                    </span>
                  ) : (
                    <span className="text-xs text-secondary-400">Pending</span>
                  )}
                </td>
                <td className="min-w-[200px] px-4 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLORS[c.status] ?? STATUS_COLORS.draft}`}>
                    {formatStatus(c.status)}
                  </span>
                </td>
                <td className="min-w-[200px] px-4 py-3 text-xs text-secondary-400">
                  {formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}
                </td>
                <td className="min-w-[200px] px-4 py-3">
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <Link
                      href={`/app/removal-advisor/${c.id}`}
                      className="rounded bg-primary-600 px-3 py-1 text-xs font-medium text-white hover:bg-primary-700 transition-colors"
                    >
                      View
                    </Link>
                    <a
                      href={c.review_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <button
                      onClick={(e) => handleDelete(e, c.id)}
                      disabled={deletingId === c.id}
                      className="text-red-400 hover:text-red-600 disabled:opacity-30"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <ConfirmModal
      open={!!deleteConfirmCaseId}
      onOpenChange={(open) => !open && setDeleteConfirmCaseId(null)}
      title="Delete review case"
      description="Delete this review case? This cannot be undone."
      confirmLabel="Delete"
      cancelLabel="Cancel"
      variant="danger"
      onConfirm={handleConfirmDelete}
      loading={!!deletingId}
    />
    </>
  );
}
