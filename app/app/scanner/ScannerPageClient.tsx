'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { computeScanDepthForPlace } from '@/lib/scanner-depth';
import { Radar, Star, MapPin, Calendar, Trash2, Phone, Globe } from 'lucide-react';
import { format } from 'date-fns';
import BusinessSearch from '@/components/scanner/BusinessSearch';
import ScanProgress from '@/components/scanner/ScanProgress';
import {
  upsertBusinessProfile,
  getUserScans,
  deleteScan,
  getPlaceResultForRescan,
  type ScannerListScanMetrics,
} from '@/app/actions/scanner';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { ConfirmModal } from '@/components/ui/confirm-modal';
interface PlaceResult {
  placeId: string;
  name: string;
  address: string;
  rating: number | null;
  totalReviews: number | null;
  primaryType: string | null;
  phone: string | null;
  website: string | null;
  mapsUrl: string | null;
}

interface ScanRecord {
  id: string;
  status: string;
  reviews_found: number;
  threats_found: number;
  created_at: string;
  scan_type: string;
  business_profiles: {
    id: string;
    name: string;
    address: string | null;
    rating: number | null;
    total_reviews: number | null;
    google_place_id: string;
    primary_type: string | null;
    phone?: string | null;
    website?: string | null;
  };
  list_metrics: ScannerListScanMetrics | null;
}

type PageState = 'search' | 'confirming' | 'scanning';

function formatScanStatus(status: string): string {
  if (status === 'reviews_received') return 'Reviews Analyzed';
  const withSpaces = status.replace(/_/g, ' ');
  return withSpaces.replace(/\b\w/g, (l) => l.toUpperCase());
}

interface ScannerPageClientProps {
  scanMaxDepth: number;
  subscriptionTier: string;
  initialScanCount: number;
  /** Deep link from scan results “Rescan”: load place from `business_profiles` and open confirm step. */
  initialRescanGooglePlaceId?: string | null;
}

export default function ScannerPageClient({
  scanMaxDepth,
  subscriptionTier,
  initialScanCount,
  initialRescanGooglePlaceId = null,
}: ScannerPageClientProps) {
  const router = useRouter();
  const [reportCount, setReportCount] = useState(initialScanCount);
  const isFreeScanLimitReached = subscriptionTier === 'free' && reportCount >= 1;
  const [pageState, setPageState] = useState<PageState>('search');
  const [rescanHydrating, setRescanHydrating] = useState(Boolean(initialRescanGooglePlaceId));
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const [activeScanId, setActiveScanId] = useState<string | null>(null);
  const [activeScrapeId, setActiveScrapeId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previousScans, setPreviousScans] = useState<ScanRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [scanListSort, setScanListSort] = useState<'low_to_high' | 'high_to_low'>('low_to_high');
  const [deletingScanId, setDeletingScanId] = useState<string | null>(null);
  const [deleteConfirmScanId, setDeleteConfirmScanId] = useState<string | null>(null);

  useEffect(() => {
    getUserScans()
      .then((data) => {
        const scans = data.scans as ScanRecord[];
        setPreviousScans(scans);
        setReportCount(scans.length);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!initialRescanGooglePlaceId) return;
    if (subscriptionTier === 'free' && reportCount >= 1) {
      setRescanHydrating(false);
      toast.error('Subscribe to generate more reports.');
      router.replace('/app/scanner');
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const place = await getPlaceResultForRescan(initialRescanGooglePlaceId);
        if (cancelled) return;
        if (place) {
          setSelectedPlace(place);
          setPageState('confirming');
        } else {
          toast.error('Could not load this business. Try searching again.');
        }
      } catch {
        if (!cancelled) toast.error('Could not load this business. Try searching again.');
      } finally {
        if (!cancelled) setRescanHydrating(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [initialRescanGooglePlaceId]);

  const handlePlaceSelect = (place: PlaceResult) => {
    setSelectedPlace(place);
    setPageState('confirming');
    setError(null);
  };

  const handleStartScan = async () => {
    if (!selectedPlace) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const { profileId } = await upsertBusinessProfile({
        googlePlaceId: selectedPlace.placeId,
        name: selectedPlace.name,
        address: selectedPlace.address,
        rating: selectedPlace.rating ?? undefined,
        totalReviews: selectedPlace.totalReviews ?? undefined,
        primaryType: selectedPlace.primaryType ?? undefined,
        phone: selectedPlace.phone ?? undefined,
        website: selectedPlace.website ?? undefined,
      });

      const res = await fetch('/api/scanner/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessProfileId: profileId,
          placeId: selectedPlace.placeId,
          keyword: selectedPlace.name,
          depth: computeScanDepthForPlace(selectedPlace.totalReviews, scanMaxDepth),
          sortBy: 'lowest_rating',
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: 'Failed to start scan' }));
        throw new Error(errData.error);
      }

      const data = await res.json();
      if (!data?.scanId) {
        throw new Error(data?.error ?? 'Invalid response from server');
      }
      setActiveScanId(data.scanId);
      setActiveScrapeId(data.dataforseoTaskId ?? null);
      setPageState('scanning');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start scan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScanComplete = useCallback(() => {
    if (activeScanId) {
      router.push(`/app/scanner/${activeScanId}`);
    }
  }, [activeScanId, router]);

  const handleScanError = useCallback((message?: string) => {
    setError(message ?? 'Scan failed. Please try again.');
    setPageState('search');
  }, []);

  const handleNewScan = () => {
    setPageState('search');
    setSelectedPlace(null);
    setActiveScanId(null);
    setActiveScrapeId(null);
    setError(null);
    router.replace('/app/scanner');
  };

  const handleDeleteScan = (e: React.MouseEvent, scanId: string) => {
    e.stopPropagation();
    setDeleteConfirmScanId(scanId);
  };

  const handleConfirmDeleteScan = async () => {
    const scanId = deleteConfirmScanId;
    if (!scanId) return;
    setDeletingScanId(scanId);
    try {
      await deleteScan(scanId);
      setPreviousScans((prev) => prev.filter((s) => s.id !== scanId));
      setReportCount((c) => Math.max(0, c - 1));
      toast.success('Report deleted successfully');
      setDeleteConfirmScanId(null);
    } catch (err) {
      console.error('Failed to delete scan:', err);
      toast.error('Failed to delete report');
    } finally {
      setDeletingScanId(null);
    }
  };

  const sortedPreviousScans = [...previousScans].sort((a, b) => {
    const diff = a.threats_found - b.threats_found;
    return scanListSort === 'low_to_high' ? diff : -diff;
  });

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto relative">
      {rescanHydrating && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/80 dark:bg-slate-900/80">
          <div className="flex flex-col items-center gap-2 text-secondary-600">
            <div className="h-8 w-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium">Loading business…</p>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
          <Radar className="h-6 w-6 text-primary-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Google Review Scan</h1>
          <p className="text-secondary-500">Automated Google Review Scanner & Threat Detector</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Search State */}
      {pageState === 'search' && (
        <div className="space-y-6">
          {isFreeScanLimitReached ? (
            <div className="bg-white border border-secondary-200 rounded-2xl p-8 text-center w-full max-w-5xl mx-auto">
              <h2 className="text-lg sm:text-xl font-semibold text-secondary-900 mb-2 md:whitespace-nowrap">
                Subscribe to Generate Unlimited Reports
              </h2>
              <p className="text-secondary-500 mb-6 text-sm max-w-3xl mx-auto">
                You&apos;ve used your free report. Upgrade to run unlimited Google review scans and threat analysis.
              </p>
              <Link
                href="/app/subscribe"
                className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-500 transition-colors shadow-lg"
              >
                Subscribe
              </Link>
            </div>
          ) : (
            <div className="bg-white border border-secondary-200 rounded-2xl p-8">
              <h2 className="text-lg font-semibold text-secondary-900 mb-2">
                Find Your Business
              </h2>
              <p className="text-secondary-500 mb-6">
                Bulk analyze and agregate your reviews to share positive reviews and get the negative ones removed.
              </p>
              <BusinessSearch onSelect={handlePlaceSelect} />
            </div>
          )}
        </div>
      )}

      {/* Confirming State */}
      {pageState === 'confirming' && selectedPlace && (
        <div className="bg-white border border-secondary-200 rounded-2xl p-8">
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">Confirm Business</h2>

          <div className="bg-secondary-50 rounded-xl p-5 mb-6 border border-secondary-100">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3 min-w-0">
                <MapPin className="h-6 w-6 text-primary-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-secondary-900 text-lg">{selectedPlace.name}</p>
                  <p className="text-secondary-500 text-sm">{selectedPlace.address}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-1">
                    {selectedPlace.rating != null && (
                      <span className="flex items-center gap-1 text-sm text-secondary-600">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        {selectedPlace.rating}
                      </span>
                    )}
                    {selectedPlace.totalReviews != null && (
                      <span className="text-sm text-secondary-500">
                        {selectedPlace.totalReviews.toLocaleString()} total reviews
                      </span>
                    )}
                    {selectedPlace.primaryType && (
                      <span className="text-xs bg-secondary-200 px-2 py-0.5 rounded-full text-secondary-600">
                        {selectedPlace.primaryType}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {(selectedPlace.phone || selectedPlace.website) && (
                <div className="flex flex-col gap-1.5 sm:items-end text-sm sm:text-right shrink-0">
                  {selectedPlace.phone && (
                    <a
                      href={`tel:${selectedPlace.phone}`}
                      className="flex items-center gap-1.5 text-secondary-600 hover:text-primary-600 sm:justify-end"
                    >
                      <Phone className="h-4 w-4 shrink-0" />
                      {selectedPlace.phone}
                    </a>
                  )}
                  {selectedPlace.website && (
                    <a
                      href={selectedPlace.website.startsWith('http') ? selectedPlace.website : `https://${selectedPlace.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-secondary-600 hover:text-primary-600 sm:justify-end"
                    >
                      <Globe className="h-4 w-4 shrink-0" />
                      Website
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          <p className="text-sm text-secondary-500 mb-4">
            We&apos;ll pull all Google reviews for this business and run AI-powered policy analysis on each one.
            This typically takes 1-3 minutes depending on the number of reviews.
          </p>

          <div className="flex gap-3">
            <button
              onClick={handleNewScan}
              className="px-6 py-3 rounded-xl border border-secondary-200 text-secondary-700 font-medium hover:bg-secondary-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleStartScan}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-500 transition-all shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Starting...' : 'Start Scan'}
            </button>
          </div>
        </div>
      )}

      {/* Scanning State */}
      {pageState === 'scanning' && activeScanId && (
        <ScanProgress
          scanId={activeScanId}
          scrapeId={activeScrapeId}
          onComplete={handleScanComplete}
          onError={handleScanError}
        />
      )}

      {/* Previous Scans */}
      {previousScans.length > 0 && (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h2 className="text-lg font-semibold text-secondary-900">Previous Scans</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-secondary-600">Sort by threats:</span>
              <select
                value={scanListSort}
                onChange={(e) => setScanListSort(e.target.value as 'low_to_high' | 'high_to_low')}
                className="rounded-xl border border-secondary-200 bg-white px-3 py-2 text-sm text-secondary-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
              >
                <option value="low_to_high">Lowest to highest (default)</option>
                <option value="high_to_low">Highest to lowest</option>
              </select>
            </div>
          </div>
          <div className="space-y-3">
            {sortedPreviousScans.map((scan) => {
              const m = scan.list_metrics;
              const bp = scan.business_profiles;
              return (
              <div
                key={scan.id}
                onClick={() => router.push(`/app/scanner/${scan.id}`)}
                className="w-full bg-white border border-secondary-200 rounded-2xl p-5 sm:p-6 hover:shadow-md transition-shadow cursor-pointer group relative"
              >
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-start gap-3 min-w-0">
                      <MapPin className="h-6 w-6 text-primary-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-secondary-900 text-lg">
                          {bp?.name ?? 'Unknown Business'}
                        </p>
                        {bp?.address && (
                          <p className="text-secondary-500 text-sm mt-0.5">{bp.address}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-3 mt-1">
                          {bp?.rating != null && (
                            <span className="flex items-center gap-1 text-sm text-secondary-700">
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              {bp.rating}
                            </span>
                          )}
                          {bp?.total_reviews != null && (
                            <span className="text-sm text-secondary-500">
                              {bp.total_reviews.toLocaleString()} total reviews
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 sm:items-end lg:text-right shrink-0 w-full lg:w-auto pl-9 lg:pl-0">
                      {(bp?.phone || bp?.website) && (
                        <div className="flex flex-col gap-1.5 sm:items-end text-sm">
                          {bp.phone && (
                            <a
                              href={`tel:${bp.phone}`}
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1.5 text-secondary-600 hover:text-primary-600 sm:justify-end"
                            >
                              <Phone className="h-4 w-4 shrink-0" />
                              {bp.phone}
                            </a>
                          )}
                          {bp.website && (
                            <a
                              href={bp.website.startsWith('http') ? bp.website : `https://${bp.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1.5 text-secondary-600 hover:text-primary-600 sm:justify-end"
                            >
                              <Globe className="h-4 w-4 shrink-0" />
                              Website
                            </a>
                          )}
                        </div>
                      )}
                      <p className="text-sm text-secondary-500 flex items-center gap-2 sm:justify-end">
                        <Calendar className="h-4 w-4 text-secondary-400 shrink-0" />
                        Report {format(new Date(scan.created_at), 'MMM d, yyyy')}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 justify-end">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          scan.status === 'analyzed' || scan.status === 'reviews_received'
                            ? 'bg-green-50 text-green-700'
                            : scan.status === 'failed'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-yellow-50 text-yellow-700'
                        }`}>
                          {formatScanStatus(scan.status)}
                        </span>
                        <button
                          onClick={(e) => handleDeleteScan(e, scan.id)}
                          disabled={deletingScanId === scan.id}
                          className="p-2 text-secondary-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete report"
                        >
                          {deletingScanId === scan.id ? (
                            <div className="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); router.push(`/app/scanner/${scan.id}`); }}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-500 transition-colors"
                        >
                          View Reviews
                        </button>
                      </div>
                    </div>
                  </div>

                  {m && (
                    <div className="space-y-4 pt-1 border-t border-secondary-100">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                        <div className="bg-white border border-secondary-200 rounded-xl p-4 sm:p-5 text-center shadow-sm">
                          <p className="text-2xl sm:text-3xl font-bold text-secondary-900 tabular-nums">
                            {m.analyzedReviewsAvg != null ? m.analyzedReviewsAvg.toFixed(1) : '—'}
                          </p>
                          <p className="text-sm text-secondary-500 mt-1">Analyzed Reviews Avg.</p>
                        </div>
                        <div className="bg-white border border-secondary-200 rounded-xl p-4 sm:p-5 text-center shadow-sm">
                          <p className="text-2xl sm:text-3xl font-bold text-secondary-900 tabular-nums">
                            {m.overallRating != null ? m.overallRating.toFixed(1) : '—'}
                          </p>
                          <p className="text-sm text-secondary-500 mt-1">Overall Rating</p>
                        </div>
                        <div className="bg-white border border-secondary-200 rounded-xl p-4 sm:p-5 text-center shadow-sm">
                          <p className="text-2xl sm:text-3xl font-bold text-secondary-900 tabular-nums">{m.reviewsAnalyzed.toLocaleString()}</p>
                          <p className="text-sm text-secondary-500 mt-1">Reviews Analyzed</p>
                        </div>
                        <div className="bg-white border border-secondary-200 rounded-xl p-4 sm:p-5 text-center shadow-sm">
                          <p className="text-2xl sm:text-3xl font-bold text-red-600 tabular-nums">{m.reviewsThreats.toLocaleString()}</p>
                          <p className="text-sm text-secondary-500 mt-1">Reviews Threats</p>
                        </div>
                        <div className="bg-white border border-secondary-200 rounded-xl p-4 sm:p-5 text-center shadow-sm">
                          <p className="text-2xl sm:text-3xl font-bold text-green-600 tabular-nums">{m.cleanReviews.toLocaleString()}</p>
                          <p className="text-sm text-secondary-500 mt-1">Clean Reviews</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="bg-white border border-secondary-200 rounded-xl p-4 sm:p-5 text-center shadow-sm">
                          <p className="text-xl sm:text-2xl font-bold text-secondary-900 tabular-nums">{m.star1.toLocaleString()}</p>
                          <p className="text-sm text-secondary-500 mt-1">1 Star Reviews</p>
                        </div>
                        <div className="bg-white border border-secondary-200 rounded-xl p-4 sm:p-5 text-center shadow-sm">
                          <p className="text-xl sm:text-2xl font-bold text-secondary-900 tabular-nums">{m.star2.toLocaleString()}</p>
                          <p className="text-sm text-secondary-500 mt-1">2 Star Reviews</p>
                        </div>
                        <div className="bg-white border border-secondary-200 rounded-xl p-4 sm:p-5 text-center shadow-sm">
                          <p className="text-xl sm:text-2xl font-bold text-secondary-900 tabular-nums">{m.star3.toLocaleString()}</p>
                          <p className="text-sm text-secondary-500 mt-1">3 Star Reviews</p>
                        </div>
                        <div className="bg-white border border-secondary-200 rounded-xl p-4 sm:p-5 text-center shadow-sm">
                          <p className="text-xl sm:text-2xl font-bold text-secondary-900 tabular-nums">{m.star4And5.toLocaleString()}</p>
                          <p className="text-sm text-secondary-500 mt-1">4 &amp; 5 Star Reviews</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
            })}
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!deleteConfirmScanId}
        onOpenChange={(open) => !open && setDeleteConfirmScanId(null)}
        title="Delete report"
        description="Are you sure you want to delete this report? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleConfirmDeleteScan}
        loading={!!deletingScanId}
      />
    </div>
  );
}
