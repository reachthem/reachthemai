"use client";

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { ChevronDown, Menu, Star, Trash2, MapPin, ShieldCheck, BarChart2, Radar, FileText, Monitor, MessageCircle, Sparkles, type LucideIcon } from 'lucide-react';
import AuthAwareButtons from '@/components/AuthAwareButtons';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';

type NavChild = { href: string; label: string; icon?: LucideIcon };
type NavLink = { href?: string; label: string; children?: NavChild[] };

const PRICING_PATH = '/pricing';

const baseNavLinks: NavLink[] = [
  { href: '/', label: 'Home' },
  {
    label: 'Services',
    children: [
      { href: '/review-generation', label: 'Reviews Generation', icon: Star },
      { href: '/review-removal-services', label: 'Review Removal', icon: Trash2 },
      { href: '/local-listing-aggregation', label: 'Local Listings', icon: MapPin },
      { href: '/reputation-management-tracking', label: 'Reputation Management', icon: ShieldCheck },
      { href: '/local-rank-tracking', label: 'Local Ranks', icon: BarChart2 },
      { href: '/google-business-ai-profile-optimization', label: 'Google Business', icon: Radar },
      { href: '/ai-local-seo-content-generation', label: 'Content Generation', icon: FileText },
      { href: '/ai-local-business-website-builder', label: 'Website Development', icon: Monitor },
      { href: '/social-media-management-ai-posting', label: 'Social Media', icon: MessageCircle },
      { href: '/ai-phone-agents', label: 'AI Phone Agents', icon: Sparkles },
    ],
  },
  { href: PRICING_PATH, label: 'Pricing' },
  { href: '/contact', label: 'Contact' },
];

interface NavbarProps {
  /** Use "sticky" inside app layout so header scrolls with content; "fixed" for marketing pages */
  variant?: 'fixed' | 'sticky';
  /** Solid #fff for home page header */
  background?: 'default' | 'white';
  /** When provided (e.g. sidebar toggle in app layout), render before the logo */
  leftContent?: ReactNode;
  /** When provided (e.g. in app layout), render instead of AuthAwareButtons; mobile sheet is hidden */
  rightContent?: ReactNode;
  /** When false, hide the logo (e.g. dashboard where sidebar already shows it) */
  showLogo?: boolean;
  /** When true, hide the center navigation links and mobile sheet */
  hideNavLinks?: boolean;
  /** Inner container max-width: "98%" for home page; default "90%" */
  maxWidth?: '90%' | '98%';
  /** "app" = hide FAQ and Industries (dashboard header); "marketing" = show all */
  navVariant?: 'marketing' | 'app';
}

export default function Navbar({
  variant = 'fixed',
  background = 'default',
  leftContent,
  rightContent,
  showLogo = true,
  hideNavLinks = false,
  maxWidth = '90%',
  navVariant = 'marketing',
}: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [mobileOpenSection, setMobileOpenSection] = useState<string | null>(null);

  const navLinks: NavLink[] =
    navVariant === 'app'
      ? baseNavLinks.filter((link) => link.label !== 'FAQ' && link.label !== 'Industries')
      : baseNavLinks;

  const navBg =
    background === 'white'
      ? 'bg-[#fff] dark:bg-slate-900'
      : 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm';
  const position = variant === 'sticky' ? 'sticky top-0' : 'fixed top-0';

  return (
    <nav
      className={`${position} w-full z-[100] border-b border-slate-200 dark:border-slate-800 ${navBg} pointer-events-auto`}
      style={{ isolation: 'isolate' }}
    >
      <div
        className="mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        style={{ width: maxWidth, maxWidth: '100%' }}
      >
        <div className="grid grid-cols-3 h-16 min-[1176px]:h-[85px] items-center">

          {/* Left: optional (e.g. sidebar toggle) + Logo */}
          <div className="flex items-center gap-2 relative z-10">
            {leftContent}
            {showLogo && (
              <Link href="/home" className="flex-shrink-0 flex items-center">
                <img
                  src="https://pgtpgkmtuntmplnuveak.supabase.co/storage/v1/object/public/site-images/logo.png"
                  alt="Reach Them AI"
                  className="w-[250px] h-auto object-contain"
                />
              </Link>
            )}
          </div>

          {/* Center: Desktop nav links — min 1176px = desktop; below = mobile. Links must be clickable. */}
          {!hideNavLinks && (
            <div className="hidden min-[1176px]:flex items-center justify-center gap-6 relative z-10">
                  {navLinks.map((link: NavLink, i) => (
                <span key={link.href || link.label} className="flex items-center gap-6 relative">
                  {i > 0 && (
                    <span
                      className="h-4 w-px bg-slate-300 dark:bg-slate-600 flex-shrink-0 pointer-events-none"
                      aria-hidden
                    />
                  )}
                  {link.children ? (
                  // Special case: Services should render as a 3-column mega menu on desktop
                  link.label === 'Services' ? (
                    <div className="relative group pt-2">
                      <button
                        className={`cursor-pointer text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors font-medium whitespace-nowrap inline-block py-2 ${
                          navVariant === 'marketing' ? 'text-sm max-[1475px]:text-[0.75rem]' : 'text-sm'
                        }`}
                      >
                        {link.label}
                      </button>

                      <div className="absolute left-0 top-full w-[min(80vw,900px)] bg-white dark:bg-slate-800 rounded-xl shadow-lg invisible group-hover:visible transform scale-95 group-hover:scale-100 transition-all pointer-events-none group-hover:pointer-events-auto z-50">
                        <div className="p-4">
                          <div className="grid grid-cols-3 gap-4">
                            {link.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                              >
                                {child.icon ? (
                                  <child.icon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                ) : null}
                                <span className="truncate">{child.label}</span>
                                {child.href === '/ai-phone-agents' && (
                                  <span className="ml-auto inline-flex items-center rounded-full bg-primary-600 text-white text-[0.6rem] font-semibold px-2 py-0.5">
                                    New
                                  </span>
                                )}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative group pt-2">
                      <button
                        className={`cursor-pointer text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors font-medium whitespace-nowrap inline-block py-2 ${
                          navVariant === 'marketing' ? 'text-sm max-[1475px]:text-[0.75rem]' : 'text-sm'
                        }`}
                      >
                        {link.label}
                      </button>

                      <div className="absolute left-0 top-full w-80 max-w-[90vw] bg-white dark:bg-slate-800 rounded-xl shadow-lg invisible group-hover:visible transform scale-95 group-hover:scale-100 transition-all pointer-events-none group-hover:pointer-events-auto z-50">
                        <div className="py-2">
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  <Link
                    href={link.href!}
                    className={`cursor-pointer text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors font-medium whitespace-nowrap inline-block py-2 ${
                      navVariant === 'marketing' ? 'text-sm max-[1475px]:text-[0.75rem]' : 'text-sm'
                    }`}
                  >
                    {link.label}
                  </Link>
                )}
              </span>
            ))}
          </div>
          )}

          {/* Right: Auth buttons or custom content (e.g. user dropdown) + mobile hamburger — mobile breakpoint 1175px */}
          <div className="flex items-center justify-end col-start-3">
            {rightContent ? (
              <div className="flex items-center gap-4">{rightContent}</div>
            ) : (
              <>
                <div className="hidden min-[1176px]:block">
                  <AuthAwareButtons variant="nav" />
                </div>
                {!hideNavLinks && (
                  <div className="min-[1176px]:hidden">
                    <Sheet open={open} onOpenChange={setOpen}>
                      <SheetTrigger asChild>
                        <button
                          className="p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          aria-label="Open menu"
                        >
                          <Menu className="h-6 w-6" />
                        </button>
                      </SheetTrigger>

                      <SheetContent side="right" className="w-[92vw] sm:w-[24rem]">
                        <SheetHeader>
                          <SheetTitle className="flex items-center gap-2">
                            <img
                              src="https://pgtpgkmtuntmplnuveak.supabase.co/storage/v1/object/public/site-images/logo.png"
                              alt="Reach Them AI"
                              className="w-[220px] h-auto object-contain"
                            />
                          </SheetTitle>
                        </SheetHeader>

                        <nav className="mt-6 flex flex-col gap-2">
                          {navLinks.map((link: NavLink) => (
                            link.children ? (
                              <div key={link.label} className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-900/70">
                                <button
                                  type="button"
                                  className="flex w-full items-center justify-between px-4 py-3 text-left text-slate-700 dark:text-slate-300 font-semibold"
                                  onClick={() => setMobileOpenSection(mobileOpenSection === link.label ? null : link.label)}
                                >
                                  <span>{link.label}</span>
                                  <ChevronDown className={`h-4 w-4 transition-transform ${mobileOpenSection === link.label ? 'rotate-180' : ''}`} />
                                </button>
                                {mobileOpenSection === link.label && (
                                  <div className="border-t border-slate-200 bg-white/70 p-2 dark:border-slate-700 dark:bg-slate-950/70">
                                    {link.children.map((child) => (
                                      <SheetClose asChild key={child.href}>
                                        <Link
                                          href={child.href}
                                          className="block rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                                          onClick={() => setOpen(false)}
                                        >
                                          {child.label}
                                        </Link>
                                      </SheetClose>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <SheetClose asChild key={link.href}>
                                <Link
                                  href={link.href!}
                                  className="rounded-xl px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-colors"
                                  onClick={() => setOpen(false)}
                                >
                                  {link.label}
                                </Link>
                              </SheetClose>
                            )
                          ))}

                          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-col gap-3">
                            <SheetClose asChild>
                              <Link
                                href="/auth/login"
                                className="rounded-xl px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-colors"
                              >
                                Login
                              </Link>
                            </SheetClose>
                            <SheetClose asChild>
                              <Link
                                href="/auth/register"
                                className="rounded-xl bg-primary-600 px-4 py-3 text-center font-semibold text-white transition-colors hover:bg-primary-700"
                              >
                                Get Started
                              </Link>
                            </SheetClose>
                          </div>
                        </nav>
                      </SheetContent>
                    </Sheet>
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
