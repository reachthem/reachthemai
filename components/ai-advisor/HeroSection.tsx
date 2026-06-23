import { Shield } from 'lucide-react';
import VideoDemoButton from '@/components/app/VideoDemoButton';
import AdvisorCheckoutButton from '@/components/shared/AdvisorCheckoutButton';
import BusinessImpactEstimateLink from '@/components/shared/BusinessImpactEstimateLink';

interface HeroSectionProps {
  advisorPrice?: string;
}

export default function HeroSection({ advisorPrice = '19' }: HeroSectionProps) {
  return (
    <section className="relative pt-20 max-md:pt-12 pb-24 max-md:pb-20 overflow-hidden bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900">
      {/* Background decorative elements — matches /review-removal-services hero */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-800/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-700/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="flex flex-col gap-y-2 max-md:gap-y-1 text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-snug max-md:text-[1.3rem] max-md:leading-snug text-center">
            <span className="text-white">Remove Negative Reviews</span>
            <span className="ai-advisor-hero-gradient text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-blue-300 leading-[1.35]">
              in Minutes with AI
            </span>
          </h1>

          <p className="mt-6 text-[1.1rem] leading-[1.5rem] max-md:text-[1rem] text-slate-300 max-w-5xl mx-auto">
            Our AI analyzes your reviews, identifies the strongest legal and policy grounds for removal, then gives you the exact platform-specific, step-by-step instructions to get all negative reviews removed in minutes.
          </p>

          {/* Key benefits */}
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-slate-400 max-md:text-[#fff]">
            <div className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-green-400" />
              <span>Unlimited analyses</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-green-400" />
              <span>Platform-specific instructions</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-green-400" />
              <span>Cancel anytime</span>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <AdvisorCheckoutButton
              unauthenticatedHref="/auth/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary-600 text-white font-semibold text-lg hover:bg-primary-500 transition-all shadow-lg shadow-primary-900/50 hover:shadow-primary-600/40 hover:-translate-y-0.5 max-md:w-full"
            >
              {`Start for $${advisorPrice}/month`}
            </AdvisorCheckoutButton>
            <VideoDemoButton className="inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 border-primary-500/80 bg-primary-900/30 text-white font-semibold text-lg hover:bg-primary-800/50 hover:border-primary-400 transition-all max-md:w-full" />
            <BusinessImpactEstimateLink />
          </div>
        </div>
      </div>
    </section>
  );
}
