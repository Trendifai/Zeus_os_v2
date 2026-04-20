-- Jarvis onboarding configuration per user
CREATE TABLE public.jarvis_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'ceo',
  autonomy_level TEXT NOT NULL DEFAULT 'copilot',
  tone TEXT NOT NULL DEFAULT 'Visionario',
  context_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT jarvis_configs_user_id_key UNIQUE (user_id)
);

-- RLS
ALTER TABLE public.jarvis_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own config"
  ON public.jarvis_configs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own config"
  ON public.jarvis_configs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own config"
  ON public.jarvis_configs FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
