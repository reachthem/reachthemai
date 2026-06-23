import { NextResponse } from 'next/server'
import { createSSRSassClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = requestUrl.searchParams.get('next')
    const type = requestUrl.searchParams.get('type')

    if (!code) {
        return NextResponse.redirect(new URL('/auth/login?error=auth_callback_failed', request.url))
    }

    try {
        const supabase = await createSSRSassClient()
        const client = supabase.getSupabaseClient()

        const { error } = await supabase.exchangeCodeForSession(code)

        if (error) {
            return NextResponse.redirect(new URL('/auth/login?error=auth_callback_failed', request.url))
        }

        // Password recovery — redirect to reset password page
        if (type === 'recovery') {
            return NextResponse.redirect(new URL(next ?? '/auth/reset-password', request.url))
        }

        // Check if MFA is required before granting access
        const { data: aal, error: aalError } = await client.auth.mfa.getAuthenticatorAssuranceLevel()

        if (!aalError && aal.nextLevel === 'aal2' && aal.nextLevel !== aal.currentLevel) {
            return NextResponse.redirect(new URL('/auth/2fa', request.url))
        }

        // Email confirmation or OAuth — redirect to app or custom next path
        return NextResponse.redirect(new URL(next ?? '/app', request.url))
    } catch {
        return NextResponse.redirect(new URL('/auth/login?error=auth_callback_failed', request.url))
    }
}
