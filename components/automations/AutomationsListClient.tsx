'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Play, List, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { deleteAutomation } from '@/app/actions/automations';
import AutomationStats from '@/components/automations/AutomationStats';
import { ConfirmModal } from '@/components/ui/confirm-modal';

type Automation = {
  id: string;
  name: string | null;
  keyword_phrases: string[] | unknown;
  status: string;
  max_contacts: number | null;
  contacts_found: number;
  total_runs: number;
  credits_used: number;
  assign_to_list_id: string | null;
  automatically_get_contact_data: boolean;
  contact_ai_model: string | null;
  current_keyword_index: number;
  emails_found?: number;
  emails_validated?: number;
};

interface AutomationsListClientProps {
  automations: Automation[];
}

export default function AutomationsListClient({ automations }: AutomationsListClientProps) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteAutomation(deleteTarget.id);
      toast.success('Automation deleted.');
      setDeleteTarget(null);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to delete');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
    <ul className="space-y-6">
      {automations.map((a) => {
        const phrases = (a.keyword_phrases as string[]) ?? [];
        const completed = phrases.length ? Math.min(a.current_keyword_index, phrases.length) : 0;

        return (
          <li
            key={a.id}
            className="rounded-2xl border border-secondary-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col gap-4 mb-4">
              <div>
                <h2 className="text-lg font-bold text-secondary-900">
                  {a.name || (phrases[0] ?? 'Unnamed automation')}
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-secondary-500">
                  <span>{completed}/{phrases.length} Completed</span>
                  {a.assign_to_list_id && (
                    <>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-100 text-secondary-700">
                        <List className="h-3.5 w-3.5" />
                        List assigned
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-secondary-600">
                <span>Contact search: {a.status === 'active' ? 'Active' : 'Inactive'}</span>
                <span>Find contacts: {a.automatically_get_contact_data ? 'Enabled' : 'Not enabled'}</span>
              </div>
            </div>

            <AutomationStats
              totalRuns={a.total_runs ?? 0}
              maxContacts={a.max_contacts}
              contactsFound={a.contacts_found ?? 0}
              creditsUsed={a.credits_used ?? 0}
              automaticallyGetContactData={a.automatically_get_contact_data}
              emailsFound={a.emails_found ?? 0}
              emailsValidated={a.emails_validated ?? 0}
              stackedOnMobile
            />

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 sm:justify-center sm:items-center mt-4">
              <Link
                href={`/app/automations/${a.id}`}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-secondary-200 text-secondary-700 font-medium hover:bg-secondary-50 w-full sm:w-auto"
              >
                <Play className="h-4 w-4" />
                View Automation
              </Link>
              <Link
                href={`/app/automations/${a.id}/edit`}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-secondary-200 text-secondary-700 font-medium hover:bg-secondary-50 w-full sm:w-auto"
              >
                <Pencil className="h-4 w-4" />
                Edit Automation
              </Link>
              <button
                type="button"
                onClick={() => setDeleteTarget({ id: a.id, name: a.name || (phrases[0] ?? 'Unnamed') })}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-accent-200 text-accent-600 font-medium hover:bg-accent-50 w-full sm:w-auto"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </li>
        );
      })}
    </ul>
    <ConfirmModal
      open={!!deleteTarget}
      onOpenChange={(open) => !open && setDeleteTarget(null)}
      title="Delete automation"
      description={deleteTarget ? `Delete "${deleteTarget.name}"? Contacts will remain in your saved contacts.` : ''}
      confirmLabel="Delete"
      cancelLabel="Cancel"
      variant="danger"
      onConfirm={handleConfirmDelete}
      loading={deleteLoading}
    />
    </>
  );
}
