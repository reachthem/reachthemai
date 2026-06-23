import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In',
  description:
    'Sign in to your Reach Them AI account to manage review removal requests, monitor reviews, and protect your business reputation.',
  openGraph: {
    title: 'Sign In | Reach Them AI',
    description: 'Sign in to manage review removals and your reputation.',
    images: ['/featured.png'],
    type: 'website',
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
