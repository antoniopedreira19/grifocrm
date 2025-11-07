-- Forçar recálculo de todos os scores dos leads GBC
-- Atualizando o campo updated_at para disparar o trigger de cálculo de score
UPDATE leads 
SET updated_at = now() 
WHERE produto = 'gbc';