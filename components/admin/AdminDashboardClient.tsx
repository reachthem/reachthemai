'use client';

import {
  Users,
  UserCheck,
  DollarSign,
  TrendingUp,
  CreditCard,
  Shield,
  BarChart3,
  Search,
  AlertTriangle,
  MessageSquare,
  Bot,
  Globe,
  Coins,
  FileX,
} from 'lucide-react';
import type { AdminDashboardStats } from '@/app/actions/admin-dashboard';

function fmt(n: number): string {
  return n.toLocaleString('en-US');
}

function fmtCurrency(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color = 'text-primary-600',
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: string;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 flex items-start gap-4">
      <div className={`p-2.5 rounded-lg bg-slate-100 dark:bg-slate-700 ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">{value}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function BreakdownTable({
  title,
  rows,
  labelHeader,
  valueHeader,
}: {
  title: string;
  rows: { label: string; value: number }[];
  labelHeader: string;
  valueHeader: string;
}) {
  const total = rows.reduce((s, r) => s + r.value, 0);
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400">
            <th className="text-left px-5 py-2 font-medium">{labelHeader}</th>
            <th className="text-right px-5 py-2 font-medium">{valueHeader}</th>
            <th className="text-right px-5 py-2 font-medium">%</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-t border-slate-100 dark:border-slate-700">
              <td className="px-5 py-2.5 text-slate-700 dark:text-slate-300 capitalize">{row.label.replace(/_/g, ' ')}</td>
              <td className="px-5 py-2.5 text-right font-medium text-slate-900 dark:text-white">{fmt(row.value)}</td>
              <td className="px-5 py-2.5 text-right text-slate-500 dark:text-slate-400">
                {total > 0 ? `${((row.value / total) * 100).toFixed(1)}%` : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminDashboardClient({ stats }: { stats: AdminDashboardStats }) {
  return (
    <div className="space-y-8">
      {/* Users & Growth */}
      <section>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Users</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Users" value={fmt(stats.totalUsers)} icon={Users} />
          <StatCard
            label="New Users (30 days)"
            value={fmt(stats.newUsersLast30Days)}
            icon={UserCheck}
            color="text-green-600"
          />
          <StatCard
            label="Advisor Subscribers"
            value={fmt(stats.advisorSubscribers)}
            icon={Bot}
            color="text-indigo-600"
          />
          <StatCard
            label="Saved Contacts"
            value={fmt(stats.totalContacts)}
            icon={MessageSquare}
            color="text-sky-600"
          />
        </div>
      </section>

      {/* Revenue */}
      <section>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Revenue</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Revenue"
            value={fmtCurrency(stats.totalRevenue)}
            icon={DollarSign}
            color="text-emerald-600"
          />
          <StatCard
            label="Revenue (30 days)"
            value={fmtCurrency(stats.revenueLast30Days)}
            icon={TrendingUp}
            color="text-emerald-600"
          />
          <StatCard
            label="Advisor MRR"
            value={fmtCurrency(stats.advisorMRR)}
            sub={`${fmt(stats.advisorSubscribers)} × ${fmtCurrency(stats.advisorPrice)}/mo`}
            icon={CreditCard}
            color="text-indigo-600"
          />
          <StatCard
            label="Removal Revenue"
            value={fmtCurrency(stats.premiumRemovalRevenue)}
            sub={`${fmt(stats.premiumRemovalPurchases)} purchases`}
            icon={FileX}
            color="text-rose-600"
          />
        </div>
      </section>

      {/* Breakdowns */}
      <section>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Breakdowns</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <BreakdownTable
            title="Users by Role"
            labelHeader="Role"
            valueHeader="Users"
            rows={stats.roleBreakdown.map((r) => ({ label: r.role, value: r.count }))}
          />
          <BreakdownTable
            title="Users by Subscription"
            labelHeader="Tier"
            valueHeader="Users"
            rows={stats.subscriptionBreakdown.map((r) => ({ label: r.tier, value: r.count }))}
          />
          {stats.removalRequests.length > 0 && (
            <BreakdownTable
              title="Removal Requests by Status"
              labelHeader="Status"
              valueHeader="Count"
              rows={stats.removalRequests.map((r) => ({ label: r.status, value: r.count }))}
            />
          )}
        </div>
      </section>

      {/* Scanner & AI */}
      <section>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Scanner &amp; AI</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Scans"
            value={fmt(stats.totalScans)}
            icon={Search}
            color="text-violet-600"
          />
          <StatCard
            label="Reviews Scanned"
            value={fmt(stats.totalReviewsScanned)}
            icon={BarChart3}
            color="text-violet-600"
          />
          <StatCard
            label="Threats Found"
            value={fmt(stats.totalThreatsFound)}
            icon={AlertTriangle}
            color="text-amber-600"
          />
          <StatCard
            label="Removal Purchases"
            value={fmt(stats.premiumRemovalPurchases)}
            icon={Shield}
            color="text-rose-600"
          />
        </div>
      </section>

      {/* API Usage */}
      <section>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">API Usage</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="OpenRouter Calls"
            value={fmt(stats.apiUsage.openrouterCalls)}
            icon={Bot}
            color="text-orange-600"
          />
          <StatCard
            label="Google Places Calls"
            value={fmt(stats.apiUsage.googlePlacesCalls)}
            icon={Globe}
            color="text-blue-600"
          />
          <StatCard
            label="OpenRouter Tokens (×1k)"
            value={fmt(Math.round(stats.apiUsage.openrouterTokens))}
            icon={Coins}
            color="text-orange-600"
          />
        </div>
      </section>

    </div>
  );
}
