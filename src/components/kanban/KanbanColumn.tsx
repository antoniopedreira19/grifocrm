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
}

export function KanbanColumn({ status, title, leads, canDrag }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { status },
  });

  const leadIds = leads.map(l => l.id);

  return (
    <div ref={setNodeRef} className="flex-shrink-0 w-80">
      <Card className={`h-full ${isOver ? 'ring-2 ring-primary' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">
              {title}
            </CardTitle>
            <Badge variant="secondary" className="rounded-full">
              {leads.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="max-h-[calc(100vh-16rem)] overflow-y-auto">
          <SortableContext items={leadIds} strategy={verticalListSortingStrategy}>
            {leads.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-8">
                Nenhum lead nesta etapa
              </div>
            ) : (
              leads.map((lead) => (
                <KanbanCard
                  key={lead.id}
                  lead={lead}
                  status={status}
                  disabled={!canDrag(lead)}
                />
              ))
            )}
          </SortableContext>
        </CardContent>
      </Card>
    </div>
  );
}
