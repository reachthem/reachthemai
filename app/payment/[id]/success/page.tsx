import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center border border-slate-200 dark:border-slate-700">
        <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Payment Successful!
        </h1>
        
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Thank you for your payment. We have received your request and our team will begin working on your case immediately. You will receive a confirmation email shortly.
        </p>
        
        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/">
              Return to Home
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="w-full">
            <Link href="/auth/login">
              Login to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
