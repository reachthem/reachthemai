'use client';

import { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '@/app/actions/user-profile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, User, Mail, Phone, Building2 } from 'lucide-react';

export default function UserInfoForm() {
  const [profile, setProfile] = useState<{
    full_name: string | null;
    email: string | null;
    phone_number: string | null;
    company_name: string | null;
    auth_email: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    company_name: '',
  });

  useEffect(() => {
    getUserProfile()
      .then((p) => {
        setProfile(p);
        setForm({
          full_name: p.full_name ?? '',
          email: p.email ?? p.auth_email ?? '',
          phone_number: p.phone_number ?? '',
          company_name: p.company_name ?? '',
        });
      })
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSaving(true);
    try {
      await updateUserProfile({
        full_name: form.full_name || null,
        email: form.email || null,
        phone_number: form.phone_number || null,
        company_name: form.company_name || null,
      });
      setMessage({ type: 'success', text: 'Saved.' });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to save.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Information</CardTitle>
        <CardDescription>
          This information can be used to pre-fill removal request forms. Use your registered email for the Email Address.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="full_name"
                type="text"
                placeholder="Your name"
                className="pl-10"
                value={form.full_name}
                onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="pl-10"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            {profile?.auth_email && !profile?.email && (
              <p className="mt-1 text-xs text-slate-500">Using your registered account email.</p>
            )}
          </div>
          <div>
            <label htmlFor="phone_number" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="phone_number"
                type="tel"
                placeholder="+1 (555) 000-0000"
                className="pl-10"
                value={form.phone_number}
                onChange={(e) => setForm((f) => ({ ...f, phone_number: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <label htmlFor="company_name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Company Name
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="company_name"
                type="text"
                placeholder="Your company"
                className="pl-10"
                value={form.company_name}
                onChange={(e) => setForm((f) => ({ ...f, company_name: e.target.value }))}
              />
            </div>
          </div>
          {message && (
            <p className={message.type === 'success' ? 'text-sm text-green-600' : 'text-sm text-red-600'}>
              {message.text}
            </p>
          )}
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
