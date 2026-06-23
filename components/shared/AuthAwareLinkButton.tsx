'use client';

import { type ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { createSPASassClient } from '@/lib/supabase/client';

interface AuthAwareLinkButtonProps {
  authenticatedHref: string;
  unauthenticatedHref: string;
  className: string;
  loadingText?: string;
  children: ReactNode;
}

export default function AuthAwareLinkButton({
  authenticatedHref,
  unauthenticatedHref,
  className,
  loadingText = 'Loading...',
  children,
}: AuthAwareLinkButtonProps) {
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
      <div className={`${className} pointer-events-none opacity-80`} aria-busy="true">
        <Loader2 className="h-5 w-5 animate-spin" />
        {loadingText}
      </div>
    );
  }

  return (
    <Link href={isAuthenticated ? authenticatedHref : unauthenticatedHref} className={className}>
      {children}
    </Link>
  );
}
