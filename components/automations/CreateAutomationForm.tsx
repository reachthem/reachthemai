'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, Loader2, ArrowRight, List } from 'lucide-react';
import { toast } from 'sonner';
import { createAutomation } from '@/app/actions/automations';
import { getContactListsWithCounts } from '@/app/actions/contact-lists';
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

export default function CreateAutomationForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phrases, setPhrases] = useState<string[]>([]);
  const [newPhrase, setNewPhrase] = useState('');
  const [automaticallyGetContactData, setAutomaticallyGetContactData] = useState(false);
  const [contactAiModel, setContactAiModel] = useState(AI_CONTACT_MODELS[0]?.value ?? '');
  const [assignToList, setAssignToList] = useState(false);
  const [assignToListId, setAssignToListId] = useState<string>('');
  const [validateEmails, setValidateEmails] = useState(false);
  const [doNotAddWithoutContact, setDoNotAddWithoutContact] = useState(false);
  const [maxContacts, setMaxContacts] = useState<string>('');
  const [lists, setLists] = useState<{ id: string; name: string; contactCount: number }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [aiOpen, setAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

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

  const buildPayload = () => ({
    name: name.trim() || undefined,
    keyword_phrases: phrases,
    automatically_get_contact_data: automaticallyGetContactData,
    contact_ai_model: automaticallyGetContactData ? contactAiModel : undefined,
    assign_to_list_id: assignToList && assignToListId ? assignToListId : undefined,
    validate_emails: validateEmails,
    do_not_add_without_contact: automaticallyGetContactData && validateEmails ? doNotAddWithoutContact : false,
    max_contacts: maxContacts.trim() ? parseInt(maxContacts, 10) || undefined : undefined,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phrases.length === 0) {
      toast.error('Add at least one keyword phrase.');
      return;
    }
    setSubmitting(true);
    try {
      await createAutomation({ ...buildPayload(), run_after_create: true });
      toast.success('Automation created and running.');
      router.push('/app/automations');
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create automation');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveOnly = async () => {
    if (phrases.length === 0) {
      toast.error('Add at least one keyword phrase.');
      return;
    }
    setSubmitting(true);
    try {
      await createAutomation({ ...buildPayload(), run_after_create: false });
      toast.success('Automation saved. You can run it later from the automations list.');
      router.push('/app/automations');
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save automation');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-secondary-200 bg-white px-4 py-2.5 text-secondary-900 placeholder:text-secondary-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed';
  const btnPrimary =
    'inline-flex items-center justify-center px-8 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-500 transition-all shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0';
  const btnSecondary =
    'px-6 py-3 rounded-xl border border-secondary-200 text-secondary-700 font-medium hover:bg-secondary-50 transition-colors';

  return (
    <div className="bg-white border border-secondary-200 rounded-2xl p-8 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
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
            Add search phrases (e.g. Restaurant St. Petersburg, FL). The automation will run a Google Places search for each phrase. Add one above or use Generate in Bulk below.
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
            <button
              type="button"
              onClick={() => setBulkOpen(true)}
              className={`${btnSecondary} shrink-0`}
            >
              Generate in Bulk
            </button>
          </div>
          {phrases.length === 0 ? (
            <p className="text-sm text-secondary-500 py-4 rounded-xl bg-secondary-50 border border-secondary-100 px-4">
              No phrases yet. Add one above or use Generate in Bulk.
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
            <Label className="block text-sm font-semibold text-secondary-700">AI model for contact retrieval</Label>
            <AIModelSelect
              value={contactAiModel}
              onChange={setContactAiModel}
              className="block w-full max-w-md rounded-xl border border-secondary-200 bg-white px-4 py-2.5 text-secondary-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
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
          <div className="pl-6 space-y-2">
            <select
              value={assignToListId}
              onChange={(e) => setAssignToListId(e.target.value)}
              className="w-full max-w-md rounded-xl border border-secondary-200 bg-white px-4 py-2.5 text-secondary-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
            >
              <option value="">Select a list</option>
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

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.push('/app/automations')}
            className={btnSecondary}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveOnly}
            disabled={phrases.length === 0 || submitting}
            className={btnSecondary}
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Save only
          </button>
          <button
            type="submit"
            disabled={phrases.length === 0 || submitting}
            className={btnPrimary}
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Create and Run
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </form>

      {/* Bulk modal */}
      <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-secondary-900">Generate in Bulk</DialogTitle>
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
              <button
                type="button"
                onClick={saveBulk}
                className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-500 transition-all shadow-lg"
              >
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
            <button
              type="button"
              onClick={closeAiModal}
              className="px-6 py-3 rounded-xl border border-secondary-200 text-secondary-700 font-medium hover:bg-secondary-50 transition-colors"
            >
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
    </div>
  );
}
