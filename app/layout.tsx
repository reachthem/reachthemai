import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from '@vercel/analytics/next';
import CookieConsent from "@/components/Cookies";
import { GoogleAnalytics } from '@next/third-parties/google';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://reachthemai.com';

export const metadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title: {
        default: "Reach Them AI — Reputation Management Platform",
        template: "%s | Reach Them AI",
    },
    description:
        "Protect and grow your business reputation. Monitor reviews, generate AI responses, remove fake reviews, and get more 5-star ratings across Google, Yelp, Facebook, and Trustpilot.",
    keywords: [
        "review management",
        "reputation management",
        "remove fake reviews",
        "Google reviews",
        "Yelp reviews",
        "online reputation",
        "review monitoring",
        "AI review responses",
        "5-star reviews",
    ],
    openGraph: {
        images: ['/featured.png'],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/featured.png'],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    let theme = process.env.NEXT_PUBLIC_THEME;
    if (!theme) {
        theme = "theme-review";
    }
    const gaID = process.env.NEXT_PUBLIC_GOOGLE_TAG;
    return (
        <html lang="en">
            <head>
                {/* Google tag (gtag.js) - Google Ads */}
                <script
                    async
                    src="https://www.googletagmanager.com/gtag/js?id=AW-17986224579"
                />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-17986224579');
`,
                    }}
                />
            </head>
            <body className={theme}>
                {children}
                <Analytics />
                <CookieConsent />
                {gaID && <GoogleAnalytics gaId={gaID} />}
            </body>
        </html>
    );
}
