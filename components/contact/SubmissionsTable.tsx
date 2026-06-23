'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Trash2, Phone, Mail, Calendar, X } from 'lucide-react';
import { toast } from 'sonner';
import { deleteSubmission } from '@/app/actions/contact';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface Submission {
  id: string;
  first_name: string;
  last_name: string;
  email_address: string;
  phone_number: string | null;
  message: string;
  created_at: string;
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

export default function SubmissionsTable({ submissions }: { submissions: Submission[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Submission | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Submission | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      try {
        await deleteSubmission(deleteTarget.id);
        toast.success('Submission deleted.');
        setDeleteTarget(null);
        if (selected?.id === deleteTarget.id) setSelected(null);
        router.refresh();
      } catch {
        toast.error('Failed to delete submission.');
      }
    });
  };

  return (
    <>
      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden lg:table-cell">Message</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {formatDate(sub.created_at)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white whitespace-nowrap">
                    {sub.first_name} {sub.last_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    {sub.email_address}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 hidden lg:table-cell max-w-xs">
                    <span className="truncate block">{sub.message.slice(0, 80)}{sub.message.length > 80 ? '…' : ''}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelected(sub)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </button>
                      <button
                        onClick={() => setDeleteTarget(sub)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Sheet */}
      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="text-xl">
                  {selected.first_name} {selected.last_name}
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-5">
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <Calendar className="h-4 w-4 flex-shrink-0 text-slate-400" />
                  {formatDate(selected.created_at)}
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <Mail className="h-4 w-4 flex-shrink-0 text-slate-400" />
                  <a href={`mailto:${selected.email_address}`} className="text-primary-600 dark:text-primary-400 hover:underline">
                    {selected.email_address}
                  </a>
                </div>
                {selected.phone_number && (
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <Phone className="h-4 w-4 flex-shrink-0 text-slate-400" />
                    <a href={`tel:${selected.phone_number}`} className="text-primary-600 dark:text-primary-400 hover:underline">
                      {selected.phone_number}
                    </a>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Message</p>
                  <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {selected.message}
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => { setDeleteTarget(selected); setSelected(null); }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete this submission
                  </button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => !isPending && setDeleteTarget(null)} />
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 max-w-md w-full">
            <button
              onClick={() => setDeleteTarget(null)}
              disabled={isPending}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 mx-auto mb-4">
              <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-white text-center mb-2">
              Delete submission?
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
              This will permanently delete the message from <strong className="text-slate-700 dark:text-slate-300">{deleteTarget.first_name} {deleteTarget.last_name}</strong>. This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={isPending}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
