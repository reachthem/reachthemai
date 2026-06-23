'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Download, Trash2 } from 'lucide-react';
import { deleteAdvisorCase } from '@/app/actions/admin-advisor-cases';
import { toast } from 'sonner';
import { useState } from 'react';
import { ConfirmModal } from '@/components/ui/confirm-modal';

const PLATFORM_LABELS: Record<string, string> = {
  google: 'Google',
  yelp: 'Yelp',
  facebook: 'Facebook',
  trustpilot: 'Trustpilot',
  tripadvisor: 'TripAdvisor',
  other: 'Other',
};

interface AdvisorCaseRow {
  id: string;
  platform: string;
  review_url: string;
  review_text: string | null;
  review_rating: number | null;
  reviewer_name: string | null;
  status: string;
  ai_confidence: string | null;
  ai_removal_ground: string | null;
  ai_strategy: string | null;
  removal_reasons: string[] | null;
  created_at: string;
  user_email: string | null;
  business_name: string | null;
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString));
}

function CaseStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
    analyzed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    submitted: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    removed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    unsuccessful: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    in_progress: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${colors[status] ?? 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

function exportCSV(rows: AdvisorCaseRow[]) {
  const headers = ['Date', 'Platform', 'Company', 'Reviewer', 'Rating', 'Review Text', 'Status', 'AI Confidence', 'Removal Ground', 'AI Strategy', 'Removal Reasons', 'User Email', 'Review URL'];
  const csvRows = rows.map((r) => [
    formatDate(r.created_at),
    PLATFORM_LABELS[r.platform] ?? r.platform,
    r.business_name ?? '',
    r.reviewer_name ?? '',
    r.review_rating?.toString() ?? '',
    r.review_text ?? '',
    r.status,
    r.ai_confidence ?? '',
    r.ai_removal_ground ?? '',
    r.ai_strategy ?? '',
    (r.removal_reasons ?? []).join('; '),
    r.user_email ?? '',
    r.review_url,
  ]);
  const csvContent = [headers, ...csvRows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `advisor-cases-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdvisorCasesTable({ cases }: { cases: AdvisorCaseRow[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [caseToDelete, setCaseToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCaseToDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (!caseToDelete) return;
    setDeletingId(caseToDelete);
    try {
      await deleteAdvisorCase(caseToDelete);
      toast.success('AI Advisor case deleted');
      router.refresh();
    } catch (error) {
      console.error('Failed to delete case:', error);
      toast.error('Failed to delete case');
    } finally {
      setDeletingId(null);
    }
  };

  if (cases.length === 0) {
    return (
      <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
        <p className="text-slate-500 dark:text-slate-400">No AI advisor cases found.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button variant="outline" size="sm" onClick={() => exportCSV(cases)}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Platform</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Company</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Reviewer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Review</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rating</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">AI Ground</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Confidence</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {cases.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-4 py-3 text-sm text-slate-900 dark:text-white whitespace-nowrap">
                    {formatDate(c.created_at)}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                    {PLATFORM_LABELS[c.platform] ?? c.platform}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-900 dark:text-white max-w-[180px] truncate">
                    {c.business_name ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 max-w-[140px] truncate">
                    {c.reviewer_name ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 max-w-[240px]">
                    <p className="truncate">{c.review_text || '—'}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 text-center">
                    {c.review_rating != null ? `★ ${c.review_rating}` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <CaseStatusBadge status={c.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 max-w-[160px] truncate capitalize">
                    {c.ai_removal_ground?.replace(/_/g, ' ') ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-center font-medium">
                    {c.ai_confidence ? (
                      <span className={parseFloat(c.ai_confidence) >= 70 ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-300'}>
                        {c.ai_confidence}%
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 max-w-[180px] truncate">
                    {c.user_email ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      disabled={deletingId === c.id}
                      onClick={(e) => handleDeleteClick(c.id, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        open={!!caseToDelete}
        onOpenChange={(open) => !open && setCaseToDelete(null)}
        title="Delete AI Advisor Case"
        description="Are you sure you want to delete this AI Advisor case? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleConfirmDelete}
        loading={!!deletingId}
      />
    </div>
  );
}

export type { AdvisorCaseRow };
