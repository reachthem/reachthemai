import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getContact } from '@/app/actions/contacts';
import ContactDetailsModal from '@/components/contacts/ContactDetailsModal';
import type { ContactForModal } from '@/components/contacts/ContactDetailsModal';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Saved contact details.',
};

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string }> };

export default async function ContactDetailPage({ params }: Props) {
  const { id } = await params;
  const contact = await getContact(id);
  if (!contact) notFound();

  const automationId = contact.automation_id;

  const contactForModal: ContactForModal = {
    id: contact.id,
    name: contact.name,
    address: contact.address,
    phone: contact.phone,
    website: contact.website,
    rating: contact.rating,
    total_reviews: contact.total_reviews,
    primary_type: contact.primary_type,
    maps_url: contact.maps_url,
    created_at: contact.created_at,
    email_address: contact.email_address ?? undefined,
    contact_first_name: contact.contact_first_name ?? undefined,
    contact_last_name: contact.contact_last_name ?? undefined,
    email_validation_status: contact.email_validation_status ?? undefined,
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
        <Link href="/app/contacts" className="hover:text-slate-700 dark:hover:text-slate-300">Contacts</Link>
        {automationId && (
          <>
            <span>/</span>
            <Link href={`/app/automations/${automationId}`} className="hover:text-slate-700 dark:hover:text-slate-300">Automation</Link>
          </>
        )}
        <span>/</span>
        <span className="text-slate-900 dark:text-white truncate">{contact.name || 'Contact'}</span>
      </nav>

      <ContactDetailsModal
        contact={contactForModal}
        open={true}
        onClose={() => {}}
        standalone
      />
    </div>
  );
}
