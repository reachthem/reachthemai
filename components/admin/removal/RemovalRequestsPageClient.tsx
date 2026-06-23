'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import RemovalRequestsTable from './RemovalRequestsTable';
import AssessmentRequestsTable from './AssessmentRequestsTable';
import BusinessScansTable from './BusinessScansTable';
import AdvisorCasesTable from './AdvisorCasesTable';
import type { BusinessScanRow } from './BusinessScansTable';
import type { AdvisorCaseRow } from './AdvisorCasesTable';

const STATUS_TABS = [
  { key: 'all', label: 'All' },
  { key: 'ready_for_payment', label: 'Ready for Payment' },
  { key: 'submitted', label: 'Submitted' },
  { key: 'in_review', label: 'In Review' },
  { key: 'action_taken', label: 'Action Taken' },
  { key: 'resolved', label: 'Removed' },
  { key: 'unsuccessful', label: 'Unsuccessful' },
];

interface RemovalRequestRow {
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

interface AssessmentRequestRow {
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

interface RemovalRequestsPageClientProps {
  removalRequests: RemovalRequestRow[];
  assessmentRequests: AssessmentRequestRow[];
  statusCounts: Record<string, number>;
  totalRemovalCount: number;
  businessScans: BusinessScanRow[];
  advisorCases: AdvisorCaseRow[];
}

const MAIN_TABS = [
  { key: 'removal', label: 'Removal Requests' },
  { key: 'scans', label: 'Business Scans' },
  { key: 'advisor', label: 'AI Advisor' },
  { key: 'assessment', label: 'Free Assessments' },
] as const;

export default function RemovalRequestsPageClient({
  removalRequests,
  assessmentRequests,
  statusCounts,
  totalRemovalCount,
  businessScans,
  advisorCases,
}: RemovalRequestsPageClientProps) {
  const searchParams = useSearchParams();
  const mainTab = searchParams.get('tab') ?? 'removal';
  const statusFilter = searchParams.get('status') ?? 'all';

  const filteredRemovalRequests =
    statusFilter === 'all'
      ? removalRequests
      : removalRequests.filter((r) => r.status === statusFilter);

  const tabCounts: Record<string, number> = {
    removal: totalRemovalCount,
    assessment: assessmentRequests.length,
    scans: businessScans.length,
    advisor: advisorCases.length,
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Removal Requests
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage removal requests, assessments, business scans, and AI advisor cases.
          </p>
        </div>
      </div>

      {/* Main tabs */}
      <div className="flex gap-1 mb-6 border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
        {MAIN_TABS.map((tab) => {
          const isActive = mainTab === tab.key || (tab.key === 'removal' && !searchParams.get('tab'));
          const href = tab.key === 'removal'
            ? '/app/admin/removal-requests'
            : `/app/admin/removal-requests?tab=${tab.key}`;
          return (
            <Link
              key={tab.key}
              href={href}
              className={cn(
                'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap',
                isActive
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              )}
            >
              {tab.label}
              <span className="ml-1.5 text-xs font-normal text-slate-400">
                ({tabCounts[tab.key] ?? 0})
              </span>
            </Link>
          );
        })}
      </div>

      {mainTab === 'assessment' ? (
        <AssessmentRequestsTable requests={assessmentRequests} />
      ) : mainTab === 'scans' ? (
        <BusinessScansTable scans={businessScans} />
      ) : mainTab === 'advisor' ? (
        <AdvisorCasesTable cases={advisorCases} />
      ) : (
        <>
          {/* Status filter tabs (removal only) */}
          <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
            {STATUS_TABS.map((tab) => {
              const count = tab.key === 'all' ? totalRemovalCount : (statusCounts[tab.key] ?? 0);
              const isActive = statusFilter === tab.key;
              return (
                <Link
                  key={tab.key}
                  href={
                    tab.key === 'all'
                      ? '/app/admin/removal-requests'
                      : `/app/admin/removal-requests?status=${tab.key}`
                  }
                  className={cn(
                    'inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
                    isActive
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                  )}
                >
                  {tab.label}
                  <span
                    className={cn(
                      'text-xs px-1.5 py-0.5 rounded-full',
                      isActive ? 'bg-primary-100 dark:bg-primary-800/50' : 'bg-slate-200 dark:bg-slate-700'
                    )}
                  >
                    {count}
                  </span>
                </Link>
              );
            })}
          </div>

          <RemovalRequestsTable requests={filteredRemovalRequests} />
        </>
      )}
    </>
  );
}
