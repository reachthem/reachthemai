'use client';

import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import type { UserDataRow } from '@/app/actions/admin-dashboard';

function fmt(n: number): string {
  return n.toLocaleString('en-US');
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

type SortKey =
  | 'email'
  | 'phone_number'
  | 'full_name'
  | 'user_role'
  | 'subscription_tier'
  | 'credits'
  | 'created_at'
  | 'user_id';

export default function AdminUsersTable({
  rows,
  error,
}: {
  rows: UserDataRow[];
  error: string | null;
}) {
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const sortedRows = useMemo(() => {
    const mult = sortDir === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const tie = (a.user_id < b.user_id ? -1 : 1) * mult;
      const av = a[sortKey];
      const bv = b[sortKey];
      if (sortKey === 'credits') {
        const c = (Number(a.credits) - Number(b.credits)) * mult;
        return c !== 0 ? c : tie;
      }
      if (sortKey === 'created_at') {
        const t = (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) * mult;
        return t !== 0 ? t : tie;
      }
      const sa = av == null ? '' : String(av).toLowerCase();
      const sb = bv == null ? '' : String(bv).toLowerCase();
      const cmp = sa.localeCompare(sb, undefined, { numeric: true }) * mult;
      return cmp !== 0 ? cmp : tie;
    });
  }, [rows, sortKey, sortDir]);

  const onSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'created_at' ? 'desc' : 'asc');
    }
  };

  const SortHead = ({ k, children, className = '' }: { k: SortKey; children: React.ReactNode; className?: string }) => {
    const active = sortKey === k;
    return (
      <th scope="col" className={`px-4 py-3 font-medium uppercase tracking-wider ${className}`}>
        <button
          type="button"
          onClick={() => onSort(k)}
          className="inline-flex items-center gap-1 text-left w-full hover:text-slate-700 dark:hover:text-slate-200 text-slate-500 dark:text-slate-400"
          aria-sort={active ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
        >
          {children}
          {active ? (
            sortDir === 'asc' ? (
              <ArrowUp className="h-3.5 w-3.5 shrink-0" aria-hidden />
            ) : (
              <ArrowDown className="h-3.5 w-3.5 shrink-0" aria-hidden />
            )
          ) : null}
        </button>
      </th>
    );
  };

  if (error) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-destructive/50 rounded-xl p-5">
        <p className="text-destructive text-sm">Failed to load user data: {error}</p>
      </div>
    );
  }
  if (rows.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center">
        <p className="text-slate-500 dark:text-slate-400">No user data found.</p>
      </div>
    );
  }
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400">
              <SortHead k="email">Email</SortHead>
              <SortHead k="phone_number">Phone</SortHead>
              <SortHead k="full_name">Full name</SortHead>
              <SortHead k="user_role">Role</SortHead>
              <SortHead k="subscription_tier">Subscription</SortHead>
              <SortHead k="credits" className="text-right">
                <span className="w-full flex justify-end">Credits</span>
              </SortHead>
              <SortHead k="created_at">Created</SortHead>
              <SortHead k="user_id">User ID</SortHead>
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row) => (
              <tr key={row.id} className="border-t border-slate-100 dark:border-slate-700">
                <td className="px-4 py-2.5 text-slate-700 dark:text-slate-300">{row.email ?? '—'}</td>
                <td className="px-4 py-2.5 text-slate-700 dark:text-slate-300">{row.phone_number ?? '—'}</td>
                <td className="px-4 py-2.5 text-slate-700 dark:text-slate-300">{row.full_name ?? '—'}</td>
                <td className="px-4 py-2.5">
                  <span className="capitalize text-slate-700 dark:text-slate-300">{row.user_role.replace(/_/g, ' ')}</span>
                </td>
                <td className="px-4 py-2.5 text-slate-700 dark:text-slate-300 capitalize">
                  {row.subscription_tier.replace(/_/g, ' ')}
                </td>
                <td className="px-4 py-2.5 text-right font-medium text-slate-900 dark:text-white">{fmt(row.credits)}</td>
                <td className="px-4 py-2.5 text-slate-500 dark:text-slate-400">{formatDate(row.created_at)}</td>
                <td
                  className="px-4 py-2.5 text-slate-400 dark:text-slate-500 font-mono text-xs truncate max-w-[120px]"
                  title={row.user_id}
                >
                  {row.user_id}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
