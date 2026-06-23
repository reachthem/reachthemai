import type { Metadata } from 'next';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import ContactForm from '@/components/contact/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Contact Reach Them AI for help removing bad Google reviews and protecting your reputation. Get in touch about review removal, pricing, or support for Google, Yelp, Trustpilot, and more.',
  openGraph: {
    title: 'Contact Us | Reach Them AI',
    description:
      'Get in touch about removing harmful reviews from Google, Yelp, Trustpilot, and more. We help businesses protect their reputation.',
    images: ['/featured.png'],
    type: 'website',
  },
};

const CONTACT_EMAIL = 'reachtemai@gmail.com';
const SUPPORT_PHONE = '(317) 494-0354';

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-slate-50 dark:bg-slate-950">
        {/* Header */}
        <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Get in Touch
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Have questions about removing a harmful review? Our team is ready to help you protect your online reputation.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

              {/* Contact info panel */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                    We&apos;d love to hear from you
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Whether you have a specific review you need removed or simply want to learn more about how our platform works, reach out and we&apos;ll respond within one business day.
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Email</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{CONTACT_EMAIL}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Phone</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{SUPPORT_PHONE}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Location</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">United States</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Response Time</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Within 2 hours</p>
                    </div>
                  </div>
                </div>

                {/* Trust signals */}
                <div className="rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 p-5 space-y-2">
                  {['Results-based pricing — only pay if removed', 'Google, Yelp, Trustpilot & 50+ platforms', 'Expert review dispute team'].map((point) => (
                    <div key={point} className="flex items-center gap-2 text-sm text-primary-800 dark:text-primary-300">
                      <svg className="h-4 w-4 flex-shrink-0 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {point}
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact form */}
              <div className="lg:col-span-3">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                    Send us a message
                  </h3>
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
