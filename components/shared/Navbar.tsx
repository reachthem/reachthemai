"use client";

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import AuthAwareButtons from '@/components/AuthAwareButtons';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';

const PRICING_PATH = '/pricing';

const baseNavLinks = [
  { href: '/', label: 'Home' },
  { href: '/review-removal-services', label: 'Pro Removal' },
  { href: '/ai-advisor', label: 'AI Advisor' },
  { href: '/business-review-scan', label: 'Analyze Reviews' },
  { href: '/free-assessment', label: 'Free Assessment' },
  { href: '/industries', label: 'Industries' },
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
  maxWidth = '90%',
  navVariant = 'marketing',
}: NavbarProps) {
  const [open, setOpen] = useState(false);

  const navLinks =
    navVariant === 'app'
      ? baseNavLinks.filter(
          (link) => link.label !== 'FAQ' && link.label !== 'Industries'
        )
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
        <div className="grid grid-cols-3 h-16 items-center">

          {/* Left: optional (e.g. sidebar toggle) + Logo */}
          <div className="flex items-center gap-2 relative z-10">
            {leftContent}
            {showLogo && (
              <Link href="/" className="flex-shrink-0 flex items-center gap-2.5">
                <Image
                  src="/logo-icon.svg"
                  alt="Reach Them AI"
                  width={36}
                  height={36}
                  priority
                />
                <span className="text-xl font-bold tracking-tight text-[#182825] dark:text-white">
                  Reach Them{' '}
                  <span className="text-primary-600 dark:text-primary-400">AI</span>
                </span>
              </Link>
            )}
          </div>

          {/* Center: Desktop nav links — min 1176px = desktop; below = mobile. Links must be clickable. */}
          <div className="hidden min-[1176px]:flex items-center justify-center gap-6 relative z-10">
            {navLinks.map((link, i) => (
              <span key={link.href} className="flex items-center gap-6">
                {i > 0 && (
                  <span
                    className="h-4 w-px bg-slate-300 dark:bg-slate-600 flex-shrink-0 pointer-events-none"
                    aria-hidden
                  />
                )}
                <Link
                  href={link.href}
                  className={`cursor-pointer text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors font-medium whitespace-nowrap inline-block py-2 ${
                    navVariant === 'marketing'
                      ? 'text-sm max-[1475px]:text-[0.75rem]'
                      : 'text-sm'
                  }`}
                >
                  {link.label}
                </Link>
              </span>
            ))}
          </div>

          {/* Right: Auth buttons or custom content (e.g. user dropdown) + mobile hamburger — mobile breakpoint 1175px */}
          <div className="flex items-center justify-end col-start-3">
            {rightContent ? (
              <div className="flex items-center gap-4">{rightContent}</div>
            ) : (
              <>
                <div className="hidden min-[1176px]:block">
                  <AuthAwareButtons variant="nav" />
                </div>
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

                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <Image
                        src="/logo-icon.svg"
                        alt="Reach Them AI"
                        width={32}
                        height={32}
                      />
                      <span className="text-lg font-bold tracking-tight text-[#182825] dark:text-white">
                        Reach Them{' '}
                        <span className="text-primary-600 dark:text-primary-400">AI</span>
                      </span>
                    </SheetTitle>
                  </SheetHeader>

                  <nav className="mt-8 flex flex-col gap-2">
                    {navLinks.map((link) => (
                      <SheetClose asChild key={link.href}>
                        <Link
                          href={link.href}
                          className="px-3 py-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
                          onClick={() => setOpen(false)}
                        >
                          {link.label}
                        </Link>
                      </SheetClose>
                    ))}

                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-col gap-3">
                      <SheetClose asChild>
                        <Link
                          href="/auth/login"
                          className="px-3 py-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
                        >
                          Login
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="/auth/register"
                          className="px-4 py-3 rounded-xl bg-primary-600 text-white font-semibold text-center hover:bg-primary-700 transition-colors"
                        >
                          Get Started
                        </Link>
                      </SheetClose>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
