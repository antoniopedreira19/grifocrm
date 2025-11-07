-- Criar tipo de pagamento se não existir
DO $$ BEGIN
  CREATE TYPE tipo_pagamento_t AS ENUM ('a_vista', 'parcelado', 'entrada_parcelado');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Adicionar novos campos na tabela leads se não existirem
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='leads' AND column_name='tipo_pagamento') THEN
    ALTER TABLE public.leads ADD COLUMN tipo_pagamento tipo_pagamento_t;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='leads' AND column_name='valor_a_vista') THEN
    ALTER TABLE public.leads ADD COLUMN valor_a_vista numeric;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='leads' AND column_name='valor_parcelado') THEN
    ALTER TABLE public.leads ADD COLUMN valor_parcelado numeric;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='leads' AND column_name='valor_entrada') THEN
    ALTER TABLE public.leads ADD COLUMN valor_entrada numeric;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='leads' AND column_name='proximo_followup') THEN
    ALTER TABLE public.leads ADD COLUMN proximo_followup timestamp with time zone;
  END IF;
END $$;