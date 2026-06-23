'use client';

import { PLATFORMS, PLATFORM_LABELS } from '@/lib/schemas/review-case';
import { Globe } from 'lucide-react';

const PLATFORM_COLORS: Record<string, string> = {
  google: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
  yelp: 'border-red-500 bg-red-50 dark:bg-red-900/20',
  facebook: 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20',
  trustpilot: 'border-green-500 bg-green-50 dark:bg-green-900/20',
  tripadvisor: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20',
  bbb: 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20',
  glassdoor: 'border-lime-500 bg-lime-50 dark:bg-lime-900/20',
  amazon: 'border-amber-500 bg-amber-50 dark:bg-amber-900/20',
  other: 'border-gray-500 bg-gray-50 dark:bg-gray-800',
};

const PLATFORM_DESCRIPTIONS: Record<string, string> = {
  google: 'Google Reviews, Maps, Business Profile',
  yelp: 'Yelp Business Reviews',
  facebook: 'Facebook Page Reviews & Recommendations',
  trustpilot: 'Trustpilot Business Reviews',
  tripadvisor: 'TripAdvisor Reviews',
  bbb: 'BBB Business Reviews',
  glassdoor: 'Glassdoor Employer Reviews',
  amazon: 'Amazon Product & Seller Reviews',
  other: 'Any other review platform',
};

interface StepPlatformProps {
  value?: string;
  onChange: (platform: string) => void;
}

export default function StepPlatform({ value, onChange }: StepPlatformProps) {
  return (
    <div>
      <h3 className="mb-1 text-lg font-semibold">Where is the review?</h3>
      <p className="mb-6 text-sm text-secondary-500">
        Select the platform where the negative review was posted.
      </p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {PLATFORMS.map((platform) => {
          const isSelected = value === platform;
          return (
            <button
              key={platform}
              type="button"
              onClick={() => onChange(platform)}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 p-5 transition-all ${
                isSelected
                  ? `${PLATFORM_COLORS[platform]} ring-2 ring-primary-600`
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <Globe className={`h-8 w-8 ${isSelected ? 'text-primary-600' : 'text-gray-400'}`} />
              <span className="font-medium">{PLATFORM_LABELS[platform]}</span>
              <span className="text-center text-xs text-secondary-500">
                {PLATFORM_DESCRIPTIONS[platform]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
