import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Two-Factor Authentication',
  description:
    'Complete two-factor authentication to sign in to your Reach Them AI account. Enter your verification code to continue.',
  openGraph: {
    title: 'Two-Factor Authentication | Reach Them AI',
    description: 'Complete 2FA to sign in to your account.',
    images: ['/featured.png'],
    type: 'website',
  },
};

export default function TwoFactorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
