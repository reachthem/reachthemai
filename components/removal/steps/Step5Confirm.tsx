'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { createSPAClient } from '@/lib/supabase/client';
import { linkUserToDraft, setReadyForPayment, submitFreeAssessment } from '@/app/actions/removal-requests';
import { Button } from '@/components/ui/button';
import {
  Loader2,
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  Link as LinkIcon,
  AlertTriangle,
  Pencil,
  Lock,
  User as UserIcon,
} from 'lucide-react';

const PLATFORM_LABELS: Record<string, string> = {
  google: 'Google',
  yelp: 'Yelp',
  facebook: 'Facebook',
  trustpilot: 'Trustpilot',
  tripadvisor: 'TripAdvisor',
  bbb: 'BBB',
  glassdoor: 'Glassdoor',
  amazon: 'Amazon',
  angi: 'Angi',
  homeadvisor: 'HomeAdvisor',
  healthgrades: 'Healthgrades',
  avvo: 'Avvo',
  cars_com: 'Cars.com',
  dealer_rater: 'DealerRater',
  zocdoc: 'Zocdoc',
  vitals: 'Vitals',
  other: 'Other',
};

const REASON_LABELS: Record<string, string> = {
  fake_review: 'Fake Review',
  violates_tos: 'Violates TOS',
  competitor: 'Competitor',
  spam: 'Spam',
  harassment: 'Harassment',
  not_sure: 'Not Sure',
  other: 'Other',
};

interface Step5Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  draftData: Record<string, any> | null;
  draftKey: string;
  onBack: (step?: number) => void;
  /** When true, no auth or payment; submit as free assessment and redirect to /confirmation */
  freeAssessment?: boolean;
}

export default function Step5Confirm({ draftData, draftKey, onBack, freeAssessment = false }: Step5Props) {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | null>(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const paymentPrepStarted = useRef(false);

  useEffect(() => {
    const supabase = createSPAClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser({ id: data.user.id, email: data.user.email ?? '' });
      }
      setAuthChecked(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email ?? '' });
        setAuthMode(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user && draftKey) {
      linkUserToDraft(draftKey, user.id).catch(() => {});
    }
  }, [user, draftKey]);

  useEffect(() => {
    if (freeAssessment || !draftKey || paymentPrepStarted.current) return;
    paymentPrepStarted.current = true;
    void setReadyForPayment(draftKey).catch(() => {
      paymentPrepStarted.current = false;
    });
  }, [draftKey, freeAssessment]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      const supabase = createSPAClient();
      if (authMode === 'signup') {
        const { error } = await supabase.auth.signUp({ email: authEmail, password: authPassword });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
        if (error) throw error;
      }
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handlePayment = async () => {
    setProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draft_key: draftKey }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      if (data.url) window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start checkout');
    } finally {
      setProcessing(false);
    }
  };

  const handleSubmitFreeAssessment = async () => {
    setProcessing(true);
    setError(null);

    try {
      await submitFreeAssessment(draftKey);
      window.location.href = '/confirmation';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit for review');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          Review &amp; Confirm
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {freeAssessment
            ? 'Please review your submission before submitting for a free assessment.'
            : 'Please review your submission before proceeding to payment.'}
        </p>
      </div>

      {/* Summary cards */}
      <div className="space-y-4">
        {/* Contact Info */}
        <SummaryCard title="Contact Info" onEdit={() => onBack(1)}>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-slate-400" />
              <span>{draftData?.contact_email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-slate-400" />
              <span>{draftData?.contact_phone}</span>
            </div>
          </div>
        </SummaryCard>

        {/* Platform & Review */}
        <SummaryCard title="Review Details" onEdit={() => onBack(2)}>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4 text-slate-400" />
              <span>{PLATFORM_LABELS[draftData?.platform] ?? draftData?.platform}</span>
            </div>
            {draftData?.review_author && (
              <div className="flex items-center gap-2 text-sm">
                <UserIcon className="h-4 w-4 text-slate-400" />
                <span>{draftData.review_author}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <LinkIcon className="h-4 w-4 text-slate-400" />
              <a href={draftData?.review_url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline truncate">
                {draftData?.review_url}
              </a>
            </div>
          </div>
        </SummaryCard>

        {/* Removal Reason */}
        <SummaryCard title="Removal details" onEdit={() => onBack(3)}>
          <div className="space-y-2">
            {draftData?.removal_reason && REASON_LABELS[draftData.removal_reason] && (
              <div className="flex items-center gap-2 text-sm">
                <AlertTriangle className="h-4 w-4 text-slate-400" />
                <span>{REASON_LABELS[draftData.removal_reason]}</span>
              </div>
            )}
            {draftData?.description && (
              <p className="text-sm text-slate-600 dark:text-slate-400">{draftData.description}</p>
            )}
          </div>
        </SummaryCard>
      </div>

      {/* Auth gate (skip for free assessment) */}
      {!freeAssessment && authChecked && !user && (
        <div className="p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <div className="flex items-start gap-3">
            <Lock className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                Sign in to continue
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                An account is required to process payment and track your request.
              </p>

              {authMode ? (
                <form onSubmit={handleAuth} className="mt-4 space-y-3">
                  <input
                    type="email"
                    placeholder="Email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                    required
                  />
                  {authError && <p className="text-xs text-red-600">{authError}</p>}
                  <div className="flex gap-2">
                    <Button type="submit" size="sm" disabled={authLoading}>
                      {authLoading && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                      {authMode === 'signup' ? 'Create Account' : 'Sign In'}
                    </Button>
                    <Button type="button" size="sm" variant="ghost" onClick={() => setAuthMode(null)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="mt-4 flex gap-3">
                  <Button size="sm" onClick={() => setAuthMode('signin')}>
                    <UserIcon className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setAuthMode('signup')}>
                    Create Account
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="flex justify-between">
        <Button type="button" variant="ghost" onClick={() => onBack()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        {freeAssessment ? (
          <Button onClick={handleSubmitFreeAssessment} disabled={processing} size="lg">
            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit for Review
          </Button>
        ) : (
          user && (
            <Button onClick={handlePayment} disabled={processing} size="lg">
              {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Pay $299 &amp; Submit
            </Button>
          )
        )}
      </div>

      {!freeAssessment && (
        <>
          <div className="mt-6 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-4">
            <p className="text-sm text-green-800 dark:text-green-200">
              <strong>Our services are guaranteed.</strong> If we cannot get your review removed, you receive a full refund.
            </p>
          </div>
          <div className="mt-6 flex justify-center">
            <Image src="/guarantee.png" alt="Guarantee" width={350} height={200} className="max-w-[350px] w-full h-auto" />
          </div>
        </>
      )}
    </div>
  );
}

function SummaryCard({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700"
        >
          <Pencil className="h-3 w-3" />
          Edit
        </button>
      </div>
      {children}
    </div>
  );
}
