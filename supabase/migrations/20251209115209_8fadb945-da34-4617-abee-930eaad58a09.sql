-- Fix ALL masterclass leads to have correct category 'produtos'
UPDATE leads 
SET categoria = 'produtos' 
WHERE produto = 'masterclass' AND (categoria = 'mentorias' OR categoria IS NULL);

-- Also ensure products_config has masterclass in produtos category
UPDATE products_config 
SET categoria = 'produtos' 
WHERE produto = 'masterclass' AND categoria != 'produtos';