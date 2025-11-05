import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners } from "@dnd-kit/core";
import { AppLayout } from "@/components/layout/AppLayout";
import { KanbanColumn } from "@/components/kanban/KanbanColumn";
import { KanbanCard } from "@/components/kanban/KanbanCard";
import { ProximoContatoModal } from "@/components/kanban/ProximoContatoModal";
import { GanhoModal } from "@/components/kanban/GanhoModal";
import { PerdidoModal } from "@/components/kanban/PerdidoModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { statusLabels } from "@/utils/labels";
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
  status: Status;
}

interface PendingMove {
  leadId: string;
  leadNome: string;
  fromStatus: Status;
  toStatus: Status;
}

const columns: Status[] = [
  "primeiro_contato",
  "proximo_contato",
  "negociando",
  "ganho",
  "perdido",
];

export default function Kanban() {
  const { currentUser, currentRole } = useAuth();
  const queryClient = useQueryClient();
  const [produtoFilter, setProdutoFilter] = useState<string>("todos");
  const [activeLead, setActiveLead] = useState<KanbanLead | null>(null);
  const [pendingMove, setPendingMove] = useState<PendingMove | null>(null);
  
  const [proximoContatoOpen, setProximoContatoOpen] = useState(false);
  const [ganhoOpen, setGanhoOpen] = useState(false);
  const [perdidoOpen, setPerdidoOpen] = useState(false);

  // Fetch leads
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["kanban-leads", produtoFilter],
    queryFn: async () => {
      let query = supabase
        .from("leads")
        .select("*")
        .in("status", ["primeiro_contato", "proximo_contato", "negociando", "ganho", "perdido"])
        .order("created_at", { ascending: false });

      if (produtoFilter !== "todos") {
        query = query.eq("produto", produtoFilter as any);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as KanbanLead[];
    },
  });

  // Update lead mutation
  const updateLeadMutation = useMutation({
    mutationFn: async ({ 
      leadId, 
      updates 
    }: { 
      leadId: string; 
      updates: any;
    }) => {
      const { error } = await supabase
        .from("leads")
        .update(updates)
        .eq("id", leadId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kanban-leads"] });
      toast({ title: "Lead atualizado com sucesso!" });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar lead",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Create interaction mutation
  const createInteractionMutation = useMutation({
    mutationFn: async ({ 
      leadId, 
      conteudo,
      tipo = "comentario"
    }: { 
      leadId: string; 
      conteudo: string;
      tipo?: string;
    }) => {
      const { error } = await supabase
        .from("interacoes")
        .insert({
          lead_id: leadId,
          tipo: tipo as any,
          conteudo,
          autor: currentUser?.id,
        } as any);

      if (error) throw error;
    },
  });

  const canDrag = (lead: KanbanLead): boolean => {
    if (!currentRole || !currentUser) return false;
    if (currentRole === "viewer") return false;
    if (currentRole === "admin") return true;
    if (currentRole === "closer" || currentRole === "sdr") {
      return lead.responsavel === currentUser.id;
    }
    return false;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const lead = active.data.current?.lead as KanbanLead;
    setActiveLead(lead);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveLead(null);

    if (!over) return;

    const lead = active.data.current?.lead as KanbanLead;
    const fromStatus = active.data.current?.status as Status;
    const toStatus = over.id as Status;

    if (fromStatus === toStatus) return;

    // Verificar permissões
    if (!canDrag(lead)) {
      toast({
        title: "Sem permissão",
        description: "Você não pode mover este lead.",
        variant: "destructive",
      });
      return;
    }

    // Validações especiais
    if (toStatus === "proximo_contato") {
      setPendingMove({ leadId: lead.id, leadNome: lead.nome, fromStatus, toStatus });
      setProximoContatoOpen(true);
      return;
    }

    if (toStatus === "ganho") {
      setPendingMove({ leadId: lead.id, leadNome: lead.nome, fromStatus, toStatus });
      setGanhoOpen(true);
      return;
    }

    if (toStatus === "perdido") {
      setPendingMove({ leadId: lead.id, leadNome: lead.nome, fromStatus, toStatus });
      setPerdidoOpen(true);
      return;
    }

    // Move simples
    updateLeadMutation.mutate({
      leadId: lead.id,
      updates: { status: toStatus },
    });
  };

  const handleProximoContatoConfirm = (data: { proximo_contato: string }) => {
    if (!pendingMove) return;

    updateLeadMutation.mutate({
      leadId: pendingMove.leadId,
      updates: {
        status: pendingMove.toStatus,
        proximo_contato: data.proximo_contato,
      },
    });

    setProximoContatoOpen(false);
    setPendingMove(null);
  };

  const handleGanhoConfirm = async (data: { deal_valor: number; observacao: string }) => {
    if (!pendingMove) return;

    try {
      await updateLeadMutation.mutateAsync({
        leadId: pendingMove.leadId,
        updates: {
          status: pendingMove.toStatus,
          deal_valor: data.deal_valor,
        },
      });

      if (data.observacao) {
        await createInteractionMutation.mutateAsync({
          leadId: pendingMove.leadId,
          conteudo: `Lead ganho! Valor: R$ ${data.deal_valor.toFixed(2)}. ${data.observacao}`,
          tipo: "comentario",
        });
      }

      setGanhoOpen(false);
      setPendingMove(null);
    } catch (error) {
      console.error("Erro ao marcar como ganho:", error);
    }
  };

  const handlePerdidoConfirm = async (data: { motivo_categoria?: string; motivo_texto: string }) => {
    if (!pendingMove) return;

    try {
      await updateLeadMutation.mutateAsync({
        leadId: pendingMove.leadId,
        updates: {
          status: pendingMove.toStatus,
          perdido_motivo_cat: data.motivo_categoria,
          perdido_motivo_txt: data.motivo_texto,
        },
      });

      await createInteractionMutation.mutateAsync({
        leadId: pendingMove.leadId,
        conteudo: `Lead perdido. Motivo: ${data.motivo_texto}`,
        tipo: "comentario",
      });

      setPerdidoOpen(false);
      setPendingMove(null);
    } catch (error) {
      console.error("Erro ao marcar como perdido:", error);
    }
  };

  const getLeadsByStatus = (status: Status) => {
    return leads.filter((lead) => lead.status === status);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-8">
          <div className="text-center">Carregando...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Kanban</h1>
            <p className="text-muted-foreground mt-2">
              Pipeline visual de leads por etapa
            </p>
          </div>

          <div className="w-64">
            <Select value={produtoFilter} onValueChange={setProdutoFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por produto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os produtos</SelectItem>
                <SelectItem value="gbc">GBC</SelectItem>
                <SelectItem value="mentoria_fast">Mentoria Fast</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DndContext
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-4">
            {columns.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                title={statusLabels[status]}
                leads={getLeadsByStatus(status)}
                canDrag={canDrag}
              />
            ))}
          </div>

          <DragOverlay>
            {activeLead ? (
              <KanbanCard lead={activeLead} status={activeLead.status} disabled={false} />
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Modals */}
        <ProximoContatoModal
          open={proximoContatoOpen}
          onClose={() => {
            setProximoContatoOpen(false);
            setPendingMove(null);
          }}
          onConfirm={handleProximoContatoConfirm}
          leadNome={pendingMove?.leadNome || ""}
        />

        <GanhoModal
          open={ganhoOpen}
          onClose={() => {
            setGanhoOpen(false);
            setPendingMove(null);
          }}
          onConfirm={handleGanhoConfirm}
          leadNome={pendingMove?.leadNome || ""}
        />

        <PerdidoModal
          open={perdidoOpen}
          onClose={() => {
            setPerdidoOpen(false);
            setPendingMove(null);
          }}
          onConfirm={handlePerdidoConfirm}
          leadNome={pendingMove?.leadNome || ""}
        />
      </div>
    </AppLayout>
  );
}
