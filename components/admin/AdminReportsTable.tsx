'use client';

import Link from 'next/link';
import { ExternalLink, Star, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AdminPlaceReportRow } from '@/lib/admin/loadAdminPlaceReports';

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

function CacheStatusBadge({ expiresAt }: { expiresAt: string | null }) {
  if (!expiresAt) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
        No expiry
      </span>
    );
  }
  const isExpired = new Date(expiresAt).getTime() < Date.now();
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
        isExpired
          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
          : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      }`}
    >
      {isExpired ? 'Expired' : 'Active'}
    </span>
  );
}

export default function AdminReportsTable({ reports }: { reports: AdminPlaceReportRow[] }) {
  if (reports.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center">
        <p className="text-slate-500 dark:text-slate-400">No reports found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400">
              <th className="text-left px-4 py-3 font-medium uppercase tracking-wider">Generated</th>
              <th className="text-left px-4 py-3 font-medium uppercase tracking-wider">Business</th>
              <th className="text-right px-4 py-3 font-medium uppercase tracking-wider">Rating</th>
              <th className="text-right px-4 py-3 font-medium uppercase tracking-wider">Reviews</th>
              <th className="text-right px-4 py-3 font-medium uppercase tracking-wider">Leads</th>
              <th className="text-left px-4 py-3 font-medium uppercase tracking-wider">Cache</th>
              <th className="text-left px-4 py-3 font-medium uppercase tracking-wider">Expires</th>
              <th className="text-right px-4 py-3 font-medium uppercase tracking-wider">View</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="border-t border-slate-100 dark:border-slate-700">
                <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                  {formatDateTime(report.generated_at)}
                </td>
                <td className="px-4 py-2.5 max-w-[250px]">
                  <p className="font-medium text-slate-900 dark:text-white truncate">{report.business_name}</p>
                  {report.business_address && (
                    <p className="text-xs text-slate-500 truncate">{report.business_address}</p>
                  )}
                  <p className="text-xs text-slate-400 font-mono truncate" title={report.place_id}>
                    {report.place_id.slice(0, 20)}…
                  </p>
                </td>
                <td className="px-4 py-2.5 text-right">
                  {report.business_rating != null ? (
                    <span className="inline-flex items-center gap-1 font-medium text-slate-900 dark:text-white">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {report.business_rating}
                    </span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td className="px-4 py-2.5 text-right font-medium text-slate-900 dark:text-white">
                  {report.business_total_reviews?.toLocaleString() ?? '—'}
                </td>
                <td className="px-4 py-2.5 text-right">
                  {report.lead_count > 0 ? (
                    <span className="inline-flex items-center gap-1 text-primary-600 font-medium">
                      <Users className="h-3.5 w-3.5" />
                      {report.lead_count}
                    </span>
                  ) : (
                    <span className="text-slate-400">0</span>
                  )}
                </td>
                <td className="px-4 py-2.5">
                  <CacheStatusBadge expiresAt={report.expires_at} />
                </td>
                <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                  {formatDateTime(report.expires_at)}
                </td>
                <td className="px-4 py-2.5 text-right">
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={`/report?placeId=${encodeURIComponent(report.place_id)}`}
                      target="_blank"
                      className="inline-flex items-center gap-1"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      View report
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
