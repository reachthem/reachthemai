"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Star,
    Send,
    BarChart2,
    MessageCircle,
    Flag,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronDown,
    ChevronRight,
    Receipt,
    SlidersHorizontal,
    Mail,
    ShieldCheck,
    Trash2,
    FileX,
    Brain,
    BookOpen,
    ClipboardCheck,
    FileText,
    HelpCircle,
    ListChecks,
    Layers,
    Bot,
    BookMarked,
    DollarSign,
    Radar,
    Search,
    Sparkles,
    Users,
} from 'lucide-react';
import { useGlobal } from "@/lib/context/GlobalContext";
import Navbar from '@/components/shared/Navbar';
import { createSPASassClient } from '@/lib/supabase/client';
import AppProfileGate from '@/components/app/AppProfileGate';

const docsSubmenu = [
    { name: 'How It Works', href: '/#how-it-works', icon: ListChecks },
    { name: 'Features', href: '/#features', icon: Layers },
    { name: 'Supported Platforms', href: '/#platforms-supported', icon: Star },
    { name: 'RM Definition', href: '/what-is-online-reputation-management', icon: BookMarked },
    { name: 'Industries', href: '/industries', icon: BookOpen },
    { name: 'FAQ', href: '/#faq', icon: HelpCircle },
    { name: 'Pricing', href: '/pricing', icon: DollarSign },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isSettingsOpen, setSettingsOpen] = useState(false);
    const [isDocsOpen, setDocsOpen] = useState(false);
    const [isFutureFuncOpen, setFutureFuncOpen] = useState(false);
    const [isContactsOpen, setContactsOpen] = useState(false);
    const [isAdminDashboardOpen, setAdminDashboardOpen] = useState(false);
    const pathname = usePathname();
    const { isAdmin } = useGlobal();

    const settingsChildren = [
        { name: 'General', href: '/app/settings', icon: SlidersHorizontal },
        { name: 'Billing', href: '/app/billing', icon: Receipt },
    ];

    const isSettingsSection = pathname.startsWith('/app/settings') || pathname.startsWith('/app/billing');

    // Main navigation — admin-only items hidden for non-admins
    const navigation = [
        { name: 'Dashboard', href: '/app', icon: LayoutDashboard },
        { name: 'AI Removal Advisor', href: '/app/removal-advisor', icon: Brain },
        { name: 'My Removals', href: '/app/my-removals', icon: FileX },
        { name: 'Submit Removal', href: '/submit-removal', icon: FileText },
        { name: 'Google Reviews', href: '/app/scanner', icon: Radar },
        { name: 'Free Assessment', href: '/free-assessment', icon: ClipboardCheck },
    ];

    const futureFuncChildren = [
        { name: 'Analytics', href: '/app/analytics', icon: BarChart2 },
        { name: 'Responses', href: '/app/responses', icon: MessageCircle },
        { name: 'Disputes', href: '/app/disputes', icon: Flag },
        { name: 'Requests', href: '/app/requests', icon: Send },
    ];
    const isFutureFuncSection = pathname.startsWith('/app/analytics') || pathname.startsWith('/app/responses') || pathname.startsWith('/app/disputes') || pathname.startsWith('/app/requests');

    const contactChildren = [
        { name: 'All Contacts', href: '/app/contacts', icon: Users },
        { name: 'Search Businesses', href: '/app/admin/search-businesses', icon: Search },
        { name: 'Automations', href: '/app/automations', icon: Bot },
        { name: 'Lists', href: '/app/contact-lists', icon: ListChecks },
    ];
    const isContactsSection = pathname.startsWith('/app/contacts') || pathname.startsWith('/app/admin/search-businesses') || pathname.startsWith('/app/automations') || pathname.startsWith('/app/contact-lists');

    const adminDashboardChildren = [
        { name: 'Overview', href: '/app/admin/dashboard' },
        { name: 'Users', href: '/app/admin/dashboard/users' },
        { name: 'Negative Review Reports', href: '/app/admin/dashboard/scans' },
        { name: 'Overview Reports', href: '/app/admin/dashboard/reports' },
    ];
    const isAdminDashboardSection = pathname.startsWith('/app/admin/dashboard');

    const visibleNav = navigation.filter((item) => !('adminOnly' in item && item.adminOnly) || isAdmin);

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    const isNavActive = (href: string) => {
        if (href === '/app') return pathname === '/app';
        return pathname.startsWith(href);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-200 ease-in-out z-30 flex flex-col
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>

                <div className="h-16 flex-shrink-0 flex items-center justify-between px-4 border-b dark:border-gray-800">
                    <Link href="/app" className="flex items-center gap-2">
                        <Image
                            src="/logo.png"
                            alt="Reach Them AI"
                            width={250}
                            height={250}
                            className="w-[250px] h-auto object-contain"
                        />
                    </Link>
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Navigation — scrollable so all links (including Admin) are accessible */}
                <nav className="flex-1 min-h-0 overflow-y-auto mt-4 px-2 space-y-1 pb-2">
                    {visibleNav.map((item) => {
                        const active = isNavActive(item.href);
                        const linkClasses = active
                            ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100';
                        const iconClasses = active ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500';
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${linkClasses}`}
                            >
                                <item.icon className={`mr-3 h-5 w-5 ${iconClasses}`} />
                                {item.name}
                            </Link>
                        );
                    })}

                    {/* Future Functionality — admin only, dark red; submenu: Analytics, Responses, Disputes */}
                    {isAdmin && (
                        <div>
                            <button
                                onClick={() => setFutureFuncOpen(!isFutureFuncOpen)}
                                className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                    isFutureFuncSection
                                        ? 'bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-400'
                                        : 'text-red-800 dark:text-red-400 hover:bg-red-50 hover:text-red-900 dark:hover:bg-red-950/30 dark:hover:text-red-300'
                                }`}
                            >
                                <Sparkles
                                    className={`mr-3 h-5 w-5 ${
                                        isFutureFuncSection ? 'text-red-700 dark:text-red-400' : 'text-red-600 dark:text-red-500 group-hover:text-red-700 dark:group-hover:text-red-400'
                                    }`}
                                />
                                Future Functionality
                                {isFutureFuncOpen || isFutureFuncSection ? (
                                    <ChevronDown className="ml-auto h-4 w-4 opacity-60" />
                                ) : (
                                    <ChevronRight className="ml-auto h-4 w-4 opacity-60" />
                                )}
                            </button>
                            {(isFutureFuncOpen || isFutureFuncSection) && (
                                <div className="mt-1 ml-4 space-y-1 border-l-2 border-red-100 dark:border-red-900/50 pl-3">
                                    {futureFuncChildren.map((child) => {
                                        const active = isNavActive(child.href);
                                        return (
                                            <Link
                                                key={child.href}
                                                href={child.href}
                                                onClick={() => setSidebarOpen(false)}
                                                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                                    active
                                                        ? 'bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-400'
                                                        : 'text-red-700 dark:text-red-500 hover:bg-red-50 hover:text-red-900 dark:hover:bg-red-950/30 dark:hover:text-red-300'
                                                }`}
                                            >
                                                <child.icon
                                                    className={`mr-2 h-4 w-4 ${
                                                        active ? 'text-red-700 dark:text-red-400' : 'text-red-600 dark:text-red-500 group-hover:text-red-700 dark:group-hover:text-red-400'
                                                    }`}
                                                />
                                                {child.name}
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Docs with submenu */}
                    <div>
                        <button
                            onClick={() => setDocsOpen(!isDocsOpen)}
                            className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                        >
                            <FileText className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                            Docs
                            {isDocsOpen ? (
                                <ChevronDown className="ml-auto h-4 w-4 opacity-60" />
                            ) : (
                                <ChevronRight className="ml-auto h-4 w-4 opacity-60" />
                            )}
                        </button>
                        {isDocsOpen && (
                            <div className="mt-1 ml-4 space-y-1 border-l-2 border-gray-100 dark:border-gray-800 pl-3">
                                {docsSubmenu.map((child) => (
                                    <Link
                                        key={child.href + child.name}
                                        href={child.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                                    >
                                        <child.icon className="mr-2 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                                        {child.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Settings with submenu */}
                    <div>
                        <button
                            onClick={() => setSettingsOpen(!isSettingsOpen)}
                            className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                isSettingsSection
                                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100'
                            }`}
                        >
                            <Settings
                                className={`mr-3 h-5 w-5 ${
                                    isSettingsSection ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                                }`}
                            />
                            Settings
                            {isSettingsOpen || isSettingsSection
                                ? <ChevronDown className="ml-auto h-4 w-4 opacity-60" />
                                : <ChevronRight className="ml-auto h-4 w-4 opacity-60" />
                            }
                        </button>

                        {(isSettingsOpen || isSettingsSection) && (
                            <div className="mt-1 ml-4 space-y-1 border-l-2 border-gray-100 dark:border-gray-800 pl-3">
                                {settingsChildren.map((child) => {
                                    const active = pathname === child.href || pathname.startsWith(child.href + '/');
                                    return (
                                        <Link
                                            key={child.href}
                                            href={child.href}
                                            onClick={() => setSidebarOpen(false)}
                                            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                                active
                                                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100'
                                            }`}
                                        >
                                            <child.icon
                                                className={`mr-2 h-4 w-4 ${
                                                    active ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                                                }`}
                                            />
                                            {child.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    {/* Contact Us link — all users */}
                    <Link
                        href="/contact"
                        onClick={() => setSidebarOpen(false)}
                        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                            pathname === '/contact'
                                ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100'
                        }`}
                    >
                        <Mail
                            className={`mr-3 h-5 w-5 ${
                                pathname === '/contact' ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                            }`}
                        />
                        Contact Us
                    </Link>

                    {/* Admin section — admins only */}
                    {isAdmin && (
                        <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                            <p className="px-2 pb-1 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                                Admin
                            </p>
                            <div>
                                <button
                                    type="button"
                                    onClick={() => setAdminDashboardOpen(!isAdminDashboardOpen)}
                                    className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                        isAdminDashboardSection
                                            ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100'
                                    }`}
                                >
                                    <BarChart2
                                        className={`mr-3 h-5 w-5 ${
                                            isAdminDashboardSection ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                                        }`}
                                    />
                                    Dashboard
                                    {isAdminDashboardOpen || isAdminDashboardSection ? (
                                        <ChevronDown className="ml-auto h-4 w-4 opacity-60" />
                                    ) : (
                                        <ChevronRight className="ml-auto h-4 w-4 opacity-60" />
                                    )}
                                </button>
                                {(isAdminDashboardOpen || isAdminDashboardSection) && (
                                    <div className="mt-1 ml-4 space-y-1 border-l-2 border-gray-100 dark:border-gray-800 pl-3">
                                        {adminDashboardChildren.map((child) => {
                                            const overviewExact = child.href === '/app/admin/dashboard';
                                            const active = overviewExact
                                                ? pathname === '/app/admin/dashboard'
                                                : pathname === child.href || pathname.startsWith(child.href + '/');
                                            return (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    onClick={() => setSidebarOpen(false)}
                                                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                                        active
                                                            ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                                                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100'
                                                    }`}
                                                >
                                                    <span
                                                        className={
                                                            active ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                                                        }
                                                    >
                                                        {child.name}
                                                    </span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                            <Link
                                href="/app/admin/removal-requests"
                                onClick={() => setSidebarOpen(false)}
                                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                    pathname.startsWith('/app/admin/removal-requests')
                                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100'
                                }`}
                            >
                                <Trash2
                                    className={`mr-3 h-5 w-5 ${
                                        pathname.startsWith('/app/admin/removal-requests') ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                                    }`}
                                />
                                Removal Requests
                            </Link>
                            <Link
                                href="/app/admin/submissions"
                                onClick={() => setSidebarOpen(false)}
                                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                    pathname.startsWith('/app/admin/submissions')
                                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100'
                                }`}
                            >
                                <ShieldCheck
                                    className={`mr-3 h-5 w-5 ${
                                        pathname.startsWith('/app/admin/submissions') ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                                    }`}
                                />
                                Submissions
                            </Link>
                            <Link
                                href="/app/admin/knowledge-base"
                                onClick={() => setSidebarOpen(false)}
                                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                    pathname.startsWith('/app/admin/knowledge-base')
                                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100'
                                }`}
                            >
                                <BookOpen
                                    className={`mr-3 h-5 w-5 ${
                                        pathname.startsWith('/app/admin/knowledge-base') ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                                    }`}
                                />
                                Knowledge Base
                            </Link>
                            <div>
                                <button
                                    onClick={() => setContactsOpen(!isContactsOpen)}
                                    className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                        isContactsSection
                                            ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100'
                                    }`}
                                >
                                    <Users
                                        className={`mr-3 h-5 w-5 ${
                                            isContactsSection ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                                        }`}
                                    />
                                    Contacts
                                    {isContactsOpen || isContactsSection ? (
                                        <ChevronDown className="ml-auto h-4 w-4 opacity-60" />
                                    ) : (
                                        <ChevronRight className="ml-auto h-4 w-4 opacity-60" />
                                    )}
                                </button>
                                {(isContactsOpen || isContactsSection) && (
                                    <div className="mt-1 ml-4 space-y-1 border-l-2 border-gray-100 dark:border-gray-800 pl-3">
                                        {contactChildren.map((child) => {
                                            const active = isNavActive(child.href) || (child.href === '/app/contact-lists' && pathname.startsWith('/app/contact-lists'));
                                            return (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    onClick={() => setSidebarOpen(false)}
                                                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                                        active
                                                            ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                                                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100'
                                                    }`}
                                                >
                                                    <child.icon
                                                        className={`mr-2 h-4 w-4 ${
                                                            active ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                                                        }`}
                                                    />
                                                    {child.name}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                            <Link
                                href="/app/admin/settings"
                                onClick={() => setSidebarOpen(false)}
                                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                    pathname.startsWith('/app/admin/settings')
                                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100'
                                }`}
                            >
                                <Settings
                                    className={`mr-3 h-5 w-5 ${
                                        pathname.startsWith('/app/admin/settings') ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                                    }`}
                                />
                                Admin Settings
                            </Link>
                        </div>
                    )}
                </nav>

                {/* Bottom logout */}
                <div className="flex-shrink-0 px-2 py-4 border-t dark:border-gray-800">
                    <button
                        type="button"
                        onClick={async () => {
                            setSidebarOpen(false);
                            const client = await createSPASassClient();
                            await client.logout();
                        }}
                        className="group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                    >
                        <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                        Log out
                    </button>
                </div>
            </div>

            <div className="lg:pl-64">
                <Navbar
                    variant="sticky"
                    background="white"
                    showLogo={false}
                    hideNavLinks={true}
                    navVariant="marketing"
                    leftContent={
                        <Link href="/app" className="lg:hidden flex items-center shrink-0">
                            <Image
                                src="/logo.png"
                                alt="Reach Them AI"
                                width={250}
                                height={250}
                                className="w-[250px] h-auto object-contain"
                            />
                        </Link>
                    }
                    rightContent={
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            aria-label="Open menu"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    }
                />

                <main className="p-4">
                    {children}
                    <AppProfileGate />
                </main>
            </div>
        </div>
    );
}
