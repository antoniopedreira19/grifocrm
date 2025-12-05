-- Criar enum para categorias de produto
CREATE TYPE public.produto_categoria_t AS ENUM ('mentorias', 'produtos');

-- Criar tabela de configuração de produtos
CREATE TABLE public.products_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  produto produto_t UNIQUE NOT NULL,
  categoria produto_categoria_t NOT NULL,
  links jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.products_config ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "sel_products_config_authenticated" 
ON public.products_config FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "upd_products_config_admin" 
ON public.products_config FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM app_users u 
  WHERE u.id = auth.uid() AND u.user_role = 'admin' AND u.user_ativo
));

CREATE POLICY "ins_products_config_admin" 
ON public.products_config FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM app_users u 
  WHERE u.id = auth.uid() AND u.user_role = 'admin' AND u.user_ativo
));

-- Trigger para updated_at
CREATE TRIGGER update_products_config_updated_at
BEFORE UPDATE ON public.products_config
FOR EACH ROW
EXECUTE FUNCTION public.trg_set_updated_at();

-- Inserir dados iniciais
INSERT INTO public.products_config (produto, categoria, links) VALUES
('gbc', 'mentorias', '[{"tipo": "formulario", "nome": "Formulário GBC", "url": "/form/gbc"}]'::jsonb),
('mentoria_fast', 'mentorias', '[{"tipo": "formulario", "nome": "Formulário Fast", "url": "/form/mentoria_fast"}]'::jsonb),
('board', 'produtos', '[]'::jsonb),
('masterclass', 'produtos', '[{"tipo": "landing_page", "nome": "Landing Page Masterclass", "url": "/links/masterclass"}]'::jsonb);