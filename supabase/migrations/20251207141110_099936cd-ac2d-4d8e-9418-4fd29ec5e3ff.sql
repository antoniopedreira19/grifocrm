-- Atualizar a categoria do Masterclass para 'produtos'
UPDATE products_config 
SET categoria = 'produtos' 
WHERE produto = 'masterclass';

-- Atualizar todos os leads de masterclass para a nova categoria
UPDATE leads 
SET categoria = 'produtos' 
WHERE produto = 'masterclass';

-- Atualizar todos os sales_events de masterclass para a nova categoria
UPDATE sales_events 
SET categoria = 'produtos' 
WHERE produto = 'masterclass';