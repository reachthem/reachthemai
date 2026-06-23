'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Loader2, ArrowRight, List } from 'lucide-react';
import AutomationStats from '@/components/automations/AutomationStats';
import AutomationKeywordPhrasesModal from '@/components/automations/AutomationKeywordPhrasesModal';
import { toast } from 'sonner';
import { updateAutomation, deleteAutomation } from '@/app/actions/automations';
import { getContactListsWithCounts } from '@/app/actions/contact-lists';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AIModelSelect, AI_CONTACT_MODELS } from '@/components/ui/ai-model-select';

type Automation = {
  id: string;
  name: string | null;
  keyword_phrases: unknown;
  status: string;
  automatically_get_contact_data: boolean;
  contact_ai_model: string | null;
  assign_to_list_id: string | null;
  validate_emails: boolean;
  do_not_add_without_contact: boolean;
  max_contacts: number | null;
  filter_rating_min: number | null;
  filter_has_website: string | null;
  filter_min_reviews: number | null;
  filter_max_reviews: number | null;
  search_radius_miles: number | null;
  total_runs?: number;
  contacts_found?: number;
  credits_used?: number;
  emails_found?: number;
  emails_validated?: number;
  current_keyword_index: number;
};

export default function AutomationEditClient({ automation }: { automation: Automation }) {
  const router = useRouter();
  const phrasesInitial = (automation.keyword_phrases as string[]) ?? [];

  const [name, setName] = useState(automation.name ?? '');
  const [phrases, setPhrases] = useState<string[]>(phrasesInitial);
  const [newPhrase, setNewPhrase] = useState('');
  const [automaticallyGetContactData, setAutomaticallyGetContactData] = useState(
    automation.automatically_get_contact_data ?? false
  );
  const [contactAiModel, setContactAiModel] = useState(
    automation.contact_ai_model ?? AI_CONTACT_MODELS[0]?.value ?? ''
  );
  const [assignToList, setAssignToList] = useState(!!automation.assign_to_list_id);
  const [assignToListId, setAssignToListId] = useState(automation.assign_to_list_id ?? '');
  const [validateEmails, setValidateEmails] = useState(automation.validate_emails ?? false);
  const [doNotAddWithoutContact, setDoNotAddWithoutContact] = useState(
    automation.do_not_add_without_contact ?? false
  );
  const [maxContacts, setMaxContacts] = useState(
    automation.max_contacts != null ? String(automation.max_contacts) : ''
  );
  const [filterRatingMin, setFilterRatingMin] = useState(
    automation.filter_rating_min != null ? String(automation.filter_rating_min) : ''
  );
  const [filterHasWebsite, setFilterHasWebsite] = useState(automation.filter_has_website ?? '');
  const [filterMinReviews, setFilterMinReviews] = useState(
    automation.filter_min_reviews != null ? String(automation.filter_min_reviews) : ''
  );
  const [filterMaxReviews, setFilterMaxReviews] = useState(
    automation.filter_max_reviews != null ? String(automation.filter_max_reviews) : ''
  );
  const [searchRadiusMiles, setSearchRadiusMiles] = useState(
    automation.search_radius_miles != null ? String(automation.search_radius_miles) : ''
  );

  const [lists, setLists] = useState<{ id: string; name: string; contactCount: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [aiOpen, setAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [keywordPhrasesOpen, setKeywordPhrasesOpen] = useState(false);
  const [status, setStatus] = useState(automation.status);

  useEffect(() => {
    getContactListsWithCounts().then(setLists).catch(() => {});
  }, []);

  useEffect(() => {
    const onFocus = () => getContactListsWithCounts().then(setLists).catch(() => {});
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  const addPhrase = () => {
    const t = newPhrase.trim();
    if (!t) return;
    setPhrases((prev) => [...prev, t]);
    setNewPhrase('');
  };

  const deletePhrase = (i: number) => {
    setPhrases((prev) => prev.filter((_, idx) => idx !== i));
    setEditingIndex(null);
  };

  const startEdit = (i: number) => {
    setEditingIndex(i);
    setEditValue(phrases[i] ?? '');
  };

  const saveEdit = () => {
    if (editingIndex == null) return;
    const t = editValue.trim();
    if (t) {
      setPhrases((prev) => {
        const next = [...prev];
        next[editingIndex] = t;
        return next;
      });
    }
    setEditingIndex(null);
    setEditValue('');
  };

  const saveBulk = () => {
    const lines = bulkText
      .split(/\n/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (lines.length) {
      setPhrases((prev) => [...prev, ...lines]);
      setBulkText('');
      setBulkOpen(false);
      toast.success(`Added ${lines.length} phrase(s).`);
    }
  };

  const openAiModal = () => setAiOpen(true);
  const closeAiModal = () => {
    setAiOpen(false);
    setAiPrompt('');
    setAiLoading(false);
  };

  const generateWithAi = async () => {
    const prompt = aiPrompt.trim();
    if (!prompt) return;
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/generate-keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed');
      if (data.text) {
        setBulkText((prev) => (prev ? `${prev}\n${data.text}` : data.text));
        closeAiModal();
        setBulkOpen(true);
        toast.success('Generated. Review and click Save in the bulk modal.');
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'AI generation failed');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phrases.length === 0) {
      toast.error('Add at least one keyword phrase.');
      return;
    }
    setLoading(true);
    try {
      await updateAutomation(automation.id, {
        name: name.trim() || null,
        keyword_phrases: phrases,
        max_contacts: maxContacts.trim() ? parseInt(maxContacts, 10) || null : null,
        automatically_get_contact_data: automaticallyGetContactData,
        contact_ai_model: automaticallyGetContactData ? contactAiModel : null,
        assign_to_list_id: assignToList && assignToListId ? assignToListId : null,
        validate_emails: validateEmails,
        do_not_add_without_contact: automaticallyGetContactData && validateEmails ? doNotAddWithoutContact : false,
        filter_rating_min: filterRatingMin.trim() ? parseFloat(filterRatingMin) || null : null,
        filter_has_website: filterHasWebsite.trim() || null,
        filter_min_reviews: filterMinReviews.trim() ? parseInt(filterMinReviews, 10) || null : null,
        filter_max_reviews: filterMaxReviews.trim() ? parseInt(filterMaxReviews, 10) || null : null,
        search_radius_miles: searchRadiusMiles.trim() ? parseFloat(searchRadiusMiles) || null : null,
      });
      toast.success('Automation updated.');
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update automation');
    } finally {
      setLoading(false);
    }
  };

  const handlePause = async () => {
    setLoading(true);
    try {
      await updateAutomation(automation.id, { status: 'paused' });
      toast.success('Automation paused.');
      router.push(`/app/automations/${automation.id}`);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResume = async () => {
    setLoading(true);
    try {
      await updateAutomation(automation.id, { status: 'active' });
      toast.success('Automation resumed.');
      router.push(`/app/automations/${automation.id}`);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
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
  };

  const inputClass =
    'w-full rounded-xl border border-secondary-200 bg-white px-4 py-2.5 text-secondary-900 placeholder:text-secondary-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed';
  const btnPrimary =
    'inline-flex items-center justify-center px-8 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-500 transition-all shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0';
  const btnSecondary =
    'px-6 py-3 rounded-xl border border-secondary-200 text-secondary-700 font-medium hover:bg-secondary-50 transition-colors';

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
    try {
      await updateAutomation(automation.id, { status: newStatus as 'active' | 'paused' | 'inactive' });
      toast.success('Status updated.');
      router.refresh();
    } catch (e) {
      setStatus(automation.status);
      toast.error(e instanceof Error ? e.message : 'Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-secondary-200 rounded-2xl p-8 shadow-sm">
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
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div>
            <Label className="text-sm font-medium text-secondary-700 block mb-1">Status</Label>
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full max-w-xs rounded-xl border border-secondary-200 bg-white px-4 py-2.5 text-secondary-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-secondary-900 mb-2">Basic information</h2>
            <Label className="text-sm font-medium text-secondary-700">Automation name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Head Shop - Jacksonville"
              className={`mt-1 ${inputClass}`}
            />
            <p className="text-xs text-secondary-500 mt-1">Give your automation a descriptive name.</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-secondary-900 mb-2">Keyword phrases</h2>
            <p className="text-secondary-500 mb-6">
              Add or edit search phrases. The automation will run a Google Places search for each phrase.
            </p>
            <div className="flex gap-3">
              <Input
                id="phrase"
                value={newPhrase}
                onChange={(e) => setNewPhrase(e.target.value)}
                placeholder="e.g. Restaurant St. Petersburg, FL"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPhrase())}
                className={inputClass}
              />
              <button
                type="button"
                onClick={addPhrase}
                className={`${btnSecondary} flex items-center gap-2 shrink-0`}
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <Label className="text-sm font-medium text-secondary-700">Added phrases ({phrases.length})</Label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setKeywordPhrasesOpen(true)}
                  className="text-sm font-medium text-secondary-600 hover:text-secondary-700"
                >
                  View keyword phrases
                </button>
                <button
                  type="button"
                  onClick={() => setBulkOpen(true)}
                  className="text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  Generate in bulk
                </button>
              </div>
            </div>
            {phrases.length === 0 ? (
              <p className="text-sm text-secondary-500 py-4 rounded-xl bg-secondary-50 border border-secondary-100 px-4">
                No phrases yet. Add one above or use Generate in bulk.
              </p>
            ) : (
              <ul className="space-y-3">
                {phrases.map((p, i) => (
                  <li
                    key={`${i}-${p}`}
                    className="flex items-center gap-3 p-4 rounded-xl border border-secondary-200 bg-white hover:shadow-md transition-shadow"
                  >
                    {editingIndex === i ? (
                      <>
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className={`flex-1 ${inputClass}`}
                          autoFocus
                        />
                        <button type="button" onClick={saveEdit} className={btnPrimary}>
                          Save
                        </button>
                        <button type="button" onClick={() => setEditingIndex(null)} className={btnSecondary}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1 text-sm text-secondary-900 truncate">{p}</span>
                        {i < automation.current_keyword_index && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 shrink-0">
                            Used to search
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => startEdit(i)}
                          className="p-2 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          aria-label="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deletePhrase(i)}
                          className="p-2 text-secondary-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-secondary-700">Maximum Number of Contacts</Label>
                <Input
                  type="number"
                  min={1}
                  value={maxContacts}
                  onChange={(e) => setMaxContacts(e.target.value)}
                  placeholder="Leave blank for all"
                  className={inputClass}
                />
                <p className="text-xs text-secondary-500">Maximum number of contacts to find (leave blank for all).</p>
              </div>

              <div className="flex items-center gap-3 py-2">
                <input
                  type="checkbox"
                  id="auto-contact"
                  checked={automaticallyGetContactData}
                  onChange={(e) => setAutomaticallyGetContactData(e.target.checked)}
                  className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500/20"
                />
                <Label htmlFor="auto-contact" className="text-secondary-700 cursor-pointer">
                  Automatically get contact data
                </Label>
              </div>
              {automaticallyGetContactData && (
                <div className="pl-6 space-y-2">
                  <Label className="text-sm font-semibold text-secondary-700 block">AI Model for Contact Retrieval</Label>
                  <AIModelSelect
                    value={contactAiModel}
                    onChange={setContactAiModel}
                    className="w-full max-w-md rounded-xl border border-secondary-200 bg-white px-4 py-2.5 text-secondary-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
                  />
                </div>
              )}

              <div className="flex items-center gap-3 py-2">
                <input
                  type="checkbox"
                  id="assign-list"
                  checked={assignToList}
                  onChange={(e) => setAssignToList(e.target.checked)}
                  className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500/20"
                />
                <Label htmlFor="assign-list" className="text-secondary-700 cursor-pointer">
                  Assign to list
                </Label>
              </div>
              {assignToList && (
                <div className="pl-6 space-y-2 flex flex-wrap items-center gap-2">
                  <select
                    value={assignToListId}
                    onChange={(e) => setAssignToListId(e.target.value)}
                    className="w-full max-w-md rounded-xl border border-secondary-200 bg-white px-4 py-2.5 text-secondary-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
                  >
                    <option value="">Select a List</option>
                    {lists.map((l) => (
                      <option key={l.id} value={l.id}>{l.name} ({l.contactCount} contacts)</option>
                    ))}
                  </select>
                  <a
                    href="/app/contact-lists"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 px-3 py-2 rounded-lg border border-secondary-200 hover:bg-secondary-50 ml-2.5"
                  >
                    <List className="h-4 w-4" /> Manage Lists
                  </a>
                </div>
              )}

              <div className="flex items-center gap-3 py-2">
                <input
                  type="checkbox"
                  id="validate-emails"
                  checked={validateEmails}
                  onChange={(e) => setValidateEmails(e.target.checked)}
                  className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500/20"
                />
                <Label htmlFor="validate-emails" className="text-secondary-700 cursor-pointer">
                  Validate email addresses
                </Label>
              </div>
              {automaticallyGetContactData && validateEmails && (
                <div className="pl-6 space-y-1">
                  <div className="flex items-center gap-3 py-2">
                    <input
                      type="checkbox"
                      id="do-not-add-without-contact"
                      checked={doNotAddWithoutContact}
                      onChange={(e) => setDoNotAddWithoutContact(e.target.checked)}
                      className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500/20"
                    />
                    <Label htmlFor="do-not-add-without-contact" className="text-secondary-700 cursor-pointer">
                      Do not add without contact
                    </Label>
                  </div>
                  <p className="text-xs text-secondary-500">
                    Do not add the contact if there is no email address found or it is not validated.
                  </p>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold text-secondary-900 mb-2">Contact filters</h2>
              <p className="text-sm text-secondary-500 mb-4">
                Only insert contacts that meet these conditions (leave blank to skip).
              </p>
              <div className="grid gap-4 sm:grid-cols-1">
                <div>
                  <Label className="text-sm font-medium text-secondary-700">Minimum rating</Label>
                  <Input
                    type="number"
                    min={0}
                    max={5}
                    step={0.1}
                    value={filterRatingMin}
                    onChange={(e) => setFilterRatingMin(e.target.value)}
                    placeholder="e.g. 3.5"
                    className={`mt-1 ${inputClass}`}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-secondary-700">Has website</Label>
                  <select
                    value={filterHasWebsite}
                    onChange={(e) => setFilterHasWebsite(e.target.value)}
                    className={`mt-1 ${inputClass}`}
                  >
                    <option value="">Any</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-secondary-700">Minimum reviews</Label>
                  <Input
                    type="number"
                    min={0}
                    value={filterMinReviews}
                    onChange={(e) => setFilterMinReviews(e.target.value)}
                    placeholder="e.g. 10"
                    className={`mt-1 ${inputClass}`}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-secondary-700">Maximum reviews</Label>
                  <Input
                    type="number"
                    min={0}
                    value={filterMaxReviews}
                    onChange={(e) => setFilterMaxReviews(e.target.value)}
                    placeholder="e.g. 500"
                    className={`mt-1 ${inputClass}`}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-secondary-700">Search radius (miles)</Label>
                  <Input
                    type="number"
                    min={0}
                    step={0.1}
                    value={searchRadiusMiles}
                    onChange={(e) => setSearchRadiusMiles(e.target.value)}
                    placeholder="Leave blank for default"
                    className={`mt-1 ${inputClass}`}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button type="submit" disabled={phrases.length === 0 || loading} className={btnPrimary}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save changes
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            <Link href={`/app/automations/${automation.id}`} className={btnSecondary}>
              Cancel
            </Link>
            {automation.status === 'active' && (
              <button
                type="button"
                onClick={handlePause}
                disabled={loading}
                className="px-6 py-3 rounded-xl border border-secondary-200 text-secondary-700 font-medium hover:bg-secondary-50 disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Pause
              </button>
            )}
            {automation.status === 'paused' && (
              <button
                type="button"
                onClick={handleResume}
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-500 disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Resume
              </button>
            )}
            <button
              type="button"
              onClick={() => setDeleteConfirmOpen(true)}
              disabled={loading}
              className="px-6 py-3 rounded-xl border border-red-200 text-red-600 font-medium hover:bg-red-50 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4 inline mr-2" />
              Delete automation
            </button>
          </div>
        </form>
      </div>

      {/* Bulk modal */}
      <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-secondary-900">Generate in bulk</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-secondary-500">Enter one keyword phrase per line, then click Save.</p>
          <Textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder={'Restaurant Miami FL\nPizza Tampa FL\n...'}
            rows={8}
            className="font-mono text-sm rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          />
          <div className="flex justify-between items-center gap-4">
            <button
              type="button"
              onClick={openAiModal}
              className="px-6 py-3 rounded-xl border border-secondary-200 text-secondary-700 font-medium hover:bg-secondary-50 transition-colors"
            >
              Generate with AI
            </button>
            <DialogFooter>
              <button type="button" onClick={saveBulk} className={btnPrimary}>
                Save
              </button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI modal */}
      <Dialog open={aiOpen} onOpenChange={(open) => !open && closeAiModal()}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-secondary-900">Generate with AI</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-secondary-500">
            e.g. &quot;Give me a list of cities in Florida prepended with the word Restaurant, one per line&quot;
          </p>
          <Textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="Give me a list of cities in Florida prepended with the word Restaurant, one per line"
            rows={4}
            className="rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          />
          <DialogFooter>
            <button type="button" onClick={closeAiModal} className={btnSecondary}>
              Cancel
            </button>
            <button
              type="button"
              onClick={generateWithAi}
              disabled={!aiPrompt.trim() || aiLoading}
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-500 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {aiLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Generate with AI
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AutomationKeywordPhrasesModal
        open={keywordPhrasesOpen}
        onOpenChange={setKeywordPhrasesOpen}
        phrases={phrases}
        currentKeywordIndex={automation.current_keyword_index}
      />

      <ConfirmModal
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete automation"
        description="Delete this automation? Saved contacts will remain."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleConfirmDelete}
        loading={loading}
      />
    </div>
  );
}
