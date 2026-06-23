import { Radar, Shield, Zap } from 'lucide-react';
import AuthAwareLinkButton from '@/components/shared/AuthAwareLinkButton';
import VideoDemoButton from '@/components/app/VideoDemoButton';
import BusinessImpactEstimateLink, {
  businessImpactEstimatePrimaryClassNameMachine,
} from '@/components/shared/BusinessImpactEstimateLink';

export type HeroSectionProps = {
  headlineLine1?: string;
  headlineLine2?: string;
  headlineLine3?: string;
};

export default function HeroSection({
  headlineLine1 = 'Analyze All Your Google',
  headlineLine2 = 'Business Reviews Instantly',
  headlineLine3,
}: HeroSectionProps = {}) {
  return (
    <section className="relative bg-gradient-to-br from-[#182825] via-primary-900 to-[#182825] text-white pt-32 pb-20 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center w-full max-w-full mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#FCD0A1]/30 border border-[#FCD0A1] text-[#FCD0A1] rounded-full px-4 py-2 text-sm font-medium mb-8">
            <Radar className="h-4 w-4" />
            Automated Review Intelligence
          </div>

          <h1 className="flex flex-col gap-y-2 max-md:gap-y-1 text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6 max-md:text-[1.3rem] max-md:leading-snug text-center">
            <span className="text-white">{headlineLine1}</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-blue-300 leading-snug">
              {headlineLine2}
            </span>
            {headlineLine3 != null && headlineLine3 !== '' ? (
              <span className="text-white">{headlineLine3}</span>
            ) : null}
          </h1>

          <p className="text-[1.1rem] leading-[1.5rem] max-md:text-[1rem] text-secondary-300 mb-10 max-w-3xl mx-auto">
            Our AI-powered review scanner pulls every Google review for your business, classifies each one against Google&apos;s content policies, and generates evidence-based removal strategies automatically. Find out what reviews are hurting your business and get them removed.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <AuthAwareLinkButton
              authenticatedHref="/app/scanner"
              unauthenticatedHref="/business-scan"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-500 transition-all shadow-lg hover:-translate-y-0.5 text-lg max-md:w-full"
            >
              Free Review Scan
            </AuthAwareLinkButton>
            <VideoDemoButton className="inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 border-primary-500/80 bg-primary-900/30 text-white font-semibold text-lg hover:bg-primary-800/50 hover:border-primary-400 transition-all max-md:w-full" />
            <BusinessImpactEstimateLink className={businessImpactEstimatePrimaryClassNameMachine} />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            {[
              { icon: Shield, stat: '100%', label: 'Reviews Analyzed' },
              { icon: Zap, stat: '<3 min', label: 'Average Scan Time' },
              { icon: Radar, stat: '9', label: 'Policy Categories Checked' },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center">
                <item.icon className="h-6 w-6 text-primary-400 mb-2" />
                <p className="text-3xl font-bold text-white">{item.stat}</p>
                <p className="text-sm font-bold text-secondary-400 capitalize">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
