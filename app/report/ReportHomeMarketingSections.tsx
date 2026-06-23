import ReviewSitesBanner from '@/components/home/ReviewSitesBanner';
import NegativeReviewsCostVideoSection from '@/components/home/NegativeReviewsCostVideoSection';
import ServiceSelectionSection from '@/components/home/ServiceSelectionSection';
import CombinedFeaturesSection from '@/components/home/CombinedFeaturesSection';
import StatsBar from '@/components/home/StatsBar';
import PlatformsSupportedSection from '@/components/home/PlatformsSupportedSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import HomeFAQSection from '@/components/home/HomeFAQSection';
import HomeCTASection from '@/components/home/HomeCTASection';
import Footer from '@/components/shared/Footer';

interface ReportHomeMarketingSectionsProps {
  advisorPrice: string;
  removalPrice: string;
}

export default function ReportHomeMarketingSections({
  advisorPrice,
  removalPrice,
}: ReportHomeMarketingSectionsProps) {
  return (
    <div className="bg-white dark:bg-slate-900">
      <ReviewSitesBanner />
      <NegativeReviewsCostVideoSection />
      <ServiceSelectionSection advisorPrice={advisorPrice} removalPrice={removalPrice} />
      <CombinedFeaturesSection />
      <StatsBar />
      <PlatformsSupportedSection />
      <TestimonialsSection />
      <HomeFAQSection advisorPrice={advisorPrice} removalPrice={removalPrice} />
      <HomeCTASection advisorPrice={advisorPrice} />
      <Footer />
    </div>
  );
}
