-- Adiciona 'planilhas' ao enum produto_t
ALTER TYPE public.produto_t ADD VALUE IF NOT EXISTS 'planilhas';