import type { Metadata } from 'next';
import {
  Flag,
  FileUp,
  ListChecks,
  ArrowUpCircle,
  Eye,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Disputes',
  description:
    'Flag and report policy-violating reviews for removal. Submit disputes to Google, Yelp, and other platforms when reviews break their guidelines.',
  openGraph: {
    title: 'Disputes | Reach Them AI',
    description: 'Flag and report policy-violating reviews for removal.',
    images: ['/featured.png'],
    type: 'website',
  },
};

const upcomingFeatures = [
  {
    icon: ListChecks,
    title: 'Guided Dispute Forms',
    description:
      'Step-by-step guided forms that walk you through the dispute process for each platform. Select the policy violation, describe the issue, and we format the submission correctly.',
  },
  {
    icon: FileUp,
    title: 'Evidence Uploads',
    description:
      'Attach screenshots, documents, and other proof of policy violations directly to your dispute. Build a stronger case with organized evidence packages.',
  },
  {
    icon: Eye,
    title: 'Dispute Status Tracking',
    description:
      'Track every dispute from submission to resolution. See real-time status updates — pending, under review, escalated, resolved, or rejected — for every flagged review.',
  },
  {
    icon: ArrowUpCircle,
    title: 'Professional Escalation',
    description:
      'If a self-service dispute is unsuccessful, escalate directly to our professional review removal team. Seamless handoff with all evidence and context preserved.',
  },
  {
    icon: ShieldCheck,
    title: 'Policy Violation Detection',
    description:
      'AI-assisted identification of reviews that likely violate platform policies. Get recommendations on which reviews are strong candidates for dispute and removal.',
  },
  {
    icon: Flag,
    title: 'Multi-Platform Support',
    description:
      'File disputes across Google, Yelp, Facebook, Trustpilot, TripAdvisor, BBB, and more — all from one centralized dashboard with platform-specific guidance.',
  },
];

export default function DisputesPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30">
              <Flag className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <CardTitle>Flagging & Dispute Tools</CardTitle>
              <CardDescription>
                Report policy-violating reviews and track disputes to resolution
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border-2 border-dashed border-red-300 dark:border-red-700 bg-red-50/50 dark:bg-red-900/10 p-8 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm font-semibold mb-4">
              <Clock className="h-4 w-4" />
              Coming Soon
            </span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
              Self-Service Dispute & Flagging Tools
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              We&apos;re building self-service dispute tools that empower you to report and challenge
              policy-violating reviews directly from your dashboard. Use guided forms tailored to
              each platform&apos;s dispute process, upload evidence and documentation, track every
              dispute through to resolution, and seamlessly escalate to our professional removal
              team when needed. Combined with AI-powered policy violation detection, you&apos;ll
              have everything you need to fight fake, fraudulent, and harmful reviews.
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
              <feature.icon className="h-5 w-5 text-red-500 mb-3" />
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
