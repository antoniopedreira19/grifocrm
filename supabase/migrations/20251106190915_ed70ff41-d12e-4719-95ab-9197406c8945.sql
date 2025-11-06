-- Atualiza a função capture_lead_public para remover colunas utm/gclid/fbclid
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
begin
  -- Saneamento básico do JSON
  v_answers := coalesce(p_form_answers, '{}'::jsonb);

  -- Força metadados úteis dentro do JSON (não conflita se já existirem)
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

  -- Insere o lead (removidas as colunas utm_*, gclid, fbclid)
  insert into public.leads (
    produto, nome, email, telefone, rede_social,
    faturamento_2025, faturamento_2024, num_funcionarios, modelo_negocio, regiao, conhece_daniel,
    interesse, faixa_investimento,
    origem, status, tag_form, form_answers
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
    v_answers
  )
  returning id into v_id;

  return v_id;
end;
$function$;