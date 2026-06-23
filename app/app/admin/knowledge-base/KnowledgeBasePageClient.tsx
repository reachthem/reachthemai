'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { formatDistanceToNow, differenceInDays } from 'date-fns';
import KnowledgeBaseEntryForm from '@/components/admin/KnowledgeBaseEntryForm';
import { toggleKnowledgeBaseActive, deleteKnowledgeBaseEntry } from '@/app/actions/admin-knowledge-base';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import type { Tables } from '@/lib/types';

type Entry = Tables<'removal_knowledge_base'>;

const PLATFORM_LABELS: Record<string, string> = {
  google: 'Google',
  yelp: 'Yelp',
  facebook: 'Facebook',
  trustpilot: 'Trustpilot',
  other: 'Other',
};

interface Props {
  entries: Entry[];
}

export default function KnowledgeBasePageClient({ entries: initialEntries }: Props) {
  const router = useRouter();
  const [entries, setEntries] = useState(initialEntries);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deleteConfirmState, setDeleteConfirmState] = useState<{
    open: boolean;
    entryId: string | null;
  }>({ open: false, entryId: null });

  const platforms = [...new Set(entries.map((e) => e.platform))];

  async function handleToggleActive(id: string, current: boolean | null) {
    const newValue = !(current ?? true);
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, is_active: newValue } : e))
    );
    try {
      await toggleKnowledgeBaseActive(id, newValue);
    } catch {
      setEntries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, is_active: current } : e))
      );
    }
  }

  function handleDelete(id: string) {
    setDeleteConfirmState({ open: true, entryId: id });
  }

  function handleFormSuccess() {
    setEditingEntry(null);
    setShowCreateForm(false);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Removal Knowledge Base</h1>
          <p className="text-sm text-[var(--color-muted)]">
            Manage platform-specific removal policies and step-by-step instructions
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Add Entry
        </button>
      </div>

      {/* Create/Edit form modal */}
      {(showCreateForm || editingEntry) && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">
            {editingEntry ? 'Edit Entry' : 'New Entry'}
          </h2>
          <KnowledgeBaseEntryForm
            entry={editingEntry ?? undefined}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setEditingEntry(null);
              setShowCreateForm(false);
            }}
          />
        </div>
      )}

      {/* Entries grouped by platform */}
      {platforms.map((platform) => (
        <div key={platform} className="space-y-3">
          <h2 className="text-lg font-semibold">
            {PLATFORM_LABELS[platform] || platform}
          </h2>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Ground</th>
                  <th className="px-4 py-3 font-medium">Criteria (preview)</th>
                  <th className="px-4 py-3 font-medium">Last Verified</th>
                  <th className="px-4 py-3 font-medium">Active</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {entries
                  .filter((e) => e.platform === platform)
                  .map((entry) => {
                    const isOutdated = entry.last_verified
                      ? differenceInDays(new Date(), new Date(entry.last_verified)) > 90
                      : true;
                    return (
                      <tr key={entry.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{entry.ground_label}</td>
                        <td className="max-w-[250px] px-4 py-3">
                          <span className="line-clamp-2 text-xs text-gray-600">
                            {entry.qualification_criteria}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs ${isOutdated ? 'font-semibold text-red-500' : 'text-gray-500'}`}>
                            {entry.last_verified
                              ? formatDistanceToNow(new Date(entry.last_verified), { addSuffix: true })
                              : 'Never'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleToggleActive(entry.id, entry.is_active)}
                            className={`relative h-5 w-9 rounded-full transition-colors ${
                              entry.is_active ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                                entry.is_active ? 'translate-x-4' : ''
                              }`}
                            />
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingEntry(entry)}
                              className="text-[var(--color-primary)] hover:opacity-70"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(entry.id)}
                              className="text-red-400 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <ConfirmModal
        open={deleteConfirmState.open}
        onOpenChange={(open) => setDeleteConfirmState((s) => ({ ...s, open, ...(open ? {} : { entryId: null }) }))}
        title="Delete knowledge base entry"
        description="Are you sure you want to delete this knowledge base entry?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={async () => {
          const id = deleteConfirmState.entryId;
          if (!id) return;
          await deleteKnowledgeBaseEntry(id);
          setEntries((prev) => prev.filter((e) => e.id !== id));
        }}
      />
    </div>
  );
}
