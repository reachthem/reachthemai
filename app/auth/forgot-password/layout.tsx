import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password',
  description:
    'Reset your Reach Them AI account password. Enter your email to receive a password reset link.',
  openGraph: {
    title: 'Forgot Password | Reach Them AI',
    description: 'Reset your password to access your Reach Them AI account.',
    images: ['/featured.png'],
    type: 'website',
  },
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
