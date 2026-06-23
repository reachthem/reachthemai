'use client';

import React, { useState } from 'react';
import {
  Settings,
  Key,
  User,
  CheckCircle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useGlobal } from '@/lib/context/GlobalContext';
import { createSPASassClientAuthenticated as createSPASassClient } from '@/lib/supabase/client';
import UserInfoForm from './UserInfoForm';
import GetStartedGuide from '@/components/app/GetStartedGuide';

export default function SettingsPage() {
  const { user } = useGlobal();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("New passwords don't match");
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const supabase = await createSPASassClient();
      const client = supabase.getSupabaseClient();
      const { error } = await client.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setSuccess('Password updated successfully');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: Error | unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Get Started */}
      <GetStartedGuide />

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-gray-600" />
            <div>
              <CardTitle>Settings</CardTitle>
              <CardDescription>
                Connect review platforms, manage integrations, and configure your account
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div id="profile">
        <UserInfoForm />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Details
          </CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-500 dark:text-slate-400">User ID</label>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{user?.id}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Email</label>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{user?.email}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Change Password
          </CardTitle>
          <CardDescription>Update your account password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                New Password
              </label>
              <Input
                type="password"
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1"
                required
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Confirm New Password
              </label>
              <Input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1"
                required
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </CardContent>
      </Card>

    </div>
  );
}
