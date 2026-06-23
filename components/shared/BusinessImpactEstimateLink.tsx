import Link from 'next/link';

/** Matches primary hero CTAs (e.g. Free Review Scan) on marketing pages. */
export const businessImpactEstimatePrimaryClassName =
  'inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary-600 text-white font-semibold text-lg hover:bg-primary-500 transition-all shadow-lg shadow-primary-900/50 hover:shadow-primary-600/40 hover:-translate-y-0.5 max-md:w-full';

/** Matches the-machine / business-review-scan primary CTA (slightly different shadow). */
export const businessImpactEstimatePrimaryClassNameMachine =
  'inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-500 transition-all shadow-lg hover:-translate-y-0.5 text-lg max-md:w-full';

export default function BusinessImpactEstimateLink({
  className = businessImpactEstimatePrimaryClassName,
}: {
  className?: string;
}) {
  return (
    <Link href="/report" className={className}>
      Business Impact Estimate
    </Link>
  );
}
