import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Plus, CheckCircle2, ScanSearch, User } from 'lucide-react';
import { createSSRSassClient } from '@/lib/supabase/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { getOnboardingStatus } from '@/app/actions/user-profile';
import ReviewCasesTable from '@/components/removal-advisor/ReviewCasesTable';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ModifyProfileModal from '@/components/app/ModifyProfileModal';
import VideoDemoButton from '@/components/app/VideoDemoButton';

export const metadata: Metadata = {
  title: 'AI Removal Advisor',
  description:
    'Manage your AI Review Advisor cases. View removal analysis, strategy recommendations, and track which reviews have been removed or reported.',
  openGraph: {
    title: 'AI Removal Advisor | Reach Them AI',
    description: 'AI-powered review removal cases and strategy tracking.',
    images: ['/featured.png'],
    type: 'website',
  },
};

type RemovalAdvisorPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function RemovalAdvisorPage({ searchParams }: RemovalAdvisorPageProps) {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const resolvedParams = await searchParams;
  const subscriptionSuccess = resolvedParams.subscription === 'success';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adminClient = (await createServerAdminClient()) as any;
  const { data: userData } = await adminClient
    .from('user_data')
    .select('subscription_tier, user_role')
    .eq('user_id', user.id)
    .single();
  const isSubscribed =
    userData?.subscription_tier === 'removal_advisor' || userData?.user_role === 'admin';

  const { data: cases } = await adminClient
    .from('review_cases')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const allCases = cases ?? [];
  const activeCount = allCases.filter((c: { status: string }) =>
    ['active', 'reported', 'pending_platform'].includes(c.status)
  ).length;
  const removedCount = allCases.filter((c: { status: string }) => c.status === 'removed').length;
  const rejectedCount = allCases.filter((c: { status: string }) => c.status === 'rejected').length;
  const successRate = removedCount + rejectedCount > 0
    ? Math.round((removedCount / (removedCount + rejectedCount)) * 100)
    : null;

  let showGetStarted = false;
  try {
    const status = await getOnboardingStatus();
    showGetStarted =
      !status.hasScannedBusiness && allCases.length === 0;
  } catch {
    // ignore
  }

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              AI Removal Advisor
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Track and get AI-guided removal instructions for your negative reviews
            </p>
          </div>
          {isSubscribed && (
            <Link
              href="/app/removal-advisor/new"
              className="flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors sm:w-auto"
            >
              <Plus className="h-4 w-4" /> Analyze a Review
            </Link>
          )}
        </div>

        {subscriptionSuccess && (
          <div className="p-5 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200">
            <div className="flex gap-3">
              <CheckCircle2 className="h-6 w-6 shrink-0 text-green-600 dark:text-green-400 mt-0.5" />
              <div>
                <p className="font-semibold text-base">Thank you — your payment was successful</p>
                <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                  We appreciate you subscribing to the AI Removal Advisor. You can now analyze an unlimited number of reviews — click the &ldquo;Analyze a Review&rdquo; button above to get started.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Total Cases" value={allCases.length} />
          <StatCard label="Active" value={activeCount} color="text-blue-600" />
          <StatCard label="Removed" value={removedCount} color="text-green-600" />
          <StatCard label="Success Rate" value={successRate !== null ? `${successRate}%` : '—'} color="text-primary-600" />
        </div>

        {/* Get Started - above table when onboarding incomplete */}
        {showGetStarted && (
          <>
            <div className="flex justify-center">
              <VideoDemoButton />
            </div>
            <Card>
            <CardHeader>
              <CardTitle>Get started</CardTitle>
              <CardDescription>
                Follow these steps to get the most out of your account
              </CardDescription>
            </CardHeader>
            <div className="px-6 pb-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 p-4">
                  <div className="flex flex-col gap-3 items-center text-center w-full">
                    <div className="rounded-lg bg-primary-100 dark:bg-primary-900/30 p-2.5 w-fit">
                      <User className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <p className="text-[1.5rem] font-medium text-slate-500 dark:text-slate-400">Step 1</p>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Complete Profile Information</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Complete profile information for faster analysis and removal requests.
                    </p>
                    <ModifyProfileModal
                      triggerLabel="Modify Profile"
                      triggerVariant="outline"
                      triggerSize="sm"
                      triggerClassName="mt-2 w-full"
                    />
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm">
                  <div className="flex flex-col gap-3 items-center text-center w-full">
                    <div className="rounded-lg bg-primary-100 dark:bg-primary-900/30 p-2.5 w-fit">
                      <ScanSearch className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <p className="text-[1.5rem] font-medium text-slate-500 dark:text-slate-400">Step 2</p>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Scan Your Google Business Reviews or Analyze a Specific Review</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Either run a Google Business Reviews Scan for a list of all reviews that need attention with prefilled forms for easy analysis, or analyze a specific review from any platform by clicking the Analyze Review button.
                    </p>
                    <div className="mt-2 flex flex-col w-full gap-2 mb-5">
                      <Button asChild variant="secondary" size="sm" className="w-full">
                        <Link href="/app/scanner" className="w-full">Scan Google Reviews</Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link href="/app/removal-advisor/new" className="w-full">Analyze Specific Review</Link>
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm">
                  <div className="flex flex-col gap-3 items-center text-center w-full">
                    <div className="rounded-lg bg-primary-100 dark:bg-primary-900/30 p-2.5 w-fit">
                      <Plus className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <p className="text-[1.5rem] font-medium text-slate-500 dark:text-slate-400">Step 3</p>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">View Google Scan Results</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      If working with Google Reviews, view your scan results and click on the AI Removal Analysis button next to the review you want removed.
                    </p>
                    <Button asChild variant="secondary" size="sm" className="mt-2 w-full">
                      <Link href="/app/scanner" className="w-full">View Google Scan Results</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          </>
        )}

        {/* Table */}
        <ReviewCasesTable cases={allCases} showAnalyzeEmptyState={isSubscribed} />

        {/* Two-column action grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Link
            href="/app/scanner"
            className="group block rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm transition-all hover:border-primary-500 hover:shadow-md hover:bg-primary-50/30 dark:hover:bg-primary-900/10"
          >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
              <div className="rounded-lg bg-primary-100 dark:bg-primary-900/30 p-2.5 shrink-0">
                <ScanSearch className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="min-w-0 flex-1 text-center md:text-left">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-400">
                  Scan Google Reviews
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  If you are looking for Google Review Removals you can get a list of your reviews and expedite the AI Advisor process with prefilled forms for all your reviews, as well as get other important insights.
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:gap-2 transition-all">
                  Go to Scanner
                </span>
              </div>
            </div>
          </Link>

          <Link
            href="/app/removal-advisor/new"
            className="group block rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm transition-all hover:border-primary-500 hover:shadow-md hover:bg-primary-50/30 dark:hover:bg-primary-900/10"
          >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
              <div className="rounded-lg bg-primary-100 dark:bg-primary-900/30 p-2.5 shrink-0">
                <Plus className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="min-w-0 flex-1 text-center md:text-left">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-400">
                  Analyze a Specific Review
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Analyze a specific review from Google, Facebook, Yelp and many other platforms and get a step by step recommended guide for how to get the review removed.
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:gap-2 transition-all">
                  Start analysis
                </span>
              </div>
            </div>
          </Link>
        </div>

      </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm">
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p className={`text-2xl font-bold ${color || 'text-slate-900 dark:text-white'}`}>{value}</p>
    </div>
  );
}
