'use client';

export type AutomationStatsProps = {
  totalRuns: number;
  maxContacts: number | null;
  contactsFound: number;
  creditsUsed: number;
  automaticallyGetContactData?: boolean;
  emailsFound?: number;
  emailsValidated?: number;
  /** On mobile, use single column stacked layout when true */
  stackedOnMobile?: boolean;
};

function StatBlock({
  label,
  value,
  valueClassName = 'text-secondary-900',
}: {
  label: string;
  value: string | number;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-xl border border-secondary-100 bg-secondary-50/50 p-4 text-center">
      <p className={`text-2xl font-bold mt-0 mb-1 ${valueClassName}`}>
        {value}
      </p>
      <p className="text-xs font-medium text-secondary-500 whitespace-nowrap">
        {label}
      </p>
    </div>
  );
}

export default function AutomationStats({
  totalRuns,
  maxContacts,
  contactsFound,
  creditsUsed,
  automaticallyGetContactData,
  emailsFound = 0,
  emailsValidated = 0,
  stackedOnMobile = false,
}: AutomationStatsProps) {
  const maxDisplay = maxContacts != null ? String(maxContacts) : '∞';
  const gridClass = stackedOnMobile
    ? 'grid grid-cols-1 sm:grid-cols-3 gap-4'
    : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4';

  return (
    <div className={gridClass}>
      <StatBlock label="Total runs" value={totalRuns} valueClassName="text-primary-600" />
      <StatBlock label="Max Contacts" value={maxDisplay} valueClassName="text-orange-600" />
      <StatBlock label="Contacts found" value={contactsFound} valueClassName="text-green-600" />
      <StatBlock label="Credits used" value={creditsUsed} valueClassName="text-purple-600" />
      {automaticallyGetContactData && (
        <>
          <StatBlock label="Emails found" value={emailsFound} valueClassName="text-blue-600" />
          <StatBlock label="Emails validated" value={emailsValidated} valueClassName="text-teal-600" />
        </>
      )}
    </div>
  );
}
