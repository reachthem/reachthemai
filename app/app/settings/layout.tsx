import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings',
  description:
    'Connect your review platforms, manage integrations, and configure your Reach Them AI account. Link Google, Yelp, Facebook, and Trustpilot.',
  openGraph: {
    title: 'Settings | Reach Them AI',
    description: 'Connect review platforms and manage your account.',
    images: ['/featured.png'],
    type: 'website',
  },
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
