-- Drop existing enum and recreate with technical names
-- First, we need to handle the dependency on sales_events table

-- Step 1: Create new enum with technical names
CREATE TYPE public.lastlink_event_new_t AS ENUM (
  'Abandoned_Cart',
  'Payment_Chargeback',
  'Payment_Refund',
  'Purchase_Order_Confirmed',
  'Purchase_Request_Canceled',
  'Purchase_Request_Confirmed',
  'Purchase_Request_Expired',
  'Recurrent_Payment',
  'Refund_Period_Over',
  'Subscription_Canceled',
  'Subscription_Expired',
  'Product_Access_Started',
  'Product_Access_Ended',
  'Subscription_Product_Access',
  'Subscription_Renewal_Pending',
  'Active_Member_Notification',
  'Refund_Requested'
);

-- Step 2: Update sales_events table to use the new enum
ALTER TABLE public.sales_events 
  ALTER COLUMN evento TYPE public.lastlink_event_new_t 
  USING CASE evento::text
    WHEN 'Carrinho Abandonado' THEN 'Abandoned_Cart'::public.lastlink_event_new_t
    WHEN 'Pagamento Estornado' THEN 'Payment_Chargeback'::public.lastlink_event_new_t
    WHEN 'Pagamento Reembolsado' THEN 'Payment_Refund'::public.lastlink_event_new_t
    WHEN 'Compra Completa' THEN 'Purchase_Order_Confirmed'::public.lastlink_event_new_t
    WHEN 'Pedido de Compra Cancelado' THEN 'Purchase_Request_Canceled'::public.lastlink_event_new_t
    WHEN 'Fatura Criada' THEN 'Purchase_Request_Confirmed'::public.lastlink_event_new_t
    WHEN 'Pedido de Compra Expirada' THEN 'Purchase_Request_Expired'::public.lastlink_event_new_t
    WHEN 'Pagamento de Renovação Efetuado' THEN 'Recurrent_Payment'::public.lastlink_event_new_t
    WHEN 'Periodo de Reembolso Terminado' THEN 'Refund_Period_Over'::public.lastlink_event_new_t
    WHEN 'Assinatura Cancelada' THEN 'Subscription_Canceled'::public.lastlink_event_new_t
    WHEN 'Assinatura Expirada' THEN 'Subscription_Expired'::public.lastlink_event_new_t
    WHEN 'Liberação e remoção de acesso' THEN 'Product_Access_Started'::public.lastlink_event_new_t
    WHEN 'Assinatura Pendente de Renovação' THEN 'Subscription_Renewal_Pending'::public.lastlink_event_new_t
    WHEN 'Notificar Membro Ativo' THEN 'Active_Member_Notification'::public.lastlink_event_new_t
    WHEN 'Início liberação de acesso' THEN 'Product_Access_Started'::public.lastlink_event_new_t
    WHEN 'Fim liberação de acesso' THEN 'Product_Access_Ended'::public.lastlink_event_new_t
    WHEN 'Reembolso solicitado' THEN 'Refund_Requested'::public.lastlink_event_new_t
    ELSE 'Abandoned_Cart'::public.lastlink_event_new_t
  END;

-- Step 3: Drop old enum
DROP TYPE public.lastlink_event_t;

-- Step 4: Rename new enum to original name
ALTER TYPE public.lastlink_event_new_t RENAME TO lastlink_event_t;

-- Step 5: Add RLS policies to sales_events if not exists
ALTER TABLE public.sales_events ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read sales events
CREATE POLICY "sel_sales_events_authenticated" ON public.sales_events
FOR SELECT USING (auth.role() = 'authenticated');

-- Allow service role to insert (for webhook)
CREATE POLICY "ins_sales_events_service" ON public.sales_events
FOR INSERT WITH CHECK (true);