'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function updateGlobalConfig(data: {
  currency?: string;
  lang?: string;
  fiscal_data?: {
    tva_rate?: number;
    rc?: string;
    matricule_fiscale?: string;
    rib?: string;
    address?: string;
    phone?: string;
  };
}) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); }
          catch {}
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  const { error } = await supabase
    .from('global_config')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('tenant_id', 'manipura-0');

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function updateUserRole(userId: string, role: string, permissions?: string[]) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); }
          catch {}
        },
      },
    }
  );

  const { error } = await supabase
    .from('user_roles')
    .upsert({
      tenant_id: 'manipura-0',
      user_id: userId,
      role,
      permissions: permissions || [],
      updated_at: new Date().toISOString(),
    }, { onConflict: 'tenant_id,user_id' });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function createTeamInvitation(email: string, role: string) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); }
          catch {}
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  const token = crypto.randomUUID();
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);

  const { error } = await supabase
    .from('team_invitations')
    .insert({
      tenant_id: 'manipura-0',
      email,
      role,
      invited_by: user.id,
      token,
      expires_at: expires.toISOString(),
    });

  if (error) return { success: false, error: error.message };
  return { success: true, token };
}

export async function createProductionLot(data: {
  lot_number: string;
  product_id: string;
  story_data?: {
    origin?: string;
    ingredients?: string[];
    process?: string;
    quality?: string;
  };
}) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); }
          catch {}
        },
      },
    }
  );

  const { data: existing } = await supabase
    .from('production_lots')
    .select('id')
    .eq('tenant_id', 'manipura-0')
    .eq('lot_number', data.lot_number)
    .single();

  if (existing) {
    return { success: false, error: 'Lot number already exists' };
  }

  const qrCodeUrl = `https://manipura.shop/lot/${data.lot_number}`;

  const { error } = await supabase
    .from('production_lots')
    .insert({
      tenant_id: 'manipura-0',
      lot_number: data.lot_number,
      product_id: data.product_id,
      story_data: data.story_data || {},
      qr_code_url: qrCodeUrl,
    });

  if (error) return { success: false, error: error.message };
  return { success: true, qr_code_url: qrCodeUrl };
}

export async function getGlobalConfig() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); }
          catch {}
        },
      },
    }
  );

  const { data } = await supabase
    .from('global_config')
    .select('*')
    .eq('tenant_id', 'manipura-0')
    .single();

  return data;
}

export async function getTeamMembers() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); }
          catch {}
        },
      },
    }
  );

  const { data } = await supabase
    .from('user_roles')
    .select('*, auth:user_id(email)')
    .eq('tenant_id', 'manipura-0');

  return data || [];
}

export async function getProductionLots() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); }
          catch {}
        },
      },
    }
  );

  const { data } = await supabase
    .from('production_lots')
    .select('*')
    .eq('tenant_id', 'manipura-0')
    .order('created_at', { ascending: false });

  return data || [];
}