'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createSPASassClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

export default function CheckoutButton() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="mt-8 w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-primary-600/80 text-white font-semibold text-lg">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading...
      </div>
    );
  }

  return (
    <div className="mt-8">
      {isAuthenticated ? (
        <Link
          href="/submit-removal"
          className="w-full flex items-center justify-center py-4 px-6 rounded-xl bg-primary-600 text-white font-semibold text-lg hover:bg-primary-700 transition-all shadow-lg hover:shadow-primary-600/30 hover:-translate-y-0.5"
        >
          Submit Review
        </Link>
      ) : (
        <Link
          href="/auth/register?redirect=/submit-removal"
          className="w-full flex items-center justify-center py-4 px-6 rounded-xl bg-primary-600 text-white font-semibold text-lg hover:bg-primary-700 transition-all shadow-lg hover:shadow-primary-600/30 hover:-translate-y-0.5"
        >
          Submit Review
        </Link>
      )}

      {!isAuthenticated && (
        <p className="mt-3 text-xs text-center text-slate-500 dark:text-slate-400">
          Create an account to get started. You&apos;ll be taken to the removal submission page after signing in.
        </p>
      )}
    </div>
  );
}
