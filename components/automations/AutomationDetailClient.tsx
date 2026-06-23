'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pause, Play, Trash2, ExternalLink, Loader2, List } from 'lucide-react';
import { toast } from 'sonner';
import { updateAutomation, deleteAutomation } from '@/app/actions/automations';
import { deleteContact, deleteContacts, getAutomationContactsAll } from '@/app/actions/contacts';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import AutomationStats from '@/components/automations/AutomationStats';
import AutomationKeywordPhrasesModal from '@/components/automations/AutomationKeywordPhrasesModal';
import ContactDetailsModal, { type ContactForModal } from '@/components/contacts/ContactDetailsModal';

type Automation = {
  id: string;
  name: string | null;
  keyword_phrases: unknown;
  status: string;
  automatically_get_contact_data: boolean;
  contact_ai_model: string | null;
  current_keyword_index: number;
  created_at: string;
  max_contacts: number | null;
  contacts_found: number;
  total_runs?: number;
  credits_used?: number;
  emails_found?: number;
  emails_validated?: number;
};

type Contact = ContactForModal;

type Props = {
  automation: Automation;
  initialContacts: Contact[];
  totalContacts: number;
  page: number;
  perPage: number;
};

export default function AutomationDetailClient({
  automation,
  initialContacts,
  totalContacts,
  page,
  perPage,
}: Props) {
  const router = useRouter();
  const [contacts, setContacts] = useState(initialContacts);
  const [total, setTotal] = useState(totalContacts);
  const [status, setStatus] = useState(automation.status);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [viewContactId, setViewContactId] = useState<string | null>(null);
  const [keywordPhrasesOpen, setKeywordPhrasesOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    onConfirm: () => Promise<void>;
  }>({ open: false, title: '', description: '', confirmLabel: 'Confirm', onConfirm: async () => {} });

  const phrases = (automation.keyword_phrases as string[]) ?? [];
  const totalPages = Math.ceil(total / perPage);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = contacts.length > 0 && selectedIds.size === contacts.length;
  const handleSelectAll = () => {
    if (selectAll) setSelectedIds(new Set());
    else setSelectedIds(new Set(contacts.map((c) => c.id)));
  };

  const handlePause = async () => {
    setLoading(true);
    try {
      await updateAutomation(automation.id, { status: 'paused' });
      setStatus('paused');
      toast.success('Automation paused.');
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to pause');
    } finally {
      setLoading(false);
    }
  };

  const handleResume = async () => {
    setLoading(true);
    try {
      await updateAutomation(automation.id, { status: 'active' });
      setStatus('active');
      toast.success('Automation resumed.');
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to resume');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAutomation = () => {
    setConfirmState({
      open: true,
      title: 'Delete automation',
      description: 'Delete this automation? Contacts will remain in your saved contacts.',
      confirmLabel: 'Delete',
      onConfirm: async () => {
        setLoading(true);
        try {
          await deleteAutomation(automation.id);
          toast.success('Automation deleted.');
          router.push('/app/automations');
          router.refresh();
        } catch (e) {
          toast.error(e instanceof Error ? e.message : 'Failed to delete');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleDeleteContact = async (contactId: string) => {
    try {
      await deleteContact(contactId);
      setContacts((prev) => prev.filter((c) => c.id !== contactId));
      setTotal((t) => Math.max(0, t - 1));
      toast.success('Contact removed.');
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to delete');
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    const count = selectedIds.size;
    const ids = Array.from(selectedIds);
    setConfirmState({
      open: true,
      title: 'Remove selected contacts',
      description: `Are you sure you want to remove ${count} contact(s)?`,
      confirmLabel: 'Remove',
      onConfirm: async () => {
        setLoading(true);
        try {
          await deleteContacts(ids);
          setContacts((prev) => prev.filter((c) => !selectedIds.has(c.id)));
          setTotal((t) => Math.max(0, t - count));
          setSelectedIds(new Set());
          toast.success('Contacts removed.');
          router.refresh();
        } catch (e) {
          toast.error(e instanceof Error ? e.message : 'Failed to delete');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleExportCsv = async () => {
    try {
      const all = await getAutomationContactsAll(automation.id);
      if (all.length === 0) {
        toast.info('No contacts to export.');
        return;
      }
      const headers = ['Name', 'Address', 'Phone', 'Website', 'Rating', 'Reviews', 'Type', 'Maps URL'];
      const escape = (v: string | number | null | undefined) => {
        const s = String(v ?? '');
        return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
      };
      const rows = all.map((c) =>
        [c.name, c.address, c.phone, c.website, c.rating, c.total_reviews, c.primary_type, c.maps_url].map(escape).join(',')
      );
      const csv = [headers.join(','), ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `automation-${automation.id}-contacts-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Export downloaded.');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Export failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-secondary-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-secondary-900 mb-4">
          {(automation.name || phrases[0]) ?? 'Unnamed automation'}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-secondary-600 mb-4">
          <div><span className="font-medium text-secondary-700">Status:</span> {status === 'active' ? 'Active' : status === 'paused' ? 'Paused' : status}</div>
          <div><span className="font-medium text-secondary-700">Contact search:</span> {status === 'active' ? 'Active' : 'Inactive'}</div>
          <div><span className="font-medium text-secondary-700">Find contacts:</span> {automation.automatically_get_contact_data ? 'Enabled' : 'Not enabled'}</div>
          {automation.automatically_get_contact_data && automation.contact_ai_model && (
            <div><span className="font-medium text-secondary-700">AI model:</span> {automation.contact_ai_model}</div>
          )}
          <div><span className="font-medium text-secondary-700">Phrase:</span> {automation.current_keyword_index + 1} of {phrases.length}</div>
        </div>

        <AutomationStats
          totalRuns={automation.total_runs ?? 0}
          maxContacts={automation.max_contacts}
          contactsFound={automation.contacts_found ?? 0}
          creditsUsed={automation.credits_used ?? 0}
          automaticallyGetContactData={automation.automatically_get_contact_data}
          emailsFound={automation.emails_found ?? 0}
          emailsValidated={automation.emails_validated ?? 0}
          stackedOnMobile
        />

        <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-2 sm:justify-center sm:items-center mt-4">
          {status === 'active' ? (
            <button
              type="button"
              onClick={handlePause}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-secondary-200 text-sm font-medium text-secondary-700 hover:bg-secondary-50 disabled:opacity-50 w-full sm:w-auto"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Pause className="h-4 w-4" />}
              Pause
            </button>
          ) : status === 'paused' ? (
            <button
              type="button"
              onClick={handleResume}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 disabled:opacity-50 w-full sm:w-auto"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              Resume
            </button>
          ) : null}
          <Link
            href={`/app/automations/${automation.id}/edit`}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-secondary-200 text-secondary-700 font-medium hover:bg-secondary-50 w-full sm:w-auto"
          >
            Edit automation
          </Link>
          <button
            type="button"
            onClick={() => setKeywordPhrasesOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-secondary-200 text-secondary-700 font-medium hover:bg-secondary-50 w-full sm:w-auto"
          >
            <List className="h-4 w-4" />
            Keyword phrases
          </button>
          <button
            type="button"
            onClick={handleDeleteAutomation}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-accent-200 text-accent-600 font-medium hover:bg-accent-50 disabled:opacity-50 w-full sm:w-auto"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      <AutomationKeywordPhrasesModal
        open={keywordPhrasesOpen}
        onOpenChange={setKeywordPhrasesOpen}
        phrases={phrases}
        currentKeywordIndex={automation.current_keyword_index}
      />

      <div className="rounded-2xl border border-secondary-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="text-lg font-semibold text-secondary-900">Contacts ({total})</h2>
          {total > 0 && (
            <button
              type="button"
              onClick={handleExportCsv}
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              Export CSV
            </button>
          )}
        </div>
        {contacts.length === 0 ? (
          <p className="text-secondary-500 py-6">No contacts yet. The automation will add them as it runs.</p>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                {selectAll ? 'Deselect all' : 'Select all'}
              </button>
              {selectedIds.size > 0 && (
                <button
                  type="button"
                  onClick={handleBulkDelete}
                  disabled={loading}
                  className="text-sm font-medium text-accent-600 hover:text-accent-700 disabled:opacity-50"
                >
                  Remove selected ({selectedIds.size})
                </button>
              )}
            </div>
            <ul className="space-y-2">
              {contacts.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-secondary-100 bg-secondary-50/50"
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.has(c.id)}
                    onChange={() => toggleSelect(c.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setViewContactId(c.id)}
                    className="flex-1 min-w-0 text-left"
                  >
                    <span className="font-medium text-secondary-900 hover:underline truncate block">
                      {c.name || 'Unnamed'}
                    </span>
                    {c.address && <p className="text-sm text-secondary-500 truncate">{c.address}</p>}
                    {c.rating != null && <p className="text-xs text-secondary-400">Rating: {c.rating}</p>}
                  </button>
                  <div className="flex items-center gap-2 shrink-0">
                    {c.maps_url && (
                      <a href={c.maps_url} target="_blank" rel="noopener noreferrer" className="text-secondary-500 hover:text-primary-600" aria-label="Maps" onClick={(e) => e.stopPropagation()}>
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleDeleteContact(c.id); }}
                      className="p-1 text-secondary-500 hover:text-accent-600"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-secondary-500">
                Page {page} of {totalPages} · {perPage} per page
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary-500">Per page:</span>
                <select
                  value={perPage}
                  onChange={(e) => router.push(`/app/automations/${automation.id}?page=1&perPage=${e.target.value}`)}
                  className="text-sm border border-secondary-200 rounded-lg px-2 py-1 bg-white text-secondary-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20"
                >
                  {[25, 50, 100].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>
            {totalPages > 1 && (
              <div className="mt-2 flex justify-end">
                <div className="flex gap-2">
                  <Link
                    href={page > 1 ? `/app/automations/${automation.id}?page=${page - 1}&perPage=${perPage}` : '#'}
                    className={`text-sm font-medium ${page > 1 ? 'text-primary-600 hover:text-primary-700' : 'text-secondary-400 pointer-events-none'}`}
                  >
                    Previous
                  </Link>
                  <Link
                    href={page < totalPages ? `/app/automations/${automation.id}?page=${page + 1}&perPage=${perPage}` : '#'}
                    className={`text-sm font-medium ${page < totalPages ? 'text-primary-600 hover:text-primary-700' : 'text-secondary-400 pointer-events-none'}`}
                  >
                    Next
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <ContactDetailsModal
        contact={viewContactId ? (contacts.find((c) => c.id === viewContactId) ?? null) : null}
        open={!!viewContactId}
        onClose={() => setViewContactId(null)}
        onSaved={() => { router.refresh(); setViewContactId(null); }}
      />

      <ConfirmModal
        open={confirmState.open}
        onOpenChange={(open) => setConfirmState((s) => ({ ...s, open }))}
        title={confirmState.title}
        description={confirmState.description}
        confirmLabel={confirmState.confirmLabel}
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={confirmState.onConfirm}
      />
    </div>
  );
}

