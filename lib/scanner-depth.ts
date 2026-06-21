export const ABSOLUTE_MAX_SCAN_DEPTH = 5000;
export const DEFAULT_SCAN_DEPTH_CAP = 500;

export function parseScanDepthCap(raw: string | null | undefined): number {
  const n = parseInt(String(raw ?? ''), 10);
  if (!Number.isFinite(n) || n < 1) return DEFAULT_SCAN_DEPTH_CAP;
  return Math.min(n, ABSOLUTE_MAX_SCAN_DEPTH);
}

export function computeScanDepthForPlace(
  totalReviews: number | null | undefined,
  cap: number
): number {
  const c = parseScanDepthCap(String(cap));
  const base = totalReviews ?? c;
  return Math.min(Math.ceil((base + 9) / 10) * 10, c);
}
