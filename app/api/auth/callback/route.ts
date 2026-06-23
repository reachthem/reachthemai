// src/app/api/auth/callback/route.ts
import { NextResponse } from 'next/server'
import { createSSRSassClient } from "@/lib/supabase/server";

/** Allow only same-origin paths (app, auth, etc.). Reject protocol-relative or absolute URLs. */
function getSafeRedirect(next: string | null): string {
    if (!next || next.startsWith('//') || next.includes(':')) return '/app';
    const path = next.startsWith('/') ? next : `/${next}`;
    if (!path.startsWith('/app') && !path.startsWith('/auth') && path !== '/') return '/app';
    return path;
}

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const nextParam = requestUrl.searchParams.get('next')

    if (!code) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    try {
        const supabase = await createSSRSassClient()
        const client = supabase.getSupabaseClient()

        const { error } = await supabase.exchangeCodeForSession(code)

        if (error) {
            return NextResponse.redirect(new URL('/auth/login?error=auth_callback_failed', request.url))
        }

        // Check MFA status
        const { data: aal, error: aalError } = await client.auth.mfa.getAuthenticatorAssuranceLevel()

        if (aalError) {
            console.error('Error checking MFA status:', aalError)
            return NextResponse.redirect(new URL('/auth/login', request.url))
        }

        // If user needs to complete MFA verification
        if (aal.nextLevel === 'aal2' && aal.nextLevel !== aal.currentLevel) {
            return NextResponse.redirect(new URL('/auth/2fa', request.url))
        }

        const redirectPath = getSafeRedirect(nextParam)
        return NextResponse.redirect(new URL(redirectPath, request.url))
    } catch {
        return NextResponse.redirect(new URL('/auth/login?error=auth_callback_failed', request.url))
    }
}