import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verify Email',
  description:
    'Verify your email address to activate your Reach Them AI account and start submitting review removal requests.',
  openGraph: {
    title: 'Verify Email | Reach Them AI',
    description: 'Confirm your email to activate your account.',
    images: ['/featured.png'],
    type: 'website',
  },
};

export default function VerifyEmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
