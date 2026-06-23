'use client';

import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AdminBusinessScanRow } from '@/lib/admin/loadAdminBusinessScans';

function formatDateTime(dateString: string | null) {
  if (!dateString) return '—';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
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
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
        colors[status] ?? 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
      }`}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
}

export default function AdminScansTable({ scans }: { scans: AdminBusinessScanRow[] }) {
  if (scans.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center">
        <p className="text-slate-500 dark:text-slate-400">No scans found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400">
              <th className="text-left px-4 py-3 font-medium uppercase tracking-wider">Created</th>
              <th className="text-left px-4 py-3 font-medium uppercase tracking-wider">User</th>
              <th className="text-left px-4 py-3 font-medium uppercase tracking-wider">Business</th>
              <th className="text-left px-4 py-3 font-medium uppercase tracking-wider">Type</th>
              <th className="text-right px-4 py-3 font-medium uppercase tracking-wider">Reviews</th>
              <th className="text-right px-4 py-3 font-medium uppercase tracking-wider">Threats</th>
              <th className="text-left px-4 py-3 font-medium uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 font-medium uppercase tracking-wider">Completed</th>
              <th className="text-right px-4 py-3 font-medium uppercase tracking-wider">View</th>
            </tr>
          </thead>
          <tbody>
            {scans.map((scan) => (
              <tr key={scan.id} className="border-t border-slate-100 dark:border-slate-700">
                <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                  {formatDateTime(scan.created_at)}
                </td>
                <td className="px-4 py-2.5 max-w-[200px]">
                  <p className="text-slate-800 dark:text-slate-200 truncate" title={scan.user_email ?? scan.user_id ?? undefined}>
                    {scan.user_email ?? '—'}
                  </p>
                  <p
                    className="text-xs text-slate-400 font-mono truncate"
                    title={scan.user_id ?? undefined}
                  >
                    {scan.user_id ? `${scan.user_id.slice(0, 8)}…` : '—'}
                  </p>
                </td>
                <td className="px-4 py-2.5 max-w-[220px]">
                  <p className="font-medium text-slate-900 dark:text-white truncate">{scan.business_name}</p>
                  {scan.business_address && (
                    <p className="text-xs text-slate-500 truncate">{scan.business_address}</p>
                  )}
                </td>
                <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300 capitalize">
                  {scan.scan_type?.replace(/_/g, ' ') ?? '—'}
                </td>
                <td className="px-4 py-2.5 text-right font-medium text-slate-900 dark:text-white">
                  {scan.reviews_found.toLocaleString()}
                </td>
                <td className="px-4 py-2.5 text-right">
                  <span
                    className={
                      scan.threats_found > 0
                        ? 'text-red-600 dark:text-red-400 font-medium'
                        : 'text-slate-600 dark:text-slate-300'
                    }
                  >
                    {scan.threats_found.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <ScanStatusBadge status={scan.status} />
                </td>
                <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                  {formatDateTime(scan.completed_at)}
                </td>
                <td className="px-4 py-2.5 text-right">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/app/scanner/${scan.id}`} className="inline-flex items-center gap-1">
                      <ExternalLink className="h-3.5 w-3.5" />
                      Open scan
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
