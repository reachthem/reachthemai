-- submissions table for contact form
CREATE TABLE IF NOT EXISTS public.submissions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name  TEXT NOT NULL,
    last_name   TEXT NOT NULL,
    email_address TEXT NOT NULL,
    phone_number  TEXT,
    message     TEXT NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Admins can read all submissions
CREATE POLICY "Admins can select submissions"
    ON public.submissions
    FOR SELECT
    USING (
        auth.uid() IN (
            SELECT id FROM public.user_data WHERE user_role = 'admin'
        )
    );

-- Admins can delete submissions
CREATE POLICY "Admins can delete submissions"
    ON public.submissions
    FOR DELETE
    USING (
        auth.uid() IN (
            SELECT id FROM public.user_data WHERE user_role = 'admin'
        )
    );

-- Service role handles inserts (no public insert policy needed)