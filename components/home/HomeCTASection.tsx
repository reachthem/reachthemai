import Link from 'next/link';
import { Bot, UserCheck } from 'lucide-react';

interface HomeCTASectionProps {
  advisorPrice?: string;
}

export default function HomeCTASection({ advisorPrice = '49' }: HomeCTASectionProps) {
  return (
    <section className="py-12 md:py-24 relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-blue-700">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
          Ready to Fix Your Reputation?
        </h2>

        <p className="mt-6 text-xl text-primary-100 max-w-2xl mx-auto mb-10">
          Don&apos;t let negative reviews damage your business. Choose the solution that works best for you.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link
            href="/ai-advisor"
            className="group inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-primary-700 font-semibold text-lg hover:bg-primary-50 transition-all shadow-lg hover:-translate-y-0.5"
          >
            <Bot className="mr-2 h-5 w-5 text-primary-600 group-hover:text-primary-700" />
            {`Get AI Advisor ($${advisorPrice}/mo)`}
          </Link>
          
          <Link
            href="/review-removal-services"
            className="group inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 border-white/30 text-white font-semibold text-lg hover:bg-white/10 transition-all backdrop-blur-sm"
          >
            <UserCheck className="mr-2 h-5 w-5 text-white/90 group-hover:text-white" />
            Get Full Service Removal
          </Link>
        </div>

        <p className="mt-8 text-primary-200 text-sm">
          No long-term contracts &middot; Results guaranteed for full service &middot; Cancel anytime
        </p>
      </div>
    </section>
  );
}
