import { cn } from '@/lib/utils';

function formatStatusLabel(str: string): string {
  return str.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  submitted: { label: 'Submitted', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  in_review: { label: 'In Review', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  action_taken: { label: 'Action Taken', className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  resolved: { label: 'Removed', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  unsuccessful: { label: 'Unsuccessful', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  ready_for_payment: { label: 'Ready For Payment', className: 'bg-red-900 text-white dark:bg-red-950 dark:text-white' },
  // Assessment request statuses
  requested: { label: 'Requested', className: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300' },
  reviewed: { label: 'Reviewed', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  contacted: { label: 'Contacted', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? { label: formatStatusLabel(status), className: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300' };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
