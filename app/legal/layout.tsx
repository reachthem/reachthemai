import type { Metadata } from 'next';
import LegalLayoutClient from '@/components/legal/LegalLayoutClient';

export const metadata: Metadata = {
  title: 'Legal',
  description:
    'Read Reach Them AI legal documents: Privacy Policy, Terms of Service, and Refund Policy. Understand how we handle your data and our review removal service terms.',
  openGraph: {
    title: 'Legal | Reach Them AI',
    description: 'Privacy Policy, Terms of Service, and Refund Policy.',
    images: ['/featured.png'],
    type: 'website',
  },
};

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return <LegalLayoutClient>{children}</LegalLayoutClient>;
}
