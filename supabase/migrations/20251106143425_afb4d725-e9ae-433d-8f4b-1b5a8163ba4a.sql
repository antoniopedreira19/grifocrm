-- Adiciona coluna para rastrear interesse na Mentoria Fast vindo do formulário GBC
ALTER TABLE leads
ADD COLUMN interesse_mentoria_fast boolean DEFAULT false;

COMMENT ON COLUMN leads.interesse_mentoria_fast IS 'Indica se o lead demonstrou interesse na Mentoria Fast (quando não pode investir no GBC)';