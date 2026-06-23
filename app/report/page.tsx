import { Suspense } from 'react';
import ReportGeneratorClient from './ReportGeneratorClient';
import ReportHomeMarketingSections from './ReportHomeMarketingSections';
import ReportViewClient from './ReportViewClient';
import { getDisplayPrices } from '@/app/actions/admin-settings';

const fallback = (
  <div className="max-w-4xl mx-auto space-y-6">
    <div className="h-12 bg-secondary-100 rounded-xl animate-pulse" />
    <div className="h-64 bg-white border border-secondary-200 rounded-2xl animate-pulse" />
  </div>
);

export default async function ReportPage({
  searchParams,
}: {
  searchParams: Promise<{ placeId?: string; email?: string; phone?: string }>;
}) {
  const params = await searchParams;
  const placeId = params.placeId?.trim();

  if (!placeId) {
    const { advisorPrice, removalPrice } = await getDisplayPrices();
    return (
      <Suspense fallback={fallback}>
        <ReportGeneratorClient />
        <ReportHomeMarketingSections advisorPrice={advisorPrice} removalPrice={removalPrice} />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={fallback}>
      <ReportViewClient
        placeId={placeId}
        contactEmail={params.email ?? undefined}
        contactPhone={params.phone ?? undefined}
      />
    </Suspense>
  );
}
