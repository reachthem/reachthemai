import Stripe from 'stripe';

export type StripeMode = 'sandbox' | 'live';

const stripeInstances: Partial<Record<StripeMode, Stripe>> = {};

function getSecretKeyForMode(mode: StripeMode): string {
  const key = mode === 'sandbox'
    ? process.env.SANDBOX_STRIPE_SECRET_KEY
    : process.env.STRIPE_SECRET_KEY;
  if (!key) {
    const envVar = mode === 'sandbox' ? 'SANDBOX_STRIPE_SECRET_KEY' : 'STRIPE_SECRET_KEY';
    throw new Error(`${envVar} environment variable is not set`);
  }
  return key;
}

export function getWebhookSecretForMode(mode: StripeMode): string | undefined {
  return mode === 'sandbox'
    ? process.env.SANDBOX_STRIPE_WEBHOOK_SECRET
    : process.env.STRIPE_WEBHOOK_SECRET;
}

export function getPublishableKeyForMode(mode: StripeMode): string | undefined {
  return mode === 'sandbox'
    ? process.env.SANDBOX_NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    : process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
}

export async function getStripeMode(supabaseClient: { from: (table: string) => { select: (cols: string) => { eq: (col: string, val: string) => { single: () => Promise<{ data: { option_value: string } | null }> } } } }): Promise<StripeMode> {
  const { data: modeRow } = await supabaseClient
    .from('admin_settings')
    .select('option_value')
    .eq('option_key', 'stripe_mode')
    .single();

  const raw = modeRow?.option_value ?? 'sandbox';
  return raw === 'live' ? 'live' : 'sandbox';
}

export function getStripeClient(mode: StripeMode): Stripe {
  if (!stripeInstances[mode]) {
    const secretKey = getSecretKeyForMode(mode);
    stripeInstances[mode] = new Stripe(secretKey, {
      apiVersion: '2026-05-27.dahlia',
      typescript: true,
    });
  }
  return stripeInstances[mode] as Stripe;
}
