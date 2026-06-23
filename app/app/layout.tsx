// src/app/app/layout.tsx
import type { Metadata } from 'next';
import AppLayout from '@/components/AppLayout';
import { GlobalProvider } from '@/lib/context/GlobalContext';

export const metadata: Metadata = {
  title: 'Dashboard',
  description:
    'Manage your reputation from one place. Track removal requests, monitor reviews, send review requests, view analytics, and respond to reviews.',
  openGraph: {
    title: 'Dashboard | Reach Them AI',
    description: 'Manage review removals, monitor reviews, and protect your reputation.',
    images: ['/featured.png'],
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <GlobalProvider>
            <div className="theme-brand">
                <AppLayout>{children}</AppLayout>
            </div>
        </GlobalProvider>
    );
}
