"use client";
import React, { useEffect, useState } from 'react';
import { useGlobal } from '@/lib/context/GlobalContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { TrendingUp, FileX, Radar, ArrowRight, MapPin, Brain, Star, ShieldAlert, Activity, Trash2, Eye } from 'lucide-react';
import GetStartedGuide from '@/components/app/GetStartedGuide';
import VideoDemoButton from '@/components/app/VideoDemoButton';
import Link from 'next/link';
import { getUserScans, getScanStats, deleteScan } from '@/app/actions/scanner';
import { getOnboardingStatus } from '@/app/actions/user-profile';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { toast } from 'sonner';

type ScanRecord = {
  id: string;
  created_at: string;
  reviews_found: number;
  threats_found: number;
  business_profiles: { id: string; name: string } | null;
};

type ScanStats = {
  scanId: string;
  businessName: string;
  address: string | null;
  phone: string | null;
  website: string | null;
  aggregateRating: number | null;
  starCounts: { 1: number; 2: number; 3: number; 4: number; 5: number };
  totalReviews: number;
};

const quickActions = [
    {
        title: 'Google Reviews',
        description: 'Scan your Google Business profile and analyze reviews',
        href: '/app/scanner',
        icon: Radar,
        color: 'text-amber-500',
        bg: 'bg-amber-50 dark:bg-amber-900/20',
        borderColor: 'border-amber-100 dark:border-amber-900',
    },
    {
        title: 'AI Removal Advisor',
        description: 'Get AI-guided removal strategies and step-by-step plans for negative reviews',
        href: '/app/removal-advisor',
        icon: Brain,
        color: 'text-primary-600',
        bg: 'bg-primary-50 dark:bg-primary-900/20',
        borderColor: 'border-primary-100 dark:border-primary-900',
    },
    {
        title: 'Track & Submit Professional Removal Requests',
        description: 'Submit a review for professional removal services and track previous submissions.',
        href: '/app/my-removals',
        icon: FileX,
        color: 'text-accent-500',
        bg: 'bg-accent-50 dark:bg-accent-900/20',
        borderColor: 'border-accent-100 dark:border-accent-900',
    },
];

export default function DashboardPage() {
    const { loading } = useGlobal();
    const [scans, setScans] = useState<ScanRecord[]>([]);
    const [companyStats, setCompanyStats] = useState<ScanStats[]>([]);
    const [statsLoading, setStatsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [scanToDelete, setScanToDelete] = useState<{ scanId: string; businessName: string } | null>(null);
    const [showGuide, setShowGuide] = useState(true);

    useEffect(() => {
        getOnboardingStatus()
            .then((status) => {
                setShowGuide(!status.hasScannedBusiness && !status.hasProSubmission && !status.hasAIAnalysis);
            })
            .catch(() => setShowGuide(true));
    }, []);

    useEffect(() => {
        getUserScans()
            .then((res) => setScans((res.scans ?? []) as ScanRecord[]))
            .catch(() => setScans([]));
    }, []);

    useEffect(() => {
        if (scans.length === 0) {
            setStatsLoading(false);
            return;
        }
        const byProfile = new Map<string, ScanRecord>();
        for (const s of scans) {
            const pid = s.business_profiles?.id ?? s.id;
            if (!byProfile.has(pid)) byProfile.set(pid, s);
        }
        const latest = Array.from(byProfile.values());
        Promise.all(latest.map((s) => getScanStats(s.id)))
            .then((results) => setCompanyStats(results.filter((r): r is ScanStats => r != null)))
            .finally(() => setStatsLoading(false));
    }, [scans]);

    const openDeleteModal = (scanId: string, businessName: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setScanToDelete({ scanId, businessName });
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!scanToDelete) return;
        setDeletingId(scanToDelete.scanId);
        try {
            await deleteScan(scanToDelete.scanId);
            setCompanyStats((prev) => prev.filter((s) => s.scanId !== scanToDelete.scanId));
            setScans((prev) => prev.filter((s) => s.id !== scanToDelete.scanId));
            toast.success('Scan deleted successfully');
            setScanToDelete(null);
        } catch (error) {
            console.error('Failed to delete scan:', error);
            toast.error('Failed to delete scan');
        } finally {
            setDeletingId(null);
        }
    };

    const singleCompany = companyStats.length === 1;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8 p-4 sm:p-6 w-full">
            {/* Get Started - when onboarding incomplete */}
            {showGuide && (
              <div className="flex flex-col gap-4">
                <div className="flex justify-center">
                  <VideoDemoButton />
                </div>
                <GetStartedGuide />
              </div>
            )}

            {/* Quick Actions - First Row */}
            <div>
                <h2 className="text-xl font-bold text-secondary-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary-600" />
                    Quick Actions
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {quickActions.map((action) => (
                        <Link
                            key={action.href}
                            href={action.href}
                            className={`group flex flex-col p-5 border rounded-2xl hover:shadow-md transition-all bg-white ${action.borderColor}`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className={`p-2.5 rounded-xl ${action.bg}`}>
                                    <action.icon className={`h-6 w-6 ${action.color}`} />
                                </div>
                                <ArrowRight className="h-5 w-5 text-secondary-300 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                            </div>
                            <h3 className="font-semibold text-secondary-900 mb-1">{action.title}</h3>
                            <p className="text-sm text-secondary-500 leading-relaxed">
                                {action.description}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Stats Overview - Only if single company (optional, keeping for now if useful context) */}
            {!statsLoading && singleCompany && companyStats[0] && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-secondary-200 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="p-3 rounded-full bg-primary-100 text-primary-600">
                                <Star className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-secondary-500">Aggregate Rating</p>
                                <h3 className="text-2xl font-bold text-secondary-900">
                                    {companyStats[0].aggregateRating != null ? companyStats[0].aggregateRating.toFixed(1) : '—'}
                                </h3>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-secondary-200 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="p-3 rounded-full bg-secondary-100 text-secondary-600">
                                <Activity className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-secondary-500">Total Reviews</p>
                                <h3 className="text-2xl font-bold text-secondary-900">{companyStats[0].totalReviews}</h3>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-secondary-200 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="p-3 rounded-full bg-accent-100 text-accent-600">
                                <ShieldAlert className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-secondary-500">Threats Found</p>
                                <h3 className="text-2xl font-bold text-secondary-900">
                                    {companyStats[0].starCounts[1] + companyStats[0].starCounts[2] + companyStats[0].starCounts[3]}
                                </h3>
                            </div>
                        </CardContent>
                    </Card>
                     <Card className="border-secondary-200 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-primary-50 to-white">
                        <CardContent className="p-6 flex flex-col justify-center h-full">
                            <Link href={`/app/scanner/${companyStats[0].scanId}`} className="text-primary-700 font-semibold hover:text-primary-900 flex items-center gap-2 group">
                                View Full Report
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                             <p className="text-xs text-primary-500 mt-1">Last updated recently</p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Main Grid: Your Locations (2/3) + Pro Tip (1/3) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Your Locations */}
                <div className="lg:col-span-2 space-y-6">
                    {!statsLoading && (
                        <Card className="border-secondary-200 shadow-sm h-fit">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold text-secondary-900 flex items-center gap-2">
                                    <Radar className="h-5 w-5 text-primary-600" />
                                    Your Locations
                                </CardTitle>
                                <CardDescription>
                                    Manage your scanned business profiles and view reports
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                {companyStats.length === 0 ? (
                                    <div className="p-8 text-center text-secondary-500">
                                        <p>No scans found. Start a new scan to monitor your reputation.</p>
                                        <Link href="/app/scanner" className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-700 font-medium">
                                            Start a Scan <ArrowRight className="ml-1 h-4 w-4" />
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-secondary-100">
                                        {companyStats.map((stat) => (
                                            <div
                                                key={stat.scanId}
                                                className="p-4 hover:bg-secondary-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h4 className="font-semibold text-secondary-900 line-clamp-1">
                                                            {stat.businessName}
                                                        </h4>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-sm mb-2">
                                                        <span className="font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                                                            {stat.aggregateRating != null ? stat.aggregateRating.toFixed(1) : '—'}
                                                        </span>
                                                        <span className="text-secondary-500">
                                                            {stat.totalReviews} reviews
                                                        </span>
                                                    </div>
                                                    {(stat.address || stat.phone) && (
                                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-secondary-400">
                                                            {stat.address && (
                                                                <span className="flex items-center gap-1">
                                                                    <MapPin className="h-3 w-3" /> {stat.address}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <Link href={`/app/scanner/${stat.scanId}`}>
                                                        <Button variant="outline" size="sm" className="h-9 gap-2 border-secondary-200 hover:bg-white hover:text-primary-600">
                                                            <Eye className="h-4 w-4" />
                                                            View Scan
                                                        </Button>
                                                    </Link>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-9 w-9 text-secondary-400 hover:text-red-600 hover:bg-red-50"
                                                        onClick={(e) => openDeleteModal(stat.scanId, stat.businessName, e)}
                                                        disabled={deletingId === stat.scanId}
                                                    >
                                                        {deletingId === stat.scanId ? (
                                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                        ) : (
                                                            <Trash2 className="h-4 w-4" />
                                                        )}
                                                        <span className="sr-only">Delete scan</span>
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right Column: Pro Tip (1/3) */}
                <div className="space-y-6">
                    {/* Pro Tip / Upsell Card */}
                    <div className="bg-[#FCD0A1]/20 border border-[#FCD0A1] rounded-2xl p-6 sticky top-24">
                        <h3 className="font-bold text-[#182825] mb-2 flex items-center gap-2">
                            <Brain className="h-5 w-5 text-orange-600" />
                            Pro Tip
                        </h3>
                        <p className="text-sm text-secondary-700 mb-4 leading-relaxed">
                            Responding to negative reviews within 24 hours increases the chance of removal or update by 33%.
                        </p>
                        <Link href="/app/removal-advisor" className="inline-flex items-center text-sm font-semibold text-orange-700 hover:text-orange-800 hover:underline">
                            Try AI Removal Advisor <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                    </div>
                </div>
            </div>

            <ConfirmModal
                open={deleteModalOpen}
                onOpenChange={(open) => {
                    setDeleteModalOpen(open);
                    if (!open) setScanToDelete(null);
                }}
                title="Delete scan"
                description={
                    scanToDelete
                        ? `Are you sure you want to delete the scan for "${scanToDelete.businessName}"? This action cannot be undone.`
                        : ''
                }
                confirmLabel="Delete"
                cancelLabel="Cancel"
                variant="danger"
                onConfirm={handleConfirmDelete}
                loading={deletingId !== null}
            />
        </div>
    );
}
