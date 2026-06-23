'use client';

import { useState, useEffect } from 'react';
import { createSPASassClient } from '@/lib/supabase/client';
import { GlobalProvider } from '@/lib/context/GlobalContext';
import AppLayout from '@/components/AppLayout';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { Loader2 } from 'lucide-react';

export default function SubmitRemovalLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = await createSPASassClient();
        const { data: { user } } = await supabase.getSupabaseClient().auth.getUser();
        setIsLoggedIn(!!user);
      } catch {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (isLoggedIn) {
    return (
      <GlobalProvider>
        <div className="theme-brand">
          <AppLayout>{children}</AppLayout>
        </div>
      </GlobalProvider>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">{children}</main>
      <Footer />
    </div>
  );
}
