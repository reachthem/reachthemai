import type { Metadata } from 'next';
import {
  Send,
  Mail,
  MessageSquare,
  QrCode,
  Upload,
  Link2,
  BarChart3,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Review Requests',
  description:
    'Send automated review requests to customers via email, SMS, or QR codes. Get more Google and Yelp reviews with personalized, timely requests.',
  openGraph: {
    title: 'Review Requests | Reach Them AI',
    description: 'Send automated review requests via email, SMS, or QR codes.',
    images: ['/featured.png'],
    type: 'website',
  },
};

const upcomingFeatures = [
  {
    icon: Mail,
    title: 'Email Campaigns',
    description:
      'Send branded review request emails to your customers with personalized messaging, direct platform links, and automatic follow-up sequences.',
  },
  {
    icon: MessageSquare,
    title: 'SMS Review Requests',
    description:
      'Reach customers directly via text message with short, mobile-friendly review request links. Higher open rates than email for time-sensitive requests.',
  },
  {
    icon: QrCode,
    title: 'QR Code Generation',
    description:
      'Generate printable QR codes that link directly to your review pages. Perfect for receipts, table tents, business cards, and storefronts.',
  },
  {
    icon: Upload,
    title: 'CSV Customer Import',
    description:
      'Upload your customer lists via CSV to quickly build review request campaigns. Map columns to name, email, phone, and transaction date fields.',
  },
  {
    icon: Link2,
    title: 'Custom Landing Pages',
    description:
      'Branded, mobile-friendly review pages with your logo, colors, and messaging. Customers select their star rating and leave feedback — with smart routing to the right platform.',
  },
  {
    icon: BarChart3,
    title: 'Campaign Analytics',
    description:
      'Track open rates, click-through rates, and review completion rates for every campaign. See which channels and messaging drive the most reviews.',
  },
];

export default function RequestsPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30">
              <Send className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <CardTitle>Review Request Tools</CardTitle>
              <CardDescription>
                Proactively collect more positive reviews from happy customers
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border-2 border-dashed border-primary-300 dark:border-primary-700 bg-primary-50/50 dark:bg-primary-900/10 p-8 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-semibold mb-4">
              <Clock className="h-4 w-4" />
              Coming Soon
            </span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
              Automated Review Solicitation
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              We&apos;re building powerful tools to help you proactively collect positive reviews from
              satisfied customers. Send personalized review requests via email, SMS, or QR codes.
              Upload customer lists via CSV, create branded review landing pages, set up
              post-purchase automation triggers, and track every campaign&apos;s performance — all
              designed to systematically grow your positive review count and strengthen your
              online reputation.
            </p>
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          What&apos;s Coming
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingFeatures.map((feature) => (
            <div
              key={feature.title}
              className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            >
              <feature.icon className="h-5 w-5 text-primary-600 mb-3" />
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                {feature.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
