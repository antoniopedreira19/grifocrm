import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  ShoppingCart, 
  CreditCard, 
  XCircle, 
  CheckCircle, 
  Clock, 
  RefreshCw,
  AlertTriangle,
  PlayCircle,
  StopCircle,
  Bell
} from "lucide-react";

interface LeadSalesEventsTabProps {
  leadId: string;
}

const eventLabels: Record<string, string> = {
  Abandoned_Cart: "Carrinho Abandonado",
  Payment_Chargeback: "Chargeback",
  Payment_Refund: "Reembolso",
  Purchase_Order_Confirmed: "Compra Confirmada",
  Purchase_Request_Canceled: "Pedido Cancelado",
  Purchase_Request_Confirmed: "Pedido Confirmado",
  Purchase_Request_Expired: "Pedido Expirado",
  Recurrent_Payment: "Pagamento Recorrente",
  Refund_Period_Over: "Período de Reembolso Encerrado",
  Subscription_Canceled: "Assinatura Cancelada",
  Subscription_Expired: "Assinatura Expirada",
  Product_Access_Started: "Acesso ao Produto Iniciado",
  Product_Access_Ended: "Acesso ao Produto Encerrado",
  Subscription_Product_Access: "Acesso à Assinatura",
  Subscription_Renewal_Pending: "Renovação Pendente",
  Active_Member_Notification: "Notificação de Membro Ativo",
  Refund_Requested: "Reembolso Solicitado",
};

const eventIcons: Record<string, React.ReactNode> = {
  Abandoned_Cart: <ShoppingCart className="h-4 w-4" />,
  Payment_Chargeback: <AlertTriangle className="h-4 w-4" />,
  Payment_Refund: <RefreshCw className="h-4 w-4" />,
  Purchase_Order_Confirmed: <CheckCircle className="h-4 w-4" />,
  Purchase_Request_Canceled: <XCircle className="h-4 w-4" />,
  Purchase_Request_Confirmed: <CreditCard className="h-4 w-4" />,
  Purchase_Request_Expired: <Clock className="h-4 w-4" />,
  Recurrent_Payment: <RefreshCw className="h-4 w-4" />,
  Refund_Period_Over: <Clock className="h-4 w-4" />,
  Subscription_Canceled: <XCircle className="h-4 w-4" />,
  Subscription_Expired: <Clock className="h-4 w-4" />,
  Product_Access_Started: <PlayCircle className="h-4 w-4" />,
  Product_Access_Ended: <StopCircle className="h-4 w-4" />,
  Subscription_Product_Access: <CheckCircle className="h-4 w-4" />,
  Subscription_Renewal_Pending: <Clock className="h-4 w-4" />,
  Active_Member_Notification: <Bell className="h-4 w-4" />,
  Refund_Requested: <AlertTriangle className="h-4 w-4" />,
};

const eventColors: Record<string, string> = {
  Abandoned_Cart: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  Payment_Chargeback: "bg-red-500/10 text-red-600 border-red-500/20",
  Payment_Refund: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  Purchase_Order_Confirmed: "bg-green-500/10 text-green-600 border-green-500/20",
  Purchase_Request_Canceled: "bg-red-500/10 text-red-600 border-red-500/20",
  Purchase_Request_Confirmed: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Purchase_Request_Expired: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  Recurrent_Payment: "bg-green-500/10 text-green-600 border-green-500/20",
  Refund_Period_Over: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  Subscription_Canceled: "bg-red-500/10 text-red-600 border-red-500/20",
  Subscription_Expired: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  Product_Access_Started: "bg-green-500/10 text-green-600 border-green-500/20",
  Product_Access_Ended: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  Subscription_Product_Access: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Subscription_Renewal_Pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  Active_Member_Notification: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Refund_Requested: "bg-orange-500/10 text-orange-600 border-orange-500/20",
};

export function LeadSalesEventsTab({ leadId }: LeadSalesEventsTabProps) {
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["lead-sales-events", leadId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sales_events")
        .select("*")
        .eq("lead_id", leadId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!leadId,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Nenhum evento de venda registrado para este lead.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
        
        {events.map((event, index) => (
          <div key={event.id} className="relative flex gap-4 pb-6">
            {/* Timeline dot */}
            <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 ${eventColors[event.evento] || "bg-muted"}`}>
              {eventIcons[event.evento] || <CreditCard className="h-4 w-4" />}
            </div>
            
            {/* Event content */}
            <div className="flex-1 bg-card border rounded-lg p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge variant="outline" className={eventColors[event.evento]}>
                    {eventLabels[event.evento] || event.evento}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                    {format(new Date(event.created_at!), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
                {event.valor && (
                  <span className="font-semibold text-lg">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(event.valor)}
                  </span>
                )}
              </div>
              
              {event.email_cliente && (
                <p className="text-sm text-muted-foreground mt-2">
                  Email: {event.email_cliente}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
