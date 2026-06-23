import type { Metadata } from 'next';
import {
  MessageCircle,
  Bot,
  Columns3,
  Palette,
  CheckSquare,
  Zap,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Responses',
  description:
    'Draft and publish AI-powered responses to your reviews. Manage your response queue and reply to customers on Google, Yelp, and more.',
  openGraph: {
    title: 'Responses | Reach Them AI',
    description: 'AI-powered review response generator and moderation queue.',
    images: ['/featured.png'],
    type: 'website',
  },
};

const upcomingFeatures = [
  {
    icon: Bot,
    title: 'AI Response Generator',
    description:
      'Generate professional, empathetic responses to any review with one click. Our AI drafts context-aware replies that maintain your brand voice and address specific customer concerns.',
  },
  {
    icon: Palette,
    title: 'Customizable Tone Templates',
    description:
      'Choose from pre-built tone templates — professional, friendly, apologetic, or grateful — or create your own. Ensure every response matches your brand personality.',
  },
  {
    icon: Columns3,
    title: 'Moderation Queue',
    description:
      'Kanban-style workflow for managing review responses. Drag and drop reviews between "Needs Response," "Draft," "Pending Approval," and "Published" columns.',
  },
  {
    icon: CheckSquare,
    title: 'Approval Workflow',
    description:
      'Set up team approval workflows so AI-generated responses are reviewed by a manager before publishing. Maintain quality control at every step.',
  },
  {
    icon: Zap,
    title: 'One-Click Publishing',
    description:
      'Once approved, publish responses directly to Google, Yelp, Facebook, and other platforms without leaving the app. No copy-pasting required.',
  },
  {
    icon: MessageCircle,
    title: 'Response Analytics',
    description:
      'Track your average response time, response rate, and sentiment impact. See how responding to reviews affects your overall rating over time.',
  },
];

export default function ResponsesPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30">
              <MessageCircle className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <CardTitle>AI Response Manager</CardTitle>
              <CardDescription>
                AI-powered review responses with team approval workflows
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border-2 border-dashed border-violet-300 dark:border-violet-700 bg-violet-50/50 dark:bg-violet-900/10 p-8 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-sm font-semibold mb-4">
              <Clock className="h-4 w-4" />
              Coming Soon
            </span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
              AI-Powered Response Generator
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              We&apos;re building an intelligent response management system that uses AI to draft
              professional, personalized replies to every review. Choose from customizable tone
              templates, manage responses in a Kanban-style moderation queue, set up team approval
              workflows, and publish directly to Google, Yelp, Facebook, and other platforms — all
              from one interface. Responding to reviews quickly and professionally is proven to
              improve ratings and build customer trust.
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
              <feature.icon className="h-5 w-5 text-violet-600 mb-3" />
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
