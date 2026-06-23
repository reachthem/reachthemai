import { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import ConfirmationContent from './ConfirmationContent';

export const metadata: Metadata = {
  title: 'Assessment Submitted',
  description:
    'Your review has been submitted for a free assessment. Our team will look into the potential and method for getting the review removed.',
  openGraph: {
    title: 'Assessment Submitted | Reach Them AI',
    description: 'Your review has been submitted. Our team will start looking into the potential and method for getting the review removed.',
    images: ['/featured.png'],
    type: 'website',
  },
};

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <ConfirmationContent />
      </main>
      <Footer />
    </div>
  );
}
