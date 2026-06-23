'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getContactListsWithCounts, createContactList, updateContactList, deleteContactList } from '@/app/actions/contact-lists';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConfirmModal } from '@/components/ui/confirm-modal';

type ListWithCount = { id: string; name: string; user_id: string; created_at: string; updated_at: string; contactCount: number };

export default function ContactListsClient() {
  const [lists, setLists] = useState<ListWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => Promise<void>;
  }>({ open: false, title: '', description: '', onConfirm: async () => {} });

  const fetchLists = async () => {
    setLoading(true);
    try {
      const data = await getContactListsWithCounts();
      setLists(data as ListWithCount[]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to load lists');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setName('');
    setModalOpen(true);
  };

  const openEdit = (list: ListWithCount) => {
    setEditingId(list.id);
    setName(list.name);
    setModalOpen(true);
  };

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error('Enter a list name');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await updateContactList(editingId, trimmed);
        toast.success('List updated.');
      } else {
        await createContactList(trimmed);
        toast.success('List created.');
      }
      setModalOpen(false);
      fetchLists();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    setConfirmState({
      open: true,
      title: 'Delete list',
      description: 'Delete this list? Contacts will not be deleted.',
      onConfirm: async () => {
        await deleteContactList(id);
        toast.success('List deleted.');
        fetchLists();
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          New list
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      ) : lists.length === 0 ? (
        <div className="rounded-xl border border-secondary-200 bg-secondary-50 p-8 text-center text-secondary-600">
          <p>No lists yet. Create one to organize your contacts.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {lists.map((list) => (
            <li
              key={list.id}
              className="flex items-center justify-between rounded-xl border border-secondary-200 bg-white p-4 hover:shadow-md transition-shadow"
            >
              <div>
                <p className="font-medium text-secondary-900">{list.name}</p>
                <p className="text-sm text-secondary-500">{list.contactCount} contacts</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(list)}
                  className="p-2 text-secondary-500 hover:text-primary-600 rounded-lg hover:bg-primary-50"
                  aria-label="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(list.id)}
                  className="p-2 text-secondary-500 hover:text-red-600 rounded-lg hover:bg-red-50"
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmModal
        open={confirmState.open}
        onOpenChange={(open) => setConfirmState((s) => ({ ...s, open }))}
        title={confirmState.title}
        description={confirmState.description}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={confirmState.onConfirm}
      />

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit list' : 'New list'}</DialogTitle>
          </DialogHeader>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="List name"
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!name.trim() || saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {editingId ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
