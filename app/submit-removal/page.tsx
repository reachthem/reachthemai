import { Metadata } from 'next';
import RemovalWizard from '@/components/removal/RemovalWizard';
import { getContactPrefillForRemovalForm } from '@/app/actions/user-profile';

export const metadata: Metadata = {
  title: 'Submit a Review for Removal',
  description:
    'Submit a bad Google review or other negative review for professional removal. Our team handles removal requests for Google, Yelp, Facebook, Trustpilot, and 50+ platforms. Free assessment.',
  openGraph: {
    title: 'Submit a Review for Removal | Reach Them AI',
    description:
      'Submit a negative review for professional removal. We handle Google, Yelp, Facebook, Trustpilot, and 50+ platforms.',
    images: ['/featured.png'],
    type: 'website',
  },
};

function getParam(params: Record<string, string | string[] | undefined>, key: string): string | null {
  const v = params[key];
  if (v == null) return null;
  return Array.isArray(v) ? v[0] ?? null : v;
}

export default async function SubmitRemovalPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [params, contactPrefill] = await Promise.all([
    searchParams,
    getContactPrefillForRemovalForm(),
  ]);
  const initialPrefill = {
    prefill_platform: getParam(params, 'prefill_platform'),
    prefill_url: getParam(params, 'prefill_url'),
    prefill_text: getParam(params, 'prefill_text'),
    prefill_reviewer: getParam(params, 'prefill_reviewer'),
    prefill_rating: getParam(params, 'prefill_rating'),
    prefill_date: getParam(params, 'prefill_date'),
  };

  return (
    <>
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
          Submit a Review for Removal
        </h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Complete the form below and our team will begin working on your case.
          You can save your progress and return anytime.
        </p>
      </div>
      <RemovalWizard initialPrefill={initialPrefill} contactPrefill={contactPrefill} />
    </>
  );
}
