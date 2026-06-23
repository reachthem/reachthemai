import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';

export const metadata: Metadata = {
  title: 'Free Business Impact Report | Reach Them AI',
  description:
    'See how much your business can improve by removing negative reviews. Get a free report with estimated monthly traffic, revenue impact, and what reaching a 5.0 rating could mean for your business.',
  openGraph: {
    title: 'Free Business Impact Report | Reach Them AI',
    description:
      'Discover how much revenue you are leaving on the table because of negative reviews. Free business impact report.',
    images: ['/featured.png'],
    type: 'website',
  },
};

export default function ReportLayout({ children }: { children: React.ReactNode }) {
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
