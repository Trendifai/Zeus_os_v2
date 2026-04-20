-- Memory files table for vector ingestion
CREATE TABLE IF NOT EXISTS public.memory_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    vector_status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.memory_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own memory files" ON public.memory_files
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own memory files" ON public.memory_files
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own memory files" ON public.memory_files
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own memory files" ON public.memory_files
    FOR DELETE TO authenticated
    USING (auth.uid() = user_id);