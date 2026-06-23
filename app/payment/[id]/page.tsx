import { notFound } from 'next/navigation';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { getRemovalDisplayPrice } from '@/app/actions/admin-settings';
import PaymentClient from './PaymentClient';
import { AlertTriangle, CheckCircle2, Globe, Mail } from 'lucide-react';

export const metadata = {
  title: 'Complete Your Payment | Reach Them AI',
  description: 'Securely pay for your review removal request.',
};

export default async function PaymentPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const searchParamsValue = await searchParams;
  const isCancelled = searchParamsValue.cancelled === 'true';

  const adminClient = await createServerAdminClient();
  const { data: request, error } = await adminClient
    .from('removal_requests')
    .select('id, status, review_url, platform, contact_email, created_at')
    .eq('id', id)
    .single();

  if (error || !request) {
    notFound();
  }

  type RequestRow = { id: string; status: string; review_url: string | null; platform: string | null; contact_email: string | null; created_at: string };
  const req = request as RequestRow;

  // If already paid or resolved, show a different message
  if (req.status !== 'ready_for_payment') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center border border-slate-200 dark:border-slate-700">
          <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Request Status: {req.status.replace(/_/g, ' ')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            This request is not pending payment. If you believe this is an error, please contact support.
          </p>
        </div>
      </div>
    );
  }

  const price = await getRemovalDisplayPrice();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            Complete Your Payment
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Finalize your review removal request to start the process.
          </p>
        </div>

        {isCancelled && (
          <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              Payment was cancelled. You can try again when you&apos;re ready.
            </p>
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
          <div className="p-8 sm:p-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Review Removal Service
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Request ID: {req.id.slice(0, 8)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  ${price}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  One-time fee
                </p>
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 py-6 space-y-4">
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    Platform: {req.platform || 'Unknown'}
                  </p>
                  {req.review_url && (
                    <a 
                      href={req.review_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 truncate block max-w-md"
                    >
                      {req.review_url}
                    </a>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-slate-400 shrink-0" />
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Receipt will be sent to: <span className="font-medium text-slate-900 dark:text-white">{req.contact_email}</span>
                </p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 mb-8">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                What happens next?
              </h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  <span>Our team will review your case immediately after payment.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  <span>We will draft and submit the removal request to {req.platform || 'the platform'}.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  <span>You&apos;ll receive updates via email throughout the process.</span>
                </li>
              </ul>
            </div>

            <PaymentClient 
              requestId={req.id} 
              contactEmail={req.contact_email ?? ''} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
