-- Adicionar novos valores ao enum status_t
ALTER TYPE status_t ADD VALUE IF NOT EXISTS 'proposta';
ALTER TYPE status_t ADD VALUE IF NOT EXISTS 'followup';

-- Criar enum tipo_pagamento_t se não existir
DO $$ BEGIN
  CREATE TYPE tipo_pagamento_t AS ENUM ('a_vista', 'parcelado', 'entrada_parcelado');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Adicionar colunas relacionadas a proposta e followup se não existirem
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='tipo_pagamento') THEN
    ALTER TABLE public.leads ADD COLUMN tipo_pagamento tipo_pagamento_t;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='valor_a_vista') THEN
    ALTER TABLE public.leads ADD COLUMN valor_a_vista numeric;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='valor_parcelado') THEN
    ALTER TABLE public.leads ADD COLUMN valor_parcelado numeric;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='valor_entrada') THEN
    ALTER TABLE public.leads ADD COLUMN valor_entrada numeric;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='proximo_followup') THEN
    ALTER TABLE public.leads ADD COLUMN proximo_followup timestamp with time zone;
  END IF;
END $$;

-- Atualizar a função de regras de negócio para incluir validações dos novos status
CREATE OR REPLACE FUNCTION public.trg_lead_business_rules()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
begin
  if new.status = 'proximo_contato' and new.proximo_contato is null then
    raise exception 'proximo_contato é obrigatório quando status = proximo_contato';
  end if;

  if new.status = 'proposta' and new.tipo_pagamento is null then
    raise exception 'tipo_pagamento é obrigatório quando status = proposta';
  end if;

  if new.status = 'followup' and new.proximo_followup is null then
    raise exception 'proximo_followup é obrigatório quando status = followup';
  end if;

  if new.status = 'ganho' and new.deal_valor is null then
    raise exception 'deal_valor é obrigatório quando status = ganho';
  end if;

  if new.status = 'perdido'
     and (new.perdido_motivo_cat is null and coalesce(new.perdido_motivo_txt,'') = '') then
    raise exception 'Informe o motivo do perdido (categoria ou texto)';
  end if;

  -- Registra primeiro_contato quando a etapa for definida pela 1ª vez
  if (old.status is distinct from 'primeiro_contato')
     and new.status = 'primeiro_contato'
     and new.primeiro_contato is null then
    new.primeiro_contato := now();
  end if;

  return new;
end$function$;