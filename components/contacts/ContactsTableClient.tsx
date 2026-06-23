'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ExternalLink, Trash2, Loader2, ChevronUp, ChevronDown, Mail, CheckCircle, X, FileText, PenLine } from 'lucide-react';
import { toast } from 'sonner';
import {
  getMyContactsFiltered,
  getMyContactsFilteredAll,
  deleteContact,
  deleteContacts,
  type ContactSortBy,
} from '@/app/actions/contacts';
import { getContactListsWithCounts, assignContactsToList } from '@/app/actions/contact-lists';
import ContactDetailsModal from './ContactDetailsModal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { AIModelSelect, AI_CONTACT_MODELS } from '@/components/ui/ai-model-select';

type EmailSeriesEntry = {
  subject: string;
  body: string;
  created_at: string;
  model: string;
  prompt: string;
};

type Contact = {
  id: string;
  name: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  rating: number | null;
  total_reviews: number | null;
  primary_type: string | null;
  maps_url: string | null;
  created_at?: string;
  email_address?: string | null;
  contact_first_name?: string | null;
  contact_last_name?: string | null;
  email_validation_status?: string | null;
  email_series?: EmailSeriesEntry[] | null;
};

const PER_PAGE_OPTIONS = [10, 25, 50, 100];
const WRITE_EMAIL_PROMPT_CACHE_KEY = 'contacts_write_email_prompt';

export default function ContactsTableClient() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [appliedCity, setAppliedCity] = useState('');
  const [appliedState, setAppliedState] = useState('');
  const [appliedZip, setAppliedZip] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [sortBy, setSortBy] = useState<ContactSortBy>('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [exporting, setExporting] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'found' | 'not_found' | 'not_attempted' | ''>('');
  const [validationStatus, setValidationStatus] = useState<'validated' | 'not_valid' | 'not_attempted' | ''>('');
  const [listId, setListId] = useState('');
  const [appliedEmailStatus, setAppliedEmailStatus] = useState<'found' | 'not_found' | 'not_attempted' | undefined>(undefined);
  const [appliedValidationStatus, setAppliedValidationStatus] = useState<'validated' | 'not_valid' | 'not_attempted' | undefined>(undefined);
  const [appliedListId, setAppliedListId] = useState<string | undefined>(undefined);
  const [lists, setLists] = useState<{ id: string; name: string; contactCount: number }[]>([]);
  const [getEmailsModel, setGetEmailsModel] = useState(AI_CONTACT_MODELS[0]?.value ?? '');
  const [getEmailsLoading, setGetEmailsLoading] = useState(false);
  const [getEmailPendingId, setGetEmailPendingId] = useState<string | null>(null);
  const getEmailsAbortRef = useRef<AbortController | null>(null);
  const [validateEmailsLoading, setValidateEmailsLoading] = useState(false);
  const [validatePendingId, setValidatePendingId] = useState<string | null>(null);
  const [assignListOpen, setAssignListOpen] = useState(false);
  const [assignListId, setAssignListId] = useState('');
  const [assignListLoading, setAssignListLoading] = useState(false);
  const [viewContactId, setViewContactId] = useState<string | null>(null);
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => Promise<void>;
    loading?: boolean;
  }>({ open: false, title: '', description: '', onConfirm: async () => {} });

  const [writeEmailOpen, setWriteEmailOpen] = useState(false);
  const [writeEmailPrompt, setWriteEmailPrompt] = useState('');
  const [writeEmailModel, setWriteEmailModel] = useState(AI_CONTACT_MODELS[0]?.value ?? '');
  const [writeEmailLoading, setWriteEmailLoading] = useState(false);
  const [writeEmailProgress, setWriteEmailProgress] = useState({ done: 0, total: 0 });
  const writeEmailPromptRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (writeEmailOpen && typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(WRITE_EMAIL_PROMPT_CACHE_KEY);
        if (cached != null) setWriteEmailPrompt(cached);
      } catch {
        // ignore
      }
    }
  }, [writeEmailOpen]);

  const [emailSeriesContactId, setEmailSeriesContactId] = useState<string | null>(null);
  const emailSeriesContact = emailSeriesContactId ? contacts.find((c) => c.id === emailSeriesContactId) : null;

  useEffect(() => {
    getContactListsWithCounts().then(setLists).catch(() => {});
  }, []);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const { contacts: data, total: count } = await getMyContactsFiltered({
        search: appliedSearch.trim() || undefined,
        city: appliedCity.trim() || undefined,
        state: appliedState.trim() || undefined,
        zip: appliedZip.trim() || undefined,
        emailStatus: appliedEmailStatus,
        validationStatus: appliedValidationStatus,
        listId: appliedListId,
        page,
        perPage,
        sortBy,
        sortDir,
      });
      setContacts(data as Contact[]);
      setTotal(count);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to load contacts');
      setContacts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [appliedSearch, appliedCity, appliedState, appliedZip, appliedEmailStatus, appliedValidationStatus, appliedListId, page, perPage, sortBy, sortDir]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const applyFilters = () => {
    setAppliedSearch(search);
    setAppliedCity(city);
    setAppliedState(state);
    setAppliedZip(zip);
    setAppliedEmailStatus(emailStatus || undefined);
    setAppliedValidationStatus(validationStatus || undefined);
    setAppliedListId(listId || undefined);
    setPage(1);
  };

  const handleGetEmails = async () => {
    if (selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);
    setGetEmailsLoading(true);
    getEmailsAbortRef.current = new AbortController();
    const signal = getEmailsAbortRef.current.signal;
    let updated = 0;
    try {
      for (const id of ids) {
        if (signal.aborted) break;
        setGetEmailPendingId(id);
        let res: Response;
        let data: { updated?: number; error?: string; contacts?: Array<{ id: string; email_address: string | null; contact_first_name: string | null; contact_last_name: string | null }> };
        try {
          res = await fetch('/api/contacts/get-emails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contactIds: [id], model: getEmailsModel }),
            signal,
          });
          data = await res.json();
        } catch (err) {
          if ((err as Error).name === 'AbortError') throw err;
          setSelectedIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
          throw err;
        }
        if (signal.aborted) break;
        // Always uncheck this contact once we have a response (found or not)
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        if (!res.ok) throw new Error(data.error ?? 'Failed');
        updated += data.updated ?? 0;
        // Update local state so the row shows new email status immediately
        if (data.contacts?.length) {
          setContacts((prev) =>
            prev.map((c) => {
              const updatedContact = data.contacts!.find((u) => u.id === c.id);
              if (!updatedContact) return c;
              return {
                ...c,
                email_address: updatedContact.email_address,
                contact_first_name: updatedContact.contact_first_name,
                contact_last_name: updatedContact.contact_last_name,
              };
            })
          );
        }
        // Do not fetchContacts() here — it sets loading=true and hides the table/spinner
      }
      if (updated > 0) {
        toast.success(`Updated ${updated} contact(s).`);
      }
      // Do not refetch: keep the selected contacts in the current view so the user can see
      // each result (e.g. email → "Not found" or the address) even if they no longer match
      // the active filter (e.g. "Not attempted").
    } catch (e) {
      if ((e as Error).name === 'AbortError') {
        toast.info('Get emails cancelled.');
      } else {
        toast.error(e instanceof Error ? e.message : 'Get emails failed');
      }
    } finally {
      setGetEmailPendingId(null);
      setGetEmailsLoading(false);
      getEmailsAbortRef.current = null;
    }
  };

  const handleCancelGetEmails = () => {
    if (getEmailsAbortRef.current) {
      getEmailsAbortRef.current.abort();
    }
    setGetEmailPendingId(null);
  };

  const handleValidateEmails = async () => {
    if (selectedIds.size === 0) return;
    setValidateEmailsLoading(true);
    const ids = Array.from(selectedIds);
    let validated = 0;
    try {
      for (const id of ids) {
        setValidatePendingId(id);
        const res = await fetch('/api/contacts/validate-emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contactIds: [id] }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? 'Failed');
        validated += data.validated ?? 0;
        const status = (data.results?.[0] as { email_validation_status?: string } | undefined)?.email_validation_status ?? null;
        setContacts((prev) =>
          prev.map((c) => (c.id === id && status ? { ...c, email_validation_status: status } : c))
        );
      }
      if (validated > 0) toast.success(`Validated ${validated} contact(s).`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Validate failed');
    } finally {
      setValidatePendingId(null);
      setValidateEmailsLoading(false);
    }
  };

  const handleAssignToList = async () => {
    if (!assignListId || selectedIds.size === 0) return;
    setAssignListLoading(true);
    try {
      await assignContactsToList(Array.from(selectedIds), assignListId);
      toast.success('Contacts assigned to list.');
      setAssignListOpen(false);
      setAssignListId('');
      fetchContacts();
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Assign failed');
    } finally {
      setAssignListLoading(false);
    }
  };

  const handleWriteEmails = async () => {
    if (selectedIds.size === 0 || !writeEmailPrompt.trim()) return;
    const ids = Array.from(selectedIds);
    setWriteEmailLoading(true);
    setWriteEmailProgress({ done: 0, total: ids.length });
    let succeeded = 0;
    try {
      for (const id of ids) {
        const res = await fetch('/api/contacts/write-emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contactId: id, prompt: writeEmailPrompt, model: writeEmailModel }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          succeeded++;
          setContacts((prev) =>
            prev.map((c) => {
              if (c.id !== id) return c;
              const existing = Array.isArray(c.email_series) ? c.email_series : [];
              return { ...c, email_series: [...existing, data.email] };
            })
          );
        } else {
          toast.error(`Email failed for contact: ${data.error ?? 'Unknown error'}`);
        }
        setWriteEmailProgress((p) => ({ ...p, done: p.done + 1 }));
      }
      if (succeeded > 0) {
        toast.success(`Wrote emails for ${succeeded} contact(s).`);
      }
      try {
        if (typeof window !== 'undefined') localStorage.setItem(WRITE_EMAIL_PROMPT_CACHE_KEY, writeEmailPrompt);
      } catch {
        // ignore
      }
      setWriteEmailOpen(false);
      setWriteEmailPrompt('');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Write emails failed');
    } finally {
      setWriteEmailLoading(false);
    }
  };

  const insertShortcode = (shortcode: string) => {
    const textarea = writeEmailPromptRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = writeEmailPrompt;
    const tag = `{${shortcode}}`;
    setWriteEmailPrompt(text.substring(0, start) + tag + text.substring(end));
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + tag.length;
    }, 0);
  };

  const handleSort = (col: ContactSortBy) => {
    if (sortBy === col) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else setSortBy(col);
    setPage(1);
  };

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

  const handleDeleteOne = (id: string) => {
    setConfirmState({
      open: true,
      title: 'Remove contact',
      description: 'Are you sure you want to remove this contact?',
      onConfirm: async () => {
        await deleteContact(id);
        toast.success('Contact removed.');
        fetchContacts();
        router.refresh();
      },
    });
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    setConfirmState({
      open: true,
      title: 'Remove selected contacts',
      description: `Are you sure you want to remove ${selectedIds.size} contact(s)?`,
      onConfirm: async () => {
        await deleteContacts(Array.from(selectedIds));
        toast.success('Contacts removed.');
        setSelectedIds(new Set());
        fetchContacts();
        router.refresh();
      },
    });
  };

  const handleExportCsv = async () => {
    setExporting(true);
    try {
      const all = await getMyContactsFilteredAll({
        search: appliedSearch.trim() || undefined,
        city: appliedCity.trim() || undefined,
        state: appliedState.trim() || undefined,
        zip: appliedZip.trim() || undefined,
        emailStatus: appliedEmailStatus,
        validationStatus: appliedValidationStatus,
        listId: appliedListId,
        sortBy,
        sortDir,
      });
      if (all.length === 0) {
        toast.info('No contacts to export.');
        return;
      }
      const maxEmails = all.reduce((max, c) => {
        const series = Array.isArray((c as Contact).email_series) ? (c as Contact).email_series! : [];
        return Math.max(max, series.length);
      }, 0);
      const baseHeaders = ['Company', 'Name', 'Email', 'Address', 'Phone', 'Website', 'Reviews', 'Avg Rating', 'Maps URL'];
      const emailHeaders: string[] = [];
      for (let i = 1; i <= maxEmails; i++) {
        emailHeaders.push(`Subject ${i}`, `Email ${i}`);
      }
      const headers = [...baseHeaders, ...emailHeaders];
      const escape = (v: string | number | null | undefined) => {
        const s = String(v ?? '');
        return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
      };
      const rows = all.map((c) => {
        const base = [
          c.name,
          [c.contact_first_name, c.contact_last_name].filter(Boolean).join(' ') || '',
          c.email_address === 'not_found' ? 'Not found' : (c.email_address?.trim() ? c.email_address : 'Not Attempted'),
          c.address,
          c.phone,
          c.website,
          c.total_reviews,
          c.rating,
          c.maps_url,
        ];
        const series = Array.isArray((c as Contact).email_series) ? (c as Contact).email_series! : [];
        const emailCols: (string | null)[] = [];
        for (let i = 0; i < maxEmails; i++) {
          emailCols.push(series[i]?.subject ?? '', series[i]?.body ?? '');
        }
        return [...base, ...emailCols].map(escape).join(',');
      });
      const csv = [headers.join(','), ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contacts-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Export downloaded.');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Export failed');
    } finally {
      setExporting(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

  const inputClass =
    'px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-[#f3f4f6] dark:bg-slate-800';

  const SortIcon = ({ column }: { column: ContactSortBy }) =>
    sortBy === column ? (
      sortDir === 'asc' ? <ChevronUp className="h-4 w-4 inline ml-0.5" /> : <ChevronDown className="h-4 w-4 inline ml-0.5" />
    ) : null;

  return (
    <div className="space-y-4">
      {/* Search + filters: white card matching search-businesses */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-6 space-y-4">
        {/* Search */}
        <div>
          <label htmlFor="contacts-search" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              id="contacts-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              placeholder="Search by name or address..."
              className={`block w-full pl-9 pr-3 py-2 text-sm ${inputClass}`}
            />
          </div>
        </div>

        {/* Filter row 1: on mobile two columns except search (full width above) */}
        <div className="grid grid-cols-2 md:flex md:flex-wrap items-end gap-4">
          <div>
            <label htmlFor="contacts-city" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">City</label>
            <input
              id="contacts-city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City..."
              className={`text-sm w-32 ${inputClass}`}
            />
          </div>
          <div>
            <label htmlFor="contacts-state" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">State</label>
            <input
              id="contacts-state"
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="State..."
              className={`text-sm w-24 ${inputClass}`}
            />
          </div>
          <div>
            <label htmlFor="contacts-zip" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Zip Code</label>
            <input
              id="contacts-zip"
              type="text"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              placeholder="Zip Code..."
              className={`text-sm w-28 ${inputClass}`}
            />
          </div>
          <div>
            <label htmlFor="contacts-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
            <select
              id="contacts-email"
              value={emailStatus}
              onChange={(e) => setEmailStatus(e.target.value as typeof emailStatus)}
              className={`text-sm ${inputClass}`}
            >
              <option value="">Any</option>
              <option value="found">Found</option>
              <option value="not_found">Not found</option>
              <option value="not_attempted">Not attempted</option>
            </select>
          </div>
          <div>
            <label htmlFor="contacts-validation" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Validation</label>
            <select
              id="contacts-validation"
              value={validationStatus}
              onChange={(e) => setValidationStatus(e.target.value as typeof validationStatus)}
              className={`text-sm ${inputClass}`}
            >
              <option value="">Any</option>
              <option value="validated">Validated</option>
              <option value="not_valid">Not validated</option>
              <option value="not_attempted">Not attempted</option>
            </select>
          </div>
          <div>
            <label htmlFor="contacts-list" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">List</label>
            <select
              id="contacts-list"
              value={listId}
              onChange={(e) => setListId(e.target.value)}
              className={`text-sm min-w-[140px] ${inputClass}`}
            >
              <option value="">All</option>
              <option value="__no_list__">No List</option>
              {lists.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={applyFilters}
            className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Apply filters
          </button>
        </div>

        {/* Filter row 2: per page + Export */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500 dark:text-slate-400">Show</span>
            <select
              value={perPage}
              onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
              className={`text-sm ${inputClass} py-1.5`}
            >
              {PER_PAGE_OPTIONS.map((n) => (
                <option key={n} value={n}>{n} per page</option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={total === 0 || exporting}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-primary-600 text-primary-600 dark:text-primary-400 text-sm font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 disabled:opacity-50"
          >
            {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Export CSV ({total})
          </button>
        </div>
      </div>

      {/* Results summary + pagination */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500 dark:text-slate-400 max-w-full">
        <span className="min-w-0">
          Showing {from} to {to} of {total} results
        </span>
        <div className="flex items-center gap-1 min-w-0 max-w-full overflow-x-auto">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || loading}
            className="p-2 rounded border border-slate-300 dark:border-slate-600 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            ←
          </button>
          {(() => {
            const showPrev = 2;
            const showNext = 2;
            const start = Math.max(1, page - showPrev);
            const end = Math.min(totalPages, page + showNext);
            const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
            return pages.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                disabled={loading}
                className={`min-w-[2rem] py-2 px-2 rounded border text-sm font-medium ${
                  page === n
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                } disabled:opacity-50`}
              >
                {n}
              </button>
            ));
          })()}
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || loading}
            className="p-2 rounded border border-slate-300 dark:border-slate-600 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            →
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <p className="text-slate-600 dark:text-slate-400">No contacts yet.</p>
          <p className="text-sm text-slate-500 mt-1">
            Save contacts from <Link href="/app/admin/search-businesses" className="text-primary-600 dark:text-primary-400 hover:underline">Search Businesses</Link> or run an <Link href="/app/automations" className="text-primary-600 dark:text-primary-400 hover:underline">automation</Link>.
          </p>
        </div>
      ) : (
        <>
          {selectedIds.size > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleBulkDelete}
                className="text-sm font-medium text-red-600 dark:text-red-400 hover:underline"
              >
                Remove selected ({selectedIds.size})
              </button>
              <div className="flex items-center gap-2 border-l border-slate-200 pl-2">
                <AIModelSelect
                  value={getEmailsModel}
                  onChange={setGetEmailsModel}
                  className="text-sm border border-slate-300 rounded-lg px-2 py-1.5 bg-white dark:bg-slate-800"
                />
                <button
                  type="button"
                  onClick={handleGetEmails}
                  disabled={getEmailsLoading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-500 disabled:opacity-50"
                >
                  {getEmailsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                  Get Emails
                </button>
                {getEmailsLoading && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCancelGetEmails}
                    className="inline-flex items-center gap-1.5"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                )}
                <button
                  type="button"
                  onClick={handleValidateEmails}
                  disabled={validateEmailsLoading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary-600 text-primary-600 text-sm font-medium hover:bg-primary-50 disabled:opacity-50"
                >
                  {validateEmailsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                  Validate Emails
                </button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/app/contact-lists" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5">
                    Manage Lists
                  </Link>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAssignListOpen(true)}
                  className="inline-flex items-center gap-1.5"
                >
                  Assign to list
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setWriteEmailOpen(true)}
                  className="inline-flex items-center gap-1.5"
                >
                  <PenLine className="h-4 w-4" />
                  Write Email
                </Button>
              </div>
            </div>
          )}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-50 dark:bg-slate-800/80">
                <tr>
                  <th className="px-3 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="h-4 w-4 rounded border-slate-300 text-primary-600"
                    />
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    <button type="button" onClick={() => handleSort('name')} className="inline-flex items-center gap-0.5 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer">
                      Company <SortIcon column="name" />
                    </button>
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Name</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Email</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Validation</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Website</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider min-w-[7rem]">Phone</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    <button type="button" onClick={() => handleSort('total_reviews')} className="inline-flex items-center gap-0.5 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer">
                      Reviews <SortIcon column="total_reviews" />
                    </button>
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    <button type="button" onClick={() => handleSort('rating')} className="inline-flex items-center gap-0.5 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer">
                      Avg Rating <SortIcon column="rating" />
                    </button>
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Series</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    <button type="button" onClick={() => handleSort('created_at')} className="inline-flex items-center gap-0.5 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer">
                      Created <SortIcon column="created_at" />
                    </button>
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Act</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800/50 divide-y divide-slate-200 dark:divide-slate-700">
                {contacts.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/80">
                    <td className="px-3 py-3">
                      {getEmailPendingId === c.id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-primary-600" aria-label="Finding email..." />
                      ) : validatePendingId === c.id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-primary-600" aria-label="Validating..." />
                      ) : (
                        <input
                          type="checkbox"
                          checked={selectedIds.has(c.id)}
                          onChange={() => toggleSelect(c.id)}
                          className="h-4 w-4 rounded border-slate-300 text-primary-600"
                        />
                      )}
                    </td>
                    <td className="px-3 py-3 text-sm text-slate-900 dark:text-white">
                      <Link href={`/app/contact/${c.id}`} className="font-medium text-primary-600 dark:text-primary-400 hover:underline truncate block max-w-[200px]">
                        {c.name || '—'}
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-sm text-slate-500 dark:text-slate-400">
                      {[c.contact_first_name, c.contact_last_name].filter(Boolean).join(' ') || '—'}
                    </td>
                    <td className="px-3 py-3 text-sm text-slate-600 dark:text-slate-300">
                      {c.email_address === 'not_found' ? 'Not found' : (c.email_address?.trim() ? c.email_address : 'Not Attempted')}
                    </td>
                    <td className="px-3 py-3 text-sm">
                      {c.email_validation_status === 'validated' ? (
                        <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                          Valid
                        </span>
                      ) : c.email_validation_status === 'not_valid' ? (
                        <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                          Invalid
                        </span>
                      ) : c.email_validation_status === 'not_attempted' ? (
                        <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400">
                          Not attempted
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-3 py-3 text-sm">
                      {c.website ? (
                        <a href={c.website.startsWith('http') ? c.website : `https://${c.website}`} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-0.5">
                          <ExternalLink className="h-3.5 w-3.5" />
                          Link
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-3 py-3 text-sm text-slate-600 dark:text-slate-300 min-w-[7rem] whitespace-nowrap">{c.phone ?? '—'}</td>
                    <td className="px-3 py-3 text-sm text-slate-600 dark:text-slate-300">{c.total_reviews != null ? c.total_reviews.toLocaleString() : '—'}</td>
                    <td className="px-3 py-3 text-sm text-slate-600 dark:text-slate-300">{c.rating != null ? c.rating : '—'}</td>
                    <td className="px-3 py-3 text-sm">
                      {Array.isArray(c.email_series) && c.email_series.length > 0 ? (
                        <button
                          type="button"
                          onClick={() => setEmailSeriesContactId(c.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900/30"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          Emails ({c.email_series.length})
                        </button>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-3 py-3 text-sm text-slate-500 dark:text-slate-400">
                      {c.created_at ? new Date(c.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-3 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setViewContactId(c.id)}
                          className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteOne(c.id)}
                          className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <ContactDetailsModal
        contact={viewContactId ? (contacts.find((c) => c.id === viewContactId) ?? null) : null}
        open={!!viewContactId}
        onClose={() => setViewContactId(null)}
        onSaved={() => {
          fetchContacts();
          router.refresh();
        }}
      />

      <ConfirmModal
        open={confirmState.open}
        onOpenChange={(open) => setConfirmState((s) => ({ ...s, open }))}
        title={confirmState.title}
        description={confirmState.description}
        confirmLabel="Remove"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={confirmState.onConfirm}
      />

      <Dialog open={assignListOpen} onOpenChange={setAssignListOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Assign to list</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Choose a list to assign {selectedIds.size} selected contact(s) to.</p>
          <select
            value={assignListId}
            onChange={(e) => setAssignListId(e.target.value)}
            className="w-full rounded-lg border border-input px-3 py-2 text-sm"
          >
            <option value="">Select list</option>
            {lists.map((l) => (
              <option key={l.id} value={l.id}>{l.name} ({l.contactCount})</option>
            ))}
          </select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignListOpen(false)}>Cancel</Button>
            <Button onClick={handleAssignToList} disabled={!assignListId || assignListLoading}>
              {assignListLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={writeEmailOpen} onOpenChange={(open) => { if (!writeEmailLoading) setWriteEmailOpen(open); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Write Email for {selectedIds.size} contact(s)</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Prompt</label>
              <textarea
                ref={writeEmailPromptRef}
                value={writeEmailPrompt}
                onChange={(e) => setWriteEmailPrompt(e.target.value)}
                placeholder="Write a cold outreach email introducing our reputation management services..."
                rows={6}
                disabled={writeEmailLoading}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
              />
              <div className="flex flex-wrap gap-1.5">
                <span className="text-xs text-muted-foreground">Shortcodes:</span>
                {['company_name', 'contact_name', 'email_address', 'website', 'phone', 'reviews', 'average_rating', 'google_places_id'].map((sc) => (
                  <button
                    key={sc}
                    type="button"
                    onClick={() => insertShortcode(sc)}
                    disabled={writeEmailLoading}
                    className="px-1.5 py-0.5 rounded text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50"
                  >
                    {`{${sc}}`}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">AI Model</label>
              <AIModelSelect
                value={writeEmailModel}
                onChange={setWriteEmailModel}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            {writeEmailLoading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing {writeEmailProgress.done} of {writeEmailProgress.total} contacts...
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWriteEmailOpen(false)} disabled={writeEmailLoading}>Cancel</Button>
            <Button onClick={handleWriteEmails} disabled={writeEmailLoading || !writeEmailPrompt.trim()}>
              {writeEmailLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <PenLine className="h-4 w-4 mr-2" />}
              Write Emails
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!emailSeriesContactId} onOpenChange={(open) => { if (!open) setEmailSeriesContactId(null); }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Email Series — {emailSeriesContact?.name ?? 'Contact'}</DialogTitle>
          </DialogHeader>
          {emailSeriesContact?.email_series && emailSeriesContact.email_series.length > 0 ? (
            <div className="space-y-4">
              {emailSeriesContact.email_series.map((entry, i) => (
                <div key={i} className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email {i + 1}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(entry.created_at).toLocaleString()} · {entry.model}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-muted-foreground uppercase">Subject</span>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{entry.subject}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-muted-foreground uppercase">Body</span>
                    <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{entry.body}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-4">No emails written for this contact yet.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
