-- Supabase Schema - Tenant 0 (Manipura)
-- Execute via Supabase SQL Editor or CLI

-- 1. GLOBAL_CONFIG
CREATE TABLE IF NOT EXISTS public.global_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL DEFAULT 'manipura-0',
  currency TEXT DEFAULT 'TND',
  lang TEXT DEFAULT 'fr',
  fiscal_data JSONB DEFAULT '{"tva_rate": 19, "rc": "B0293892021", "matricule_fiscale": "1070602/A", "rib": ""}',
  settings JSONB DEFAULT '{"theme": "amber-glow", "features": {}}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id)
);

-- 2. USER_ROLES
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL DEFAULT 'manipura-0',
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'operator', 'vip_member', 'viewer')),
  permissions JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, user_id)
);

-- 3. TEAM_INVITATIONS
CREATE TABLE IF NOT EXISTS public.team_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL DEFAULT 'manipura-0',
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'operator', 'vip_member')),
  invited_by UUID NOT NULL REFERENCES auth.users(id),
  token TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(token)
);

-- 4. PRODUCTION_LOTS
CREATE TABLE IF NOT EXISTS public.production_lots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL DEFAULT 'manipura-0',
  lot_number TEXT NOT NULL,
  product_id UUID NOT NULL,
  story_data JSONB DEFAULT '{"origin": "", "ingredients": [], "process": "", "quality": ""}',
  qr_code_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'produced', 'sold', 'delivered')),
  produced_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, lot_number)
);

-- RLS Policies (Tenant 0 only)
ALTER TABLE public.global_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_lots ENABLE ROW LEVEL SECURITY;

-- Global Config: Admin full access, others read-only
CREATE POLICY "global_config_admin" ON public.global_config FOR ALL
  USING (tenant_id = 'manipura-0')
  WITH CHECK (tenant_id = 'manipura-0');

-- User Roles: Tenant members can read, owners can manage
CREATE POLICY "user_roles_tenant_access" ON public.user_roles FOR ALL
  USING (tenant_id = 'manipura-0')
  WITH CHECK (tenant_id = 'manipura-0');

-- Team Invitations: Tenant access
CREATE POLICY "team_invitations_tenant_access" ON public.team_invitations FOR ALL
  USING (tenant_id = 'manipura-0')
  WITH CHECK (tenant_id = 'manipura-0');

-- Production Lots: Tenant access
CREATE POLICY "production_lots_tenant_access" ON public.production_lots FOR ALL
  USING (tenant_id = 'manipura-0')
  WITH CHECK (tenant_id = 'manipura-0');

-- Insert default config
INSERT INTO public.global_config (tenant_id, currency, lang, fiscal_data)
VALUES ('manipura-0', 'TND', 'fr', '{"tva_rate": 19, "rc": "B0293892021", "matricule_fiscale": "1070602/A", "rib": "", "address": "46 Ave Habib Thameur, Hammam Sousse", "phone": "+216 52 300 300"}')
ON CONFLICT (tenant_id) DO NOTHING;