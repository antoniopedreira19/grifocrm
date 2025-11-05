-- Adicionar policy de DELETE para leads
CREATE POLICY "del_leads_owner_or_admin"
ON public.leads
FOR DELETE
USING (
  -- Admin pode excluir qualquer lead
  (EXISTS (
    SELECT 1 FROM app_users u
    WHERE u.id = auth.uid()
      AND u.user_role = 'admin'
      AND u.user_ativo
  ))
  OR
  -- Closer/SDR pode excluir apenas seus próprios leads
  (
    responsavel = auth.uid()
    AND (EXISTS (
      SELECT 1 FROM app_users u
      WHERE u.id = auth.uid()
        AND u.user_role IN ('closer', 'sdr')
        AND u.user_ativo
    ))
  )
);