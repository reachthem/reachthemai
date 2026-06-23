'use client';

import { useState } from 'react';
import { Globe, Palette, CreditCard, Zap, Settings2, Bell, Loader2, ExternalLink } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { updateAdminSettingsBulk } from '@/app/actions/admin-settings';
import type { AdminSetting } from '@/app/actions/admin-settings';
import { AIModelSelect, AI_MODELS } from '@/components/ui/ai-model-select';

interface AdminSettingsFormProps {
  settings: AdminSetting[];
}

function SettingField({
  label,
  description,
  value,
  onChange,
  placeholder,
  type = 'text',
  min,
  max,
  step,
}: {
  label: string;
  description?: string | null;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: 'text' | 'number' | 'email' | 'color';
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        className={type === 'color' ? 'h-10 w-20 cursor-pointer' : ''}
      />
    </div>
  );
}

function ToggleField({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string | null;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 rounded border-input"
      />
      <div>
        <label className="text-sm font-medium">{label}</label>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}

export default function AdminSettingsForm({ settings }: AdminSettingsFormProps) {
  const [local, setLocal] = useState<Record<string, string>>(() =>
    Object.fromEntries(settings.map((s) => [s.option_key, s.option_value ?? '']))
  );
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [savingAll, setSavingAll] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setValue = (key: string, value: string) => {
    setLocal((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  const handleSectionSave = async (updates: Record<string, string>) => {
    const sectionKey = Object.keys(updates)[0]?.split('.')[0] ?? 'section';
    setSavingSection(sectionKey);
    setError(null);
    try {
      const result = await updateAdminSettingsBulk(updates);
      if (result.error) setError(result.error);
    } finally {
      setSavingSection(null);
    }
  };

  const handleSaveAll = async () => {
    setSavingAll(true);
    setError(null);
    try {
      const result = await updateAdminSettingsBulk(local);
      if (result.error) setError(result.error);
    } finally {
      setSavingAll(false);
    }
  };

  const appSettings = settings.filter((s) => s.option_key.startsWith('app.'));
  const themeSettings = settings.filter((s) => s.option_key.startsWith('theme.'));
  const pricingSettings = settings.filter(
    (s) => s.option_key.startsWith('stripe') || s.option_key === 'stripe_mode'
  );
  const aiSettings = settings.filter((s) => s.option_key.startsWith('ai.'));
  const aiContactSettings = settings.filter((s) => s.option_key.startsWith('ai_contact.'));
  const reportSettings = settings.filter((s) => s.option_key.startsWith('report.'));
  const featureSettings = settings.filter((s) => s.option_key.startsWith('features.'));
  const notificationSettings = settings.filter((s) =>
    s.option_key.startsWith('notifications.')
  );

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={handleSaveAll} disabled={savingAll}>
          {savingAll && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save All Settings
        </Button>
      </div>

      {/* AI Credit Usage */}
      <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-muted-foreground" />
              <CardTitle>AI Credit Usage</CardTitle>
            </div>
            <CardDescription>Total API usage across the application</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border bg-card p-4">
                <p className="text-sm font-medium text-muted-foreground">OpenRouter API Calls</p>
                <p className="text-2xl font-bold">{local['usage.openrouter_calls'] ?? '0'}</p>
                <p className="text-xs text-muted-foreground mt-1">Total OpenRouter API calls made</p>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <p className="text-sm font-medium text-muted-foreground">OpenRouter Token Credits (×1000)</p>
                <p className="text-2xl font-bold">{(parseFloat(local['usage.openrouter_tokens'] ?? '0') || 0).toFixed(1)}</p>
                <p className="text-xs text-muted-foreground mt-1">Sum of tokens_used/1000 per OpenRouter request</p>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <p className="text-sm font-medium text-muted-foreground">Google Places API Calls</p>
                <p className="text-2xl font-bold">{local['usage.google_places_calls'] ?? '0'}</p>
                <p className="text-xs text-muted-foreground mt-1">Total Google Places API calls made</p>
              </div>
            </div>
          </CardContent>
        </Card>

      {/* Application */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Application Settings</CardTitle>
          </div>
          <CardDescription>App name, tagline, and contact emails</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {appSettings.map((s) => (
            <SettingField
              key={s.option_key}
              label={s.option_label}
              description={s.option_description}
              value={local[s.option_key] ?? ''}
              onChange={(v) => setValue(s.option_key, v)}
              type={s.option_key.includes('email') ? 'email' : 'text'}
            />
          ))}
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              handleSectionSave(
                Object.fromEntries(
                  appSettings.map((s) => [s.option_key, local[s.option_key] ?? ''])
                )
              )
            }
            disabled={!!savingSection}
          >
            {savingSection === 'app' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Section
          </Button>
        </CardFooter>
      </Card>

      {/* Theme */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Theme & Appearance</CardTitle>
          </div>
          <CardDescription>Primary and accent brand colors</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {themeSettings.map((s) => (
            <SettingField
              key={s.option_key}
              label={s.option_label}
              description={s.option_description}
              value={local[s.option_key] ?? ''}
              onChange={(v) => setValue(s.option_key, v)}
              type="color"
            />
          ))}
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              handleSectionSave(
                Object.fromEntries(
                  themeSettings.map((s) => [s.option_key, local[s.option_key] ?? ''])
                )
              )
            }
            disabled={!!savingSection}
          >
            {savingSection === 'theme' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Section
          </Button>
        </CardFooter>
      </Card>

      {/* Pricing & Billing */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Pricing & Billing</CardTitle>
          </div>
          <CardDescription>Stripe mode, display prices, and price IDs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Stripe Mode</label>
            <select
              value={local['stripe_mode'] ?? 'sandbox'}
              onChange={(e) => setValue('stripe_mode', e.target.value)}
              className="mt-1 flex h-10 w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="sandbox">Sandbox (Test)</option>
              <option value="live">Live</option>
            </select>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SettingField
              label="Review Removal Price ($)"
              description="Display price on pricing page"
              value={local['stripe_review_removal_price'] ?? ''}
              onChange={(v) => setValue('stripe_review_removal_price', v)}
              type="number"
            />
            <SettingField
              label="AI Advisor Price ($/mo)"
              description="Display price for subscription"
              value={local['stripe_removal_advisor_price'] ?? ''}
              onChange={(v) => setValue('stripe_removal_advisor_price', v)}
              type="number"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Stripe Price IDs (Sandbox)</label>
            <div className="grid gap-4 sm:grid-cols-2">
              <SettingField
                label="Review Removal"
                value={local['stripe_price_id_review_removal_sandbox'] ?? ''}
                onChange={(v) =>
                  setValue('stripe_price_id_review_removal_sandbox', v)
                }
              />
              <SettingField
                label="AI Advisor (Sandbox)"
                value={local['stripe_price_id_removal_advisor_sandbox'] ?? ''}
                onChange={(v) =>
                  setValue('stripe_price_id_removal_advisor_sandbox', v)
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Stripe Price IDs (Live)</label>
            <div className="grid gap-4 sm:grid-cols-2">
              <SettingField
                label="Review Removal"
                value={local['stripe_price_id_review_removal_live'] ?? ''}
                onChange={(v) => setValue('stripe_price_id_review_removal_live', v)}
              />
              <SettingField
                label="AI Advisor (Live)"
                value={local['stripe_price_id_removal_advisor_live'] ?? ''}
                onChange={(v) =>
                  setValue('stripe_price_id_removal_advisor_live', v)
                }
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              handleSectionSave(
                Object.fromEntries(
                  pricingSettings.map((s) => [s.option_key, local[s.option_key] ?? ''])
                )
              )
            }
            disabled={!!savingSection}
          >
            {savingSection === 'stripe' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Section
          </Button>
        </CardFooter>
      </Card>

      {/* AI Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-muted-foreground" />
            <CardTitle>AI Configuration</CardTitle>
          </div>
          <CardDescription>Removal Advisor model and parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">AI Model (Removal Advisor)</label>
            <AIModelSelect
              value={local['ai.default_model'] ?? ''}
              onChange={(v) => setValue('ai.default_model', v)}
              models={AI_MODELS}
              className="mt-1 flex h-10 w-full max-w-md rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          {/* Temperature and Max Tokens rendered in grid below; advisor_prompt has textarea below */}
          {aiSettings.some((s) => s.option_key === 'ai.advisor_prompt') && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {aiSettings.find((s) => s.option_key === 'ai.advisor_prompt')?.option_label}
              </label>
              {aiSettings.find((s) => s.option_key === 'ai.advisor_prompt')?.option_description && (
                <p className="text-xs text-muted-foreground">
                  {aiSettings.find((s) => s.option_key === 'ai.advisor_prompt')?.option_description}
                </p>
              )}
              <textarea
                value={local['ai.advisor_prompt'] ?? ''}
                onChange={(e) => setValue('ai.advisor_prompt', e.target.value)}
                placeholder="System prompt for the Removal Advisor. Use {{platform}}, {{review_text}}, etc."
                rows={12}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          )}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {aiSettings
              .filter(
                (s) =>
                  s.option_key === 'ai.advisor_temperature' ||
                  s.option_key === 'ai.advisor_max_tokens'
              )
              .map((s) => (
                <SettingField
                  key={s.option_key}
                  label={s.option_label}
                  description={s.option_description}
                  value={local[s.option_key] ?? ''}
                  onChange={(v) => setValue(s.option_key, v)}
                  type="number"
                  min={s.option_key === 'ai.advisor_temperature' ? 0 : undefined}
                  max={s.option_key === 'ai.advisor_temperature' ? 1 : undefined}
                  step={s.option_key === 'ai.advisor_temperature' ? 0.1 : undefined}
                />
              ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              handleSectionSave(
                Object.fromEntries(
                  aiSettings.map((s) => [s.option_key, local[s.option_key] ?? ''])
                )
              )
            }
            disabled={!!savingSection}
          >
            {savingSection === 'ai' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Section
          </Button>
        </CardFooter>
      </Card>

      {/* Report Generation Settings */}
      {reportSettings.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Report Generation</CardTitle>
            </div>
            <CardDescription>AI models and options for the public Review Intelligence Report (lead magnet)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                {reportSettings.find((s) => s.option_key === 'report.keyword_model')?.option_label ?? 'Keyword & Sentiment Model'}
              </label>
              <p className="text-xs text-muted-foreground mb-1">
                {reportSettings.find((s) => s.option_key === 'report.keyword_model')?.option_description}
              </p>
              <AIModelSelect
                value={local['report.keyword_model'] ?? 'anthropic/claude-3.5-sonnet'}
                onChange={(v) => setValue('report.keyword_model', v)}
                models={AI_MODELS}
                className="mt-1 flex h-10 w-full max-w-md rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                {reportSettings.find((s) => s.option_key === 'report.recommendations_model')?.option_label ?? 'Recommendations Model'}
              </label>
              <p className="text-xs text-muted-foreground mb-1">
                {reportSettings.find((s) => s.option_key === 'report.recommendations_model')?.option_description}
              </p>
              <AIModelSelect
                value={local['report.recommendations_model'] ?? 'anthropic/claude-3.5-sonnet'}
                onChange={(v) => setValue('report.recommendations_model', v)}
                models={AI_MODELS}
                className="mt-1 flex h-10 w-full max-w-md rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                {reportSettings.find((s) => s.option_key === 'report.traffic_model')?.option_label ?? 'Search Traffic Model (Gemini)'}
              </label>
              <p className="text-xs text-muted-foreground mb-1">
                {reportSettings.find((s) => s.option_key === 'report.traffic_model')?.option_description}
              </p>
              <AIModelSelect
                value={local['report.traffic_model'] ?? 'google/gemini-2.0-flash'}
                onChange={(v) => setValue('report.traffic_model', v)}
                models={AI_MODELS}
                className="mt-1 flex h-10 w-full max-w-md rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {reportSettings
                .filter((s) => s.option_key === 'report.cache_ttl_days' || s.option_key === 'report.rate_limit_minutes')
                .map((s) => (
                  <SettingField
                    key={s.option_key}
                    label={s.option_label}
                    description={s.option_description}
                    value={local[s.option_key] ?? (s.option_key === 'report.cache_ttl_days' ? '7' : '5')}
                    onChange={(v) => setValue(s.option_key, v)}
                    type="number"
                    min={1}
                  />
                ))}
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleSectionSave(
                  Object.fromEntries(
                    reportSettings.map((s) => [s.option_key, local[s.option_key] ?? ''])
                  )
                )
              }
              disabled={!!savingSection}
            >
              {savingSection === 'report' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Section
            </Button>
            <a href="/report" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                <ExternalLink className="mr-2 h-4 w-4" />
                Report Page
              </Button>
            </a>
          </CardFooter>
        </Card>
      )}

      {/* AI Contact Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-muted-foreground" />
            <CardTitle>AI Contact Settings</CardTitle>
          </div>
          <CardDescription>Contact retrieval prompt and default model for Get Emails and automations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {aiContactSettings.find((s) => s.option_key === 'ai_contact.contact_retrieval_prompt')?.option_label ?? 'Contact Retrieval Prompt'}
            </label>
            <p className="text-xs text-muted-foreground">
              Use shortcodes: [business_name], [business_address], [business_website], [business_phone_number]
            </p>
            <textarea
              value={local['ai_contact.contact_retrieval_prompt'] ?? ''}
              onChange={(e) => setValue('ai_contact.contact_retrieval_prompt', e.target.value)}
              placeholder="I want you to give me the best email address for this company..."
              rows={12}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium">
              {aiContactSettings.find((s) => s.option_key === 'ai_contact.default_model')?.option_label ?? 'Default AI Contact Request Model'}
            </label>
            <AIModelSelect
              value={local['ai_contact.default_model'] ?? 'google/gemini-3.1-pro-preview'}
              onChange={(v) => setValue('ai_contact.default_model', v)}
              className="mt-1 flex h-10 w-full max-w-md rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <hr className="border-border" />

          <div className="space-y-2">
            <label className="text-sm font-medium">
              {aiContactSettings.find((s) => s.option_key === 'ai_contact.write_email_prompt')?.option_label ?? 'Write Email Prompt'}
            </label>
            <p className="text-xs text-muted-foreground">
              System prompt prepended to user prompts when writing emails. Must instruct the AI to respond in JSON with subject and body.
            </p>
            <textarea
              value={local['ai_contact.write_email_prompt'] ?? ''}
              onChange={(e) => setValue('ai_contact.write_email_prompt', e.target.value)}
              placeholder="You are an expert email copywriter..."
              rows={8}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium">
              {aiContactSettings.find((s) => s.option_key === 'ai_contact.write_email_default_model')?.option_label ?? 'Write Email Default Model'}
            </label>
            <AIModelSelect
              value={local['ai_contact.write_email_default_model'] ?? 'google/gemini-3.1-pro-preview'}
              onChange={(v) => setValue('ai_contact.write_email_default_model', v)}
              className="mt-1 flex h-10 w-full max-w-md rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              handleSectionSave(
                Object.fromEntries(
                  ['ai_contact.contact_retrieval_prompt', 'ai_contact.default_model', 'ai_contact.write_email_prompt', 'ai_contact.write_email_default_model'].map((key) => [key, local[key] ?? ''])
                )
              )
            }
            disabled={!!savingSection}
          >
            {savingSection === 'ai_contact' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Section
          </Button>
        </CardFooter>
      </Card>

      {/* Feature Flags */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Feature Flags</CardTitle>
          </div>
          <CardDescription>Enable or disable features without code changes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {featureSettings.map((s) => (
            <ToggleField
              key={s.option_key}
              label={s.option_label}
              description={s.option_description}
              checked={local[s.option_key] === 'true'}
              onChange={(v) => setValue(s.option_key, v ? 'true' : 'false')}
            />
          ))}
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              handleSectionSave(
                Object.fromEntries(
                  featureSettings.map((s) => [s.option_key, local[s.option_key] ?? ''])
                )
              )
            }
            disabled={!!savingSection}
          >
            {savingSection === 'features' && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save Section
          </Button>
        </CardFooter>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <CardDescription>Admin alerts and user status updates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingField
            label="New Removal Request Alert Email"
            description="Email notified when a user submits a $299 removal request"
            value={local['notifications.new_removal_request_email'] ?? ''}
            onChange={(v) =>
              setValue('notifications.new_removal_request_email', v)
            }
            type="email"
          />
          <ToggleField
            label="Status Update Emails to Users"
            description="Send automatic emails when removal request status changes"
            checked={local['notifications.status_update_emails'] === 'true'}
            onChange={(v) =>
              setValue('notifications.status_update_emails', v ? 'true' : 'false')
            }
          />
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              handleSectionSave(
                Object.fromEntries(
                  notificationSettings.map((s) => [
                    s.option_key,
                    local[s.option_key] ?? '',
                  ])
                )
              )
            }
            disabled={!!savingSection}
          >
            {savingSection === 'notifications' && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save Section
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
