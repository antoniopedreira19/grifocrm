-- Adicionar coluna categoria na tabela leads
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS categoria public.produto_categoria_t;

-- Adicionar coluna categoria na tabela sales_events
ALTER TABLE public.sales_events 
ADD COLUMN IF NOT EXISTS categoria public.produto_categoria_t;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_leads_categoria ON public.leads(categoria);
CREATE INDEX IF NOT EXISTS idx_sales_events_categoria ON public.sales_events(categoria);

-- Popular dados existentes na tabela leads
UPDATE public.leads l
SET categoria = pc.categoria
FROM public.products_config pc
WHERE l.produto = pc.produto
AND l.categoria IS NULL;

-- Popular dados existentes na tabela sales_events
UPDATE public.sales_events se
SET categoria = pc.categoria
FROM public.products_config pc
WHERE se.produto = pc.produto
AND se.categoria IS NULL;

-- Função para buscar categoria do produto
CREATE OR REPLACE FUNCTION public.get_produto_categoria(p_produto produto_t)
RETURNS produto_categoria_t
LANGUAGE sql
STABLE
AS $$
  SELECT categoria FROM public.products_config WHERE produto = p_produto LIMIT 1;
$$;

-- Trigger para definir categoria automaticamente ao inserir/atualizar leads
CREATE OR REPLACE FUNCTION public.trg_set_lead_categoria()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.categoria := public.get_produto_categoria(NEW.produto);
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS set_lead_categoria ON public.leads;
CREATE TRIGGER set_lead_categoria
BEFORE INSERT OR UPDATE OF produto ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.trg_set_lead_categoria();

-- Trigger para definir categoria automaticamente ao inserir sales_events
CREATE OR REPLACE FUNCTION public.trg_set_sales_event_categoria()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW.produto IS NOT NULL THEN
    NEW.categoria := public.get_produto_categoria(NEW.produto);
  END IF;
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS set_sales_event_categoria ON public.sales_events;
CREATE TRIGGER set_sales_event_categoria
BEFORE INSERT OR UPDATE OF produto ON public.sales_events
FOR EACH ROW
EXECUTE FUNCTION public.trg_set_sales_event_categoria();

-- Trigger para sincronizar quando products_config é atualizado
CREATE OR REPLACE FUNCTION public.trg_sync_categoria_on_config_update()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  -- Atualizar leads com o produto alterado
  UPDATE public.leads
  SET categoria = NEW.categoria
  WHERE produto = NEW.produto;
  
  -- Atualizar sales_events com o produto alterado
  UPDATE public.sales_events
  SET categoria = NEW.categoria
  WHERE produto = NEW.produto;
  
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS sync_categoria_on_config_update ON public.products_config;
CREATE TRIGGER sync_categoria_on_config_update
AFTER UPDATE OF categoria ON public.products_config
FOR EACH ROW
EXECUTE FUNCTION public.trg_sync_categoria_on_config_update();