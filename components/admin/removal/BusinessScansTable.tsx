'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink, Trash2, ArrowDown, ArrowUp } from 'lucide-react';
import { deleteBusinessScan } from '@/app/actions/admin-business-scans';
import { toast } from 'sonner';
import { useMemo, useState } from 'react';
import { ConfirmModal } from '@/components/ui/confirm-modal';

export interface BusinessScanRow {
  id: string;
  status: string;
  reviews_found: number;
  threats_found: number;
  scan_type: string;
  created_at: string;
  completed_at: string | null;
  business_name: string;
  business_address: string | null;
  business_rating: number | null;
  business_total_reviews: number | null;
  user_email: string | null;
}

type SortKey =
  | 'created_at'
  | 'business_name'
  | 'user_email'
  | 'business_rating'
  | 'business_total_reviews'
  | 'reviews_found'
  | 'threats_found'
  | 'status'
  | 'scan_type';

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString));
}

function ScanStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${colors[status] ?? 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

function exportCSV(rows: BusinessScanRow[]) {
  const headers = [
    'Date',
    'Business',
    'Address',
    'Type',
    'Rating',
    'Total Reviews',
    'Reviews Scanned',
    'Threats Found',
    'Status',
    'User Email',
  ];
  const csvRows = rows.map((r) => [
    formatDate(r.created_at),
    r.business_name,
    r.business_address ?? '',
    r.scan_type,
    r.business_rating?.toString() ?? '',
    r.business_total_reviews?.toString() ?? '',
    r.reviews_found.toString(),
    r.threats_found.toString(),
    r.status,
    r.user_email ?? '',
  ]);
  const csvContent = [headers, ...csvRows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `business-scans-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function BusinessScansTable({ scans }: { scans: BusinessScanRow[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [scanToDelete, setScanToDelete] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const sortedScans = useMemo(() => {
    const mult = sortDir === 'asc' ? 1 : -1;
    return [...scans].sort((a, b) => {
      const tie = (a.id < b.id ? -1 : 1) * mult;
      if (sortKey === 'created_at') {
        const t =
          (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) * mult;
        return t !== 0 ? t : tie;
      }
      if (
        sortKey === 'reviews_found' ||
        sortKey === 'threats_found' ||
        sortKey === 'business_rating' ||
        sortKey === 'business_total_reviews'
      ) {
        const va = Number(a[sortKey] ?? -1);
        const vb = Number(b[sortKey] ?? -1);
        const n = (va - vb) * mult;
        return n !== 0 ? n : tie;
      }
      const sa = (a[sortKey] ?? '').toString().toLowerCase();
      const sb = (b[sortKey] ?? '').toString().toLowerCase();
      const c = sa.localeCompare(sb, undefined, { numeric: true }) * mult;
      return c !== 0 ? c : tie;
    });
  }, [scans, sortKey, sortDir]);

  const onSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'created_at' ? 'desc' : 'asc');
    }
  };

  const SortTh = ({
    k,
    children,
    align = 'left',
  }: {
    k: SortKey;
    children: React.ReactNode;
    align?: 'left' | 'right';
  }) => {
    const active = sortKey === k;
    return (
      <th
        scope="col"
        className={`px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ${
          align === 'right' ? 'text-right' : 'text-left'
        }`}
      >
        <button
          type="button"
          onClick={() => onSort(k)}
          className={`inline-flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-200 ${
            align === 'right' ? 'w-full justify-end' : ''
          }`}
          aria-sort={active ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
        >
          {children}
          {active ? (
            sortDir === 'asc' ? (
              <ArrowUp className="h-3.5 w-3.5 shrink-0" aria-hidden />
            ) : (
              <ArrowDown className="h-3.5 w-3.5 shrink-0" aria-hidden />
            )
          ) : null}
        </button>
      </th>
    );
  };

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setScanToDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (!scanToDelete) return;
    setDeletingId(scanToDelete);
    try {
      await deleteBusinessScan(scanToDelete);
      toast.success('Business scan deleted');
      router.refresh();
    } catch (error) {
      console.error('Failed to delete scan:', error);
      toast.error('Failed to delete scan');
    } finally {
      setDeletingId(null);
    }
  };

  if (scans.length === 0) {
    return (
      <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
        <p className="text-slate-500 dark:text-slate-400">No business scans found.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button variant="outline" size="sm" onClick={() => exportCSV(sortedScans)}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <SortTh k="created_at">Date</SortTh>
                <SortTh k="business_name">Business</SortTh>
                <SortTh k="user_email">User Email</SortTh>
                <SortTh k="scan_type">Type</SortTh>
                <SortTh k="business_rating">Rating</SortTh>
                <SortTh k="business_total_reviews" align="right">
                  <span className="inline-flex w-full justify-end">Total Reviews</span>
                </SortTh>
                <SortTh k="reviews_found" align="right">
                  <span className="inline-flex w-full justify-end">Scanned</span>
                </SortTh>
                <SortTh k="threats_found" align="right">
                  <span className="inline-flex w-full justify-end">Threats</span>
                </SortTh>
                <SortTh k="status">Status</SortTh>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {sortedScans.map((scan) => (
                <tr key={scan.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-4 py-3 text-sm text-slate-900 dark:text-white whitespace-nowrap">
                    {formatDate(scan.created_at)}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-900 dark:text-white max-w-[220px]">
                    <p className="font-medium truncate">{scan.business_name}</p>
                    {scan.business_address && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{scan.business_address}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 max-w-[200px] truncate">
                    {scan.user_email ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 capitalize max-w-[120px] truncate">
                    {scan.scan_type?.replace(/_/g, ' ') ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                    {scan.business_rating != null ? `★ ${scan.business_rating}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 text-right">
                    {scan.business_total_reviews?.toLocaleString() ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-900 dark:text-white text-right font-medium">
                    {scan.reviews_found.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-medium">
                    <span className={scan.threats_found > 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-300'}>
                      {scan.threats_found.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <ScanStatusBadge status={scan.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <a
                          href={`/app/scanner/${scan.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        disabled={deletingId === scan.id}
                        onClick={(e) => handleDeleteClick(scan.id, e)}
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
        open={!!scanToDelete}
        onOpenChange={(open) => !open && setScanToDelete(null)}
        title="Delete Business Scan"
        description="Are you sure you want to delete this business scan? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleConfirmDelete}
        loading={!!deletingId}
      />
    </div>
  );
}
