-- Adicionar colunas para rastrear datas e tempos de conversão
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS data_entrada_qualificacao TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS data_saida_qualificacao TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS data_entrada_negociacao TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS data_saida_negociacao TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS data_ganho TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS tempo_qualificacao_dias NUMERIC,
ADD COLUMN IF NOT EXISTS tempo_negociacao_dias NUMERIC,
ADD COLUMN IF NOT EXISTS tempo_total_conversao_dias NUMERIC;

-- Comentários para documentação
COMMENT ON COLUMN leads.data_entrada_qualificacao IS 'Data em que o lead entrou no status proximo_contato (Qualificação)';
COMMENT ON COLUMN leads.data_saida_qualificacao IS 'Data em que o lead saiu do status proximo_contato (Qualificação)';
COMMENT ON COLUMN leads.data_entrada_negociacao IS 'Data em que o lead entrou no status negociando';
COMMENT ON COLUMN leads.data_saida_negociacao IS 'Data em que o lead saiu do status negociando';
COMMENT ON COLUMN leads.data_ganho IS 'Data em que o lead foi marcado como ganho';
COMMENT ON COLUMN leads.tempo_qualificacao_dias IS 'Tempo em dias que o lead ficou em qualificação';
COMMENT ON COLUMN leads.tempo_negociacao_dias IS 'Tempo em dias que o lead ficou em negociação';
COMMENT ON COLUMN leads.tempo_total_conversao_dias IS 'Tempo total em dias desde primeiro contato até ganho';

-- Criar ou substituir a função que calcula os tempos de conversão
CREATE OR REPLACE FUNCTION trg_calculate_conversion_times()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Registra entrada na qualificação
  IF NEW.status = 'proximo_contato' AND (OLD.status IS NULL OR OLD.status != 'proximo_contato') THEN
    NEW.data_entrada_qualificacao := NOW();
    NEW.data_saida_qualificacao := NULL;
    NEW.tempo_qualificacao_dias := NULL;
  END IF;

  -- Registra saída da qualificação e calcula tempo
  IF OLD.status = 'proximo_contato' AND NEW.status != 'proximo_contato' AND NEW.data_entrada_qualificacao IS NOT NULL THEN
    NEW.data_saida_qualificacao := NOW();
    NEW.tempo_qualificacao_dias := EXTRACT(EPOCH FROM (NEW.data_saida_qualificacao - NEW.data_entrada_qualificacao)) / 86400.0;
  END IF;

  -- Registra entrada na negociação
  IF NEW.status = 'negociando' AND (OLD.status IS NULL OR OLD.status != 'negociando') THEN
    NEW.data_entrada_negociacao := NOW();
    NEW.data_saida_negociacao := NULL;
    NEW.tempo_negociacao_dias := NULL;
  END IF;

  -- Registra saída da negociação e calcula tempo
  IF OLD.status = 'negociando' AND NEW.status != 'negociando' AND NEW.data_entrada_negociacao IS NOT NULL THEN
    NEW.data_saida_negociacao := NOW();
    NEW.tempo_negociacao_dias := EXTRACT(EPOCH FROM (NEW.data_saida_negociacao - NEW.data_entrada_negociacao)) / 86400.0;
  END IF;

  -- Registra data de ganho e calcula tempo total de conversão
  IF NEW.status = 'ganho' AND (OLD.status IS NULL OR OLD.status != 'ganho') THEN
    NEW.data_ganho := NOW();
    IF NEW.primeiro_contato IS NOT NULL THEN
      NEW.tempo_total_conversao_dias := EXTRACT(EPOCH FROM (NEW.data_ganho - NEW.primeiro_contato)) / 86400.0;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Remover trigger antigo se existir
DROP TRIGGER IF EXISTS trg_conversion_times ON leads;

-- Criar o trigger
CREATE TRIGGER trg_conversion_times
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION trg_calculate_conversion_times();

-- Preencher dados históricos para leads que já estão em qualificação
UPDATE leads
SET data_entrada_qualificacao = primeiro_contato
WHERE status = 'proximo_contato' 
  AND data_entrada_qualificacao IS NULL 
  AND primeiro_contato IS NOT NULL;

-- Preencher dados históricos para leads que já estão em negociação
UPDATE leads
SET data_entrada_negociacao = primeiro_contato
WHERE status = 'negociando' 
  AND data_entrada_negociacao IS NULL 
  AND primeiro_contato IS NOT NULL;

-- Preencher dados históricos para leads ganhos
UPDATE leads
SET 
  data_ganho = updated_at,
  tempo_total_conversao_dias = EXTRACT(EPOCH FROM (updated_at - primeiro_contato)) / 86400.0
WHERE status = 'ganho' 
  AND data_ganho IS NULL 
  AND primeiro_contato IS NOT NULL;