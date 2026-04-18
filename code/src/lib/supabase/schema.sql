-- ZEUS OS V2 - Database Schema
-- Run in Supabase SQL Editor

-- 1. TENANTS TABLE
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  settings JSONB DEFAULT '{}',
  plan_type TEXT DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- 2. PROFILES TABLE
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'member',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- 3. ENABLE RLS
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES FOR TENANTS
CREATE POLICY "tenants_select" ON tenants FOR SELECT USING (true);
CREATE POLICY "tenants_insert" ON tenants FOR INSERT WITH CHECK (true);
CREATE POLICY "tenants_update" ON tenants FOR UPDATE USING (true);
CREATE POLICY "tenants_delete" ON tenants FOR DELETE USING (true);

-- RLS POLICIES FOR PROFILES (Tenant Isolation)
CREATE POLICY "profiles_select" ON profiles FOR SELECT 
  USING (tenant_id IN (SELECT tenant_id FROM profiles WHERE user_id = auth.uid()));
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE 
  USING (tenant_id IN (SELECT tenant_id FROM profiles WHERE user_id = auth.uid()));
CREATE POLICY "profiles_delete" ON profiles FOR DELETE 
  USING (tenant_id IN (SELECT tenant_id FROM profiles WHERE user_id = auth.uid()));

-- CREATE DEFAULT TENANT (Manipura HQ)
INSERT INTO tenants (name, slug, plan_type) 
VALUES ('Manipura - Agentia HQ', 'manipura-hq', 'enterprise');