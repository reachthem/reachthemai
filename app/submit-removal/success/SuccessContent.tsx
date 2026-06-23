'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SuccessContent() {
  useEffect(() => {
    localStorage.removeItem('removal_draft_key');
  }, []);

  return (
    <div className="max-w-lg mx-auto text-center">
      <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30">
        <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400 animate-bounce" />
      </div>

      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
        Your removal request has been submitted!
      </h1>

      <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
        Our team will review your case and begin the removal process. You can
        expect an update within 1–4 business weeks. We&apos;ll keep you
        informed by email.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/app/my-removals">View My Requests</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/submit-removal">Submit Another Review</Link>
        </Button>
      </div>
    </div>
  );
}
