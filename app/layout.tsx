import type { Metadata } from "next";
import "./globals.css";

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
    return (
        <html lang="en">
            <body className={theme}>
                {children}
            </body>
        </html>
    );
}
