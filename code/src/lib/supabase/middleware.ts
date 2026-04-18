import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isPublicRoute = pathname === '/' || pathname.startsWith('/auth');

  if (!isPublicRoute && !user) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (user && (pathname === '/' || pathname === '/login')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, role, tenants!inner(slug)')
      .eq('user_id', user.id)
      .single();

    if (profile?.full_name === 'Massimo Londi' || profile?.role === 'owner') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    if (profile?.tenants?.slug) {
      return NextResponse.redirect(new URL(`/dashboard/${profile.tenants.slug}`, request.url));
    }

    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, tenants!inner(slug)')
      .eq('user_id', user.id)
      .single();

    if (!profile?.tenants?.slug) {
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }

    if (pathname.startsWith('/admin') && profile.role !== 'owner') {
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};