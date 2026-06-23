import { Metadata } from 'next';
import RemovalWizard from '@/components/removal/RemovalWizard';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

export const metadata: Metadata = {
  title: 'Free Review Removal Assessment',
  description:
    'Get a free assessment on the potential of getting your negative review taken down. Our team will analyze your case and recommend the best method through legal and regulatory means.',
  openGraph: {
    title: 'Free Review Removal Assessment | Reach Them AI',
    description:
      'Complete the form and our team will provide a free assessment on the potential of getting the review taken down.',
    images: ['/featured.png'],
    type: 'website',
  },
};

export default function FreeAssessmentPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            Get a Free Review Removal Assessment
          </h1>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Complete the form below and our team will provide a free assessment on the potential of
            getting the review taken down.
          </p>
        </div>
        <RemovalWizard freeAssessment />
      </main>
      <Footer />
    </div>
  );
}
