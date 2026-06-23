import { MessageSquare, Mail, QrCode, Link2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const channels = [
  {
    icon: MessageSquare,
    name: 'SMS',
    description: '98% open rate. Reach customers right in the palm of their hand.',
  },
  {
    icon: Mail,
    name: 'Email',
    description: 'Personalized, on-brand email campaigns sent at the perfect moment.',
  },
  {
    icon: QrCode,
    name: 'QR Code',
    description: 'Catch customers at the point of sale with scannable in-store codes.',
  },
  {
    icon: Link2,
    name: 'Shareable Link',
    description: 'Drop your review link anywhere — receipts, invoices, social bios.',
  },
];

export default function ChannelsSection() {
  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary-600 dark:text-primary-400 text-sm font-semibold uppercase tracking-wider">
            Delivery Channels
          </span>
          <h2 className="mt-3 text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Reach Customers Where They Are
          </h2>
          <p className="mt-4 text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Send review requests through the channel that works best for your business.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {channels.map((channel) => {
            const Icon = channel.icon;
            return (
              <Card
                key={channel.name}
                className="border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors text-center"
              >
                <CardContent className="pt-8 pb-6 px-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-50 dark:bg-primary-900/30 mb-5">
                    <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {channel.name}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {channel.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
