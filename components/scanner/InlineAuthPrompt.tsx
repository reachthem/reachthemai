'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createSPAClient } from '@/lib/supabase/client';
import { Lock, ExternalLink } from 'lucide-react';

interface InlineAuthPromptProps {
  scanId: string;
  sessionToken: string;
  onAuthSuccess: (resultsUrl: string) => void;
  onError?: (error: string) => void;
}

const GOOGLE_ICON = (
  <svg viewBox="0 0 20 20" className="w-5 h-5" fill="currentColor">
    <path d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z" fill="#4285F4"/>
    <path d="M10 20c2.67 0 4.9-.89 6.57-2.43l-3.16-2.45c-.89.59-2.01.96-3.41.96-2.61 0-4.83-1.76-5.63-4.13H1.07v2.51C2.72 17.75 6.09 20 10 20z" fill="#34A853"/>
    <path d="M4.37 11.95c-.2-.6-.31-1.24-.31-1.95s.11-1.35.31-1.95V5.54H1.07C.38 6.84 0 8.36 0 10s.38 3.16 1.07 4.46l3.3-2.51z" fill="#FBBC05"/>
    <path d="M10 3.98c1.48 0 2.79.51 3.83 1.5l2.78-2.78C14.93 1.03 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.54l3.3 2.51C5.17 5.68 7.39 3.98 10 3.98z" fill="#EA4335"/>
  </svg>
);

export default function InlineAuthPrompt({
  scanId,
  sessionToken,
  onAuthSuccess,
  onError,
}: InlineAuthPromptProps) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [dashboardUrl, setDashboardUrl] = useState<string | null>(null);
  const claimDone = useRef(false);
  const popupRef = useRef<Window | null>(null);

  const claimScan = useCallback(async () => {
    if (claimDone.current || claiming) return;
    claimDone.current = true;
    setClaiming(true);
    setError('');

    try {
      const res = await fetch('/api/public/scanner/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scanId, sessionToken }),
      });

      if (res.ok) {
        const data = await res.json();
        const url = data.redirectTo || `/app/scanner/${scanId}`;
        setDashboardUrl(url);
        setClaiming(false);
        onAuthSuccess(url);
      } else if (res.status === 409) {
        const url = `/app/scanner/${scanId}`;
        setDashboardUrl(url);
        setClaiming(false);
        onAuthSuccess(url);
      } else {
        claimDone.current = false;
        const errData = await res.json().catch(() => ({}));
        setError(errData.error || 'Failed to link scan to your account. Please try again.');
        setClaiming(false);
      }
    } catch {
      claimDone.current = false;
      setError('Failed to link scan to your account. Please try again.');
      setClaiming(false);
    }
  }, [scanId, sessionToken, claiming, onAuthSuccess]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'AUTH_SUCCESS') {
        setLoading(false);
        claimScan();
      }
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [claimScan]);

  useEffect(() => {
    if (!loading) return;

    const supabase = createSPAClient();
    const interval = setInterval(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        clearInterval(interval);
        setLoading(false);
        claimScan();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [loading, claimScan]);

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const supabase = createSPAClient();

      const callbackUrl = new URL('/api/auth/callback', window.location.origin);
      callbackUrl.searchParams.set('next', '/auth/popup-close');

      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl.toString(),
          skipBrowserRedirect: true,
        },
      });

      if (oauthError) throw oauthError;
      if (!data.url) throw new Error('Failed to get Google login URL');

      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popup = window.open(
        data.url,
        'google-login',
        `width=${width},height=${height},left=${left},top=${top},popup=yes`
      );
      popupRef.current = popup;

      if (!popup) {
        setLoading(false);
        setError('Popup was blocked. Please allow popups for this site and try again.');
        return;
      }

      const pollTimer = setInterval(() => {
        if (popup.closed) {
          clearInterval(pollTimer);
        }
      }, 500);
    } catch (err) {
      setLoading(false);
      const msg = err instanceof Error ? err.message : 'Failed to start Google login';
      setError(msg);
      onError?.(msg);
    }
  };

  if (claiming) {
    return (
      <div className="bg-white border border-secondary-200 rounded-2xl p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
          <div className="h-7 w-7 border-3 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
        <h3 className="text-lg font-bold text-secondary-900 mb-2">Setting up your account...</h3>
        <p className="text-secondary-500 text-sm">Linking your scan results to your account. Just a moment.</p>
      </div>
    );
  }

  if (dashboardUrl) {
    return (
      <div className="bg-white border-2 border-green-200 rounded-2xl p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-secondary-900 mb-2">Account Ready!</h3>
        <p className="text-secondary-500 text-sm mb-6">Your scan has been linked to your account.</p>
        <a
          href={dashboardUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full h-12 px-6 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-500 transition-colors shadow-md"
        >
          <ExternalLink className="h-4 w-4" />
          Go to Dashboard
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white border border-secondary-200 rounded-2xl p-8">
      <div className="flex items-center gap-2 mb-2">
        <Lock className="h-5 w-5 text-primary-600" />
        <h3 className="text-lg font-bold text-secondary-900">Login or Create Account</h3>
      </div>
      <p className="text-secondary-500 text-sm mb-6">
        Sign in or Create an Account with Google to view your full threat report with flagged reviews and removal strategies.
      </p>

      {error && (
        <div className="mb-4 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="group relative flex h-12 w-full items-center rounded-lg border border-gray-300 bg-white px-6 transition-colors duration-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="absolute left-6">
          <div className="flex h-5 w-5 items-center justify-center">
            {GOOGLE_ICON}
          </div>
        </div>
        <span className="mx-auto text-sm font-semibold text-gray-700">
          {loading ? 'Waiting for Google sign-in...' : 'Continue with Google'}
        </span>
      </button>
    </div>
  );
}
