'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Star,
  Phone,
  Globe,
  Clock,
  AlertCircle,
  RefreshCw,
  Loader2,
  ExternalLink,
  Copy,
  Check,
  TrendingUp,
  MessageSquare,
  Target,
  User,
  Brain,
  ChevronDown,
  FileX,
} from 'lucide-react';
import { format } from 'date-fns';
import { createSPAClient } from '@/lib/supabase/client';

const LOWER_WORDS = new Set(['and', 'or', 'with', 'the', 'a', 'an', 'for', 'to', 'of', 'in', 'on', 'at', 'by']);
function titleCase(str: string): string {
  return str
    .split(/\s+/)
    .map((word, i) => {
      const lower = word.toLowerCase();
      if (i > 0 && LOWER_WORDS.has(lower)) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(' ');
}

/** Normalize Google API text fields that may be string or { text?: string; languageCode?: string } */
function toDisplayString(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null && 'text' in value) {
    const t = (value as { text?: unknown }).text;
    return typeof t === 'string' ? t : '';
  }
  return String(value);
}

interface ReportViewClientProps {
  placeId: string;
  contactEmail?: string;
  contactPhone?: string;
}

interface PlaceData {
  displayName?: { text?: string };
  formattedAddress?: string;
  rating?: number;
  userRatingCount?: number;
  photos?: Array<{ name?: string; widthPx?: number; heightPx?: number }>;
  websiteUri?: string;
  internationalPhoneNumber?: string;
  nationalPhoneNumber?: string;
  regularOpeningHours?: { openNow?: boolean; weekdayDescriptions?: (string | { text?: string; languageCode?: string })[] };
  priceLevel?: string;
  reviewSummary?: { text?: string };
  reviews?: Array<{
    name?: string;
    text?: { text?: string };
    rating?: number;
    relativePublishTimeDescription?: string;
    reviewReply?: { comment?: { text?: string } };
    publishTime?: string;
    authorAttribution?: {
      displayName?: string;
      uri?: string;
      photoUri?: string;
    };
  }>;
  primaryTypeDisplayName?: { text?: string };
  editorialSummary?: { text?: string };
  googleMapsUri?: string;
}

interface DerivedData {
  keywords?: { keywords?: string[]; sentimentThemes?: { label: string; sentiment: string }[] };
  recommendations?: { recommendations?: { title: string; priority: string; action: string; impact?: string }[] };
  traffic?: {
    monthlySearchVolume?: number;
    currentMonthlySearchVolume?: number;
    projectedMonthlySearchVolumeAt5?: number;
    percentageIncrease?: number;
    currentCTR?: number;
    projectedCTRAt5?: number;
    confidence?: string;
    note?: string;
  };
  businessImpact?: {
    currentMonthlyLeads?: number;
    projectedMonthlyLeadsAt5?: number;
    leadIncreasePercent?: number;
    estimatedCurrentMonthlyRevenue?: number;
    estimatedProjectedMonthlyRevenue?: number;
    revenueIncreasePercent?: number;
    avgRevenuePerLead?: number;
    confidence?: string;
    methodology?: string;
  } | null;
}

function trackReportEvent(placeId: string, eventType: string, eventData?: Record<string, unknown>) {
  fetch('/api/public/report/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      placeId,
      eventType,
      eventData,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      utmSource: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_source') : null,
      utmMedium: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_medium') : null,
      utmCampaign: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_campaign') : null,
    }),
  }).catch(() => {});
}

export default function ReportViewClient({ placeId, contactEmail, contactPhone }: ReportViewClientProps) {
  const [place, setPlace] = useState<PlaceData | null>(null);
  const [report, setReport] = useState<{
    raw_place_data: PlaceData;
    derived_data: DerivedData;
    generated_at: string;
    expires_at: string | null;
    cached?: boolean;
    stale?: boolean;
  } | null>(null);
  const [placeLoading, setPlaceLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [expandedReviewId, setExpandedReviewId] = useState<number | null>(null);

  const fetchPlace = useCallback(async () => {
    try {
      const res = await fetch(`/api/public/report/place?placeId=${encodeURIComponent(placeId)}`);
      if (res.ok) {
        const data = await res.json();
        setPlace(data as PlaceData);
      }
    } catch {
      // ignore; report fetch may still succeed or return cached
    } finally {
      setPlaceLoading(false);
    }
  }, [placeId]);

  const fetchReport = useCallback(async (forceRefresh = false) => {
    setReportLoading(true);
    try {
      const params = new URLSearchParams({ placeId });
      if (forceRefresh) params.set('forceRefresh', 'true');
      if (contactEmail) params.set('email', contactEmail);
      if (contactPhone) params.set('phone', contactPhone);
      const res = await fetch(`/api/public/report?${params.toString()}`);
      if (res.status === 429) {
        const data = await res.json().catch(() => ({}));
        if (data.report) {
          setReport({
            raw_place_data: data.report.raw_place_data,
            derived_data: data.report.derived_data,
            generated_at: data.report.generated_at,
            expires_at: data.report.expires_at,
            cached: true,
          });
          setPlace(data.report.raw_place_data as PlaceData);
        }
        setError('Please wait a few minutes before refreshing again.');
        return;
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Failed to load report' }));
        setError(err.error || 'Failed to load report');
        setReport(null);
        return;
      }
      const data = await res.json();
      setReport({
        raw_place_data: data.raw_place_data,
        derived_data: data.derived_data,
        generated_at: data.generated_at,
        expires_at: data.expires_at,
        cached: data.cached,
        stale: data.stale,
      });
      setPlace(data.raw_place_data as PlaceData);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
      setReport(null);
    } finally {
      setReportLoading(false);
      setRefreshing(false);
    }
  }, [placeId, contactEmail, contactPhone]);

  useEffect(() => {
    fetchPlace();
    fetchReport();
    trackReportEvent(placeId, 'report_viewed');
  }, [fetchPlace, fetchReport, placeId]);

  useEffect(() => {
    createSPAClient().auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setError(null);
    setReport(null);
    setReportLoading(true);
    fetchReport(true);
  };

  const copyLink = () => {
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/report?placeId=${placeId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const placeData = place ?? report?.raw_place_data ?? null;
  const showFullSkeleton = !placeData && (placeLoading || reportLoading);

  if (showFullSkeleton) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-8 w-48 bg-secondary-100 rounded animate-pulse" />
        <div className="bg-white border border-secondary-200 rounded-2xl p-8 shadow-sm animate-pulse">
          <div className="h-12 bg-secondary-100 rounded-xl mb-4" />
          <div className="h-4 bg-secondary-100 rounded w-3/4 mb-2" />
          <div className="h-4 bg-secondary-100 rounded w-1/2" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-secondary-100 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="flex items-center justify-center gap-2 py-12 text-secondary-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading your report…</span>
        </div>
      </div>
    );
  }

  if (error && !placeData) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border border-secondary-200 rounded-2xl p-8 shadow-sm text-center">
          <AlertCircle className="h-12 w-12 text-accent-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-secondary-900 mb-2">We couldn&apos;t load this report</h2>
          <p className="text-secondary-600 mb-6">{error}</p>
          <p className="text-sm text-secondary-500 mb-6">
            Try pasting the full Google Maps link or search for your business below.
          </p>
          <Link
            href="/report"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-500 transition-colors"
          >
            Search for a business
          </Link>
        </div>
      </div>
    );
  }

  if (!placeData) return null;

  const derived = report?.derived_data ?? {};
  const name = toDisplayString(placeData.displayName) || 'Business';
  const address = toDisplayString(placeData.formattedAddress);
  const rating = placeData.rating ?? null;
  const reviewCount = placeData.userRatingCount ?? 0;
  const phone = placeData.internationalPhoneNumber ?? placeData.nationalPhoneNumber ?? null;
  const website = placeData.websiteUri ?? null;
  const rawHours = placeData.regularOpeningHours?.weekdayDescriptions ?? [];
  const hours = rawHours
    .map((h) => (typeof h === 'string' ? h : (h && typeof h === 'object' && 'text' in h ? (h as { text?: string }).text : '') ?? ''))
    .filter(Boolean);
  const reviewSummary = toDisplayString(placeData.reviewSummary);
  const reviews = placeData.reviews ?? [];
  const photoName = placeData.photos?.[0]?.name;

  const keywords = derived.keywords?.keywords ?? [];
  const sentimentThemes = derived.keywords?.sentimentThemes ?? [];
  const recommendationsList = derived.recommendations?.recommendations ?? [];
  const traffic = derived.traffic ?? {};
  const businessImpact = derived.businessImpact ?? null;

  const currentVolume = traffic.currentMonthlySearchVolume ?? traffic.monthlySearchVolume ?? 0;
  const projectedVolume = traffic.projectedMonthlySearchVolumeAt5 ?? 0;
  const trafficIncrease = traffic.percentageIncrease ?? 0;
  const currentCTR = traffic.currentCTR ?? 0;
  const projectedCTR = traffic.projectedCTRAt5 ?? 0;

  const recentFive = reviews.slice(0, 5);
  const recentFiveAvg =
    recentFive.length > 0
      ? recentFive.reduce((sum, r) => sum + (r.rating ?? 0), 0) / recentFive.filter((r) => r.rating != null).length
      : null;
  const negativeCount =
    rating != null && rating < 5 && reviewCount > 0
      ? Math.ceil((reviewCount * (5 - rating)) / 5)
      : 0;
  const ratingGap = rating != null ? (5 - rating).toFixed(1) : '0';

  const negativeReviews = recentFive.filter((r) => (r.rating ?? 5) < 4);
  const positiveReviews = recentFive.filter((r) => (r.rating ?? 5) >= 4);

  const starDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: recentFive.filter((r) => r.rating === star).length,
  }));
  const maxStarCount = Math.max(...starDistribution.map((d) => d.count), 1);

  const ctrBenchmarks = [
    { rating: 3.0, ctr: 10 },
    { rating: 3.5, ctr: 20 },
    { rating: 4.0, ctr: 35 },
    { rating: 4.5, ctr: 50 },
    { rating: 5.0, ctr: 68 },
  ];

  const scanPageUrl = isLoggedIn ? '/app/scanner' : '/business-scan';
  const formatCurrency = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  const sectionClass =
    'rounded-2xl p-6 border border-secondary-200 shadow-sm hover:shadow-md transition-shadow duration-200';

  const renderReviewCard = (r: (typeof reviews)[0], i: number, isNeg: boolean) => {
    const reviewText = toDisplayString((r.text as { text?: string } | undefined)?.text ?? (r.text as unknown));
    const ownerResponse = toDisplayString(r.reviewReply?.comment?.text ?? (r.reviewReply?.comment as unknown));
    const isExpanded = expandedReviewId === i;
    const prefillRating = r.rating != null ? String(r.rating) : '';
    const prefillDate = r.publishTime
      ? (() => { try { const d = new Date(r.publishTime!); return isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10); } catch { return ''; } })()
      : '';
    const reviewerName = toDisplayString(r.authorAttribution?.displayName) || 'Anonymous';
    const reviewUrl = '';
    const basePrefill = `prefill_platform=google&prefill_url=${encodeURIComponent(reviewUrl)}&prefill_text=${encodeURIComponent(reviewText)}&prefill_reviewer=${encodeURIComponent(reviewerName)}`;
    const requestRemovalHref = `/submit-removal?${basePrefill}${prefillRating ? `&prefill_rating=${encodeURIComponent(prefillRating)}` : ''}${prefillDate ? `&prefill_date=${encodeURIComponent(prefillDate)}` : ''}`;
    const advisorHref = `/app/removal-advisor/new?${basePrefill}${prefillRating ? `&prefill_rating=${encodeURIComponent(prefillRating)}` : ''}${prefillDate ? `&prefill_date=${encodeURIComponent(prefillDate)}` : ''}`;
    const btnClass = 'inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto shrink-0';

    return (
      <div key={i} className={`bg-white border rounded-xl overflow-hidden transition-all hover:shadow-lg group ${isNeg ? 'border-l-4 border-l-red-400 border-red-200 hover:border-red-300' : 'border-secondary-200 hover:border-primary-200'}`}>
        <div className="p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4 min-w-0 flex-1">
              <div className="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center flex-shrink-0 overflow-hidden border border-secondary-200 relative">
                {r.authorAttribution?.photoUri ? (
                  <Image src={r.authorAttribution.photoUri} alt={reviewerName} fill className="object-cover" unoptimized />
                ) : (
                  <User className="h-6 w-6 text-secondary-400" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3 sm:flex-wrap">
                  <p className="font-semibold text-secondary-900 text-base">{reviewerName}</p>
                  <div className="flex items-center gap-2">
                    {r.rating != null && (
                      <div className="flex items-center gap-0.5" aria-label={`${r.rating} stars`}>
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star key={j} className={`h-3.5 w-3.5 ${j < r.rating! ? 'text-amber-400 fill-amber-400' : 'text-secondary-200'}`} />
                        ))}
                      </div>
                    )}
                    {isNeg && <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">Holding you back</span>}
                    {toDisplayString(r.relativePublishTimeDescription) && (
                      <span className="text-xs text-secondary-500 font-medium px-2 py-0.5 bg-secondary-100 rounded-full">{toDisplayString(r.relativePublishTimeDescription)}</span>
                    )}
                  </div>
                </div>
                <p className="text-secondary-700 mt-2 leading-relaxed text-sm line-clamp-3 group-hover:line-clamp-none transition-all">
                  {reviewText || <span className="italic text-secondary-400">No written review</span>}
                </p>
                {isNeg && <p className="text-xs text-red-600 mt-1.5 font-medium">Removing this review could improve your rating</p>}
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2 sm:flex-shrink-0">
              <a href={advisorHref} target="_blank" rel="noopener noreferrer" className={`${btnClass} border border-secondary-200 text-secondary-700 hover:bg-secondary-50`}>
                <Brain className="h-3.5 w-3.5" /> AI Advisor
              </a>
              <a href={requestRemovalHref} target="_blank" rel="noopener noreferrer" className={`${btnClass} ${isNeg ? 'bg-primary-600 text-white hover:bg-primary-500' : 'border border-primary-600 text-primary-600 hover:bg-primary-50'}`}>
                <FileX className="h-3.5 w-3.5" /> Expert Removal
              </a>
            </div>
          </div>
          <button type="button" onClick={() => setExpandedReviewId(isExpanded ? null : i)} className="mt-3 w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-secondary-200 text-secondary-700 text-sm font-medium hover:bg-secondary-50 transition-colors">
            <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} /> Review details
          </button>
        </div>
        {isExpanded && (
          <div className="border-t border-secondary-100 p-4 bg-secondary-50 space-y-4">
            <p className="text-sm text-secondary-800">{reviewText || '(No review text)'}</p>
            {ownerResponse && (
              <div>
                <p className="text-xs font-medium text-secondary-500 uppercase tracking-wider mb-1">Owner response</p>
                <p className="text-sm text-secondary-700 italic">{ownerResponse}</p>
              </div>
            )}
            {r.authorAttribution?.uri && (
              <a href={r.authorAttribution.uri} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-secondary-500 hover:text-secondary-700 hover:underline">
                <ExternalLink className="h-3 w-3" /> View reviewer profile
              </a>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto pt-5 space-y-10">
      {/* Dynamic headline */}
      {report && !reportLoading && (
        <div className="text-center">
          {businessImpact?.leadIncreasePercent ? (
            <>
              <h2 className="text-2xl md:text-3xl font-extrabold text-secondary-900 tracking-tight">
                Your business could see a{' '}
                <span className="text-primary-600">{businessImpact.leadIncreasePercent}% increase</span> in monthly leads
              </h2>
              <p className="text-secondary-600 mt-2">
                By removing {negativeCount} negative review{negativeCount !== 1 ? 's' : ''} and reaching a 5.0 rating
              </p>
            </>
          ) : trafficIncrease > 0 ? (
            <>
              <h2 className="text-2xl md:text-3xl font-extrabold text-secondary-900 tracking-tight">
                Removing negative reviews could boost your traffic by{' '}
                <span className="text-primary-600">{trafficIncrease}%</span>
              </h2>
              <p className="text-secondary-600 mt-2">Here&apos;s your personalized review analysis</p>
            </>
          ) : (
            <h2 className="text-2xl md:text-3xl font-extrabold text-secondary-900 tracking-tight">Your Business Impact Report</h2>
          )}
        </div>
      )}

      {/* Header with timestamp and actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          {report && (
            <p className="text-base font-semibold text-secondary-800">
              Report generated {report.stale ? '(data may be outdated) ' : ''}on {format(new Date(report.generated_at), 'MMM d, yyyy')}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={copyLink} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-secondary-200 text-secondary-700 text-sm font-medium hover:bg-secondary-50">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? 'Copied' : 'Share'}
          </button>
          <button type="button" onClick={handleRefresh} disabled={refreshing} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-500 disabled:opacity-50">
            {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />} Refresh report
          </button>
        </div>
      </div>

      {report?.stale && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3 text-sm">
          Data may be outdated. We couldn&apos;t refresh from Google right now; showing last saved report.
        </div>
      )}
      {error && report && (
        <div className="bg-accent-50 border border-accent-200 text-accent-800 rounded-xl px-4 py-3 text-sm">{error}</div>
      )}

      {/* 1. Place overview hero */}
      <section className={`bg-gradient-to-br from-white to-secondary-50 ${sectionClass} relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="relative flex flex-col sm:flex-row gap-6">
          {photoName && (
            <div className="w-24 h-24 rounded-2xl bg-secondary-100 flex-shrink-0 overflow-hidden shadow-sm border border-secondary-100 relative">
              <Image src={`/api/public/report/photo?name=${encodeURIComponent(photoName)}&maxWidthPx=200`} alt="" fill className="object-cover" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-secondary-900 tracking-tight">{name}</h1>
                {address && (
                  <p className="text-secondary-600 flex items-center gap-1.5 mt-2 text-base">
                    <MapPin className="h-4 w-4 flex-shrink-0 text-primary-500" /> {address}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  {rating != null && (
                    <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 text-amber-900 rounded-full px-3 py-1 text-sm font-semibold shadow-sm">
                      <Star className="h-4 w-4 fill-amber-500 text-amber-500" /> {rating}
                      <span className="text-amber-700 font-normal">({reviewCount.toLocaleString()})</span>
                    </div>
                  )}
                  {website && (
                    <a href={website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-50 border border-secondary-100 text-secondary-700 text-sm hover:bg-secondary-100 transition-colors">
                      <Globe className="h-3.5 w-3.5" /> Website
                    </a>
                  )}
                </div>
              </div>
              <div className="flex-shrink-0">
                <Link
                  href={scanPageUrl}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-secondary-300 text-secondary-700 font-semibold hover:bg-secondary-50 transition-colors"
                >
                  Get Deep Analysis
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Business Impact Summary */}
      {businessImpact && (reportLoading ? null : (
        <section className={`bg-gradient-to-br from-[#0f2027] to-[#1a3a3a] text-white ${sectionClass} border-0`}>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" /> Estimated Business Impact
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <p className="text-sm text-white/70 mb-1">Estimated Customer Increase</p>
              <div className="flex items-center justify-center gap-1.5 mt-3">
                <TrendingUp className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span className="text-green-400 font-bold text-2xl tabular-nums">
                  {Math.max(
                    0,
                    (businessImpact.projectedMonthlyLeadsAt5 ?? 0) - (businessImpact.currentMonthlyLeads ?? 0)
                  ).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-green-400/90 mt-2">
                At 5.0 (+{businessImpact.leadIncreasePercent ?? 0}%)
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <p className="text-sm text-white/70 mb-1">Est. Monthly Revenue Increase</p>
              <div className="flex items-center justify-center gap-1.5 mt-3">
                <TrendingUp className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span className="text-green-400 font-bold text-2xl tabular-nums">
                  {formatCurrency(
                    Math.max(
                      0,
                      (businessImpact.estimatedProjectedMonthlyRevenue ?? 0) -
                        (businessImpact.estimatedCurrentMonthlyRevenue ?? 0)
                    )
                  )}
                </span>
              </div>
              <p className="text-sm text-green-400/90 mt-2">
                At 5.0 (+{businessImpact.revenueIncreasePercent ?? 0}%)
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <p className="text-sm text-white/70 mb-1">Per Customer Est. Revenue</p>
              <p className="text-2xl font-bold">{formatCurrency(businessImpact.avgRevenuePerLead ?? 0)}</p>
              <p className="text-xs text-white/50 mt-1">Industry estimate</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <Target className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-amber-400 font-bold">{negativeCount} reviews</span>
              </div>
              <p className="text-xs text-amber-400/80">to remove for 5.0</p>
            </div>
          </div>
          {businessImpact.methodology && <p className="text-xs text-white/50 text-center">{businessImpact.methodology}</p>}
        </section>
      ))}

      {/* 3. Rating Gap & Negative Review Breakdown */}
      {rating != null && reviewCount > 0 && rating < 5 && (
        <section className={`bg-gradient-to-br from-white to-primary-50/30 ${sectionClass}`}>
          <h2 className="text-xl font-semibold text-secondary-900 mb-4 flex items-center gap-2">
            <Target className="h-5 w-5" /> Rating Improvement Potential
          </h2>

          {/* Rating gauge */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold text-secondary-900">{rating}</span>
              <span className="text-2xl font-bold text-green-600">5.0</span>
            </div>
            <div className="h-4 bg-secondary-100 rounded-full overflow-hidden relative">
              <div className="h-full bg-gradient-to-r from-amber-400 to-primary-500 rounded-full transition-all duration-1000" style={{ width: `${(rating / 5) * 100}%` }} />
            </div>
            <p className="text-sm text-secondary-600 mt-2">
              You&apos;re <strong className="text-primary-600">{ratingGap} stars</strong> away from 5.0
            </p>
          </div>

          {/* Star distribution */}
          {recentFive.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-secondary-700 mb-3">Review Distribution (Recent Sample)</h3>
              <div className="space-y-2">
                {starDistribution.map((d) => (
                  <div key={d.star} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-secondary-600 w-12">{d.star} <Star className="h-3 w-3 inline fill-amber-400 text-amber-400" /></span>
                    <div className="flex-1 h-5 bg-secondary-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${d.star >= 4 ? 'bg-green-400' : d.star === 3 ? 'bg-amber-400' : 'bg-red-400'}`}
                        style={{ width: `${(d.count / maxStarCount) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-secondary-700 w-6 text-right">{d.count}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-secondary-400 mt-2">Based on your most recent reviews. Run a Deep Scan for full analysis.</p>
            </div>
          )}

          <p className="text-secondary-700 mb-4">
            Removing approximately <strong className="text-primary-700">{negativeCount}</strong> low-rated review{negativeCount !== 1 ? 's' : ''} could take you from <strong>{rating}</strong> to <strong>5.0</strong>
            {businessImpact?.leadIncreasePercent ? ` and increase your monthly leads by ~${businessImpact.leadIncreasePercent}%` : ''}.
          </p>
        </section>
      )}

      {/* 4. Traffic & CTR Impact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className={`bg-white ${sectionClass}`}>
          <h2 className="text-xl font-semibold text-secondary-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" /> Search Traffic Impact
          </h2>
          {reportLoading && !report ? (
            <div className="flex items-center justify-center gap-2 py-8 text-secondary-500">
              <Loader2 className="h-5 w-5 animate-spin" /><span className="text-sm">Estimating traffic…</span>
            </div>
          ) : projectedVolume > 0 && currentVolume > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-secondary-50 rounded-xl p-4 text-center border border-secondary-100">
                  <p className="text-xs font-medium text-secondary-500 uppercase tracking-wider mb-1">Current</p>
                  <p className="text-2xl font-bold text-secondary-900">{currentVolume.toLocaleString()}</p>
                  <p className="text-xs text-secondary-500">monthly searches</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center border border-green-100">
                  <p className="text-xs font-medium text-green-700 uppercase tracking-wider mb-1">At 5.0</p>
                  <p className="text-2xl font-bold text-green-700">{projectedVolume.toLocaleString()}</p>
                  <p className="text-xs text-green-600">monthly searches</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 text-primary-600 font-semibold">
                <TrendingUp className="h-4 w-4" /> +{trafficIncrease}% increase at 5.0
              </div>
              {currentCTR > 0 && projectedCTR > 0 && (
                <p className="text-sm text-secondary-500 text-center">
                  CTR: {currentCTR}% → {projectedCTR}% at 5.0
                </p>
              )}
              {toDisplayString(traffic.note) && <p className="text-xs text-secondary-400 text-center">{toDisplayString(traffic.note)}</p>}
            </div>
          ) : (
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary-600">{currentVolume.toLocaleString()}</span>
                <span className="text-secondary-500">estimated monthly searches</span>
              </div>
              {toDisplayString(traffic.note) && <p className="text-sm text-secondary-500 mt-2">{toDisplayString(traffic.note)}</p>}
            </div>
          )}
        </section>

        {/* CTR Benchmarks */}
        <section className={`bg-white ${sectionClass}`}>
          <h2 className="text-xl font-semibold text-secondary-900 mb-4 flex items-center gap-2">
            <Target className="h-5 w-5" /> Click-Through Rate by Rating
          </h2>
          <div className="space-y-3">
            {ctrBenchmarks.map((b) => {
              const isCurrentRange = rating != null && Math.abs(rating - b.rating) < 0.25;
              const isTarget = b.rating === 5.0;
              return (
                <div key={b.rating} className="flex items-center gap-3">
                  <span className={`text-sm font-medium w-10 ${isCurrentRange ? 'text-primary-700 font-bold' : isTarget ? 'text-green-700 font-bold' : 'text-secondary-500'}`}>
                    {b.rating}
                  </span>
                  <div className="flex-1 h-6 bg-secondary-100 rounded-full overflow-hidden relative">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${isCurrentRange ? 'bg-primary-500' : isTarget ? 'bg-green-500' : 'bg-secondary-300'}`}
                      style={{ width: `${b.ctr}%` }}
                    />
                    {isCurrentRange && (
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-primary-700">You</span>
                    )}
                  </div>
                  <span className={`text-sm font-medium w-10 text-right ${isCurrentRange ? 'text-primary-700 font-bold' : isTarget ? 'text-green-700 font-bold' : 'text-secondary-500'}`}>
                    {b.ctr}%
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-secondary-400 mt-3">Source: BrightLocal & Moz local search benchmarks</p>
        </section>
      </div>

      {/* 5. Deep Scan CTA */}
      <section className={`bg-gradient-to-br from-primary-50 to-white ${sectionClass} border-primary-100`}>
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-secondary-900 mb-2">Get a Complete Review Analysis</h2>
            <p className="text-secondary-600 mb-3">
              This quick report covers your top reviews. Run a <strong>Deep Scan</strong> to analyze ALL {reviewCount.toLocaleString()} of your reviews, identify policy violations, and get a detailed threat report.
            </p>
            <div className="flex items-center gap-4 text-sm text-secondary-500">
              <span>✓ All reviews analyzed</span>
              <span>✓ AI threat detection</span>
              <span>✓ Policy violation flagging</span>
            </div>
          </div>
          <Link
            href={`${scanPageUrl}${scanPageUrl.includes('?') ? '&' : '?'}ref=report&business=${encodeURIComponent(name)}`}
            className="flex-shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-500 transition-all shadow-md hover:shadow-lg"
          >
            Run Deep Scan <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
        <p className="text-xs text-secondary-400 mt-3">Takes 2–3 minutes • Analyzes every review • Redirects to full results when complete</p>
      </section>

      {/* 6. Keyword & sentiment */}
      <section className={`bg-white ${sectionClass}`}>
        <h2 className="text-xl font-semibold text-secondary-900 mb-4 flex items-center gap-2">
          <MessageSquare className="h-5 w-5" /> {titleCase('Keyword & sentiment')}
        </h2>
        {reportLoading && !report ? (
          <div className="flex items-center justify-center gap-2 py-8 text-secondary-500">
            <Loader2 className="h-5 w-5 animate-spin" /><span className="text-sm">Analyzing reviews…</span>
          </div>
        ) : keywords.length > 0 || sentimentThemes.length > 0 ? (
          <>
            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {keywords.slice(0, 20).map((kw, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-primary-50 text-primary-800 text-sm border border-primary-100">{toDisplayString(kw)}</span>
                ))}
              </div>
            )}
            {sentimentThemes.length > 0 && (
              <div className="space-y-2">
                {sentimentThemes.map((t, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="font-medium text-secondary-700">{toDisplayString(t.label)}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${t.sentiment === 'positive' ? 'bg-green-100 text-green-800' : t.sentiment === 'negative' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>{toDisplayString(t.sentiment)}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <p className="text-secondary-500">No keyword data yet.</p>
        )}
      </section>

      {/* 7. Ratings & Reviews with negative highlighting */}
      <section className={`bg-white ${sectionClass}`}>
        <h2 className="text-xl font-semibold text-secondary-900 mb-4">{titleCase('Ratings & review summary')}</h2>
        <div className="flex flex-wrap items-center gap-4 mb-4">
          {rating != null && (
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className={`h-8 w-8 ${i <= Math.round(rating) ? 'text-amber-500 fill-amber-500' : 'text-secondary-200'}`} />
              ))}
            </div>
          )}
          <span className="text-2xl font-bold text-secondary-900">{rating ?? '—'}</span>
          <span className="text-secondary-500">Overall ({reviewCount.toLocaleString()} reviews)</span>
          {recentFiveAvg != null && !Number.isNaN(recentFiveAvg) && (
            <span className="text-secondary-600 text-sm">Recent 5 avg: <strong>{recentFiveAvg.toFixed(1)}</strong></span>
          )}
        </div>
        {reviewSummary && <p className="text-secondary-700 mb-4">{reviewSummary}</p>}
        {reviews.length > 0 && (
          <div className="mt-4 space-y-3">
            {negativeReviews.length > 0 && (
              <>
                <h3 className="text-sm font-semibold text-red-700 flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4" /> Reviews Impacting Your Rating ({negativeReviews.length})
                </h3>
                {negativeReviews.map((r, i) => renderReviewCard(r, i, true))}
              </>
            )}
            {positiveReviews.length > 0 && (
              <>
                <h3 className="text-sm font-semibold text-green-700 mt-6 flex items-center gap-1.5">
                  <Check className="h-4 w-4" /> Positive Reviews ({positiveReviews.length})
                </h3>
                {positiveReviews.map((r, i) => renderReviewCard(r, negativeReviews.length + i, false))}
              </>
            )}
          </div>
        )}
        {reviews.length === 0 && reviewCount === 0 && (
          <p className="text-secondary-500 italic">Be the first to get reviewed!</p>
        )}
      </section>

      {/* 8. Actionable recommendations */}
      <section className={`bg-white ${sectionClass}`}>
        <h2 className="text-xl font-semibold text-secondary-900 mb-4">{titleCase('Actionable recommendations')}</h2>
        {reportLoading && !report ? (
          <div className="flex items-center justify-center gap-2 py-8 text-secondary-500">
            <Loader2 className="h-5 w-5 animate-spin" /><span className="text-sm">Generating recommendations…</span>
          </div>
        ) : recommendationsList.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {recommendationsList.map((rec, i) => {
              const isHigh = rec.priority === 'high';
              const isMedium = rec.priority === 'medium';
              return (
                <div key={i} className={`p-4 rounded-xl border transition-all hover:shadow-md ${isHigh ? 'bg-accent-50/50 border-accent-100' : isMedium ? 'bg-amber-50/50 border-amber-100' : 'bg-white border-secondary-100'}`}>
                  <div className="flex gap-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${isHigh ? 'bg-accent-100 text-accent-700' : isMedium ? 'bg-amber-100 text-amber-700' : 'bg-secondary-100 text-secondary-600'}`}>
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className={`font-semibold ${isHigh ? 'text-accent-900' : isMedium ? 'text-amber-900' : 'text-secondary-900'}`}>{toDisplayString(rec.title)}</p>
                        {isHigh && <span className="text-[10px] font-bold uppercase tracking-wider text-accent-600 bg-accent-100 px-1.5 py-0.5 rounded">High Priority</span>}
                      </div>
                      <p className="text-sm text-secondary-700 leading-relaxed">{toDisplayString(rec.action)}</p>
                      {rec.impact && (
                        <p className="text-sm text-primary-700 mt-2 bg-primary-50 px-3 py-1.5 rounded-lg border border-primary-100 inline-block">
                          <TrendingUp className="h-3.5 w-3.5 inline mr-1" />{rec.impact}
                        </p>
                      )}
                      {(isHigh || isMedium) && (
                        <div className="flex gap-2 mt-3">
                          <Link href="/submit-removal?prefill_platform=google" className="text-xs font-medium text-primary-600 hover:text-primary-700 hover:underline">Get Removal Help →</Link>
                          <Link href="/app/removal-advisor/new" className="text-xs font-medium text-secondary-500 hover:text-secondary-700 hover:underline">Use AI Advisor →</Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-secondary-500">No recommendations generated.</p>
        )}
      </section>

      {/* 9. Contact & operations */}
      <section className={`bg-white ${sectionClass}`}>
        <h2 className="text-xl font-semibold text-secondary-900 mb-4">{titleCase('Contact & operations')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {phone && (
            <a href={`tel:${phone}`} className="flex items-center gap-4 p-4 rounded-xl bg-secondary-50 border border-secondary-100 text-secondary-700 hover:bg-secondary-100 transition-colors group">
              <div className="w-10 h-10 rounded-full bg-white border border-secondary-200 flex items-center justify-center group-hover:border-primary-200 group-hover:text-primary-600 transition-colors"><Phone className="h-5 w-5" /></div>
              <span className="font-medium">{phone}</span>
            </a>
          )}
          {website && (
            <a href={website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-xl bg-secondary-50 border border-secondary-100 text-secondary-700 hover:bg-secondary-100 transition-colors group">
              <div className="w-10 h-10 rounded-full bg-white border border-secondary-200 flex items-center justify-center group-hover:border-primary-200 group-hover:text-primary-600 transition-colors"><Globe className="h-5 w-5" /></div>
              <div className="min-w-0"><span className="block font-medium truncate">Visit Website</span><span className="block text-xs text-secondary-500 truncate">{new URL(website).hostname}</span></div>
              <ExternalLink className="h-4 w-4 flex-shrink-0 ml-auto opacity-50 group-hover:opacity-100" />
            </a>
          )}
        </div>
        {hours.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-secondary-900 mb-4 flex items-center gap-2"><Clock className="h-4 w-4 text-primary-600" /> Opening Hours</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
              {hours.map((line, i) => {
                const parts = line.split(': ');
                return (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-secondary-100 last:border-0">
                    <span className="font-medium text-secondary-700">{parts[0]}</span>
                    <span className="text-secondary-600">{parts.slice(1).join(': ') || parts[0]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* 10. Lead magnet CTA */}
      <section className="bg-gradient-to-br from-[#182825] to-[#2A403C] text-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-200">
        {businessImpact?.estimatedProjectedMonthlyRevenue && businessImpact.estimatedCurrentMonthlyRevenue ? (
          <>
            <h2 className="text-xl font-bold mb-2">
              You Could Be Earning {formatCurrency(businessImpact.estimatedProjectedMonthlyRevenue - businessImpact.estimatedCurrentMonthlyRevenue)} More Per Month
            </h2>
            <p className="text-secondary-300 mb-4 text-sm">
              Rating: {rating} → 5.0 | +{(businessImpact.projectedMonthlyLeadsAt5 ?? 0) - (businessImpact.currentMonthlyLeads ?? 0)} leads/mo | +{formatCurrency((businessImpact.estimatedProjectedMonthlyRevenue ?? 0) - (businessImpact.estimatedCurrentMonthlyRevenue ?? 0))}/mo
            </p>
          </>
        ) : (
          <h2 className="text-xl font-bold mb-2">Unlock Your Business&apos;s Full Potential</h2>
        )}
        <p className="text-secondary-300 mb-6 max-w-xl mx-auto">
          {negativeCount > 0
            ? `By removing ${negativeCount} negative review${negativeCount !== 1 ? 's' : ''} and reaching a 5.0 rating, you could see a significant increase in monthly leads. Let our experts help.`
            : 'Get expert help improving your reviews and your local visibility. Sign up for a free account or talk to our team.'}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/submit-removal?prefill_platform=google" className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-400 transition-all">
            Start Removing Reviews
          </Link>
          <Link href="/app" className="inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 border-white/50 text-white font-semibold hover:bg-white/10 transition-all">
            Create Free Account
          </Link>
          <Link href="/contact" className="inline-flex items-center justify-center px-6 py-3 text-white/70 hover:text-white text-sm transition-all hover:underline">
            Talk to an expert
          </Link>
        </div>
      </section>
    </div>
  );
}
