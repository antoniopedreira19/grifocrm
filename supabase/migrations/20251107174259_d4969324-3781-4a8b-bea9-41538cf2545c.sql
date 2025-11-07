-- Adicionar tipo de pagamento enum
CREATE TYPE tipo_pagamento_t AS ENUM ('a_vista', 'parcelado', 'entrada_parcelado');

-- Adicionar novos campos na tabela leads
ALTER TABLE public.leads 
ADD COLUMN tipo_pagamento tipo_pagamento_t,
ADD COLUMN valor_a_vista numeric,
ADD COLUMN valor_parcelado numeric,
ADD COLUMN valor_entrada numeric,
ADD COLUMN proximo_followup timestamp with time zone;

-- Adicionar comentários para documentação
COMMENT ON COLUMN public.leads.tipo_pagamento IS 'Tipo de pagamento: à vista, parcelado ou entrada + parcelado';
COMMENT ON COLUMN public.leads.valor_a_vista IS 'Valor total à vista';
COMMENT ON COLUMN public.leads.valor_parcelado IS 'Valor total parcelado';
COMMENT ON COLUMN public.leads.valor_entrada IS 'Valor da entrada (quando tipo_pagamento = entrada_parcelado)';
COMMENT ON COLUMN public.leads.proximo_followup IS 'Data e hora do próximo follow-up agendado';