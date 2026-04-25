import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  const roleBasedRoutes: Record<string, string[]> = {
    '/jarvis': ['admin', 'manager'],
    '/ecommerce': ['admin', 'manager', 'operator'],
    '/vip-club': ['admin', 'manager', 'vip_member'],
  };

  for (const [route, allowedRoles] of Object.entries(roleBasedRoutes)) {
    if (path.startsWith(route)) {
      if (!user) {
        return NextResponse.redirect(new URL('/auth/login?redirect=' + path, request.url));
      }

      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('tenant_id', 'manipura-0')
        .eq('user_id', user.id)
        .single();

      const userRole = roleData?.role || 'viewer';
      
      if (!allowedRoles.includes(userRole)) {
        return NextResponse.redirect(new URL('/auth/unauthorized', request.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: ['/jarvis/:path*', '/ecommerce/:path*', '/vip-club/:path*'],
};