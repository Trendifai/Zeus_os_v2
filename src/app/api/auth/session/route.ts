import { NextResponse } from 'next/server';
import { createTenantClient, getTenantContext } from '@/lib/supabase/tenant';

export async function GET() {
  const supabase = await createTenantClient();
  const tenant = getTenantContext();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({
      authenticated: false,
      tenant: null,
      error: userError?.message || 'Not authenticated'
    }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
    },
    tenant: tenant,
    headers: {
      'X-Tenant-ID': tenant.tenantId,
      'X-Tenant-Name': tenant.tenantName,
    }
  });
}