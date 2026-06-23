-- Migration: admin_settings and billing_history tables
-- Task: Pricing Page & Stripe Integration (Task 4)

-- admin_settings table: key-value store for application configuration
CREATE TABLE IF NOT EXISTS public.admin_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value text,
  description text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_admin_settings_key ON public.admin_settings(key);

-- Updated at trigger
CREATE TRIGGER admin_settings_updated_at
  BEFORE UPDATE ON public.admin_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- RLS
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read admin_settings"
  ON public.admin_settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can modify admin_settings"
  ON public.admin_settings FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Seed initial Stripe configuration keys
INSERT INTO public.admin_settings (key, value, description) VALUES
  ('stripe_mode', 'test', 'Stripe mode: test or live'),
  ('stripe_price_id_review_removal', '', 'Active Stripe Price ID (resolved by stripe_mode)'),
  ('stripe_price_id_review_removal_live', '', 'Live Stripe Price ID for review removal ($299)'),
  ('stripe_price_id_review_removal_sandbox', '', 'Test/sandbox Stripe Price ID for review removal')
ON CONFLICT (key) DO NOTHING;

-- billing_history table: records all Stripe payments
CREATE TABLE IF NOT EXISTS public.billing_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  currency text NOT NULL DEFAULT 'usd',
  plan_name text,
  plan_key text,
  stripe_invoice_id text,
  stripe_payment_intent_id text UNIQUE,
  stripe_customer_id text,
  status text NOT NULL DEFAULT 'pending',
  description text,
  billing_date timestamptz DEFAULT now() NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_billing_history_user_id ON public.billing_history(user_id);
CREATE INDEX IF NOT EXISTS idx_billing_history_payment_intent ON public.billing_history(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_billing_history_customer_id ON public.billing_history(stripe_customer_id);

-- RLS
ALTER TABLE public.billing_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own billing history"
  ON public.billing_history FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all billing history"
  ON public.billing_history FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Service role can insert billing history"
  ON public.billing_history FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update billing history"
  ON public.billing_history FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);