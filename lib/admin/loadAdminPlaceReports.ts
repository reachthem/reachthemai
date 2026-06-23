export type AdminPlaceReportRow = {
  id: string;
  place_id: string;
  business_name: string;
  business_address: string | null;
  business_rating: number | null;
  business_total_reviews: number | null;
  generated_at: string;
  expires_at: string | null;
  report_version: number;
  lead_count: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function loadAdminPlaceReports(adminClient: any): Promise<AdminPlaceReportRow[]> {
  const { data: reportsRaw } = await adminClient
    .from('google_place_reports')
    .select('id, place_id, raw_place_data, generated_at, expires_at, report_version')
    .order('generated_at', { ascending: false });

  const reports = reportsRaw ?? [];

  const placeIds = reports.map((r: { place_id: string }) => r.place_id);
  const { data: leadCounts } = placeIds.length > 0
    ? await adminClient
        .from('report_leads')
        .select('place_id')
        .in('place_id', placeIds)
    : { data: [] };

  const leadCountMap = new Map<string, number>();
  for (const lead of (leadCounts ?? [])) {
    const pid = (lead as { place_id: string }).place_id;
    leadCountMap.set(pid, (leadCountMap.get(pid) ?? 0) + 1);
  }

  return reports.map(
    (r: {
      id: string;
      place_id: string;
      raw_place_data: Record<string, unknown>;
      generated_at: string;
      expires_at: string | null;
      report_version: number;
    }) => {
      const displayName = (r.raw_place_data?.displayName as { text?: string })?.text ?? 'Unknown';
      const address = typeof r.raw_place_data?.formattedAddress === 'string'
        ? r.raw_place_data.formattedAddress
        : null;
      const rating = typeof r.raw_place_data?.rating === 'number' ? r.raw_place_data.rating : null;
      const totalReviews = typeof r.raw_place_data?.userRatingCount === 'number'
        ? r.raw_place_data.userRatingCount
        : null;

      return {
        id: r.id,
        place_id: r.place_id,
        business_name: displayName,
        business_address: address,
        business_rating: rating,
        business_total_reviews: totalReviews,
        generated_at: r.generated_at,
        expires_at: r.expires_at,
        report_version: r.report_version,
        lead_count: leadCountMap.get(r.place_id) ?? 0,
      };
    }
  );
}
