'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link as LinkIcon, Check } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentLinkPanelProps {
  requestId: string;
  status: string;
  reportPlaceId?: string | null;
}

export default function PaymentLinkPanel({ requestId, status, reportPlaceId }: PaymentLinkPanelProps) {
  const [copied, setCopied] = useState(false);

  if (status !== 'ready_for_payment') {
    return null;
  }

  const handleCopyLink = () => {
    const origin = window.location.origin;
    const link = `${origin}/payment/${requestId}`;
    
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      toast.success('Payment link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
      <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
        Payment Link
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        Share this link with the customer to complete payment.
      </p>
      
      <Button 
        onClick={handleCopyLink} 
        variant="outline" 
        className="w-full flex items-center justify-center gap-2"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 text-green-500" />
            Copied!
          </>
        ) : (
          <>
            <LinkIcon className="h-4 w-4" />
            Copy Payment Link
          </>
        )}
      </Button>
      {reportPlaceId && (
        <Button asChild variant="outline" className="w-full mt-3">
          <a
            href={`/report?placeId=${encodeURIComponent(reportPlaceId)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
          >
            <LinkIcon className="h-4 w-4" />
            Open Report Page
          </a>
        </Button>
      )}
    </div>
  );
}
