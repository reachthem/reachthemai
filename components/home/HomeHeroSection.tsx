'use client';

import { useState } from 'react';
import { CheckCircle2, Play } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import AuthAwareLinkButton from '@/components/shared/AuthAwareLinkButton';
import BusinessImpactEstimateLink from '@/components/shared/BusinessImpactEstimateLink';

const VIDEO_ID = '-9FZYstTdCY';
const VIDEO_EMBED_URL = `https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1`;

export default function HomeHeroSection() {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <section className="relative pt-20 max-md:pt-12 pb-24 max-md:pb-20 overflow-hidden bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-800/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-700/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="flex flex-col gap-y-2 max-md:gap-y-1 text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight max-md:text-[1.3rem] max-md:leading-snug text-center">
            <span className="text-white">Remove Negative Reviews</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-blue-300 leading-snug">Increase Positive Reviews Everywhere</span>
            <span className="text-white">Get More Clients and Customers</span>
          </h1>

          <p className="mt-6 text-[1.1rem] leading-[1.5rem] max-md:text-[1rem] text-slate-300 max-w-3xl mx-auto">
            Get all your negative reviews removed with our Self Service AI Review Advisor or let our Professional Team analyze your reviews, potential policy violations and execute the Review Removal operations that can get you back to a 5.0 Rating. We also help business owners increase positive reviews and mitigate bad reviews on Google Business, Yelp, Facebook and more.
          </p>

          {/* Key benefits */}
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-slate-400 max-md:text-[#fff]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary-400" />
              <span>Legitimate Process</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary-400" />
              <span>Policy-Based Removals</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary-400" />
              <span>Results Guaranteed</span>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <AuthAwareLinkButton
              authenticatedHref="/app/scanner"
              unauthenticatedHref="/auth/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary-600 text-white font-semibold text-lg hover:bg-primary-500 transition-all shadow-lg shadow-primary-900/50 hover:shadow-primary-600/40 hover:-translate-y-0.5 max-md:w-full"
            >
              Free Review Scan
            </AuthAwareLinkButton>
            <button
              type="button"
              onClick={() => setVideoOpen(true)}
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 border-primary-500/80 bg-primary-900/30 text-white font-semibold text-lg hover:bg-primary-800/50 hover:border-primary-400 transition-all max-md:w-full"
            >
              Video Demo
              <Play className="ml-2 h-5 w-5" />
            </button>
            <BusinessImpactEstimateLink />
          </div>

          <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
            <DialogContent className="max-w-4xl bg-slate-900 border-slate-700 p-0 overflow-hidden">
              <DialogHeader className="sr-only">
                <DialogTitle>Video Demo</DialogTitle>
              </DialogHeader>
              <div className="aspect-video w-full">
                {videoOpen && (
                  <iframe
                    src={VIDEO_EMBED_URL}
                    title="Video Demo"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="h-full w-full"
                  />
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
}
