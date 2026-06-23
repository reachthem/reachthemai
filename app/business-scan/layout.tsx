import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';

export const metadata: Metadata = {
  title: 'Free Google Review Scan | Reach Them AI',
  description:
    'Scan your Google reviews for free. Our AI-powered scanner detects policy violations, fake reviews, and removal opportunities — no account required to start.',
  openGraph: {
    title: 'Free Google Review Scan | Reach Them AI',
    description:
      'Scan your Google reviews for free. AI-powered threat detection and removal strategies.',
    images: ['/featured.png'],
    type: 'website',
  },
};

export default function BusinessScanLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="theme-brand">
      <div className="min-h-screen bg-gray-100">
        <Navbar background="white" maxWidth="98%" />

        <main className="pt-16 p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
