import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

const APP_URL = 'http://localhost:3000';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(`${APP_URL}/?error=no_code`);
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Auth error:', error.message);
      return NextResponse.redirect(`${APP_URL}/?error=auth_failed`);
    }

    return NextResponse.redirect(`${APP_URL}/dashboard`);
  } catch (err) {
    console.error('Callback error:', err);
    return NextResponse.redirect(`${APP_URL}/?error=auth_failed`);
  }
}