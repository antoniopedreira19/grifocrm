import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  DndContext, 
  DragEndEvent, 
  DragOverlay, 
  DragStartEvent, 
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter
} from "@dnd-kit/core";
import { AppLayout } from "@/components/layout/AppLayout";
import { KanbanColumn } from "@/components/kanban/KanbanColumn";
import { KanbanCard } from "@/components/kanban/KanbanCard";
import { ProximoContatoModal } from "@/components/kanban/ProximoContatoModal";
import { GanhoModal } from "@/components/kanban/GanhoModal";
import { PerdidoModal } from "@/components/kanban/PerdidoModal";
import { NegociandoModal } from "@/components/kanban/NegociandoModal";
import { PropostaModal } from "@/components/kanban/PropostaModal";
import { FollowUpModal } from "@/components/kanban/FollowUpModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Filter, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { statusLabels } from "@/utils/labels";
import { useProductCategories } from "@/hooks/useProductCategories";
import type { Status, Produto, TipoPagamento } from "@/types/lead";

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
  score_total?: number | null;
  score_cor?: string | null;
  deal_valor?: number | null;
  interesse_mentoria_fast?: boolean | null;
  proximo_contato?: string;
  tipo_pagamento?: string | null;
  valor_a_vista?: number | null;
  valor_parcelado?: number | null;
  valor_entrada?: number | null;
  proximo_followup?: string;
}

interface PendingMove {
  leadId: string;
  leadNome: string;
  fromStatus: Status;
  toStatus: Status;
  dealValor?: number;
}

const columns: Status[] = [
  "primeiro_contato",
  "proximo_contato",
  "negociando",
  "proposta",
  "followup",
  "ganho",
  "perdido",
];

export default function Kanban() {
  const { currentUser, currentRole } = useAuth();
  const queryClient = useQueryClient();
  const [produtoFilter, setProdutoFilter] = useState<string>("todos");
  const [categoriaFilter, setCategoriaFilter] = useState<string>("todos");
  const [responsavelFilter, setResponsavelFilter] = useState<string>("todos");
  const [ordenacao, setOrdenacao] = useState<string>("prioridade");
  const [scoreRange, setScoreRange] = useState<[number, number] | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeLead, setActiveLead] = useState<KanbanLead | null>(null);
  const [pendingMove, setPendingMove] = useState<PendingMove | null>(null);
  
  const { getProductsByCategory } = useProductCategories();
  
  // Estado separado para edição de próximo contato (não é movimento de status)
  const [editingProximoContato, setEditingProximoContato] = useState<{
    leadId: string;
    leadNome: string;
    currentDate?: string;
  } | null>(null);
  
  const [proximoContatoOpen, setProximoContatoOpen] = useState(false);
  const [negociandoOpen, setNegociandoOpen] = useState(false);
  const [propostaOpen, setPropostaOpen] = useState(false);
  const [followUpOpen, setFollowUpOpen] = useState(false);
  const [ganhoOpen, setGanhoOpen] = useState(false);
  const [perdidoOpen, setPerdidoOpen] = useState(false);

  // Configurar sensores para drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Pequeno movimento necessário para iniciar o drag
      },
    })
  );

  // Fetch leads da tabela principal
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["kanban-leads", produtoFilter, categoriaFilter, responsavelFilter, ordenacao, scoreRange, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("leads")
        .select("id, nome, produto, interesse, faturamento_2025, regiao, created_at, responsavel, ultima_interacao, status, score_total, score_cor, deal_valor, interesse_mentoria_fast, proximo_contato, tipo_pagamento, valor_a_vista, valor_parcelado, valor_entrada, proximo_followup")
        .in("status", ["primeiro_contato", "proximo_contato", "negociando", "proposta", "followup", "ganho", "perdido"]);

      // Filtro de categoria (prioridade sobre produto)
      if (categoriaFilter !== "todos") {
        const produtosCategoria = getProductsByCategory(categoriaFilter);
        if (produtosCategoria.length > 0) {
          query = query.in("produto", produtosCategoria as any);
        }
      } else if (produtoFilter !== "todos") {
        // Filtro de produto apenas se categoria não estiver definida
        query = query.eq("produto", produtoFilter as any);
      }

      // Filtro de responsável
      if (responsavelFilter === "eu" && currentUser) {
        query = query.eq("responsavel", currentUser.id);
      }

      // Filtro de score (apenas se definido)
      if (scoreRange) {
        query = query
          .gte("score_total", scoreRange[0])
          .lte("score_total", scoreRange[1]);
      }

      // Filtro de busca por nome
      if (searchQuery.trim()) {
        query = query.ilike("nome", `%${searchQuery.trim()}%`);
      }

      // Ordenação padrão por prioridade
      if (ordenacao === "prioridade" || ordenacao === "score") {
        query = query.order("score_total", { ascending: false, nullsFirst: false });
      } else if (ordenacao === "chegada") {
        query = query.order("created_at", { ascending: true });
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

    // Validar se é um status válido
    const validStatuses: Status[] = [
      "primeiro_contato",
      "proximo_contato",
      "negociando",
      "proposta",
      "followup",
      "ganho",
      "perdido",
    ];
    
    if (!validStatuses.includes(toStatus)) return;
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

    if (toStatus === "negociando") {
      setPendingMove({ leadId: lead.id, leadNome: lead.nome, fromStatus, toStatus, dealValor: lead.deal_valor });
      setNegociandoOpen(true);
      return;
    }

    if (toStatus === "proposta") {
      setPendingMove({ leadId: lead.id, leadNome: lead.nome, fromStatus, toStatus });
      setPropostaOpen(true);
      return;
    }

    if (toStatus === "followup") {
      setPendingMove({ leadId: lead.id, leadNome: lead.nome, fromStatus, toStatus });
      setFollowUpOpen(true);
      return;
    }

    if (toStatus === "ganho") {
      // Calcular o valor padrão do lead
      let dealValor = lead.deal_valor;
      if (!dealValor) {
        if (lead.produto === "mentoria_fast" || lead.produto === "fast") {
          dealValor = 18000;
        } else if (lead.produto === "gbc") {
          // Se for GBC mas tem interesse em Mentoria Fast, valor é 18k
          dealValor = lead.interesse_mentoria_fast ? 18000 : 120000;
        }
      }
      
      setPendingMove({ leadId: lead.id, leadNome: lead.nome, fromStatus, toStatus, dealValor });
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
    // Se está editando (não é movimento de status)
    if (editingProximoContato) {
      updateLeadMutation.mutate({
        leadId: editingProximoContato.leadId,
        updates: {
          proximo_contato: data.proximo_contato,
        },
      });
      setEditingProximoContato(null);
      setProximoContatoOpen(false);
      return;
    }

    // Se é movimento de status
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

  const handleEditProximoContato = (leadId: string, leadNome: string, currentDate?: string) => {
    setEditingProximoContato({ leadId, leadNome, currentDate });
    setProximoContatoOpen(true);
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

  const handleNegociandoConfirm = async (data: { produto: Produto; deal_valor: number }) => {
    if (!pendingMove) return;

    try {
      await updateLeadMutation.mutateAsync({
        leadId: pendingMove.leadId,
        updates: {
          status: pendingMove.toStatus,
          produto: data.produto,
          deal_valor: data.deal_valor,
        },
      });

      await createInteractionMutation.mutateAsync({
        leadId: pendingMove.leadId,
        conteudo: `Lead movido para Negociando. Produto: ${data.produto}, Valor: R$ ${data.deal_valor.toFixed(2)}`,
        tipo: "comentario",
      });

      setNegociandoOpen(false);
      setPendingMove(null);
    } catch (error) {
      console.error("Erro ao atualizar negociação:", error);
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

  const handlePropostaConfirm = async (data: { 
    tipo_pagamento: TipoPagamento;
    valor_a_vista?: number;
    valor_parcelado?: number;
    valor_entrada?: number;
  }) => {
    if (!pendingMove) return;

    try {
      await updateLeadMutation.mutateAsync({
        leadId: pendingMove.leadId,
        updates: {
          status: pendingMove.toStatus,
          tipo_pagamento: data.tipo_pagamento,
          valor_a_vista: data.valor_a_vista,
          valor_parcelado: data.valor_parcelado,
          valor_entrada: data.valor_entrada,
        },
      });

      const pagamentoTexto = data.tipo_pagamento === "a_vista" 
        ? `À vista: R$ ${data.valor_a_vista?.toFixed(2)}`
        : data.tipo_pagamento === "parcelado"
        ? `Parcelado: R$ ${data.valor_parcelado?.toFixed(2)}`
        : `Entrada + Parcelado: R$ ${data.valor_entrada?.toFixed(2)} + R$ ${data.valor_parcelado?.toFixed(2)}`;

      await createInteractionMutation.mutateAsync({
        leadId: pendingMove.leadId,
        conteudo: `Proposta enviada. ${pagamentoTexto}`,
        tipo: "comentario",
      });

      setPropostaOpen(false);
      setPendingMove(null);
    } catch (error) {
      console.error("Erro ao enviar proposta:", error);
    }
  };

  const handleFollowUpConfirm = async (data: { proximo_followup: string }) => {
    if (!pendingMove) return;

    try {
      await updateLeadMutation.mutateAsync({
        leadId: pendingMove.leadId,
        updates: {
          status: pendingMove.toStatus,
          proximo_followup: data.proximo_followup,
        },
      });

      await createInteractionMutation.mutateAsync({
        leadId: pendingMove.leadId,
        conteudo: `Follow-up agendado para ${new Date(data.proximo_followup).toLocaleString('pt-BR')}`,
        tipo: "comentario",
      });

      setFollowUpOpen(false);
      setPendingMove(null);
    } catch (error) {
      console.error("Erro ao agendar follow-up:", error);
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
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar por nome..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={categoriaFilter} onValueChange={(v) => { setCategoriaFilter(v); if (v !== "todos") setProdutoFilter("todos"); }}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas categorias</SelectItem>
                  <SelectItem value="mentorias">Mentorias</SelectItem>
                  <SelectItem value="produtos">Produtos</SelectItem>
                </SelectContent>
              </Select>

              <Select value={produtoFilter} onValueChange={(v) => { setProdutoFilter(v); if (v !== "todos") setCategoriaFilter("todos"); }}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Produto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os produtos</SelectItem>
                  <SelectItem value="gbc">GBC</SelectItem>
                  <SelectItem value="mentoria_fast">Mentoria Fast</SelectItem>
                  <SelectItem value="board">Board</SelectItem>
                  <SelectItem value="masterclass">Masterclass</SelectItem>
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
                  <SelectItem value="score">Score</SelectItem>
                  <SelectItem value="chegada">Ordem de chegada</SelectItem>
                  <SelectItem value="ultima_interacao">Última interação</SelectItem>
                  <SelectItem value="data_criacao">Data de criação</SelectItem>
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-3">Filtrar por Score</h4>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium w-8">{scoreRange?.[0] ?? 0}</span>
                        <Slider
                          value={scoreRange ?? [0, 10]}
                          onValueChange={(value) => setScoreRange(value as [number, number])}
                          min={0}
                          max={10}
                          step={1}
                          minStepsBetweenThumbs={1}
                          className="flex-1"
                        />
                        <span className="text-sm font-medium w-8">{scoreRange?.[1] ?? 10}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {scoreRange ? `Score entre ${scoreRange[0]} e ${scoreRange[1]}` : 'Todos os scores'}
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setScoreRange(null)}
                        className="w-full mt-2"
                      >
                        Limpar filtro
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
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
              sensors={sensors}
              collisionDetection={closestCenter}
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
                    onEditProximoContato={handleEditProximoContato}
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
          setEditingProximoContato(null);
        }}
        onConfirm={handleProximoContatoConfirm}
        leadNome={editingProximoContato?.leadNome || pendingMove?.leadNome || ""}
        initialDate={editingProximoContato?.currentDate}
      />

      <GanhoModal
        open={ganhoOpen}
        onClose={() => {
          setGanhoOpen(false);
          setPendingMove(null);
        }}
        onConfirm={handleGanhoConfirm}
        leadNome={pendingMove?.leadNome || ""}
        defaultValor={pendingMove?.dealValor}
      />

      <NegociandoModal
        open={negociandoOpen}
        onClose={() => {
          setNegociandoOpen(false);
          setPendingMove(null);
        }}
        onConfirm={handleNegociandoConfirm}
        leadNome={pendingMove?.leadNome || ""}
        currentProduto={leads.find(l => l.id === pendingMove?.leadId)?.produto}
        currentValor={pendingMove?.dealValor}
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

      <PropostaModal
        open={propostaOpen}
        onClose={() => {
          setPropostaOpen(false);
          setPendingMove(null);
        }}
        onConfirm={handlePropostaConfirm}
        leadNome={pendingMove?.leadNome || ""}
        currentValor={leads.find(l => l.id === pendingMove?.leadId)?.deal_valor || undefined}
      />

      <FollowUpModal
        open={followUpOpen}
        onClose={() => {
          setFollowUpOpen(false);
          setPendingMove(null);
        }}
        onConfirm={handleFollowUpConfirm}
        leadNome={pendingMove?.leadNome || ""}
      />
    </AppLayout>
  );
}
