'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Shield,
  Star,
  User,
  ExternalLink,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Brain,
  FileX,
  Loader2,
  RefreshCw,
  MapPin,
  MessageSquare,
  Phone,
  Globe,
} from 'lucide-react';
import { getScanResults } from '@/app/actions/scanner';

const VIOLATION_LABELS: Record<string, { label: string; color: string }> = {
  spam_fake: { label: 'Spam / Fake', color: 'bg-red-100 text-red-700' },
  off_topic: { label: 'Off Topic', color: 'bg-orange-100 text-orange-700' },
  restricted: { label: 'Restricted Content', color: 'bg-purple-100 text-purple-700' },
  illegal: { label: 'Illegal Activity', color: 'bg-red-100 text-red-800' },
  sexually_explicit: { label: 'Sexually Explicit', color: 'bg-pink-100 text-pink-700' },
  conflict: { label: 'Conflict of Interest', color: 'bg-yellow-100 text-yellow-800' },
  impersonation: { label: 'Impersonation', color: 'bg-indigo-100 text-indigo-700' },
  harassment: { label: 'Harassment', color: 'bg-red-100 text-red-700' },
  clean: { label: 'Clean', color: 'bg-green-100 text-green-700' },
};

interface ThreatAnalysis {
  id: string;
  violation_type: string;
  confidence_score: number;
  policy_citation: string | null;
  removal_ground: string | null;
  ai_explanation: string | null;
  is_threat: boolean;
}

interface ScannedReview {
  id: string;
  review_text: string | null;
  reviewer_name: string | null;
  reviewer_profile_url: string | null;
  review_url: string | null;
  reviewer_is_local_guide: boolean;
  rating: number | null;
  review_timestamp: string | null;
  time_ago: string | null;
  owner_answer: string | null;
  review_threat_analysis: ThreatAnalysis[] | ThreatAnalysis | null;
}

interface ScanData {
  scan: {
    id: string;
    status: string;
    reviews_found: number;
    threats_found: number;
    created_at: string;
    business_profiles: {
      name: string;
      address: string | null;
      rating: number | null;
      total_reviews: number | null;
      primary_type: string | null;
      google_place_id: string;
      phone?: string | null;
      website?: string | null;
    };
  };
  reviews: ScannedReview[];
  starCounts?: { 1: number; 2: number; 3: number; 4: number; 5: number };
  aggregateRating?: number | null;
  /** Admin max depth (e.g. 500) for “Reviews Analyzed” KPI */
  scanMaxDepth?: number;
}

function getAnalysis(review: ScannedReview): ThreatAnalysis | null {
  if (!review.review_threat_analysis) return null;
  if (Array.isArray(review.review_threat_analysis)) return review.review_threat_analysis[0] ?? null;
  return review.review_threat_analysis;
}

export default function ScanResultsClient({
  scanId,
  subscriptionTier,
}: {
  scanId: string;
  subscriptionTier: string;
}) {
  const router = useRouter();
  const [data, setData] = useState<ScanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'threats' | 'clean'>('all');
  const [starFilter, setStarFilter] = useState<number | 'all'>('all');
  const [starRangeMin, setStarRangeMin] = useState<number>(1);
  const [starRangeMax, setStarRangeMax] = useState<number>(5);
  const [useStarRange, setUseStarRange] = useState(false);
  const [expandedReview, setExpandedReview] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [retryingReviews, setRetryingReviews] = useState(false);

  const loadResults = useCallback(() => {
    return getScanResults(scanId).then((result) => setData(result as unknown as ScanData));
  }, [scanId]);

  useEffect(() => {
    loadResults()
      .catch(() => router.push('/app/scanner'))
      .finally(() => setLoading(false));
  }, [loadResults, router]);

  useEffect(() => {
    setPage(1);
  }, [filter, pageSize, starFilter, useStarRange, starRangeMin, starRangeMax]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!data) return null;

  const { scan, reviews } = data;
  const googlePlaceId = scan.business_profiles.google_place_id?.trim() ?? '';
  const rescanScannerHref =
    googlePlaceId.length > 0
      ? `/app/scanner?google_place_id=${encodeURIComponent(googlePlaceId)}`
      : null;
  const starCounts = data.starCounts ?? { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const aggregateRating = data.aggregateRating ?? null;
  const scanMaxDepth = data.scanMaxDepth ?? 500;

  const gmbTotalReviews = scan.business_profiles.total_reviews;
  const reviewsInDataset = reviews.length > 0 ? reviews.length : scan.reviews_found;
  const lowStarTotal = starCounts[1] + starCounts[2] + starCounts[3];
  /** KPI: min(Google listing total, admin scan cap); if GMB total unknown, cap actual rows */
  const reviewsAnalyzedDisplay =
    gmbTotalReviews != null
      ? Math.min(gmbTotalReviews, scanMaxDepth)
      : Math.min(reviewsInDataset, scanMaxDepth);
  /** Clean / 4&5: GMB total − (1+2+3 star counts from analyzed set); else dataset-based fallback */
  const cleanReviewsDisplay =
    gmbTotalReviews != null
      ? Math.max(0, gmbTotalReviews - lowStarTotal)
      : Math.max(0, reviewsInDataset - lowStarTotal);
  const fourAndFiveStarDisplay = cleanReviewsDisplay;

  // Threats / clean tabs: star-based (1–3 vs 4–5) to match summary KPIs; card styling still uses AI for badges
  const isThreatByRating = (r: ScannedReview) => r.rating != null && r.rating >= 1 && r.rating <= 3;
  const threats = reviews.filter((r) => r.rating != null && r.rating >= 1 && r.rating <= 3);
  const cleanReviews = reviews.filter((r) => r.rating != null && r.rating >= 4 && r.rating <= 5);

  const filteredReviews = filter === 'threats' ? threats : filter === 'clean' ? cleanReviews : reviews;

  // Star filters: apply to filteredReviews (all/threats/clean)
  const filteredByStar = useStarRange
    ? filteredReviews.filter(
        (r) => r.rating != null && r.rating >= starRangeMin && r.rating <= starRangeMax
      )
    : starFilter === 'all'
      ? filteredReviews
      : filteredReviews.filter((r) => r.rating === starFilter);
  const sortedReviews = [...filteredByStar].sort((a, b) => {
    const aAnalysis = getAnalysis(a);
    const bAnalysis = getAnalysis(b);
    const aScore = aAnalysis?.confidence_score ?? 0;
    const bScore = bAnalysis?.confidence_score ?? 0;
    const aIsThreat = aAnalysis?.is_threat ? 1 : 0;
    const bIsThreat = bAnalysis?.is_threat ? 1 : 0;
    if (bIsThreat !== aIsThreat) return bIsThreat - aIsThreat;
    return bScore - aScore;
  });

  const totalReviews = sortedReviews.length;
  const totalPages = Math.max(1, Math.ceil(totalReviews / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const pageStart = (currentPage - 1) * pageSize;
  const paginatedReviews = sortedReviews.slice(pageStart, pageStart + pageSize);
  const displayReviews = paginatedReviews;

  const violationBreakdown: Record<string, number> = {};
  threats.forEach((r) => {
    const a = getAnalysis(r);
    if (a) {
      violationBreakdown[a.violation_type] = (violationBreakdown[a.violation_type] || 0) + 1;
    }
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={() => router.push('/app/scanner')}
        className="inline-flex items-center gap-2 text-secondary-500 hover:text-secondary-700 transition-colors text-sm font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Scanner
      </button>

      {/* Business Header */}
      <div className="bg-white border border-secondary-200 rounded-2xl p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-start gap-3">
            <MapPin className="h-6 w-6 text-primary-500 mt-0.5 flex-shrink-0" />
            <div>
              <h1 className="text-xl font-bold text-secondary-900">{scan.business_profiles.name}</h1>
              <p className="text-secondary-500">{scan.business_profiles.address}</p>
              <div className="flex items-center gap-3 mt-1">
                {scan.business_profiles.rating && (
                  <span className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    {scan.business_profiles.rating}
                  </span>
                )}
                {scan.business_profiles.total_reviews != null && (
                  <span className="text-sm text-secondary-500">
                    {scan.business_profiles.total_reviews.toLocaleString()} total reviews
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-stretch sm:items-end gap-3 min-w-0 w-full sm:w-auto">
            {subscriptionTier === 'free' ? (
              <Link
                href="/app/subscribe"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-500 transition-colors shrink-0"
              >
                Rescan Reviews
              </Link>
            ) : rescanScannerHref ? (
              <Link
                href={rescanScannerHref}
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-500 transition-colors shrink-0"
              >
                Rescan Reviews
              </Link>
            ) : (
              <button
                type="button"
                disabled
                title="Google Place ID is missing for this scan"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-secondary-200 text-secondary-500 text-sm font-semibold cursor-not-allowed shrink-0"
              >
                Rescan Reviews
              </button>
            )}
            <div className="text-right text-sm text-secondary-500 space-y-1">
              {(scan.business_profiles.phone ?? scan.business_profiles.website) && (
                <div className="flex flex-col items-end gap-1">
                  {scan.business_profiles.phone && (
                    <a href={`tel:${scan.business_profiles.phone}`} className="flex items-center gap-1.5 text-secondary-600 hover:text-primary-600">
                      <Phone className="h-4 w-4" />
                      {scan.business_profiles.phone}
                    </a>
                  )}
                  {scan.business_profiles.website && (
                    <a href={scan.business_profiles.website.startsWith('http') ? scan.business_profiles.website : `https://${scan.business_profiles.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-secondary-600 hover:text-primary-600">
                      <Globe className="h-4 w-4" />
                      Website
                    </a>
                  )}
                </div>
              )}
              <p>Scanned {new Date(scan.created_at).toLocaleString()}</p>
              {scan.business_profiles.google_place_id && (
                <p className="text-xs text-secondary-400 font-mono mt-2" title="Google Place ID">
                  {scan.business_profiles.google_place_id}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <>
      {/* Summary Cards: aggregate first, then overall (GMB), then counts; then star distribution row */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white border border-secondary-200 rounded-xl p-5 text-center">
          <p className="text-3xl font-bold text-secondary-900">
            {aggregateRating != null ? aggregateRating.toFixed(1) : '—'}
          </p>
          <p className="text-sm text-secondary-500 mt-1">Analyzed Reviews Avg.</p>
        </div>
        <div className="bg-white border border-secondary-200 rounded-xl p-5 text-center">
          <p className="text-3xl font-bold text-secondary-900">
            {scan.business_profiles.rating != null ? scan.business_profiles.rating.toFixed(1) : '—'}
          </p>
          <p className="text-sm text-secondary-500 mt-1">Overall Rating</p>
        </div>
        <div className="bg-white border border-secondary-200 rounded-xl p-5 text-center">
          <p className="text-3xl font-bold text-secondary-900">{reviewsAnalyzedDisplay.toLocaleString()}</p>
          <p className="text-sm text-secondary-500 mt-1">Reviews Analyzed</p>
        </div>
        <div className="bg-white border border-secondary-200 rounded-xl p-5 text-center">
          <p className="text-3xl font-bold text-red-600">{lowStarTotal.toLocaleString()}</p>
          <p className="text-sm text-secondary-500 mt-1">Threats Found</p>
        </div>
        <div className="bg-white border border-secondary-200 rounded-xl p-5 text-center">
          <p className="text-3xl font-bold text-green-600">{cleanReviewsDisplay.toLocaleString()}</p>
          <p className="text-sm text-secondary-500 mt-1">Clean Reviews</p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {([1, 2, 3] as const).map((stars) => (
          <div key={stars} className="bg-white border border-secondary-200 rounded-xl p-5 text-center">
            <p className="text-2xl font-bold text-secondary-900">{starCounts[stars].toLocaleString()}</p>
            <p className="text-sm text-secondary-500 mt-1">{stars} Star Reviews</p>
          </div>
        ))}
        <div className="bg-white border border-secondary-200 rounded-xl p-5 text-center">
          <p className="text-2xl font-bold text-secondary-900">{fourAndFiveStarDisplay.toLocaleString()}</p>
          <p className="text-sm text-secondary-500 mt-1">4 &amp; 5 Star Reviews</p>
        </div>
      </div>

      {/* Violation Breakdown */}
      {Object.keys(violationBreakdown).length > 0 && (
        <div className="bg-white border border-secondary-200 rounded-2xl p-6">
          <h2 className="font-semibold text-secondary-900 mb-4">Violation Breakdown</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(violationBreakdown)
              .sort(([, a], [, b]) => b - a)
              .map(([type, count]) => {
                const info = VIOLATION_LABELS[type] ?? { label: type, color: 'bg-gray-100 text-gray-700' };
                return (
                  <span key={type} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${info.color}`}>
                    {info.label}: {count}
                  </span>
                );
              })}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 items-center">
        {(['all', 'threats', 'clean'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === tab
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-secondary-200 text-secondary-600 hover:bg-secondary-50'
            }`}
          >
            {tab === 'all' ? `All (${reviews.length})` : tab === 'threats' ? `Threats (${lowStarTotal})` : `Clean (${cleanReviewsDisplay})`}
          </button>
        ))}
        <span className="text-secondary-400 mx-1">|</span>
        <span className="text-sm text-secondary-600">Stars:</span>
        <select
          value={String(starFilter)}
          onChange={(e) => setStarFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          className="rounded-lg border border-secondary-200 bg-white px-3 py-2 text-sm text-secondary-900"
        >
          <option value="all">All</option>
          {[1, 2, 3, 4, 5].map((s) => (
            <option key={s} value={s}>{s} star{s !== 1 ? 's' : ''}</option>
          ))}
        </select>
        <label className="inline-flex items-center gap-2 text-sm text-secondary-600">
          <input
            type="checkbox"
            checked={useStarRange}
            onChange={(e) => setUseStarRange(e.target.checked)}
            className="rounded border-secondary-200"
          />
          Range
        </label>
        {useStarRange && (
          <>
            <select
              value={starRangeMin}
              onChange={(e) => setStarRangeMin(Number(e.target.value))}
              className="rounded-lg border border-secondary-200 bg-white px-2 py-1.5 text-sm"
            >
              {[1, 2, 3, 4, 5].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <span className="text-secondary-500">–</span>
            <select
              value={starRangeMax}
              onChange={(e) => setStarRangeMax(Number(e.target.value))}
              className="rounded-lg border border-secondary-200 bg-white px-2 py-1.5 text-sm"
            >
              {[1, 2, 3, 4, 5].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </>
        )}
      </div>

      {/* Pagination at top */}
      {totalReviews > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-secondary-200 rounded-xl p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-secondary-600">Reviews per page</span>
            <div className="flex rounded-lg border border-secondary-200 p-0.5 bg-secondary-50">
              {([10, 25, 50] as const).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setPageSize(size)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    pageSize === size ? 'bg-white text-primary-700 shadow-sm' : 'text-secondary-600 hover:text-secondary-900'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <span className="text-sm text-secondary-500">
              Showing {pageStart + 1}&ndash;{Math.min(pageStart + pageSize, totalReviews)} of {totalReviews}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-2 rounded-lg border border-secondary-200 text-secondary-600 hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 py-1.5 text-sm text-secondary-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-2 rounded-lg border border-secondary-200 text-secondary-600 hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Review List */}
      <div className="space-y-3">
        {displayReviews.map((review) => {
          const analysis = getAnalysis(review);
          const isExpanded = expandedReview === review.id;
          const violationInfo = VIOLATION_LABELS[analysis?.violation_type ?? 'clean'];

          return (
            <div
              key={review.id}
              className={`bg-white border rounded-xl overflow-hidden transition-shadow ${
                (analysis?.is_threat || isThreatByRating(review)) ? 'border-red-200 hover:shadow-md' : 'border-secondary-200'
              }`}
            >
              <div className="p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-full bg-secondary-100 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-secondary-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-2 sm:flex-wrap">
                        <p className="font-medium text-secondary-900 text-sm">{review.reviewer_name ?? 'Anonymous'}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          {review.rating != null && (
                            <span className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${i < review.rating! ? 'text-yellow-500 fill-yellow-500' : 'text-secondary-200'}`}
                                />
                              ))}
                            </span>
                          )}
                          <span className="text-xs text-secondary-400">{review.time_ago}</span>
                        </div>
                      </div>
                      <p className="text-sm text-secondary-700 mt-1 line-clamp-2">
                        {review.review_text || '(No review text)'}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2 sm:flex-shrink-0">
                    {(() => {
                      const prefillRating = review.rating != null ? String(review.rating) : '';
                      const prefillDate = review.review_timestamp
                        ? (() => {
                            try {
                              const d = new Date(review.review_timestamp);
                              return isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
                            } catch {
                              return '';
                            }
                          })()
                        : '';
                      const basePrefill = `prefill_platform=google&prefill_url=${encodeURIComponent(review.review_url ?? '')}&prefill_text=${encodeURIComponent(review.review_text ?? '')}&prefill_reviewer=${encodeURIComponent(review.reviewer_name ?? '')}`;
                      const requestRemovalHref = `/submit-removal?${basePrefill}${prefillRating ? `&prefill_rating=${encodeURIComponent(prefillRating)}` : ''}${prefillDate ? `&prefill_date=${encodeURIComponent(prefillDate)}` : ''}`;
                      const advisorHref = `/app/removal-advisor/new?${basePrefill}${prefillRating ? `&prefill_rating=${encodeURIComponent(prefillRating)}` : ''}${prefillDate ? `&prefill_date=${encodeURIComponent(prefillDate)}` : ''}`;
                      const btnClass = "inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto shrink-0";
                      return (
                        <>
                          <a
                            href={advisorHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${btnClass} border border-secondary-200 text-secondary-700 hover:bg-secondary-50`}
                          >
                            <Brain className="h-3.5 w-3.5" />
                            AI Advisor
                          </a>
                          <a
                            href={requestRemovalHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${btnClass} border border-primary-600 text-primary-600 hover:bg-primary-50`}
                          >
                            Expert Removal
                          </a>
                          {review.review_url ? (
                            <a
                              href={review.review_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`${btnClass} border border-secondary-200 text-secondary-700 hover:bg-secondary-50`}
                            >
                              <MessageSquare className="h-3.5 w-3.5" />
                              Respond
                            </a>
                          ) : null}
                        </>
                      );
                    })()}
                    <div className="flex flex-wrap gap-2">
                      {analysis && (
                        <>
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${violationInfo?.color}`}>
                            {violationInfo?.label}
                          </span>
                          {analysis.is_threat && (
                            <span className="text-xs font-bold text-red-600">
                              {analysis.confidence_score}%
                            </span>
                          )}
                        </>
                      )}
                      {!analysis && isThreatByRating(review) && (
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-red-900 text-white">
                          Low rating (1–3)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setExpandedReview(isExpanded ? null : review.id)}
                  className="mt-3 w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-secondary-200 text-secondary-700 text-sm font-medium hover:bg-secondary-50 transition-colors"
                >
                  {isExpanded ? (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      Review Details
                    </>
                  ) : (
                    <>
                      Review Details
                    </>
                  )}
                </button>
              </div>

              {isExpanded && (
                <div className="border-t border-secondary-100 p-4 bg-secondary-50 space-y-4">
                  <div>
                    <p className="text-sm text-secondary-800">{review.review_text || '(No review text)'}</p>
                  </div>

                  {/* Owner response */}
                  {review.owner_answer && (
                    <div>
                      <p className="text-xs font-medium text-secondary-500 uppercase tracking-wider mb-1">Owner Response</p>
                      <p className="text-sm text-secondary-700 italic">{review.owner_answer}</p>
                    </div>
                  )}

                  {/* AI Analysis */}
                  {analysis && (
                    <div className="bg-white rounded-lg p-4 border border-secondary-200">
                      <p className="text-xs font-medium text-secondary-500 uppercase tracking-wider mb-3">AI Analysis</p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-secondary-500">Violation Type:</span>{' '}
                          <span className={`font-medium ${analysis.is_threat ? 'text-red-700' : 'text-green-700'}`}>
                            {violationInfo?.label}
                          </span>
                        </div>
                        <div>
                          <span className="text-secondary-500">Confidence:</span>{' '}
                          <span className="font-medium text-secondary-900">{analysis.confidence_score}%</span>
                        </div>
                        {analysis.policy_citation && (
                          <div className="col-span-2">
                            <span className="text-secondary-500">Policy Citation:</span>{' '}
                            <span className="text-secondary-800">{analysis.policy_citation}</span>
                          </div>
                        )}
                        {analysis.removal_ground && (
                          <div className="col-span-2">
                            <span className="text-secondary-500">Removal Ground:</span>{' '}
                            <span className="text-secondary-800">{analysis.removal_ground}</span>
                          </div>
                        )}
                        {analysis.ai_explanation && (
                          <div className="col-span-2">
                            <span className="text-secondary-500">Explanation:</span>{' '}
                            <span className="text-secondary-800">{analysis.ai_explanation}</span>
                          </div>
                        )}
                      </div>

                      {/* Action buttons for threats */}
                      {analysis.is_threat && (
                        <div className="flex gap-2 mt-4 pt-3 border-t border-secondary-100">
                          <a
                            href={`/app/removal-advisor/new?prefill_platform=google&prefill_url=${encodeURIComponent(review.review_url ?? '')}&prefill_text=${encodeURIComponent(review.review_text ?? '')}&prefill_reviewer=${encodeURIComponent(review.reviewer_name ?? '')}${review.rating != null ? `&prefill_rating=${review.rating}` : ''}${review.review_timestamp ? `&prefill_date=${encodeURIComponent(new Date(review.review_timestamp).toISOString().slice(0, 10))}` : ''}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-500 transition-colors"
                          >
                            <Brain className="h-3.5 w-3.5" />
                            AI Advisor
                          </a>
                          <a
                            href={`/submit-removal?prefill_platform=google&prefill_url=${encodeURIComponent(review.review_url ?? '')}&prefill_text=${encodeURIComponent(review.review_text ?? '')}&prefill_reviewer=${encodeURIComponent(review.reviewer_name ?? '')}${review.rating != null ? `&prefill_rating=${review.rating}` : ''}${review.review_timestamp ? `&prefill_date=${encodeURIComponent(new Date(review.review_timestamp).toISOString().slice(0, 10))}` : ''}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-secondary-200 text-secondary-700 text-sm font-medium hover:bg-secondary-50 transition-colors"
                          >
                            <FileX className="h-3.5 w-3.5" />
                            Expert Removal
                          </a>
                          {review.reviewer_profile_url && (
                            <a
                              href={review.reviewer_profile_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-secondary-200 text-secondary-700 text-sm font-medium hover:bg-secondary-50 transition-colors"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              Reviewer Profile
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination at bottom */}
      {totalReviews > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-secondary-200 rounded-xl p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-secondary-600">Reviews per page</span>
            <div className="flex rounded-lg border border-secondary-200 p-0.5 bg-secondary-50">
              {([10, 25, 50] as const).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setPageSize(size)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    pageSize === size ? 'bg-white text-primary-700 shadow-sm' : 'text-secondary-600 hover:text-secondary-900'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <span className="text-sm text-secondary-500">
              Showing {pageStart + 1}&ndash;{Math.min(pageStart + pageSize, totalReviews)} of {totalReviews}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-2 rounded-lg border border-secondary-200 text-secondary-600 hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 py-1.5 text-sm text-secondary-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-2 rounded-lg border border-secondary-200 text-secondary-600 hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {sortedReviews.length === 0 && (
        <div className="text-center py-12 bg-white border border-secondary-200 rounded-2xl px-6">
          <Shield className="h-12 w-12 text-secondary-300 mx-auto mb-3" />
          {reviews.length === 0 ? (
            <>
              <p className="text-secondary-700 font-medium mb-1">No reviews loaded for this scan</p>
              <p className="text-secondary-500 text-sm mb-4 max-w-md mx-auto">
                This can happen if the scan completed before reviews were saved, or there was an issue saving results. You can retry loading from DataForSEO or run a new scan.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  type="button"
                  onClick={async () => {
                    setRetryingReviews(true);
                    try {
                      await fetch(`/api/scanner/scrape-status?scanId=${scanId}`);
                      await loadResults();
                    } finally {
                      setRetryingReviews(false);
                    }
                  }}
                  disabled={retryingReviews}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-primary-600 text-primary-600 font-medium hover:bg-primary-50 transition-colors disabled:opacity-50"
                >
                  {retryingReviews ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  Retry loading reviews
                </button>
                <Link
                  href="/app/scanner"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-500 transition-colors"
                >
                  Run new scan
                </Link>
              </div>
            </>
          ) : (
            <p className="text-secondary-500">No reviews match this filter.</p>
          )}
        </div>
      )}

      {/* Re-scan button */}
      <div className="text-center pb-8">
        <button
          onClick={() => router.push('/app/scanner')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-secondary-200 text-secondary-700 font-medium hover:bg-secondary-50 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Run New Scan
        </button>
      </div>
      </>
    </div>
  );
}
