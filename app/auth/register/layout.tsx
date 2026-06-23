import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account',
  description:
    'Create your free Reach Them AI account to submit review removal requests, remove bad Google reviews, and protect your business reputation. No credit card required.',
  openGraph: {
    title: 'Create Account | Reach Them AI',
    description: 'Sign up to submit review removal requests and protect your reputation.',
    images: ['/featured.png'],
    type: 'website',
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
