'use client';

import { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '@/app/actions/user-profile';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, User, Mail, Phone, Building2 } from 'lucide-react';
import { toast } from 'sonner';

export interface ModifyProfileModalProps {
  /** When true, only the dialog is rendered (controlled open). No trigger button. */
  hideTrigger?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  triggerLabel?: string;
  triggerVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  triggerSize?: 'default' | 'sm' | 'lg' | 'icon';
  triggerClassName?: string;
  /** Called after profile is successfully updated (e.g. to refresh parent state). */
  onSuccess?: () => void;
}

export default function ModifyProfileModal({
  hideTrigger = false,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  triggerLabel = 'Modify Profile',
  triggerVariant = 'outline',
  triggerSize = 'sm',
  triggerClassName,
  onSuccess,
}: ModifyProfileModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOnOpenChange !== undefined || controlledOpen !== undefined;
  const open = isControlled ? (controlledOpen ?? false) : internalOpen;

  const [profile, setProfile] = useState<{
    full_name: string | null;
    email: string | null;
    phone_number: string | null;
    company_name: string | null;
    auth_email: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    company_name: '',
  });

  const loadProfile = () => {
    setLoading(true);
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
  };

  useEffect(() => {
    if (open) loadProfile();
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUserProfile({
        full_name: form.full_name || null,
        email: form.email || null,
        phone_number: form.phone_number || null,
        company_name: form.company_name || null,
      });
      toast.success('Profile Information Updated');
      handleOpenChange(false);
      onSuccess?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenChange = (next: boolean) => {
    if (isControlled && controlledOnOpenChange) controlledOnOpenChange(next);
    else if (!isControlled) setInternalOpen(next);
  };

  return (
    <>
      {!hideTrigger && (
        <Button
          variant={triggerVariant}
          size={triggerSize}
          className={triggerClassName}
          onClick={() => handleOpenChange(true)}
        >
          {triggerLabel}
        </Button>
      )}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Profile information</DialogTitle>
            <DialogDescription>
              This information can be used to pre-fill removal request forms. Use your registered email for the Email Address.
            </DialogDescription>
          </DialogHeader>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="modal-full_name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="modal-full_name"
                    type="text"
                    placeholder="Your name"
                    className="pl-10"
                    value={form.full_name}
                    onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="modal-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="modal-email"
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
                <label htmlFor="modal-phone_number" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="modal-phone_number"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="pl-10"
                    value={form.phone_number}
                    onChange={(e) => setForm((f) => ({ ...f, phone_number: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="modal-company_name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Company Name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="modal-company_name"
                    type="text"
                    placeholder="Your company"
                    className="pl-10"
                    value={form.company_name}
                    onChange={(e) => setForm((f) => ({ ...f, company_name: e.target.value }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
