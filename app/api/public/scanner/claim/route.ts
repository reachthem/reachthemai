import { NextRequest, NextResponse } from 'next/server';
import { createSSRSassClient } from '@/lib/supabase/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';

export async function POST(request: NextRequest) {
  try {
    const sassClient = await createSSRSassClient();
    const supabase = sassClient.getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { scanId, sessionToken } = body;

    if (!scanId || !sessionToken) {
      return NextResponse.json({ error: 'scanId and sessionToken are required' }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const adminClient = (await createServerAdminClient()) as any;

    const { data: scan, error: scanError } = await adminClient
      .from('business_scans')
      .select('id, business_profile_id, user_id, session_token')
      .eq('id', scanId)
      .eq('session_token', sessionToken)
      .single();

    if (scanError || !scan) {
      return NextResponse.json({ error: 'Scan not found or token mismatch' }, { status: 404 });
    }

    if (scan.user_id) {
      return NextResponse.json({ error: 'Scan has already been claimed' }, { status: 409 });
    }

    const { error: updateScanError } = await adminClient
      .from('business_scans')
      .update({
        user_id: user.id,
        session_token: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', scanId);

    if (updateScanError) {
      console.error('Claim scan update error:', updateScanError);
      return NextResponse.json({ error: 'Failed to claim scan' }, { status: 500 });
    }

    if (scan.business_profile_id) {
      const { data: profile } = await adminClient
        .from('business_profiles')
        .select('user_id')
        .eq('id', scan.business_profile_id)
        .single();

      if (profile && !profile.user_id) {
        await adminClient
          .from('business_profiles')
          .update({
            user_id: user.id,
            updated_at: new Date().toISOString(),
          })
          .eq('id', scan.business_profile_id);
      }
    }

    return NextResponse.json({
      success: true,
      redirectTo: `/app/scanner/${scanId}`,
    });
  } catch (error) {
    console.error('Claim API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
