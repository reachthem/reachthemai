'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ConfirmationContent() {
  useEffect(() => {
    localStorage.removeItem('removal_draft_key');
  }, []);

  return (
    <div className="max-w-lg mx-auto text-center">
      <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30">
        <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
      </div>

      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
        Your review has been submitted
      </h1>

      <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
        Our team will start looking into the potential and method for getting the review removed.
        We&apos;ll be in touch with our assessment and next steps.
      </p>

      <div className="mt-8">
        <Button asChild size="lg">
          <Link href="/auth/register">Create Free Account</Link>
        </Button>
      </div>
    </div>
  );
}
