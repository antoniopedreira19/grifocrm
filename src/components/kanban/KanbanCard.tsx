import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Status } from "@/types/lead";
import { LeadDetailsModal } from "../lead/LeadDetailsModal";

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
  score_total?: number | null;
  score_cor?: string | null;
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

const getScoreBadgeColor = (score: number | null | undefined): string => {
  if (!score) return "bg-gray-500";
  if (score >= 8) return "bg-green-600";
  if (score >= 6) return "bg-green-400";
  if (score >= 4) return "bg-yellow-500";
  return "bg-red-600";
};

export function KanbanCard({ lead, status, disabled }: KanbanCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({ 
    id: lead.id,
    data: { lead, status },
    disabled,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    cursor: disabled ? 'not-allowed' : isDragging ? 'grabbing' : 'grab',
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 'auto',
  };

  const createdAgo = formatDistanceToNow(new Date(lead.created_at), {
    addSuffix: true,
    locale: ptBR,
  });

  const handleOpenModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDetailsOpen(true);
  };

  return (
    <>
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <Card 
          className={`group relative transition-shadow hover:shadow-md ${
            disabled ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        >
          {/* Botão de abrir modal - absolutamente posicionado */}
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 hover:bg-primary/10 transition-opacity z-10"
            onClick={handleOpenModal}
          >
            <Plus className="h-4 w-4" />
          </Button>

          <CardContent className="p-3 pr-8">
          {/* Título */}
          <h4 className="font-semibold mb-2 text-xs line-clamp-1">
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

            {lead.score_total !== null && lead.score_total !== undefined && (
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${getScoreBadgeColor(lead.score_total)}`} />
                <span className="text-[10px] font-semibold">{lead.score_total}</span>
              </div>
            )}
          </div>

          {/* Info adicional */}
          <div className="space-y-1 text-[11px] text-muted-foreground line-clamp-1">
            <div className="flex items-center gap-1">
              {lead.regiao && (
                <>
                  <span>📍 {lead.regiao}</span>
                  <span>•</span>
                </>
              )}
              <span>{createdAgo}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <LeadDetailsModal
      leadId={lead.id}
      open={detailsOpen}
      onClose={() => setDetailsOpen(false)}
    />
  </>
  );
}
