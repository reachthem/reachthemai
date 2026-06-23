import Link from 'next/link';
import Image from 'next/image';
import { Youtube, Instagram, type LucideIcon } from 'lucide-react';
import { getPublicSettings } from '@/app/actions/admin-settings';

function TiktokIcon({ className, size = 20 }: { className?: string; size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

const socialLinks: { label: string; href: string; icon: LucideIcon | typeof TiktokIcon }[] = [
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@ReachThemAIRev',
    icon: Youtube,
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@reachthemai',
    icon: TiktokIcon,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/reachthem.ai/',
    icon: Instagram,
  },
];

const footerLinks = {
  Services: [
    { label: 'Review Removal', href: '/#service' },
    { label: 'AI Review Advisor', href: '/ai-advisor' },
    { label: 'Free Assessment', href: '/free-assessment' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'What is ORM?', href: '/what-is-online-reputation-management' },
  ],
  Industries: [
    { label: 'Restaurants', href: '/industries/restaurants' },
    { label: 'Healthcare', href: '/industries/healthcare' },
    { label: 'Legal Services', href: '/industries/legal' },
    { label: 'Home Services', href: '/industries/home-services' },
    { label: 'Automotive', href: '/industries/automotive' },
    { label: 'Hotels & Travel', href: '/industries/hotels-travel' },
  ],
  Platforms: [
    { label: 'Google Reviews', href: '/platforms/google' },
    { label: 'Yelp', href: '/platforms/yelp' },
    { label: 'Facebook', href: '/platforms/facebook' },
    { label: 'Trustpilot', href: '/platforms/trustpilot' },
    { label: 'TripAdvisor', href: '/platforms/tripadvisor' },
    { label: 'BBB', href: '/platforms/bbb' },
  ],
  Company: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Login', href: '/auth/login' },
    { label: 'Sign Up', href: '/auth/register' },
    { label: 'Privacy Policy', href: '/legal/privacy' },
    { label: 'Terms of Service', href: '/legal/terms' },
    { label: 'Refund Policy', href: '/legal/refund' },
  ],
};

export default async function Footer() {
  const publicSettings = await getPublicSettings();
  const productName =
    publicSettings['app.application_name'] ??
    process.env.NEXT_PUBLIC_PRODUCTNAME ??
    'Reach Them AI';

  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo-icon.svg"
                alt="Reach Them AI"
                width={32}
                height={32}
              />
              <span className="text-lg font-bold tracking-tight text-white">
                Reach Them{' '}
                <span className="text-primary-400">AI</span>
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed">
              Professional reputation management and negative review removal for businesses of all
              sizes.
            </p>
            {/* Social links */}
            <div className="mt-5 flex gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 hover:text-white hover:border-slate-500 transition-colors"
                >
                  <Icon className="w-4 h-4" size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} {productName}. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">
            Not affiliated with Google, Yelp, Facebook, Trustpilot, TripAdvisor, BBB, Glassdoor, or Amazon.
          </p>
        </div>
      </div>
    </footer>
  );
}
