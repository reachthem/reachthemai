import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/home');
}

export const metadata: Metadata = {
  title: 'Remove Bad Reviews & Protect Your Reputation | Reach Them AI',
  description:
    'Take control of your online reputation. Choose between our $49/mo AI Advisor for self-service guidance or our Full Service Removal for professional, guaranteed results.',
  keywords: [
    'remove bad reviews',
    'online reputation management',
    'AI review removal',
    'Google review removal',
    'Yelp review removal',
    'negative review removal',
    'reputation management software',
    'remove fake reviews',
  ],
  openGraph: {
    title: 'Remove Bad Reviews & Protect Your Reputation | Reach Them AI',
    description:
      'Take control of your online reputation. Choose between our $49/mo AI Advisor for self-service guidance or our Full Service Removal for professional, guaranteed results.',
    type: 'website',
    images: ['/featured.png'],
  },
};

// root now redirects to /home — content moved to /home
