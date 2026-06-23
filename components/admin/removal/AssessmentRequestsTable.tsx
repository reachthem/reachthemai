'use client';

import { useRouter } from 'next/navigation';
import StatusBadge from '@/components/removal/StatusBadge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

const PLATFORM_LABELS: Record<string, string> = {
  google: 'Google',
  yelp: 'Yelp',
  facebook: 'Facebook',
  trustpilot: 'Trustpilot',
  tripadvisor: 'TripAdvisor',
  other: 'Other',
};

interface AssessmentRequest {
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

export default function AssessmentRequestsTable({
  requests,
}: {
  requests: AssessmentRequest[];
}) {
  const router = useRouter();

  if (requests.length === 0) {
    return (
      <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
        <p className="text-slate-500 dark:text-slate-400">No free assessment requests yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Platform
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Reason
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {requests.map((request) => (
              <tr
                key={request.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer"
                onClick={() => router.push(`/app/admin/assesment-requests/${request.id}`)}
              >
                <td className="px-4 py-3 text-sm text-slate-900 dark:text-white whitespace-nowrap">
                  {formatDate(request.created_at)}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 max-w-[200px] truncate">
                  {request.contact_email}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                  {PLATFORM_LABELS[request.platform ?? ''] ?? request.platform ?? '—'}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 capitalize">
                  {request.removal_reason?.replace(/_/g, ' ') ?? '—'}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={request.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/app/admin/assesment-requests/${request.id}`);
                    }}
                  >
                    <Eye className="h-4 w-4" />
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
