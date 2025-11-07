-- Atualizar função capture_lead_public para gravar deal_valor automaticamente
CREATE OR REPLACE FUNCTION public.capture_lead_public(
  p_produto produto_t,
  p_nome text,
  p_email text,
  p_telefone text,
  p_faturamento_2025 faturamento_t,
  p_conhece_daniel conhece_daniel_t,
  p_interesse interesse_t,
  p_origem origem_t,
  p_rede_social text DEFAULT NULL::text,
  p_faturamento_2024 faturamento_t DEFAULT NULL::faturamento_t,
  p_num_funcionarios integer DEFAULT NULL::integer,
  p_modelo_negocio text DEFAULT NULL::text,
  p_regiao text DEFAULT NULL::text,
  p_faixa_investimento text DEFAULT NULL::text,
  p_utm_source text DEFAULT NULL::text,
  p_utm_medium text DEFAULT NULL::text,
  p_utm_campaign text DEFAULT NULL::text,
  p_utm_term text DEFAULT NULL::text,
  p_utm_content text DEFAULT NULL::text,
  p_gclid text DEFAULT NULL::text,
  p_fbclid text DEFAULT NULL::text,
  p_tag_form text DEFAULT NULL::text,
  p_form_answers jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
declare
  v_id uuid;
  v_answers jsonb;
  v_deal_valor numeric;
  v_interesse_mentoria_fast boolean;
begin
  -- Saneamento básico do JSON
  v_answers := coalesce(p_form_answers, '{}'::jsonb);

  -- Verifica se tem interesse em mentoria fast (para leads GBC)
  v_interesse_mentoria_fast := coalesce((v_answers->>'interesse_mentoria_fast')::boolean, false);

  -- Calcula deal_valor baseado no produto
  if p_produto = 'mentoria_fast' then
    v_deal_valor := 18000;
  elsif p_produto = 'gbc' then
    -- Se marcou interesse na mentoria fast, valor é 18k, senão 120k
    v_deal_valor := case when v_interesse_mentoria_fast then 18000 else 120000 end;
  end if;

  -- Força metadados úteis dentro do JSON
  v_answers := jsonb_build_object(
                  'schema_version','1.1',
                  'form', case when p_produto='gbc' then 'gbc' else 'mentoria_fast' end,
                  'utm_source', p_utm_source,
                  'utm_medium', p_utm_medium,
                  'utm_campaign', p_utm_campaign,
                  'utm_term', p_utm_term,
                  'utm_content', p_utm_content,
                  'gclid', p_gclid,
                  'fbclid', p_fbclid
               ) || v_answers;

  -- GBC não usa pesos: evita guardar bloco fast_peso quando produto=gbc
  if p_produto = 'gbc' then
    v_answers := v_answers - 'fast_peso';
  end if;

  -- Insere o lead com deal_valor
  insert into public.leads (
    produto, nome, email, telefone, rede_social,
    faturamento_2025, faturamento_2024, num_funcionarios, modelo_negocio, regiao, conhece_daniel,
    interesse, faixa_investimento,
    origem, status, tag_form, form_answers, deal_valor, interesse_mentoria_fast
  )
  values (
    p_produto,
    trim(p_nome),
    lower(p_email),
    trim(p_telefone),
    nullif(p_rede_social,''),
    p_faturamento_2025,
    p_faturamento_2024,
    p_num_funcionarios,
    left(coalesce(p_modelo_negocio,''),280),
    p_regiao,
    p_conhece_daniel,
    p_interesse,
    p_faixa_investimento,
    p_origem,
    'primeiro_contato',
    p_tag_form,
    v_answers,
    v_deal_valor,
    v_interesse_mentoria_fast
  )
  returning id into v_id;

  return v_id;
end;
$function$;

-- Atualizar leads existentes que não têm deal_valor definido
UPDATE leads
SET deal_valor = CASE
  WHEN produto = 'mentoria_fast' THEN 18000
  WHEN produto = 'gbc' AND coalesce(interesse_mentoria_fast, false) = true THEN 18000
  WHEN produto = 'gbc' THEN 120000
  ELSE deal_valor
END
WHERE deal_valor IS NULL;