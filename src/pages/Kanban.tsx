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
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
  const [responsavelFilter, setResponsavelFilter] = useState<string>("todos");
  const [ordenacao, setOrdenacao] = useState<string>("prioridade");
  const [activeLead, setActiveLead] = useState<KanbanLead | null>(null);
  const [pendingMove, setPendingMove] = useState<PendingMove | null>(null);
  
  const [proximoContatoOpen, setProximoContatoOpen] = useState(false);
  const [ganhoOpen, setGanhoOpen] = useState(false);
  const [perdidoOpen, setPerdidoOpen] = useState(false);

  // Fetch leads da tabela principal
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["kanban-leads", produtoFilter, responsavelFilter, ordenacao],
    queryFn: async () => {
      let query = supabase
        .from("leads")
        .select("*")
        .in("status", ["primeiro_contato", "proximo_contato", "negociando", "ganho", "perdido"]);

      // Filtro de produto
      if (produtoFilter !== "todos") {
        query = query.eq("produto", produtoFilter as any);
      }

      // Filtro de responsável
      if (responsavelFilter === "eu" && currentUser) {
        query = query.eq("responsavel", currentUser.id);
      }

      // Ordenação
      if (ordenacao === "prioridade") {
        query = query.order("score_total", { ascending: false, nullsFirst: false });
      } else if (ordenacao === "ultima_interacao") {
        query = query.order("ultima_interacao", { ascending: false, nullsFirst: false });
      } else if (ordenacao === "data_criacao") {
        query = query.order("created_at", { ascending: false });
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

  const totalLeads = leads.length;

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
          <div className="px-8 pt-8 pb-4">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="px-8 pb-4">
            <div className="flex gap-3">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
          <div className="flex gap-4 px-8 pb-8 overflow-x-auto">
            {columns.map((status) => (
              <div key={status} className="w-[280px]">
                <Skeleton className="h-[calc(100vh-16rem)] rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        {/* Cabeçalho */}
        <div className="px-4 md:px-8 pt-8 pb-4">
          <h1 className="text-3xl font-bold text-foreground">Kanban</h1>
          <p className="text-muted-foreground mt-2">
            Pipeline visual de leads por etapa
          </p>
        </div>

        {/* Barra de ferramentas sticky */}
        <div className="sticky top-0 z-10 bg-background border-b px-4 md:px-8 py-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3 flex-wrap">
              <Select value={produtoFilter} onValueChange={setProdutoFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Produto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os produtos</SelectItem>
                  <SelectItem value="gbc">GBC</SelectItem>
                  <SelectItem value="mentoria_fast">Mentoria Fast</SelectItem>
                </SelectContent>
              </Select>

              <Select value={responsavelFilter} onValueChange={setResponsavelFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Responsável" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="eu">Meus leads</SelectItem>
                </SelectContent>
              </Select>

              <Select value={ordenacao} onValueChange={setOrdenacao}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Ordenar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prioridade">Prioridade</SelectItem>
                  <SelectItem value="ultima_interacao">Última interação</SelectItem>
                  <SelectItem value="data_criacao">Data de criação</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-muted-foreground">
              {totalLeads} {totalLeads === 1 ? "lead" : "leads"}
            </div>
          </div>
        </div>

        {/* Board do Kanban */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden px-4 md:px-8 pb-8">
          <div className="h-full">
            <DndContext
              collisionDetection={closestCorners}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className="flex gap-4 h-full py-4">
                {columns.map((status) => (
                  <KanbanColumn
                    key={status}
                    status={status}
                    title={statusLabels[status]}
                    leads={getLeadsByStatus(status)}
                    canDrag={canDrag}
                    columnWidth="w-[280px]"
                  />
                ))}
              </div>

              <DragOverlay>
                {activeLead ? (
                  <KanbanCard 
                    lead={activeLead} 
                    status={activeLead.status} 
                    disabled={false}
                  />
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>
        </div>

      </div>

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
    </AppLayout>
  );
}
