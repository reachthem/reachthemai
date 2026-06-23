'use client';

import { type ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { createSPASassClient } from '@/lib/supabase/client';

interface AdvisorCheckoutButtonProps {
  unauthenticatedHref: string;
  className: string;
  loadingText?: string;
  processingText?: string;
  errorClassName?: string;
  children: ReactNode;
}

export default function AdvisorCheckoutButton({
  unauthenticatedHref,
  className,
  loadingText = 'Loading...',
  processingText = 'Processing...',
  errorClassName = 'mt-3 text-sm text-red-600 dark:text-red-400 text-center',
  children,
}: AdvisorCheckoutButtonProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = await createSPASassClient();
        const { data: { user } } = await supabase.getSupabaseClient().auth.getUser();
        setIsAuthenticated(!!user);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

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

  if (loading) {
    return (
      <div className={`${className} pointer-events-none opacity-80`} aria-busy="true">
        <Loader2 className="h-5 w-5 animate-spin" />
        {loadingText}
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Link href={unauthenticatedHref} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleSubscribe}
        disabled={checkoutLoading}
        className={`${className} disabled:opacity-50 disabled:hover:translate-y-0`}
      >
        {checkoutLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            {processingText}
          </>
        ) : (
          children
        )}
      </button>
      {checkoutError && (
        <p className={errorClassName}>{checkoutError}</p>
      )}
    </>
  );
}
