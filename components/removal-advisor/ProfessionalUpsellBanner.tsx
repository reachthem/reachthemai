'use client';

import { Star } from 'lucide-react';
import Link from 'next/link';

interface ProfessionalUpsellBannerProps {
  caseId: string;
  status: string;
}

const VISIBLE_STATUSES = ['active', 'reported', 'pending_platform', 'rejected'];

export default function ProfessionalUpsellBanner({ caseId, status }: ProfessionalUpsellBannerProps) {
  if (!VISIBLE_STATUSES.includes(status)) return null;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-amber-200 bg-amber-50 p-5 sm:flex-row sm:items-center">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
        <Star className="h-5 w-5 text-amber-600" />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-amber-900">Want guaranteed results?</p>
        <p className="text-sm text-amber-800">
          If the DIY process doesn&apos;t work, our professional team handles the full removal — direct escalation with the platform, no extra work for you.
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-lg font-bold text-amber-900">$299 per review</span>
        <Link
          href={`/submit-removal?from_case=${caseId}`}
          className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700"
        >
          Start Professional Removal
        </Link>
        <span className="text-xs text-amber-700">No removal, no charge</span>
      </div>
    </div>
  );
}
