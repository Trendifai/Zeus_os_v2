import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const TENANT_ID = 'manipura-0';
const TENANT_NAME = 'Manipura';

export async function createTenantClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Called from Server Component
          }
        },
      },
      global: {
        headers: {
          'X-Tenant-ID': TENANT_ID,
          'X-Tenant-Name': TENANT_NAME,
        },
      },
    }
  );
}

export function getTenantContext() {
  return {
    tenantId: TENANT_ID,
    tenantName: TENANT_NAME,
  };
}