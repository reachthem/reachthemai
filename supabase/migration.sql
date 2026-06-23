-- Consolidated migration for Reach Them AI Supabase schema
-- Includes auth helpers, user profile data, pricing/admin settings,
-- submissions, removal request workflow, review cases, and knowledge-base tables.

-- ============================================================
-- Extensions / schemas
-- ============================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE SCHEMA IF NOT EXISTS authenticative;

-- ============================================================
-- Auth helper: MFA authentication check
-- ============================================================
CREATE OR REPLACE FUNCTION authenticative.is_user_authenticated()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $function$
  SELECT array[(select auth.jwt()->>'aal')] <@ (
    SELECT
      CASE
        WHEN count(id) > 0 THEN array['aal2']
        ELSE array['aal1', 'aal2']
      END AS aal
    FROM auth.mfa_factors
    WHERE auth.uid() = user_id
      AND status = 'verified'
  );
$function$;

-- ============================================================
-- Shared helper functions
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================================
-- user_data table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_data (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  avatar_url text,
  phone_number text,
  company_name text,
  user_role text NOT NULL DEFAULT 'free'
    CHECK (user_role IN ('free', 'pro', 'admin', 'starter', 'enterprise', 'business', 'professional')),
  subscription_tier text NOT NULL DEFAULT 'free',
  credits integer NOT NULL DEFAULT 0,
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_data_user_id_key UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS user_data_user_id_idx ON public.user_data(user_id);
CREATE INDEX IF NOT EXISTS user_data_user_role_idx ON public.user_data(user_role);
CREATE INDEX IF NOT EXISTS user_data_subscription_tier_idx ON public.user_data(subscription_tier);

COMMENT ON TABLE public.user_data IS 'User profile, credits, subscription, and settings data. Auto-populated via trigger on auth.users insert.';
COMMENT ON COLUMN public.user_data.user_role IS 'free | pro | admin | starter | enterprise | business | professional';
COMMENT ON COLUMN public.user_data.settings IS 'Extensible JSONB settings including settings.stripe for Stripe subscription state';

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_data
    WHERE user_id = auth.uid()
      AND user_role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_data (
    user_id,
    email,
    full_name,
    user_role,
    subscription_tier,
    credits,
    settings
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    'free',
    'free',
    0,
    '{}'::jsonb
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

ALTER TABLE public.user_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data" ON public.user_data
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all data" ON public.user_data
  FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY "Users can update own profile" ON public.user_data
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (
    user_id = auth.uid()
    AND user_role = (SELECT user_role FROM public.user_data WHERE user_id = auth.uid())
    AND credits = (SELECT credits FROM public.user_data WHERE user_id = auth.uid())
    AND subscription_tier = (SELECT subscription_tier FROM public.user_data WHERE user_id = auth.uid())
  );

CREATE POLICY "Service role can insert" ON public.user_data
  FOR INSERT TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update all" ON public.user_data
  FOR UPDATE TO service_role
  USING (true)
  WITH CHECK (true);

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE TRIGGER user_data_updated_at
  BEFORE UPDATE ON public.user_data
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- admin_settings table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.admin_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value text,
  description text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_admin_settings_key ON public.admin_settings(key);

CREATE OR REPLACE TRIGGER admin_settings_updated_at
  BEFORE UPDATE ON public.admin_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

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

INSERT INTO public.admin_settings (key, value, description) VALUES
  ('stripe_mode', 'test', 'Stripe mode: test or live'),
  ('stripe_price_id_review_removal', '', 'Active Stripe Price ID (resolved by stripe_mode)'),
  ('stripe_price_id_review_removal_live', '', 'Live Stripe Price ID for review removal ($299)'),
  ('stripe_price_id_review_removal_sandbox', '', 'Test/sandbox Stripe Price ID for review removal')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- billing_history table
-- ============================================================
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

-- ============================================================
-- submissions table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email_address text NOT NULL,
  phone_number text,
  message text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can select submissions"
  ON public.submissions
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.user_data WHERE user_role = 'admin'
    )
  );

CREATE POLICY "Admins can delete submissions"
  ON public.submissions
  FOR DELETE
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.user_data WHERE user_role = 'admin'
    )
  );

-- Service role handles inserts (no public insert policy needed)

-- ============================================================
-- removal_requests table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.removal_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform text NOT NULL,
  review_url text NOT NULL,
  review_content text NOT NULL,
  review_author text,
  review_rating integer CHECK (review_rating BETWEEN 1 AND 5),
  review_date text,
  removal_reasons text[] NOT NULL DEFAULT '{}',
  has_responded boolean NOT NULL DEFAULT false,
  user_response text,
  email text NOT NULL,
  phone text,
  additional_context text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_removal_requests_user_id ON public.removal_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_removal_requests_status ON public.removal_requests(status);
CREATE INDEX IF NOT EXISTS idx_removal_requests_platform ON public.removal_requests(platform);

ALTER TABLE public.removal_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own removal requests"
  ON public.removal_requests FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own removal requests"
  ON public.removal_requests FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own removal requests"
  ON public.removal_requests FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all removal requests"
  ON public.removal_requests FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Service role can manage removal requests"
  ON public.removal_requests FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE OR REPLACE TRIGGER removal_requests_updated_at
  BEFORE UPDATE ON public.removal_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- removal_knowledge_base table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.removal_knowledge_base (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  platform text NOT NULL,
  ground text NOT NULL,
  ground_label text NOT NULL,
  qualification_criteria text NOT NULL,
  removal_steps text NOT NULL,
  required_info text NOT NULL,
  expected_timeline text,
  escalation_note text,
  success_rate text,
  is_active boolean DEFAULT true,
  last_verified timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_removal_kb_platform ON public.removal_knowledge_base(platform);
CREATE INDEX IF NOT EXISTS idx_removal_kb_active ON public.removal_knowledge_base(is_active);

ALTER TABLE public.removal_knowledge_base ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read removal knowledge base"
  ON public.removal_knowledge_base FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage removal knowledge base"
  ON public.removal_knowledge_base FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE OR REPLACE TRIGGER removal_knowledge_base_updated_at
  BEFORE UPDATE ON public.removal_knowledge_base
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- review_cases table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.review_cases (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform text NOT NULL,
  review_url text NOT NULL,
  review_text text,
  review_rating integer CHECK (review_rating BETWEEN 1 AND 5),
  review_date text,
  reviewer_name text,
  removal_reasons text[] DEFAULT '{}',
  has_responded boolean DEFAULT false,
  user_response text,
  reviewer_context text,
  removal_method text,
  ai_analyzed_at timestamptz,
  ai_confidence text,
  ai_removal_ground text,
  ai_strategy text,
  ai_session_id text,
  last_verified_at timestamptz,
  removal_submitted_at timestamptz,
  removed_at timestamptz,
  status text NOT NULL DEFAULT 'draft',
  status_history jsonb,
  status_notes text,
  billing_history_id uuid REFERENCES public.billing_history(id) ON DELETE SET NULL,
  removal_request_id uuid REFERENCES public.removal_requests(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_review_cases_user_id ON public.review_cases(user_id);
CREATE INDEX IF NOT EXISTS idx_review_cases_status ON public.review_cases(status);
CREATE INDEX IF NOT EXISTS idx_review_cases_platform ON public.review_cases(platform);
CREATE INDEX IF NOT EXISTS idx_review_cases_removal_request_id ON public.review_cases(removal_request_id);

ALTER TABLE public.review_cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own review cases"
  ON public.review_cases FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own review cases"
  ON public.review_cases FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own review cases"
  ON public.review_cases FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all review cases"
  ON public.review_cases FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Service role can manage review cases"
  ON public.review_cases FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE OR REPLACE TRIGGER review_cases_updated_at
  BEFORE UPDATE ON public.review_cases
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
