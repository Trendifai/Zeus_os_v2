import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  if (!code) {
    return NextResponse.redirect(`${appUrl}/dashboard?error=no_code`)
  }

  const clientId = process.env.GITHUB_CONNECTOR_CLIENT_ID
  const clientSecret = process.env.GITHUB_CONNECTOR_SECRET

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${appUrl}/dashboard?error=missing_config`)
  }

  // 1. Resolve authenticated user via Supabase SSR
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(`${appUrl}/auth/login?error=unauthorized`)
  }

  try {
    // 2. Exchange code → access_token with GitHub
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    })

    const tokenData = await tokenRes.json()

    if (!tokenData.access_token) {
      console.error('[GITHUB CALLBACK] Token exchange failed:', tokenData)
      return NextResponse.redirect(`${appUrl}/dashboard?error=token_exchange_failed`)
    }

    // 3. UPSERT connector row — aligned to 0001_connectors.sql schema
    const { error: upsertError } = await supabase
      .from('connectors')
      .upsert(
        {
          user_id: user.id,
          provider: 'github',
          access_token: tokenData.access_token,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,provider' }
      )

    if (upsertError) {
      console.error('[GITHUB CALLBACK] UPSERT failed:', upsertError)
      return NextResponse.redirect(`${appUrl}/dashboard?error=db_write_failed`)
    }

    // 4. Done — redirect to dashboard
    return NextResponse.redirect(`${appUrl}/dashboard?success=github`)
  } catch (err) {
    console.error('[GITHUB CALLBACK] Fatal error:', err)
    return NextResponse.redirect(`${appUrl}/dashboard?error=token_exchange_failed`)
  }
}