import BusinessScanClient from './BusinessScanClient';
import { getScanReportMaxDepth } from '@/app/actions/admin-settings';

export default async function BusinessScanPage() {
  const scanMaxDepth = await getScanReportMaxDepth();
  return <BusinessScanClient scanMaxDepth={scanMaxDepth} />;
}
