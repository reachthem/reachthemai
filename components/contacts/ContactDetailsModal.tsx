'use client';

import { useState, useEffect } from 'react';
import { User, Phone, Briefcase, MapPin, FileText, Star, Clipboard, Pencil, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateContact } from '@/app/actions/contacts';
import { toast } from 'sonner';

export type ContactForModal = {
  id: string;
  name: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  rating: number | null;
  total_reviews: number | null;
  primary_type: string | null;
  maps_url: string | null;
  created_at?: string;
  email_address?: string | null;
  contact_first_name?: string | null;
  contact_last_name?: string | null;
  email_validation_status?: string | null;
};

interface ContactDetailsModalProps {
  contact: ContactForModal | null;
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
  /** When true, render as inline page content (no overlay). Use for /app/contact/[id] page. */
  standalone?: boolean;
}

const inputClass =
  'w-full rounded-xl border border-secondary-200 bg-white px-4 py-2.5 text-secondary-900 placeholder:text-secondary-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all';

export default function ContactDetailsModal({ contact, open, onClose, onSaved, standalone }: ContactDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: '',
    website: '',
    contact_first_name: '',
    contact_last_name: '',
    email_address: '',
    email_validation_status: '' as string,
    rating: '' as string,
    total_reviews: '' as string,
    primary_type: '',
  });

  useEffect(() => {
    if (contact && open) {
      setForm({
        name: contact.name ?? '',
        address: contact.address ?? '',
        phone: contact.phone ?? '',
        website: contact.website ?? '',
        contact_first_name: contact.contact_first_name ?? '',
        contact_last_name: contact.contact_last_name ?? '',
        email_address: contact.email_address && contact.email_address !== 'not_found' ? contact.email_address : '',
        email_validation_status: contact.email_validation_status ?? '',
        rating: contact.rating != null ? String(contact.rating) : '',
        total_reviews: contact.total_reviews != null ? String(contact.total_reviews) : '',
        primary_type: contact.primary_type ?? '',
      });
    }
  }, [contact, open]);

  useEffect(() => {
    if (!open) setIsEditing(false);
  }, [open]);

  const displayName = contact
    ? [contact.contact_first_name, contact.contact_last_name].filter(Boolean).join(' ') || contact.name || '—'
    : '—';

  const handleStartEdit = () => {
    if (contact) {
      setForm({
        name: contact.name ?? '',
        address: contact.address ?? '',
        phone: contact.phone ?? '',
        website: contact.website ?? '',
        contact_first_name: contact.contact_first_name ?? '',
        contact_last_name: contact.contact_last_name ?? '',
        email_address: contact.email_address && contact.email_address !== 'not_found' ? contact.email_address : '',
        email_validation_status: contact.email_validation_status ?? '',
        rating: contact.rating != null ? String(contact.rating) : '',
        total_reviews: contact.total_reviews != null ? String(contact.total_reviews) : '',
        primary_type: contact.primary_type ?? '',
      });
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!contact) return;
    setSaving(true);
    try {
      await updateContact(contact.id, {
        name: form.name.trim() || null,
        address: form.address.trim() || null,
        phone: form.phone.trim() || null,
        website: form.website.trim() || null,
        contact_first_name: form.contact_first_name.trim() || null,
        contact_last_name: form.contact_last_name.trim() || null,
        email_address: form.email_address.trim() || null,
        email_validation_status: form.email_validation_status.trim() || null,
        rating: form.rating.trim() ? parseFloat(form.rating) : null,
        total_reviews: form.total_reviews.trim() ? parseInt(form.total_reviews, 10) : null,
        primary_type: form.primary_type.trim() || null,
      });
      toast.success('Contact updated.');
      setIsEditing(false);
      onSaved?.();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to update contact');
    } finally {
      setSaving(false);
    }
  };

  if (!open && !standalone) return null;
  const isStandalone = standalone && contact;

  return (
    <div className={isStandalone ? 'w-full' : 'fixed inset-0 z-50 flex items-center justify-center p-4'}>
      {!isStandalone && <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />}
      <div className={`relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-w-[100%] md:max-w-2xl overflow-hidden flex flex-col ${isStandalone ? '' : 'max-h-[90vh]'}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <User className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-bold truncate">{displayName}</h2>
              <p className="text-white/90 text-sm truncate">{contact?.name ?? '—'}</p>
              {contact?.maps_url && (
                <a
                  href={contact.maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 text-xs inline-flex items-center gap-0.5 hover:underline mt-0.5"
                >
                  Google Places
                  <span className="inline-block ml-0.5">↗</span>
                </a>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {contact && !isEditing && (
              <button
                type="button"
                onClick={handleStartEdit}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
                title="Edit"
              >
                <Pencil className="h-5 w-5" />
              </button>
            )}
            {isStandalone ? (
              <a
                href="/app/contacts"
                className="p-2 rounded-full hover:bg-white/20 transition-colors text-white"
                aria-label="Back to contacts"
              >
                <X className="h-5 w-5" />
              </a>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {!contact ? (
            <p className="text-secondary-500">No contact data.</p>
          ) : isEditing ? (
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-xl border border-secondary-200 p-4 space-y-4">
                  <h3 className="font-semibold text-secondary-900 flex items-center gap-2">
                    <User className="h-4 w-4 text-primary-500" />
                    Contact Details
                  </h3>
                  <div>
                    <Label className="text-sm font-medium text-secondary-700">Phone</Label>
                    <Input
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      placeholder="(555) 123-4567"
                      className={`mt-1 ${inputClass}`}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-secondary-700">Contact first name</Label>
                    <Input
                      value={form.contact_first_name}
                      onChange={(e) => setForm((f) => ({ ...f, contact_first_name: e.target.value }))}
                      placeholder="First name"
                      className={`mt-1 ${inputClass}`}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-secondary-700">Contact last name</Label>
                    <Input
                      value={form.contact_last_name}
                      onChange={(e) => setForm((f) => ({ ...f, contact_last_name: e.target.value }))}
                      placeholder="Last name"
                      className={`mt-1 ${inputClass}`}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-secondary-700">Location / Address</Label>
                    <Input
                      value={form.address}
                      onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                      placeholder="Street, City, State"
                      className={`mt-1 ${inputClass}`}
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-secondary-200 p-4 space-y-4">
                  <h3 className="font-semibold text-secondary-900 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary-500" />
                    Company & Engagement
                  </h3>
                  <div>
                    <Label className="text-sm font-medium text-secondary-700">Company name</Label>
                    <Input
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Business name"
                      className={`mt-1 ${inputClass}`}
                    />
                  </div>
                  <div className="text-sm text-secondary-500">Emails sent: 0</div>
                  <div>
                    <Label className="text-sm font-medium text-secondary-700">Average rating</Label>
                    <Input
                      type="number"
                      min={0}
                      max={5}
                      step={0.1}
                      value={form.rating}
                      onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))}
                      placeholder="e.g. 4.5"
                      className={`mt-1 ${inputClass}`}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-secondary-700">Total reviews</Label>
                    <Input
                      type="number"
                      min={0}
                      value={form.total_reviews}
                      onChange={(e) => setForm((f) => ({ ...f, total_reviews: e.target.value }))}
                      placeholder="e.g. 100"
                      className={`mt-1 ${inputClass}`}
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-secondary-200 p-4 space-y-4 md:col-span-2">
                  <h3 className="font-semibold text-secondary-900 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary-500" />
                    Additional Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-secondary-700">Website</Label>
                      <Input
                        type="url"
                        value={form.website}
                        onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                        placeholder="https://..."
                        className={`mt-1 ${inputClass}`}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-secondary-700">Business type</Label>
                      <Input
                        value={form.primary_type}
                        onChange={(e) => setForm((f) => ({ ...f, primary_type: e.target.value }))}
                        placeholder="e.g. Store, Restaurant"
                        className={`mt-1 ${inputClass}`}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-secondary-700">Email</Label>
                      <Input
                        type="email"
                        value={form.email_address}
                        onChange={(e) => setForm((f) => ({ ...f, email_address: e.target.value }))}
                        placeholder="contact@example.com"
                        className={`mt-1 ${inputClass}`}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-secondary-700">Email validation status</Label>
                      <select
                        value={form.email_validation_status}
                        onChange={(e) => setForm((f) => ({ ...f, email_validation_status: e.target.value }))}
                        className={`mt-1 ${inputClass}`}
                      >
                        <option value="">Not attempted</option>
                        <option value="validated">Validated</option>
                        <option value="not_valid">Not valid</option>
                      </select>
                    </div>
                  </div>
                  {contact.created_at && (
                    <p className="text-sm text-secondary-500">
                      Subscribe date: {new Date(contact.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-500 transition-all disabled:opacity-50"
                >
                  {saving && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  )}
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={saving}
                  className="px-6 py-3 rounded-xl border border-secondary-200 text-secondary-700 font-medium hover:bg-secondary-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-secondary-200 p-4 space-y-3">
                  <h3 className="font-semibold text-secondary-900 flex items-center gap-2">
                    <User className="h-4 w-4 text-primary-500" />
                    Contact Details
                  </h3>
                {contact.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-secondary-400" />
                    <span className="text-secondary-700">PHONE:</span>
                    <a href={`tel:${contact.phone}`} className="text-primary-600 hover:underline">
                      {contact.phone}
                    </a>
                  </div>
                )}
                {(contact.contact_first_name || contact.contact_last_name) && (
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="h-4 w-4 text-secondary-400" />
                    <span className="text-secondary-700">CONTACT:</span>
                    <span>{[contact.contact_first_name, contact.contact_last_name].filter(Boolean).join(' ')}</span>
                  </div>
                )}
                {contact.address && (
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-secondary-400 mt-0.5" />
                    <div>
                      <span className="text-secondary-700 block">LOCATION:</span>
                      <span className="text-secondary-900">{contact.address}</span>
                    </div>
                  </div>
                )}
                {!contact.phone && !contact.address && !contact.contact_first_name && !contact.contact_last_name && (
                  <p className="text-secondary-500 text-sm">—</p>
                )}
                </div>

                <div className="rounded-xl border border-secondary-200 p-4 space-y-3">
                  <h3 className="font-semibold text-secondary-900 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary-500" />
                    Company & Engagement
                  </h3>
                <div className="text-sm">
                  <span className="text-secondary-700">COMPANY:</span>
                  <span className="ml-2 text-secondary-900">{contact.name ?? '—'}</span>
                </div>
                <div className="text-sm">
                  <span className="text-secondary-700">EMAILS SENT:</span>
                  <span className="ml-2">0</span>
                </div>
                {contact.rating != null && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-secondary-700">AVERAGE RATING:</span>
                    <span className="flex items-center gap-0.5">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      {contact.rating}
                    </span>
                  </div>
                )}
                {contact.total_reviews != null && (
                  <div className="text-sm">
                    <span className="text-secondary-700">TOTAL REVIEWS:</span>
                    <span className="ml-2 font-semibold">{contact.total_reviews}</span>
                  </div>
                )}
                </div>
              </div>

              <div className="rounded-xl border border-secondary-200 p-4 space-y-3">
                <h3 className="font-semibold text-secondary-900 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary-500" />
                  Additional Information
                </h3>
                <div className="text-sm">
                  <span className="text-secondary-700">STATUS:</span>
                  <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                    ✓ Active
                  </span>
                </div>
                {contact.created_at && (
                  <div className="text-sm">
                    <span className="text-secondary-700">SUBSCRIBE DATE:</span>
                    <span className="ml-2">{new Date(contact.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                )}
                {contact.primary_type && (
                  <div className="text-sm">
                    <span className="text-secondary-700">BUSINESS TYPES:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs">
                        {contact.primary_type}
                      </span>
                    </div>
                  </div>
                )}
                {contact.email_address && contact.email_address !== 'not_found' && (
                  <div className="text-sm">
                    <span className="text-secondary-700">EMAIL:</span>
                    <span className="ml-2">{contact.email_address}</span>
                    {contact.email_validation_status && (
                      <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                        contact.email_validation_status === 'validated' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {contact.email_validation_status === 'validated' ? 'Validated' : 'Not valid'}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-secondary-200 p-4">
                <h3 className="font-semibold text-secondary-900 flex items-center gap-2 mb-2">
                  <Clipboard className="h-4 w-4 text-primary-500" />
                  Notes
                </h3>
                <p className="text-sm text-secondary-500 bg-secondary-50 rounded-lg p-3">
                  To add notes, click on the edit button in the top right.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
