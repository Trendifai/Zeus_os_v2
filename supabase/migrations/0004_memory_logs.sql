-- Memory logs table for conversation history
CREATE TABLE IF NOT EXISTS public.memory_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    response TEXT NOT NULL,
    skill TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.memory_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own memory logs" ON public.memory_logs
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own memory logs" ON public.memory_logs
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_memory_logs_user_id ON public.memory_logs(user_id);
CREATE INDEX idx_memory_logs_created_at ON public.memory_logs(created_at DESC);