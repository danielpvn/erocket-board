-- ==============================================================================
-- SCHEMA DO SUPABASE — EROCKET BOARD (MENTORIA LEI SECA)
-- ==============================================================================
-- Execute este script no SQL Editor do seu projeto no Supabase (supabase.com)
-- ==============================================================================

-- 1. Criar a tabela de boards
CREATE TABLE IF NOT EXISTS public.boards (
    id TEXT PRIMARY KEY DEFAULT 'erocket_main',
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Habilitar Row Level Security (RLS)
ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;

-- 3. Criar políticas de acesso público (Leitura e Escrita para o time)
DROP POLICY IF EXISTS "Permitir leitura publica de boards" ON public.boards;
CREATE POLICY "Permitir leitura publica de boards"
    ON public.boards
    FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Permitir insercao de boards" ON public.boards;
CREATE POLICY "Permitir insercao de boards"
    ON public.boards
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir atualizacao de boards" ON public.boards;
CREATE POLICY "Permitir atualizacao de boards"
    ON public.boards
    FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- 4. Habilitar Sincronização em Tempo Real (Realtime) na tabela boards
ALTER PUBLICATION supabase_realtime ADD TABLE public.boards;
