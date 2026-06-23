import type { Metadata } from 'next';

const documentMetadata: Record<string, { title: string; description: string }> = {
  privacy: {
    title: 'Privacy Policy',
    description:
      'Reach Them AI Privacy Policy. How we collect, use, and protect your data when you use our review removal and reputation management services.',
  },
  terms: {
    title: 'Terms of Service',
    description:
      'Reach Them AI Terms of Service. Rules and guidelines for using our review removal, reputation management, and related services.',
  },
  refund: {
    title: 'Refund Policy',
    description:
      'Reach Them AI Refund Policy. Our policy on refunds and cancellations for review removal and subscription services.',
  },
};

type DocumentId = keyof typeof documentMetadata;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ document: string }>;
}): Promise<Metadata> {
  const { document: doc } = await params;
  const meta = documentMetadata[doc as DocumentId];
  if (!meta) {
    return { title: 'Legal | Reach Them AI' };
  }
  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: `${meta.title} | Reach Them AI`,
      description: meta.description,
      images: ['/featured.png'],
      type: 'website',
    },
  };
}

export default function LegalDocumentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
