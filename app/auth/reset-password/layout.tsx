import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password',
  description:
    'Set a new password for your Reach Them AI account. Use the link from your email to complete the reset.',
  openGraph: {
    title: 'Reset Password | Reach Them AI',
    description: 'Set a new password for your account.',
    images: ['/featured.png'],
    type: 'website',
  },
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
