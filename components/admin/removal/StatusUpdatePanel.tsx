'use client';

import { useState } from 'react';
import { updateRemovalRequestStatus } from '@/app/actions/admin-removal-requests';
import StatusBadge from '@/components/removal/StatusBadge';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle } from 'lucide-react';

const VALID_STATUSES = [
  { value: 'submitted', label: 'Submitted' },
  { value: 'in_review', label: 'In Review' },
  { value: 'ready_for_payment', label: 'Ready For Payment' },
  { value: 'action_taken', label: 'Action Taken' },
  { value: 'resolved', label: 'Removed' },
  { value: 'unsuccessful', label: 'Unsuccessful' },
];

interface StatusUpdatePanelProps {
  requestId: string;
  currentStatus: string;
  adminUserId: string;
}

export default function StatusUpdatePanel({ requestId, currentStatus, adminUserId }: StatusUpdatePanelProps) {
  const [status, setStatus] = useState(currentStatus);
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = async () => {
    if (selectedStatus === status) return;
    setUpdating(true);
    setError(null);
    setSuccess(false);

    try {
      await updateRemovalRequestStatus(requestId, selectedStatus, adminUserId);
      setStatus(selectedStatus);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
        Update Status
      </h3>

      <div className="mb-4">
        <p className="text-xs text-slate-400 mb-1">Current Status</p>
        <StatusBadge status={status} />
      </div>

      <div className="mb-4">
        <label htmlFor="new-status" className="block text-xs text-slate-400 mb-1">
          New Status
        </label>
        <select
          id="new-status"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {VALID_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <Button
        onClick={handleUpdate}
        disabled={updating || selectedStatus === status}
        className="w-full"
        size="sm"
      >
        {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Update Status
      </Button>

      {success && (
        <p className="mt-2 text-xs text-green-600 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Status updated
        </p>
      )}

      {error && (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
