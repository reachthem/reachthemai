import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Connect Your Business',
    description:
      'Add your business profile and link the review platforms you want to grow. Takes less than 5 minutes with zero technical setup required.',
  },
  {
    number: '02',
    title: 'Build Your Campaign',
    description:
      'Choose your delivery channel (SMS or Email), customize your message template, and configure your send timing. No coding required.',
  },
  {
    number: '03',
    title: 'Watch Reviews Roll In',
    description:
      'Customers receive a timely, friendly review request. Happy customers click through and leave a review. Monitor every result in your dashboard.',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary-400 text-sm font-semibold uppercase tracking-wider">
            How It Works
          </span>
          <h2 className="mt-3 text-4xl font-bold text-white tracking-tight">
            Three Steps to More Reviews
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="text-5xl font-bold text-primary-500/30 mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {step.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/auth/register"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-primary-600 text-white font-semibold text-lg hover:bg-primary-500 transition-all shadow-lg shadow-primary-900/50 hover:shadow-primary-600/40 hover:-translate-y-0.5"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
