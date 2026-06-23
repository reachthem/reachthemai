'use client';

import { useRouter } from 'next/navigation';
import StatusBadge from '@/components/removal/StatusBadge';
import { Button } from '@/components/ui/button';
import { Download, Eye, Trash2 } from 'lucide-react';
import { deleteRemovalRequest } from '@/app/actions/admin-removal-requests';
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

interface Request {
  id: string;
  contact_email: string;
  contact_phone: string | null;
  platform: string | null;
  review_url: string | null;
  removal_reason: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString));
}

/** Format phone for display: US 10-digit as (XXX) XXX-XXXX, 11-digit with leading 1 as +1 (XXX) XXX-XXXX, otherwise digits with spaces. */
function formatPhone(phone: string | null | undefined): string {
  if (phone == null || phone === '') return '—';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 0) return phone;
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  if (digits.length > 10) {
    return `+${digits.slice(0, digits.length - 10)} (${digits.slice(-10, -7)}) ${digits.slice(-7, -4)}-${digits.slice(-4)}`;
  }
  return digits.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
}

function exportCSV(requests: Request[]) {
  const headers = ['ID', 'Date', 'Contact Email', 'Phone', 'Platform', 'Review URL', 'Removal Reason', 'Status', 'Submitted At'];
  const rows = requests.map((r) => [
    r.id,
    formatDate(r.created_at),
    r.contact_email,
    r.contact_phone ?? '',
    PLATFORM_LABELS[r.platform ?? ''] ?? r.platform ?? '',
    r.review_url ?? '',
    r.removal_reason ?? '',
    r.status,
    r.created_at,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `removal-requests-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function RemovalRequestsTable({ requests }: { requests: Request[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [requestToDelete, setRequestToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRequestToDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (!requestToDelete) return;
    
    setDeletingId(requestToDelete);
    try {
      await deleteRemovalRequest(requestToDelete);
      toast.success('Removal request deleted');
      router.refresh();
    } catch (error) {
      console.error('Failed to delete request:', error);
      toast.error('Failed to delete request');
    } finally {
      setDeletingId(null);
      // Modal will be closed by the component after this promise resolves
    }
  };

  if (requests.length === 0) {
    return (
      <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
        <p className="text-slate-500 dark:text-slate-400">No requests found for this filter.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button variant="outline" size="sm" onClick={() => exportCSV(requests)}>
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
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Platform</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Reason</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider min-w-[140px] whitespace-nowrap">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {requests.map((request) => (
                <tr
                  key={request.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer"
                  onClick={() => router.push(`/app/admin/removal-requests/${request.id}`)}
                >
                  <td className="px-4 py-3 text-sm text-slate-900 dark:text-white whitespace-nowrap">
                    {formatDate(request.created_at)}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 max-w-[200px] truncate">
                    {request.contact_email}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    {formatPhone(request.contact_phone)}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                    {PLATFORM_LABELS[request.platform ?? ''] ?? request.platform ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 capitalize">
                    {request.removal_reason?.replace(/_/g, ' ') ?? '—'}
                  </td>
                  <td className="px-4 py-3 min-w-[140px] whitespace-nowrap">
                    <StatusBadge status={request.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/app/admin/removal-requests/${request.id}`);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        disabled={deletingId === request.id}
                        onClick={(e) => handleDeleteClick(request.id, e)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        open={!!requestToDelete}
        onOpenChange={(open) => !open && setRequestToDelete(null)}
        title="Delete Removal Request"
        description="Are you sure you want to delete this removal request? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleConfirmDelete}
        loading={!!deletingId}
      />
    </div>
  );
}
