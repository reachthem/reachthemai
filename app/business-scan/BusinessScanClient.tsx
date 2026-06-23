'use client';

import { useState, useCallback, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { computeScanDepthForPlace } from '@/lib/scanner-depth';
import { Radar, Shield, MapPin, Star, ExternalLink, AlertTriangle, Brain, User, TrendingDown, Eye, UserX } from 'lucide-react';
import BusinessSearch from '@/components/scanner/BusinessSearch';
import ScanProgress from '@/components/scanner/ScanProgress';
import InlineAuthPrompt from '@/components/scanner/InlineAuthPrompt';

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

type PageState = 'search' | 'confirming' | 'scanning' | 'complete';

const SESSION_TOKEN_KEY = 'business_scan_session_token';

function getOrCreateSessionToken(): string {
  if (typeof window === 'undefined') return crypto.randomUUID();
  let token = sessionStorage.getItem(SESSION_TOKEN_KEY);
  if (!token) {
    token = crypto.randomUUID();
    sessionStorage.setItem(SESSION_TOKEN_KEY, token);
  }
  return token;
}

function MockReviewCard({ name, rating, timeAgo, text, violation, confidence, isThreat }: {
  name: string; rating: number; timeAgo: string; text: string;
  violation: { label: string; color: string }; confidence: number; isThreat: boolean;
}) {
  return (
    <div className={`bg-white border rounded-xl overflow-hidden ${isThreat ? 'border-red-200' : 'border-secondary-200'}`}>
      <div className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-full bg-secondary-100 flex items-center justify-center flex-shrink-0">
              <User className="h-4 w-4 text-secondary-500" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-2">
                <p className="font-medium text-secondary-900 text-sm">{name}</p>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-secondary-200'}`} />
                    ))}
                  </span>
                  <span className="text-xs text-secondary-400">{timeAgo}</span>
                </div>
              </div>
              <p className="text-sm text-secondary-700 mt-1 line-clamp-2">{text}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${violation.color}`}>
              {violation.label}
            </span>
            {isThreat && <span className="text-xs font-bold text-red-600">{confidence}%</span>}
          </div>
        </div>
        {isThreat && (
          <div className="mt-3 flex gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-secondary-200 text-secondary-700 bg-white">
              <Brain className="h-3.5 w-3.5" /> AI Advisor
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-primary-600 text-primary-600 bg-white">
              Expert Removal
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function MockReportPreview() {
  return (
    <div className="relative max-w-5xl mx-auto opacity-75 grayscale-[0.3] hover:grayscale-0 transition-all duration-700 ease-in-out transform scale-[0.98] origin-top">
      <div className="absolute top-0 inset-x-0 flex justify-center z-20 -mt-4">
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-secondary-200 text-secondary-600 text-sm font-medium shadow-xl">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          Sample Report Preview — Scan your business to see real data
        </div>
      </div>

      <div className="space-y-6 select-none pointer-events-none pt-12" aria-hidden="true">
        {/* Business Header (mock) */}
        <div className="bg-white border border-secondary-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0 border border-primary-100">
              <MapPin className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-secondary-900">Sample Business LLC</h2>
              <p className="text-secondary-500">123 Main Street, Austin, TX 78701</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="flex items-center gap-1 text-sm font-medium bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-md border border-yellow-100">
                  <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" /> 4.2
                </span>
                <span className="text-sm text-secondary-500">847 total reviews</span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { value: '3.1', label: 'Analyzed Reviews Avg.', color: 'text-secondary-900' },
            { value: '4.2', label: 'Overall Rating', color: 'text-secondary-900' },
            { value: '847', label: 'Reviews Scanned', color: 'text-secondary-900' },
            { value: '23', label: 'Threats Found', color: 'text-red-600' },
            { value: '824', label: 'Clean Reviews', color: 'text-green-600' },
          ].map((card) => (
            <div key={card.label} className="bg-white border border-secondary-200 rounded-xl p-5 text-center shadow-sm">
              <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
              <p className="text-xs font-medium text-secondary-400 mt-1 uppercase tracking-wide">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Impact Callout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-red-50 to-white border border-red-100 rounded-2xl p-6 text-center shadow-sm">
            <div className="inline-flex p-2 rounded-lg bg-red-100/50 mb-3">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-secondary-900">-0.3</p>
            <p className="text-sm font-medium text-red-600/80 mt-1">Star rating impact</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-100 rounded-2xl p-6 text-center shadow-sm">
            <div className="inline-flex p-2 rounded-lg bg-amber-100/50 mb-3">
              <Eye className="h-6 w-6 text-amber-600" />
            </div>
            <p className="text-3xl font-bold text-secondary-900">~2,400</p>
            <p className="text-sm font-medium text-amber-600/80 mt-1">Lost impressions/mo</p>
          </div>
          <div className="bg-gradient-to-br from-primary-50 to-white border border-primary-100 rounded-2xl p-6 text-center shadow-sm">
            <div className="inline-flex p-2 rounded-lg bg-primary-100/50 mb-3">
              <UserX className="h-6 w-6 text-primary-600" />
            </div>
            <p className="text-3xl font-bold text-secondary-900">~38</p>
            <p className="text-sm font-medium text-primary-600/80 mt-1">Customers lost/mo</p>
          </div>
        </div>

        {/* Filter Tabs (mock) */}
        <div className="flex gap-2 items-center pt-2">
          <span className="px-4 py-2 rounded-lg text-sm font-medium bg-secondary-900 text-white shadow-md">All (847)</span>
          <span className="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-secondary-200 text-secondary-600 shadow-sm">Threats (23)</span>
          <span className="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-secondary-200 text-secondary-600 shadow-sm">Clean (824)</span>
        </div>

        {/* Mock Review Cards */}
        <div className="space-y-4">
          <MockReviewCard
            name="John D."
            rating={1}
            timeAgo="2 weeks ago"
            text="Never even visited this place. My competitor paid me to leave this review. Total fake — don't trust the other ones either."
            violation={{ label: 'Spam / Fake', color: 'bg-red-50 text-red-700 border border-red-100' }}
            confidence={97}
            isThreat={true}
          />
          <MockReviewCard
            name="Karen M."
            rating={1}
            timeAgo="1 month ago"
            text="This has nothing to do with the business but I hate the new parking rules on this street. The city needs to fix this. Zero stars for the area."
            violation={{ label: 'Off Topic', color: 'bg-orange-50 text-orange-700 border border-orange-100' }}
            confidence={94}
            isThreat={true}
          />
          <MockReviewCard
            name="Alex R."
            rating={2}
            timeAgo="3 weeks ago"
            text="I own the shop across the street. They steal our customers with fake discounts. Terrible, dishonest business. Go somewhere else."
            violation={{ label: 'Conflict of Interest', color: 'bg-yellow-50 text-yellow-800 border border-yellow-100' }}
            confidence={91}
            isThreat={true}
          />
        </div>
      </div>

      {/* Blur overlay with gradient fade */}
      <div className="absolute inset-0 z-10" style={{
        background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.4) 30%, rgba(255,255,255,0.95) 70%, #ffffff 100%)',
      }} />
    </div>
  );
}

function BusinessScanInner({ scanMaxDepth }: { scanMaxDepth: number }) {
  const router = useRouter();
  const [pageState, setPageState] = useState<PageState>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('scanId') && params.get('token')) return 'scanning';
    }
    return 'search';
  });
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const [activeScanId, setActiveScanId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') return new URLSearchParams(window.location.search).get('scanId');
    return null;
  });
  const [activeScrapeId, setActiveScrapeId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionToken] = useState(() => {
    if (typeof window !== 'undefined') {
      const urlToken = new URLSearchParams(window.location.search).get('token');
      if (urlToken) {
        sessionStorage.setItem(SESSION_TOKEN_KEY, urlToken);
        return urlToken;
      }
    }
    return getOrCreateSessionToken();
  });
  const [authCompleted, setAuthCompleted] = useState(false);
  const [resultsUrl, setResultsUrl] = useState<string | null>(null);

  const handleAuthSuccess = useCallback((url: string) => {
    setResultsUrl(url);
    setAuthCompleted(true);
  }, []);

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
      const res = await fetch('/api/public/scanner/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          placeId: selectedPlace.placeId,
          keyword: selectedPlace.name,
          depth: computeScanDepthForPlace(selectedPlace.totalReviews, scanMaxDepth),
          sortBy: 'lowest_rating',
          sessionToken,
          place: {
            googlePlaceId: selectedPlace.placeId,
            name: selectedPlace.name,
            address: selectedPlace.address,
            rating: selectedPlace.rating,
            totalReviews: selectedPlace.totalReviews,
            primaryType: selectedPlace.primaryType,
            phone: selectedPlace.phone,
            website: selectedPlace.website,
          },
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
    if (!activeScanId) return;
    if (authCompleted) {
      router.push(`/app/scanner/${activeScanId}`);
      return;
    }
    setPageState('complete');
  }, [activeScanId, authCompleted, router]);

  useEffect(() => {
    if (pageState === 'complete' && activeScanId && authCompleted) {
      router.push(`/app/scanner/${activeScanId}`);
    }
  }, [pageState, activeScanId, authCompleted, router]);

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
    setAuthCompleted(false);
    setResultsUrl(null);
  };

  const statusApiUrl = `/api/public/scanner/scrape-status?sessionToken=${encodeURIComponent(sessionToken)}`;

  return (
    <div className="space-y-8 px-2 md:px-6 py-6 max-w-7xl mx-auto">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Search State — Hero + Form + Mock Report */}
      {pageState === 'search' && (
        <div className="space-y-12 pb-12">
          {/* Hero Section */}
          <div className="text-center max-w-6xl mx-auto pt-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-8 border border-primary-100 shadow-sm">
              <Radar className="h-4 w-4" />
              Free AI-Powered Review Scanner
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-secondary-900 tracking-tight mb-6 leading-[1.1]">
              Discover which reviews are <span className="text-red-600">killing your rankings</span> & <span className="text-primary-600">costing you customers</span>
            </h1>
            <p className="text-xl text-secondary-600 max-w-4xl mx-auto leading-relaxed">
              Scan your business reviews to see which are hurting your rankings, impressions and customer acquisition — then take action on getting them removed.
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-2xl mx-auto relative z-10">
            <div className="bg-white p-1 rounded-3xl shadow-2xl shadow-secondary-200/50 border border-secondary-100">
              <div className="bg-white rounded-[20px] p-6 md:p-8 border border-secondary-50">
                <label className="block text-sm font-bold text-secondary-700 mb-3 uppercase tracking-wide">
                  Enter Business Name
                </label>
                <BusinessSearch
                  onSelect={handlePlaceSelect}
                  placesApiUrl="/api/public/scanner/places"
                />
                <p className="text-xs text-secondary-400 mt-4 text-center flex items-center justify-center gap-1.5">
                  <Shield className="h-3 w-3" />
                  100% Free & Secure • No Credit Card Required
                </p>
              </div>
            </div>
          </div>

          {/* Mock Report Preview */}
          <div className="relative pt-8">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-secondary-200 to-transparent" />
            <MockReportPreview />
          </div>
        </div>
      )}

      {/* Compact header for non-search states */}
      {pageState !== 'search' && (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
            <Radar className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">Free Google Review Scan</h1>
            <p className="text-secondary-500">AI-powered threat detection for your business reviews</p>
          </div>
        </div>
      )}

      {/* Confirming State */}
      {pageState === 'confirming' && selectedPlace && (
        <div className="bg-white border border-secondary-200 rounded-2xl p-8">
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">Confirm Business</h2>

          <div className="bg-secondary-50 rounded-xl p-5 mb-6">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-secondary-900 text-lg">{selectedPlace.name}</p>
                <p className="text-secondary-500">{selectedPlace.address}</p>
                <div className="flex items-center gap-4 mt-2">
                  {selectedPlace.rating && (
                    <span className="flex items-center gap-1 text-sm text-secondary-600">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      {selectedPlace.rating}
                    </span>
                  )}
                  {selectedPlace.totalReviews != null && (
                    <span className="text-sm text-secondary-500">
                      {selectedPlace.totalReviews.toLocaleString()} reviews
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
              {isSubmitting ? 'Starting...' : 'Start Free Scan'}
            </button>
          </div>
        </div>
      )}

      {/* Dashboard button — shown in scanning + complete states once authenticated */}
      {authCompleted && resultsUrl && (pageState === 'scanning' || pageState === 'complete') && (
        <div className="bg-white border-2 border-green-200 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-secondary-900 mb-2">Account Created Successfully!</h2>
          <p className="text-secondary-500 mb-6">
            {pageState === 'scanning'
              ? 'Your scan is still running. You can view progress and results in your dashboard.'
              : 'Your scan is complete and your threat report is ready to view.'}
          </p>
          <a
            href={resultsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl bg-primary-600 text-white text-lg font-bold hover:bg-primary-500 transition-all shadow-lg hover:-translate-y-0.5"
          >
            Open Dashboard
            <ExternalLink className="h-5 w-5" />
          </a>
        </div>
      )}

      {/* Scanning State */}
      {pageState === 'scanning' && activeScanId && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ScanProgress
            scanId={activeScanId}
            scrapeId={activeScrapeId}
            onComplete={handleScanComplete}
            onError={handleScanError}
            statusApiUrl={statusApiUrl}
          />
          {!authCompleted && (
            <InlineAuthPrompt
              scanId={activeScanId}
              sessionToken={sessionToken}
              onAuthSuccess={handleAuthSuccess}
            />
          )}
        </div>
      )}

      {/* Complete State — only shown if NOT yet authenticated */}
      {pageState === 'complete' && activeScanId && !authCompleted && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-secondary-200 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-secondary-900 mb-2">Scan Complete!</h2>
            <p className="text-secondary-500 mb-6">
              Your review analysis is ready. Sign in with Google to view your full threat report.
            </p>
            <a
              href={`/app/scanner/${activeScanId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl border border-secondary-200 text-secondary-700 font-medium hover:bg-secondary-50 transition-colors text-sm"
            >
              <ExternalLink className="h-4 w-4" />
              View Scan Results
            </a>
          </div>
          <InlineAuthPrompt
            scanId={activeScanId}
            sessionToken={sessionToken}
            onAuthSuccess={handleAuthSuccess}
          />
        </div>
      )}
    </div>
  );
}

export default function BusinessScanClient({ scanMaxDepth }: { scanMaxDepth: number }) {
  return (
    <Suspense fallback={
      <div className="space-y-8 p-6 max-w-7xl mx-auto">
        <div className="h-12 bg-secondary-100 rounded-xl animate-pulse" />
        <div className="h-64 bg-white border border-secondary-200 rounded-2xl animate-pulse" />
      </div>
    }>
      <BusinessScanInner scanMaxDepth={scanMaxDepth} />
    </Suspense>
  );
}
