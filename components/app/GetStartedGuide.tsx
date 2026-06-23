'use client';

import Link from 'next/link';
import { Radar, Brain } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function GetStartedGuide() {
  return (
    <Card className="border-secondary-200">
      <CardHeader>
        <CardTitle>Get started</CardTitle>
        <CardDescription>
          Follow these steps to get the most out of your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 flex-1">
            <div className="flex flex-col sm:flex-row gap-2 flex-1">
              <div className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 shadow-sm">
                <div className="flex flex-col gap-2 items-center text-center w-full">
                  <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-2 w-fit">
                    <Radar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-base md:text-xl lg:text-2xl font-semibold text-slate-900 dark:text-white leading-tight">
                    Remove Google Reviews
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Start by scanning your Google Business profile to get a full list of all reviews that need attention.
                  </p>
                  <div className="my-5 w-full max-w-[300px] mx-auto">
                    <Button asChild size="sm" className="w-full bg-primary-600 hover:bg-primary-700 text-white">
                      <Link href="/app/scanner" className="w-full">Scan Google Reviews</Link>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center px-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest shrink-0">or</span>
              </div>

              <div className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 shadow-sm">
                <div className="flex flex-col gap-2 items-center text-center w-full">
                  <div className="rounded-lg bg-violet-100 dark:bg-violet-900/30 p-2 w-fit">
                    <Brain className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <h3 className="text-base md:text-xl lg:text-2xl font-semibold text-slate-900 dark:text-white leading-tight">
                    Remove Non-Google Reviews
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    For Non-Google reviews you can either get a full strategy for removing the review with our AI Advisor or Submit your review for professional removal.
                  </p>
                  <div className="my-5 flex flex-col w-full max-w-[300px] mx-auto gap-2">
                    <Button asChild size="sm" className="w-full mb-5 bg-[#182825] hover:bg-slate-800 text-white">
                      <Link href="/app/removal-advisor/new" className="w-full">AI Review Removal Advisor</Link>
                    </Button>
                    <Button asChild size="sm" className="w-full bg-primary-600 hover:bg-primary-700 text-white">
                      <Link href="/submit-removal" className="w-full">Professional Review Removal</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
