import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KanbanCard } from "./KanbanCard";
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

interface KanbanColumnProps {
  status: Status;
  title: string;
  leads: KanbanLead[];
  canDrag: (lead: KanbanLead) => boolean;
  densidade: "compacta" | "confortavel";
  columnWidth: string;
}

export function KanbanColumn({ status, title, leads, canDrag, densidade, columnWidth }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { status },
  });

  const leadIds = leads.map(l => l.id);

  return (
    <div ref={setNodeRef} className={`flex-shrink-0 ${columnWidth}`}>
      <Card className={`h-full flex flex-col ${isOver ? 'ring-2 ring-primary' : ''}`}>
        <CardHeader className="pb-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">
              {title}
            </CardTitle>
            <Badge variant="secondary" className="rounded-full">
              {leads.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto min-h-0 space-y-3">
          <SortableContext items={leadIds} strategy={verticalListSortingStrategy}>
            {leads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-4xl mb-3 opacity-20">📭</div>
                <p className="text-sm text-muted-foreground font-medium">
                  Nenhum lead nesta etapa
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Arraste cards para cá
                </p>
              </div>
            ) : (
              leads.map((lead) => (
                <KanbanCard
                  key={lead.id}
                  lead={lead}
                  status={status}
                  disabled={!canDrag(lead)}
                  densidade={densidade}
                />
              ))
            )}
          </SortableContext>
        </CardContent>
      </Card>
    </div>
  );
}
