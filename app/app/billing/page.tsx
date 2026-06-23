import type { Metadata } from 'next';
import { createSSRSassClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Receipt, ExternalLink, CheckCircle2 } from 'lucide-react';
import ManageBillingButton from '@/components/billing/ManageBillingButton';
import CancelSubscriptionButton from '@/components/billing/CancelSubscriptionButton';

export const metadata: Metadata = {
  title: 'Billing',
  description:
    'Manage your Reach Them AI subscription and billing. View invoices, update payment methods, and manage your review removal and reputation plan.',
  openGraph: {
    title: 'Billing | Reach Them AI',
    description: 'Manage subscription and billing for your account.',
    images: ['/featured.png'],
    type: 'website',
  },
};

interface BillingRow {
  id: string;
  amount: number;
  currency: string;
  plan_name: string | null;
  plan_key: string | null;
  stripe_payment_intent_id: string | null;
  status: string;
  description: string | null;
  billing_date: string;
}

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(amount / 100);
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString));
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    paid: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    refunded: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  };
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] ?? styles.pending}`}>
      {label}
    </span>
  );
}

type BillingPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function BillingPage({ searchParams }: BillingPageProps) {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const resolvedParams = await searchParams;
  const subscriptionSuccess = resolvedParams.subscription === 'success';

  const [{ data: billingRows }, { data: userData }] = await Promise.all([
    supabase
      .from('billing_history')
      .select('id, amount, currency, plan_name, plan_key, stripe_payment_intent_id, status, description, billing_date')
      .eq('user_id', user.id)
      .order('billing_date', { ascending: false }),
    supabase.from('user_data').select('subscription_tier').eq('user_id', user.id).single(),
  ]);

  const payments = (billingRows ?? []) as BillingRow[];
  const subscriptionTier = (userData as { subscription_tier?: string } | null)?.subscription_tier ?? 'free';
  const hasAdvisorSubscription = subscriptionTier === 'removal_advisor';

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Billing History</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Your review removal payments and receipts.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {hasAdvisorSubscription && <CancelSubscriptionButton />}
          <ManageBillingButton />
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
          <Receipt className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No payments yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm max-w-sm mx-auto">
            Once you submit a review for removal, your payment history will appear here.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center px-5 py-2.5 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors text-sm"
          >
            Submit a Review for Removal
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-900 dark:text-white whitespace-nowrap">
                      {formatDate(payment.billing_date)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        {payment.plan_name ?? 'Review Removal'}
                      </div>
                      {payment.description && (
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {payment.description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {formatAmount(payment.amount, payment.currency)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={payment.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      {payment.stripe_payment_intent_id && (
                        <span className="inline-flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                          <ExternalLink className="h-3 w-3" />
                          Via Stripe
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {subscriptionSuccess && (
        <div className="mt-8 p-5 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200">
          <div className="flex gap-3">
            <CheckCircle2 className="h-6 w-6 shrink-0 text-green-600 dark:text-green-400 mt-0.5" />
            <div>
              <p className="font-semibold text-base">Thank you — your payment was successful</p>
              <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                We appreciate you subscribing to the AI Removal Advisor. You can now analyze an unlimited number of reviews. Get started by clicking the &ldquo;Analyze a Review&rdquo; button below.
              </p>
              <Link
                href="/app/removal-advisor/new"
                className="mt-3 inline-flex items-center px-4 py-2 rounded-lg bg-green-600 text-white font-medium text-sm hover:bg-green-700 transition-colors"
              >
                <ArrowRight className="mr-2 h-4 w-4" />
                Analyze a Review
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
        {hasAdvisorSubscription ? (
          <>
            To cancel your AI Removal Advisor subscription, click &ldquo;Cancel subscription&rdquo; above. You&apos;ll be taken to Stripe to confirm cancellation.
            {' '}
            Need a detailed invoice or to update your payment method? Use &ldquo;Manage Billing&rdquo; to access the Stripe Customer Portal.
          </>
        ) : (
          <>
            Need a detailed invoice or to update your payment method? Click &ldquo;Manage Billing&rdquo; above to access the Stripe Customer Portal.
          </>
        )}
      </div>
    </div>
  );
}
