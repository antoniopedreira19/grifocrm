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
  densidade?: "compacta" | "confortavel";
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

export function KanbanCard({ lead, status, disabled, densidade = "compacta" }: KanbanCardProps) {
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

  const isConfortavel = densidade === "confortavel";

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className={`cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
        <CardContent className={isConfortavel ? "p-4" : "p-3"}>
          {/* Título */}
          <h4 className={`font-semibold mb-2 ${isConfortavel ? 'text-sm line-clamp-2' : 'text-xs line-clamp-1'}`}>
            {lead.nome}
          </h4>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            <Badge variant="outline" className="text-[10px] font-medium px-1.5 py-0">
              {lead.produto === "gbc" ? "GBC" : "Fast"}
            </Badge>
            
            {lead.interesse && (
              <Badge 
                variant="outline" 
                className={`text-[10px] px-1.5 py-0 border ${interesseColors[lead.interesse] || ''}`}
              >
                {interesseLabels[lead.interesse] || lead.interesse}
              </Badge>
            )}
          </div>

          {/* Info adicional */}
          <div className={`space-y-1 text-[11px] text-muted-foreground ${!isConfortavel && 'line-clamp-1'}`}>
            <div className="flex items-center gap-1">
              {lead.regiao && (
                <>
                  <span>📍 {lead.regiao}</span>
                  <span>•</span>
                </>
              )}
              <span>{createdAgo}</span>
            </div>

            {isConfortavel && (
              <>
                {lead.faturamento_2025 && (
                  <div className="flex items-center gap-1">
                    <span>💰</span>
                    <span>{faturamentoLabels[lead.faturamento_2025] || lead.faturamento_2025}</span>
                  </div>
                )}

                {lead.ultima_interacao && (
                  <div className="flex items-center gap-1">
                    <span>💬</span>
                    <span>
                      {formatDistanceToNow(new Date(lead.ultima_interacao), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
