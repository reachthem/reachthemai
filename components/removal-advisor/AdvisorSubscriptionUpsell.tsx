'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Brain,
  CheckCircle2,
  Shield,
  Lock,
  Star,
  Loader2,
  MessageSquare,
  BarChart3,
  Search,
  FileCheck,
  Zap,
} from 'lucide-react';
import VideoDemoButton from '@/components/app/VideoDemoButton';

const included = [
  'Unlimited analyses — submit as many reviews as you need',
  'Platform-specific instructions for Google, Yelp, Facebook, Trustpilot & more',
  'Strongest legal & policy-based grounds identified automatically',
  'Follow-up AI chat to dig deeper into your specific case',
  'Case tracking dashboard — all your removal efforts in one place',
  'Confidence scoring so you know your odds before you file',
];

const platforms = ['Google', 'Yelp', 'Facebook', 'Trustpilot', 'TripAdvisor'];

const capabilities = [
  { icon: Search, label: 'Deep Review Analysis', desc: 'AI scans the review text for policy violations, fake review indicators, and legal grounds' },
  { icon: FileCheck, label: 'Step-by-Step Instructions', desc: 'Tailored to each platform\'s specific flagging and reporting process' },
  { icon: MessageSquare, label: 'Follow-Up Chat', desc: 'Ask the AI follow-up questions about your specific case' },
  { icon: BarChart3, label: 'Case Tracking', desc: 'Monitor all your review removal cases from a single dashboard' },
];

const howItWorks = [
  {
    step: '1',
    title: 'Click the AI Advisor Button',
    desc: 'Click the AI Advisor button next to any Google Review from your scan or fill out the form for Non-Google Reviews',
  },
  { step: '2', title: 'AI Analyzes', desc: 'Our AI identifies the strongest removal grounds specific to that platform' },
  { step: '3', title: 'Follow Instructions', desc: 'Get a clear, step-by-step action plan to report the review' },
];

interface AdvisorSubscriptionUpsellProps {
  /** Display price from admin settings (e.g. "49"). Pass from server to avoid hardcoding. */
  advisorPrice?: string;
  /** Optional bullets inserted before the default `included` list (e.g. subscribe page scanner copy). */
  prependedFeatures?: string[];
}

export default function AdvisorSubscriptionUpsell({
  advisorPrice = '19',
  prependedFeatures,
}: AdvisorSubscriptionUpsellProps) {
  const includedItems = prependedFeatures?.length
    ? [...prependedFeatures, ...included]
    : included;
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  async function handleSubscribe() {
    setCheckoutLoading(true);
    setCheckoutError(null);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan_type: 'removal_advisor' }),
        credentials: 'same-origin',
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? `Checkout failed (${res.status})`);
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error(data.error ?? 'No checkout URL returned');
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setCheckoutLoading(false);
    }
  }

  return (
    <div className="space-y-10">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 px-3 py-1 text-sm font-medium text-primary-700 dark:text-primary-400 mb-4">
          <Zap className="h-3.5 w-3.5" /> AI-Powered
        </span>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
          Remove Negative Reviews —{' '}
          <span className="text-primary-600 dark:text-primary-400">AI Tells You Exactly How</span>
        </h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 max-w-4xl mx-auto leading-relaxed">
          Use our custom trained AI Research Analysis and Advisor to instantly execute Deep Research on each of your
          reviews, the strongest legal &amp; policy-based grounds for removal, step-by-step platform-specific
          instructions, confidence scoring, follow-up instructions with tracking, full chat modality to ask additional
          questions and advice, and much more.
        </p>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 max-w-3xl mx-auto">
          Used by business owners to fight reviews on{' '}
          {platforms.map((p, i) => (
            <span key={p}>
              <span className="font-medium text-slate-700 dark:text-slate-300">{p}</span>
              {i < platforms.length - 1 ? ', ' : ''}
            </span>
          ))}
        </p>
      </div>

      <div className="flex justify-center w-full">
        <VideoDemoButton />
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <div className="relative">
          <div className="absolute inset-0 bg-primary-600/10 blur-2xl rounded-3xl" />
          <div className="relative bg-white dark:bg-slate-800 rounded-3xl border-2 border-primary-500 shadow-2xl overflow-hidden">
            <div className="bg-primary-600 py-2 px-8 text-center">
              <span className="text-white text-sm font-semibold">
                Unlimited AI-Guided Removal
              </span>
            </div>

            <div className="p-8">
              <div className="flex items-center gap-3 mb-1">
                <Brain className="h-6 w-6 text-primary-600" />
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  AI Removal Advisor
                </h2>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Monthly subscription — unlimited analyses
              </p>

              <div className="mt-6 text-center py-6 border-y border-slate-200 dark:border-slate-700">
                <div className="flex items-start justify-center gap-1">
                  <span className="text-3xl font-bold text-primary-600 mt-3">$</span>
                  <span className="text-8xl font-extrabold text-slate-900 dark:text-white">{advisorPrice}</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 mt-1">per month</p>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 rounded-lg px-3 py-2">
                  Reputation Management Agencies charge <strong className="text-slate-700 dark:text-slate-300">$250–$1,500 per review removed</strong>.
                  Get AI-powered instructions, plans and follow-up for ${'$'}
                  {advisorPrice}.
                </p>
              </div>

              <ul className="mt-6 space-y-3">
                {includedItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700">
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center mb-2">
                  Works with
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {platforms.map((p) => (
                    <span
                      key={p}
                      className="text-xs font-medium px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {checkoutError && (
                <p className="mt-4 text-sm text-red-600 dark:text-red-400 text-center">
                  {checkoutError}
                </p>
              )}

              <button
                onClick={handleSubscribe}
                disabled={checkoutLoading}
                className="mt-8 w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-primary-600 text-white font-semibold text-lg hover:bg-primary-700 transition-all shadow-lg hover:shadow-primary-600/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {checkoutLoading ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Processing...</>
                ) : (
                  'Subscribe'
                )}
              </button>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <Lock className="h-3.5 w-3.5" />
                  Secure payments via Stripe
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5" />
                  Cancel anytime
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                  AI-powered accuracy
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              What the AI Does for You
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Trained on platform-specific review policies and legal removal grounds — so you don&apos;t have to be an expert.
            </p>

            <div className="space-y-4">
              {capabilities.map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex gap-3">
                  <div className="flex-shrink-0 mt-0.5 h-8 w-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{label}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
              How It Works
            </h3>
            <ol className="space-y-6">
              {howItWorks.map(({ step, title, desc }) => (
                <li key={step} className="flex gap-4">
                  <span
                    className="flex-shrink-0 h-9 w-9 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 flex items-center justify-center text-sm font-semibold ring-2 ring-primary-200 dark:ring-primary-800"
                    aria-hidden
                  >
                    {step}
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{title}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="text-center space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <p>
              Want to learn more before subscribing?{' '}
              <Link href="/ai-advisor" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
                See full feature details →
              </Link>
            </p>
            <p>
              Questions?{' '}
              <a href="/contact" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
                Contact us
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
