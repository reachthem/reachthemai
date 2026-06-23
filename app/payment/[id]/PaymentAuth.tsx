'use client';

import { useState, useEffect, useRef } from 'react';
import { createSPAClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { ExternalLink, Loader2, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { LoginModal } from '@/components/auth/LoginModal';

const GOOGLE_ICON = (
  <svg viewBox="0 0 20 20" className="w-5 h-5" fill="currentColor">
    <path d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z" fill="#4285F4"/>
    <path d="M10 20c2.67 0 4.9-.89 6.57-2.43l-3.16-2.45c-.89.59-2.01.96-3.41.96-2.61 0-4.83-1.76-5.63-4.13H1.07v2.51C2.72 17.75 6.09 20 10 20z" fill="#34A853"/>
    <path d="M4.37 11.95c-.2-.6-.31-1.24-.31-1.95s.11-1.35.31-1.95V5.54H1.07C.38 6.84 0 8.36 0 10s.38 3.16 1.07 4.46l3.3-2.51z" fill="#FBBC05"/>
    <path d="M10 3.98c1.48 0 2.79.51 3.83 1.5l2.78-2.78C14.93 1.03 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.54l3.3 2.51C5.17 5.68 7.39 3.98 10 3.98z" fill="#EA4335"/>
  </svg>
);

export default function PaymentAuth() {
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const popupRef = useRef<Window | null>(null);

  useEffect(() => {
    const supabase = createSPAClient();
    
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user ? { email: user.email } : null);
      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { email: session.user.email } : null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'AUTH_SUCCESS') {
        setAuthLoading(false);
        // Refresh user state
        const supabase = createSPAClient();
        supabase.auth.getUser().then(({ data: { user } }) => {
          setUser(user ? { email: user.email } : null);
          toast.success('Successfully logged in!');
        });
      }
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleGoogleLogin = async () => {
    setAuthLoading(true);
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
        setAuthLoading(false);
        toast.error('Popup was blocked. Please allow popups for this site and try again.');
        return;
      }

      const pollTimer = setInterval(() => {
        if (popup.closed) {
          clearInterval(pollTimer);
          // If popup closed without success message, we might want to stop loading
          // But we don't know if it was success or cancel. 
          // Ideally we wait for message. If closed and no message, maybe user cancelled.
          // For now, let's just leave it or set timeout? 
          // Let's rely on the message listener. If user closes, loading might stick.
          // We can check if user is logged in after close.
          setTimeout(() => {
             // check auth state one last time?
             setAuthLoading(false); 
          }, 1000);
        }
      }, 500);
    } catch (err) {
      setAuthLoading(false);
      const msg = err instanceof Error ? err.message : 'Failed to start Google login';
      toast.error(msg);
    }
  };

  const handleLoginSuccess = async () => {
    const supabase = createSPAClient();
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user ? { email: user.email } : null);
    toast.success('Successfully logged in!');
  };

  if (loading) return null;

  if (user) {
    return (
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-blue-700 dark:text-blue-300 text-center">
        You are logged in as <span className="font-semibold">{user.email}</span>
      </div>
    );
  }

  return (
    <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 text-center">
        Log in to save this request to your account
      </h3>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          variant="outline"
          onClick={() => setIsLoginModalOpen(true)}
          disabled={authLoading}
        >
          <LogIn className="mr-2 h-4 w-4" />
          Email Login
        </Button>

        <Button
          variant="outline"
          onClick={handleGoogleLogin}
          disabled={authLoading}
          className="relative"
        >
          {authLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <div className="mr-2 flex items-center justify-center">
              {GOOGLE_ICON}
            </div>
          )}
          Continue with Google
        </Button>

        <Button
          variant="outline"
          asChild
        >
          <a href="/auth/register" target="_blank" rel="noopener noreferrer">
            Create Account
            <ExternalLink className="ml-2 h-3 w-3 opacity-50" />
          </a>
        </Button>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 text-center">
        Already have an account? Log in to link this payment.
      </p>

      <LoginModal
        open={isLoginModalOpen}
        onOpenChange={setIsLoginModalOpen}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}
