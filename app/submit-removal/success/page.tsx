import { Metadata } from 'next';
import SuccessContent from './SuccessContent';

export const metadata: Metadata = {
  title: 'Request Submitted',
  description:
    'Your review removal request has been submitted. Our team will assess your case and follow up. Track status in your dashboard.',
  openGraph: {
    title: 'Request Submitted | Reach Them AI',
    description: 'Your review removal request has been submitted. We will follow up with next steps.',
    images: ['/featured.png'],
    type: 'website',
  },
};

export default function SubmitRemovalSuccessPage() {
  return <SuccessContent />;
}
