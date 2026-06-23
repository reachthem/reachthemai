'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { updateAdminNotes } from '@/app/actions/admin-removal-requests';
import { Loader2 } from 'lucide-react';

interface AdminNotesPanelProps {
  requestId: string;
  initialNotes: string;
}

export default function AdminNotesPanel({ requestId, initialNotes }: AdminNotesPanelProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveNotes = useCallback(async (value: string) => {
    setSaving(true);
    setError(null);
    try {
      const result = await updateAdminNotes(requestId, value);
      setSavedAt(
        new Intl.DateTimeFormat('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date(result.updated_at))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save notes');
    } finally {
      setSaving(false);
    }
  }, [requestId]);

  const handleBlur = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    saveNotes(notes);
  };

  const handleChange = (value: string) => {
    setNotes(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => saveNotes(value), 500);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
        Admin Notes
      </h3>
      <p className="text-xs text-slate-400 mb-2">
        Internal notes — not visible to the customer.
      </p>

      <textarea
        value={notes}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
        rows={6}
        placeholder="Add internal notes..."
        className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-slate-400"
      />

      <div className="mt-2 h-4 text-xs">
        {saving && (
          <span className="text-slate-400 flex items-center gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            Saving...
          </span>
        )}
        {!saving && savedAt && (
          <span className="text-slate-400">Saved at {savedAt}</span>
        )}
        {error && <span className="text-red-600">{error}</span>}
      </div>
    </div>
  );
}
