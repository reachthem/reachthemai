'use client';

import Link from 'next/link';
import { User, ScanSearch, Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ModifyProfileModal from '@/components/app/ModifyProfileModal';

export default function RemovalsStepsGuide() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Get started</CardTitle>
        <CardDescription>
          Follow these steps to get the most out of your account
        </CardDescription>
      </CardHeader>
      <div className="px-6 pb-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 p-4">
            <div className="flex flex-col gap-3 items-center text-center w-full">
              <div className="rounded-lg bg-primary-100 dark:bg-primary-900/30 p-2.5 w-fit">
                <User className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <p className="text-[1.5rem] font-medium text-slate-500 dark:text-slate-400">Step 1</p>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Complete Profile Information</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Complete profile information for faster analysis and removal requests.
              </p>
              <ModifyProfileModal
                triggerLabel="Modify Profile"
                triggerVariant="outline"
                triggerSize="sm"
                triggerClassName="mt-2 w-full"
              />
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm">
            <div className="flex flex-col gap-3 items-center text-center w-full">
              <div className="rounded-lg bg-primary-100 dark:bg-primary-900/30 p-2.5 w-fit">
                <ScanSearch className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <p className="text-[1.5rem] font-medium text-slate-500 dark:text-slate-400">Step 2</p>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Scan Your Google Business Reviews or Submit a Specific Review for Pro Removal</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Either run a Google Business Reviews Scan for a list of all reviews that need attention with prefilled forms for easy Pro Removal Requests, or submit a specific review from any platform for Pro Removal.
              </p>
              <div className="mt-2 flex flex-col w-full">
                <Button asChild variant="secondary" size="sm" className="w-full mb-5">
                  <Link href="/app/scanner" className="w-full">Scan Google Reviews</Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="w-full mb-5">
                  <Link href="/submit-removal" className="w-full">Submit Specific Review</Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm">
            <div className="flex flex-col gap-3 items-center text-center w-full">
              <div className="rounded-lg bg-primary-100 dark:bg-primary-900/30 p-2.5 w-fit">
                <Plus className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <p className="text-[1.5rem] font-medium text-slate-500 dark:text-slate-400">Step 3</p>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">View Google Scan Results</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                If working with Google Reviews, view your scan results and click on the Submit for Removal button next to the review you want removed.
              </p>
              <Button asChild variant="secondary" size="sm" className="mt-2 w-full">
                <Link href="/app/scanner" className="w-full">View Google Scan Results</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
