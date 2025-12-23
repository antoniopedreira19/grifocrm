-- Insere planilhas na products_config com categoria 'produtos'
INSERT INTO public.products_config (produto, categoria, links)
VALUES ('planilhas'::produto_t, 'produtos'::produto_categoria_t, '[]'::jsonb)
ON CONFLICT DO NOTHING;