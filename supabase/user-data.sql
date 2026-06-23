-- Migration: user_data table, RLS policies, trigger functions, and is_admin()
-- Task 2: Supabase Database Setup & User Data Table

-- ============================================================
-- user_data table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_data (
  id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  avatar_url text,
  user_role text NOT NULL DEFAULT 'free' CHECK (user_role IN ('free', 'pro', 'admin', 'starter', 'enterprise', 'business', 'professional')),
  subscription_tier text NOT NULL DEFAULT 'free',
  credits integer NOT NULL DEFAULT 0,
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_data_pkey PRIMARY KEY (id),
  CONSTRAINT user_data_user_id_key UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS user_data_user_id_idx ON public.user_data(user_id);
CREATE INDEX IF NOT EXISTS user_data_user_role_idx ON public.user_data(user_role);
CREATE INDEX IF NOT EXISTS user_data_subscription_tier_idx ON public.user_data(subscription_tier);

COMMENT ON TABLE public.user_data IS 'User profile, credits, subscription, and settings data. Auto-populated via trigger on auth.users insert.';
COMMENT ON COLUMN public.user_data.user_role IS 'free | pro | admin | starter | enterprise | business | professional';
COMMENT ON COLUMN public.user_data.settings IS 'Extensible JSONB settings including settings.stripe for Stripe subscription state';

-- ============================================================
-- is_admin() function
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_data
    WHERE user_id = auth.uid()
    AND user_role = 'admin'
  );
$$;

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE public.user_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data" ON public.user_data
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Admins can view all data" ON public.user_data
  FOR SELECT TO authenticated USING (public.is_admin());

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
  FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "Service role can update all" ON public.user_data
  FOR UPDATE TO service_role USING (true) WITH CHECK (true);

-- ============================================================
-- handle_new_user() trigger — auto-create user_data on signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_data (user_id, email, full_name, user_role, subscription_tier, credits, settings)
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

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- updated_at auto-update trigger
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

CREATE OR REPLACE TRIGGER user_data_updated_at
  BEFORE UPDATE ON public.user_data
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();