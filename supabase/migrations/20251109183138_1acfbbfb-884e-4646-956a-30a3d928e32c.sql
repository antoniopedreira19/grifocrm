-- Calcula tempos retrospectivamente usando o histórico de mudanças de status

-- 1. Tempo de Qualificação (tempo em 'proximo_contato')
WITH qualificacao_times AS (
  SELECT 
    h1.lead_id,
    h1.changed_at as entrada_qualificacao,
    h2.changed_at as saida_qualificacao,
    EXTRACT(EPOCH FROM (h2.changed_at - h1.changed_at)) / 86400.0 as dias_qualificacao
  FROM lead_status_history h1
  JOIN lead_status_history h2 ON h1.lead_id = h2.lead_id
  WHERE h1.para_status = 'proximo_contato'
    AND h2.de_status = 'proximo_contato'
    AND h2.changed_at > h1.changed_at
    AND h2.changed_at = (
      SELECT MIN(h3.changed_at)
      FROM lead_status_history h3
      WHERE h3.lead_id = h1.lead_id
        AND h3.de_status = 'proximo_contato'
        AND h3.changed_at > h1.changed_at
    )
)
UPDATE leads
SET 
  data_entrada_qualificacao = qt.entrada_qualificacao,
  data_saida_qualificacao = qt.saida_qualificacao,
  tempo_qualificacao_dias = qt.dias_qualificacao
FROM qualificacao_times qt
WHERE leads.id = qt.lead_id
  AND leads.tempo_qualificacao_dias IS NULL;

-- 2. Tempo de Negociação (tempo em 'negociando')
WITH negociacao_times AS (
  SELECT 
    h1.lead_id,
    h1.changed_at as entrada_negociacao,
    h2.changed_at as saida_negociacao,
    EXTRACT(EPOCH FROM (h2.changed_at - h1.changed_at)) / 86400.0 as dias_negociacao
  FROM lead_status_history h1
  JOIN lead_status_history h2 ON h1.lead_id = h2.lead_id
  WHERE h1.para_status = 'negociando'
    AND h2.de_status = 'negociando'
    AND h2.changed_at > h1.changed_at
    AND h2.changed_at = (
      SELECT MIN(h3.changed_at)
      FROM lead_status_history h3
      WHERE h3.lead_id = h1.lead_id
        AND h3.de_status = 'negociando'
        AND h3.changed_at > h1.changed_at
    )
)
UPDATE leads
SET 
  data_entrada_negociacao = nt.entrada_negociacao,
  data_saida_negociacao = nt.saida_negociacao,
  tempo_negociacao_dias = nt.dias_negociacao
FROM negociacao_times nt
WHERE leads.id = nt.lead_id
  AND leads.tempo_negociacao_dias IS NULL;

-- 3. Atualizar data de ganho para leads que não têm mas estão em histórico
WITH ganho_dates AS (
  SELECT 
    lead_id,
    MIN(changed_at) as primeira_data_ganho
  FROM lead_status_history
  WHERE para_status = 'ganho'
  GROUP BY lead_id
)
UPDATE leads
SET data_ganho = gd.primeira_data_ganho
FROM ganho_dates gd
WHERE leads.id = gd.lead_id
  AND leads.status = 'ganho'
  AND leads.data_ganho IS NULL;

-- 4. Recalcular tempo total de conversão usando as datas corretas
UPDATE leads
SET tempo_total_conversao_dias = EXTRACT(EPOCH FROM (data_ganho - primeiro_contato)) / 86400.0
WHERE status = 'ganho'
  AND primeiro_contato IS NOT NULL
  AND data_ganho IS NOT NULL
  AND tempo_total_conversao_dias IS NULL;