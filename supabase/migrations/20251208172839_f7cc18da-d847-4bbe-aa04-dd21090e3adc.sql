-- Fix masterclass leads to have correct category 'produtos' instead of 'mentorias'
UPDATE leads 
SET categoria = 'produtos' 
WHERE produto = 'masterclass' AND categoria = 'mentorias';