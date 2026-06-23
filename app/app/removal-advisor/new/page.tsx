import type { Metadata } from 'next';
import IntakeWizard from '@/components/removal-advisor/IntakeWizard';
import NewReviewCaseGate from '@/components/removal-advisor/NewReviewCaseGate';
import { getAdvisorDisplayPrice } from '@/app/actions/admin-settings';

export const metadata: Metadata = {
  title: 'Analyze a Review',
  description:
    'Get AI-powered removal strategy for a specific review. Paste the review URL and details; our AI identifies the strongest legal and policy grounds for removal.',
  openGraph: {
    title: 'Analyze a Review | Reach Them AI',
    description: 'AI analyzes your review and recommends the best removal strategy.',
    images: ['/featured.png'],
    type: 'website',
  },
};

function getParam(params: Record<string, string | string[] | undefined>, key: string): string | null {
  const v = params[key];
  if (v == null) return null;
  return Array.isArray(v) ? (v[0] ?? null) : v;
}

function getPrefillRating(params: Record<string, string | string[] | undefined>): number | undefined {
  const v = getParam(params, 'prefill_rating');
  if (v == null) return undefined;
  const n = Number(v);
  return Number.isInteger(n) && n >= 1 && n <= 5 ? n : undefined;
}

export default async function NewReviewCasePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [params, advisorPrice] = await Promise.all([
    searchParams,
    getAdvisorDisplayPrice(),
  ]);
  const initialPrefill = {
    platform: getParam(params, 'prefill_platform') ?? undefined,
    review_url: getParam(params, 'prefill_url') ?? undefined,
    review_text: getParam(params, 'prefill_text') ?? undefined,
    reviewer_name: getParam(params, 'prefill_reviewer') ?? undefined,
    review_rating: getPrefillRating(params),
    review_date: getParam(params, 'prefill_date') ?? undefined,
  };
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Analyze a Review for Removal</h1>
        <p className="text-sm text-[var(--color-muted)]">
          Complete the steps below and our AI will identify the best removal strategy.
        </p>
      </div>
      <NewReviewCaseGate advisorPrice={advisorPrice}>
        <IntakeWizard initialPrefill={initialPrefill} />
      </NewReviewCaseGate>
    </div>
  );
}
