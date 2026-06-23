"use client";

import { useState } from 'react';
import { Loader2, UserMinus } from 'lucide-react';

export default function CancelSubscriptionButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCancelSubscription = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? 'Failed to open billing portal');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleCancelSubscription}
        disabled={loading}
        className="inline-flex items-center px-4 py-2 rounded-lg border border-red-200 dark:border-red-900/50 bg-white dark:bg-slate-800 text-sm font-medium text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <UserMinus className="mr-2 h-4 w-4" />
        )}
        Cancel subscription
      </button>
      {error && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
