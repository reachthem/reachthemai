import type { Metadata } from 'next';
import { createSSRSassClient } from '@/lib/supabase/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import StatusBadge from '@/components/removal/StatusBadge';
import StatusUpdatePanel from '@/components/admin/removal/StatusUpdatePanel';
import AdminNotesPanel from '@/components/admin/removal/AdminNotesPanel';
import PaymentLinkPanel from '@/components/admin/removal/PaymentLinkPanel';
import {
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  ExternalLink,
  AlertTriangle,
  FileText,
  Image as ImageIcon,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Removal Request #${id.slice(0, 8)}`,
    description:
      'Admin: View and update this review removal request. Manage status, notes, and evidence for the case.',
    openGraph: {
      title: `Removal Request | Admin | Reach Them AI`,
      description: 'View and manage this removal request.',
      images: ['/featured.png'],
      type: 'website',
    },
  };
}

const PLATFORM_LABELS: Record<string, string> = {
  google: 'Google',
  yelp: 'Yelp',
  facebook: 'Facebook',
  trustpilot: 'Trustpilot',
  tripadvisor: 'TripAdvisor',
  other: 'Other',
};

const REASON_LABELS: Record<string, string> = {
  fake_review: 'Fake Review',
  violates_tos: 'Violates TOS',
  competitor: 'Competitor',
  spam: 'Spam',
  harassment: 'Harassment',
  not_sure: 'Not Sure',
  other: 'Other',
};

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
}

interface StatusEntry {
  status: string;
  changed_at: string;
  changed_by: string;
}

export default async function AdminRemovalRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) redirect('/app');

  const { data: request, error } = await supabase
    .from('removal_requests')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !request) notFound();

  // Resolve report place id from review_url (review -> scan -> profile -> google_place_id)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adminClient = (await createServerAdminClient()) as any;
  let reportPlaceId: string | null = null;
  if (request.review_url) {
    const { data: matchedReview } = await adminClient
      .from('scanned_reviews')
      .select('scan_id')
      .eq('review_url', request.review_url)
      .limit(1)
      .maybeSingle();

    const scanId = matchedReview?.scan_id as string | undefined;
    if (scanId) {
      const { data: matchedScan } = await adminClient
        .from('business_scans')
        .select('business_profile_id')
        .eq('id', scanId)
        .maybeSingle();

      const businessProfileId = matchedScan?.business_profile_id as string | undefined;
      if (businessProfileId) {
        const { data: matchedProfile } = await adminClient
          .from('business_profiles')
          .select('google_place_id')
          .eq('id', businessProfileId)
          .maybeSingle();

        reportPlaceId = (matchedProfile?.google_place_id as string | undefined) ?? null;
      }
    }
  }

  // Generate signed URLs for evidence files
  const evidenceUrls = (request.evidence_urls as string[]) ?? [];
  const signedEvidence: { path: string; url: string }[] = [];
  for (const path of evidenceUrls) {
    const { data } = await supabase.storage.from('removal-evidence').createSignedUrl(path, 3600);
    if (data?.signedUrl) {
      signedEvidence.push({ path, url: data.signedUrl });
    }
  }

  const statusHistory = (request.status_history as unknown as StatusEntry[]) ?? [];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/app/admin/removal-requests">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Requests
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Removal Request
              </h1>
              <StatusBadge status={request.status} />
            </div>
            <p className="text-xs text-slate-400">ID: {request.id}</p>
            <p className="text-xs text-slate-400">Submitted: {formatDate(request.created_at)}</p>
          </div>

          {/* Contact Info */}
          <DetailSection title="Contact Info">
            <div className="space-y-2">
              <DetailRow icon={Mail} value={request.contact_email} />
              {request.contact_phone && <DetailRow icon={Phone} value={request.contact_phone} />}
            </div>
          </DetailSection>

          {/* Review Details */}
          <DetailSection title="Review Details">
            <div className="space-y-3">
              <DetailRow icon={Globe} value={PLATFORM_LABELS[request.platform ?? ''] ?? request.platform ?? 'N/A'} />
              {request.review_url && (
                <Button asChild variant="outline" size="sm" className="w-fit">
                  <a
                    href={request.review_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Review
                  </a>
                </Button>
              )}
              {request.review_content && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm text-slate-600 dark:text-slate-400">
                  {request.review_content}
                </div>
              )}
            </div>
          </DetailSection>

          {/* Removal Reason */}
          <DetailSection title="Removal Reason">
            <div className="space-y-2">
              <DetailRow icon={AlertTriangle} value={REASON_LABELS[request.removal_reason ?? ''] ?? request.removal_reason ?? 'N/A'} />
              {request.description && (
                <p className="text-sm text-slate-600 dark:text-slate-400">{request.description}</p>
              )}
            </div>
          </DetailSection>

          {/* Evidence */}
          {signedEvidence.length > 0 && (
            <DetailSection title="Evidence Files">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {signedEvidence.map((file, i) => {
                  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(file.path);
                  return (
                    <a
                      key={i}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary-400 transition-colors"
                    >
                      {isImage ? (
                        <ImageIcon className="h-8 w-8 text-blue-500 mb-2" />
                      ) : (
                        <FileText className="h-8 w-8 text-orange-500 mb-2" />
                      )}
                      <span className="text-xs text-slate-600 dark:text-slate-400 truncate w-full text-center">
                        {file.path.split('/').pop()}
                      </span>
                    </a>
                  );
                })}
              </div>
            </DetailSection>
          )}

          {/* Status Timeline */}
          {statusHistory.length > 0 && (
            <DetailSection title="Status Timeline">
              <div className="relative pl-6 space-y-4">
                <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-700" />
                {statusHistory
                  .sort((a, b) => new Date(a.changed_at).getTime() - new Date(b.changed_at).getTime())
                  .map((entry, i) => (
                    <div key={i} className="relative flex items-start gap-3">
                      <div className="absolute -left-4 mt-1.5 w-3 h-3 rounded-full bg-primary-500 border-2 border-white dark:border-slate-800" />
                      <div>
                        <StatusBadge status={entry.status} />
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(entry.changed_at)}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </DetailSection>
          )}
        </div>

        {/* Right column: Admin actions */}
        <div className="space-y-6">
          <PaymentLinkPanel
            requestId={request.id}
            status={request.status}
            reportPlaceId={reportPlaceId}
          />
          <StatusUpdatePanel
            requestId={request.id}
            currentStatus={request.status}
            adminUserId={user.id}
          />
          <AdminNotesPanel
            requestId={request.id}
            initialNotes={request.admin_notes ?? ''}
          />
        </div>
      </div>
    </div>
  );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
      <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">{title}</h2>
      {children}
    </div>
  );
}

function DetailRow({ icon: Icon, value }: { icon: typeof Mail; value: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-900 dark:text-white">
      <Icon className="h-4 w-4 text-slate-400 shrink-0" />
      {value}
    </div>
  );
}
