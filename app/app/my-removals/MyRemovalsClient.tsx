'use client';

import { useState } from 'react';
import RemovalRequestCard from '@/components/removal/RemovalRequestCard';
import StatusBadge from '@/components/removal/StatusBadge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  Mail,
  Phone,
  Globe,
  ExternalLink,
  AlertTriangle,
  FileText,
  Clock,
  User,
  CreditCard,
  Loader2,
} from 'lucide-react';

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

interface StatusEntry {
  status: string;
  changed_at: string;
  changed_by: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface RemovalRequest extends Record<string, any> {
  id: string;
  platform: string | null;
  review_url: string | null;
  review_content: string | null;
  review_author: string | null;
  removal_reason: string | null;
  description: string | null;
  evidence_urls: string[] | unknown;
  status: string;
  status_history: StatusEntry[] | unknown;
  contact_email: string;
  contact_phone: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
}

export default function MyRemovalsClient({ requests }: { requests: RemovalRequest[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const selected = requests.find((r) => r.id === selectedId) ?? null;

  async function handlePay(requestId: string) {
    setCheckoutLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ removal_request_id: requestId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setCheckoutLoading(false);
      }
    } catch {
      setCheckoutLoading(false);
    }
  }

  return (
    <>
      <div className="space-y-3">
        {requests.map((request) => (
          <RemovalRequestCard
            key={request.id}
            request={request}
            onSelect={(id) => setSelectedId(id)}
          />
        ))}
      </div>

      <Sheet open={!!selected} onOpenChange={(open) => { if (!open) setSelectedId(null); }}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  Request Details
                  <StatusBadge status={selected.status} />
                </SheetTitle>
              </SheetHeader>

              {selected.status === 'ready_for_payment' && (
                <div className="mt-4 rounded-xl border-2 border-primary-500 bg-primary-50 dark:bg-primary-950/20 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        Payment Required
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Complete payment to finalize and get this review removed.
                      </p>
                    </div>
                    <button
                      onClick={() => handlePay(selected.id)}
                      disabled={checkoutLoading}
                      className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors disabled:opacity-50 shrink-0"
                    >
                      {checkoutLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CreditCard className="h-4 w-4" />
                      )}
                      Pay $299
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-6 space-y-6">
                {/* Contact */}
                <Section title="Contact Info">
                  <DetailRow icon={Mail} label="Email" value={selected.contact_email} />
                  {selected.contact_phone && (
                    <DetailRow icon={Phone} label="Phone" value={selected.contact_phone} />
                  )}
                </Section>

                {/* Platform */}
                <Section title="Review Details">
                  <DetailRow
                    icon={Globe}
                    label="Platform"
                    value={PLATFORM_LABELS[selected.platform ?? ''] ?? selected.platform ?? 'N/A'}
                  />
                  {selected.review_author && (
                    <DetailRow icon={User} label="Review Author" value={selected.review_author} />
                  )}
                  {selected.review_url && (
                    <Button asChild variant="outline" size="sm" className="w-fit">
                      <a
                        href={selected.review_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        View Review
                      </a>
                    </Button>
                  )}
                  {selected.review_content && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                      {selected.review_content}
                    </p>
                  )}
                </Section>

                {/* Reason */}
                <Section title="Removal Reason">
                  <DetailRow
                    icon={AlertTriangle}
                    label="Reason"
                    value={REASON_LABELS[selected.removal_reason ?? ''] ?? selected.removal_reason ?? 'N/A'}
                  />
                  {selected.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400">{selected.description}</p>
                  )}
                </Section>

                {/* Evidence */}
                {Array.isArray(selected.evidence_urls) && selected.evidence_urls.length > 0 && (
                  <Section title="Evidence Files">
                    <div className="space-y-2">
                      {selected.evidence_urls.map((url: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                          <span className="truncate">{url.split('/').pop()}</span>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {/* Admin notes (visible to user) */}
                {selected.admin_notes && selected.admin_notes.trim() !== '' && (
                  <Section title="Notes from our team">
                    <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                      {selected.admin_notes}
                    </p>
                  </Section>
                )}

                {/* Timeline */}
                {Array.isArray(selected.status_history) && selected.status_history.length > 0 && (
                  <Section title="Status Timeline">
                    <div className="space-y-3">
                      {selected.status_history
                        .sort((a: StatusEntry, b: StatusEntry) => new Date(a.changed_at).getTime() - new Date(b.changed_at).getTime())
                        .map((entry: StatusEntry, i: number) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="mt-1">
                              <Clock className="h-4 w-4 text-slate-400" />
                            </div>
                            <div>
                              <StatusBadge status={entry.status} />
                              <p className="text-xs text-slate-400 mt-1">
                                {formatDate(entry.changed_at)}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </Section>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon className="h-4 w-4 text-slate-400 shrink-0" />
      <span className="text-slate-500">{label}:</span>
      <span className="text-slate-900 dark:text-white">{value}</span>
    </div>
  );
}
