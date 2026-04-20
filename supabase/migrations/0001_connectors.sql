-- Jarvis configs table
CREATE TABLE IF NOT EXISTS public.jarvis_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    autonomy_level TEXT NOT NULL,
    tone TEXT,
    context_data JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.jarvis_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own jarvis config" ON public.jarvis_configs
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own jarvis config" ON public.jarvis_configs
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own jarvis config" ON public.jarvis_configs
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id);

-- Connectors table for third-party integrations
CREATE TABLE IF NOT EXISTS public.connectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider TEXT NOT NULL,
    provider_user_id TEXT,
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, provider)
);

-- Enable RLS
ALTER TABLE public.connectors ENABLE ROW LEVEL SECURITY;

-- Users can read their own connectors
CREATE POLICY "Users can read own connectors" ON public.connectors
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

-- Users can insert their own connectors
CREATE POLICY "Users can insert own connectors" ON public.connectors
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own connectors
CREATE POLICY "Users can update own connectors" ON public.connectors
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id);

-- Users can delete their own connectors
CREATE POLICY "Users can delete own connectors" ON public.connectors
    FOR DELETE TO authenticated
    USING (auth.uid() = user_id);