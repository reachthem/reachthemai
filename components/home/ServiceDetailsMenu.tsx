'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const sections = [
  { label: 'Service', href: '/#service' },
  { label: 'Platforms', href: '/#platforms-supported' },
  { label: 'Industries', href: '/#industries' },
  { label: 'Features', href: '/#features' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'FAQ', href: '/#faq' },
];

export default function ServiceDetailsMenu() {
  const [open, setOpen] = useState(false);

  return (
    <section className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop: horizontal menu */}
        <nav
          aria-label="Service details"
          className="hidden md:flex flex-wrap items-center justify-center gap-3 py-4"
        >
          {sections.map((section, i) => (
            <span key={section.href} className="flex items-center gap-3">
              {i > 0 && (
                <span
                  className="h-4 w-px bg-slate-200 dark:bg-slate-700 flex-shrink-0"
                  aria-hidden
                />
              )}
              <Link
                href={section.href}
                className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
              >
                {section.label}
              </Link>
            </span>
          ))}
        </nav>

        {/* Mobile: accordion collapsed by default */}
        <div className="md:hidden">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="w-full flex items-center justify-between px-4 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            aria-expanded={open}
            aria-controls="service-details-accordion"
            id="service-details-trigger"
          >
            Service Details
            <ChevronDown
              className={`h-5 w-5 transition-transform ${open ? 'rotate-180' : ''}`}
            />
          </button>
          <div
            id="service-details-accordion"
            role="region"
            aria-labelledby="service-details-trigger"
            className={`overflow-hidden transition-all duration-200 ${open ? 'max-h-80' : 'max-h-0'}`}
          >
            <nav className="flex flex-col gap-0 pb-4">
              {sections.map((section) => (
                <Link
                  key={section.href}
                  href={section.href}
                  className="px-4 py-3 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
                >
                  {section.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
