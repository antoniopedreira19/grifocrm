import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Status } from "@/types/lead";

interface KanbanLead {
  id: string;
  nome: string;
  produto: string;
  interesse: string;
  faturamento_2025: string;
  regiao?: string;
  created_at: string;
  responsavel?: string;
  ultima_interacao?: string;
}

interface KanbanCardProps {
  lead: KanbanLead;
  status: Status;
  disabled: boolean;
}

const interesseColors: Record<string, string> = {
  quero_agora: "bg-green-500/10 text-green-700 border-green-500/20",
  quero_entender: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  nao_mas_posso: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
  nao_nao_consigo: "bg-red-500/10 text-red-700 border-red-500/20",
};

const interesseLabels: Record<string, string> = {
  quero_agora: "Quero agora",
  quero_entender: "Quero entender",
  nao_mas_posso: "Posso conseguir",
  nao_nao_consigo: "Não consigo",
};

const faturamentoLabels: Record<string, string> = {
  ate_500k: "Até 500k",
  entre_500k_1m: "500k-1M",
  entre_1m_10m: "1M-10M",
  entre_10m_50m: "10M-50M",
};

export function KanbanCard({ lead, status, disabled }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: lead.id,
    data: { lead, status },
    disabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const createdAgo = formatDistanceToNow(new Date(lead.created_at), {
    addSuffix: true,
    locale: ptBR,
  });

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className={`mb-3 cursor-grab active:cursor-grabbing ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
        <CardContent className="p-4">
          {/* Título */}
          <h4 className="font-semibold text-sm mb-3 line-clamp-2">{lead.nome}</h4>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            <Badge variant="outline" className="text-xs font-medium">
              {lead.produto}
            </Badge>
            
            {lead.interesse && (
              <Badge 
                variant="outline" 
                className={`text-xs border ${interesseColors[lead.interesse] || ''}`}
              >
                {interesseLabels[lead.interesse] || lead.interesse}
              </Badge>
            )}
            
            {lead.faturamento_2025 && (
              <Badge variant="secondary" className="text-xs">
                {faturamentoLabels[lead.faturamento_2025] || lead.faturamento_2025}
              </Badge>
            )}
          </div>

          {/* Info adicional */}
          <div className="space-y-1 text-xs text-muted-foreground">
            {lead.regiao && (
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground/70">📍</span>
                <span>{lead.regiao}</span>
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground/70">📅</span>
              <span>{createdAgo}</span>
            </div>

            {lead.ultima_interacao && (
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground/70">💬</span>
                <span>
                  {formatDistanceToNow(new Date(lead.ultima_interacao), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
