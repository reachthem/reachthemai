'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import PaymentAuth from './PaymentAuth';

interface PaymentClientProps {
  requestId: string;
  contactEmail: string;
}

export default function PaymentClient({ requestId, contactEmail }: PaymentClientProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/public/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          removal_request_id: requestId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initiate payment');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 flex flex-col items-center text-center">
      <div className="w-full max-w-2xl">
        <PaymentAuth />
      </div>
      
      <Button 
        onClick={handlePayment} 
        disabled={isLoading} 
        className="w-full sm:w-auto min-w-[200px]"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Pay Now
          </>
        )}
      </Button>
      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
        Secure payment via Stripe. A receipt will be sent to {contactEmail}.
      </p>
    </div>
  );
}
