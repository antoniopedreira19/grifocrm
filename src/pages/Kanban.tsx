import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"; // Componentes para o MultiSelect
import { Input } from "@/components/ui/input";
import { Filter, Search, Check, ChevronsUpDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { statusLabels } from "@/utils/labels";
import { cn } from "@/lib/utils";
import type { Status, Produto, TipoPagamento } from "@/types/lead";
import type { Database } from "@/integrations/supabase/types";

type ProdutoCategoria = Database["public"]["Enums"]["produto_categoria_t"];
type StatusDB = Database["public"]["Enums"]["status_t"];

// Interface local atualizada com categoria
interface KanbanLead {
  id: string;
  nome: string;
  produto: string;
  categoria?: ProdutoCategoria;
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
  ultimo_evento?: string | null;
}

interface PendingMove {
  leadId: string;
  leadNome: string;
  fromStatus: Status;
  toStatus: Status;
  dealValor?: number;
}

// Colunas Padrão (Mentorias)
const columnsDefault: Status[] = [
  "primeiro_contato",
  "proximo_contato",
  "negociando",
  "proposta",
  "followup",
  "ganho",
  "perdido",
];

// Colunas Produtos (Board)
// Mapeando "Segundo Contato" para "proximo_contato" internamente
const columnsProdutos: Status[] = [
  "primeiro_contato",
  "proximo_contato", // Será exibido como "Segundo Contato"
  "ganho",
  "perdido",
];

// Mapeamento de eventos Lastlink: label PT → valor do enum
const lastlinkEventsMap: Record<string, Database["public"]["Enums"]["lastlink_event_t"]> = {
  "Carrinho Abandonado": "Abandoned_Cart",
  "Pagamento Estornado": "Payment_Chargeback",
  "Pagamento Reembolsado": "Payment_Refund",
  "Compra Completa": "Purchase_Order_Confirmed",
  "Pedido de Compra Cancelado": "Purchase_Request_Canceled",
  "Fatura Criada": "Purchase_Request_Confirmed",
  "Pedido de Compra Expirado": "Purchase_Request_Expired",
  "Pagamento de Renovação Efetuado": "Recurrent_Payment",
  "Período de Reembolso Terminado": "Refund_Period_Over",
  "Assinatura Cancelada": "Subscription_Canceled",
  "Assinatura Expirada": "Subscription_Expired",
  "Assinatura Pendente de Renovação": "Subscription_Renewal_Pending",
  "Reembolso Solicitado": "Refund_Requested",
};

const lastlinkEvents = Object.keys(lastlinkEventsMap);

// Mapa de configuração para o Frontend
const produtosPorCategoria: Record<string, string[]> = {
  mentorias: ["gbc", "mentoria_fast", "masterclass"],
  produtos: ["board", "masterclass"],
};

// Labels dos produtos para exibição
const produtoLabels: Record<string, string> = {
  board: "Board",
  masterclass: "Masterclass",
  gbc: "GBC",
  mentoria_fast: "Mentoria Fast",
};

export default function Kanban() {
  const { currentUser, currentRole } = useAuth();
  const queryClient = useQueryClient();

  // Filtros
  const [produtoFilter, setProdutoFilter] = useState<string>("todos");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [productsComboboxOpen, setProductsComboboxOpen] = useState(false);
  const [categoriaFilter, setCategoriaFilter] = useState<string>("mentorias");
  const [responsavelFilter, setResponsavelFilter] = useState<string>("todos");
  const [ordenacao, setOrdenacao] = useState<string>("prioridade");
  const [scoreRange, setScoreRange] = useState<[number, number] | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Novo Filtro: Eventos Selecionados (Multi-select)
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [comboboxOpen, setComboboxOpen] = useState(false);

  const [activeLead, setActiveLead] = useState<KanbanLead | null>(null);
  const [pendingMove, setPendingMove] = useState<PendingMove | null>(null);

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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  // Lógica para definir quais colunas mostrar
  const activeColumns = categoriaFilter === "produtos" ? columnsProdutos : columnsDefault;

  // Título customizado para as colunas
  const getColumnTitle = (status: Status) => {
    if (categoriaFilter === "produtos" && status === "proximo_contato") {
      return "Segundo Contato";
    }
    return statusLabels[status];
  };

  // Fetch event counts para o filtro de produtos
  const { data: eventCounts = {} } = useQuery({
    queryKey: ["event-counts", categoriaFilter],
    queryFn: async () => {
      if (categoriaFilter !== "produtos") return {};
      
      const { data, error } = await supabase
        .from("sales_events")
        .select("evento");
      
      if (error) throw error;
      
      // Conta os eventos
      const counts: Record<string, number> = {};
      data.forEach((row) => {
        counts[row.evento] = (counts[row.evento] || 0) + 1;
      });
      
      return counts;
    },
    enabled: categoriaFilter === "produtos",
  });

  // Fetch leads
  const { data: leads = [], isLoading } = useQuery({
    queryKey: [
      "kanban-leads",
      produtoFilter,
      categoriaFilter,
      responsavelFilter,
      ordenacao,
      scoreRange,
      searchQuery,
      selectedEvents,
      selectedProducts,
    ],
    queryFn: async () => {
      // LÓGICA ESPECIAL PARA PRODUTOS
      if (categoriaFilter === "produtos") {
        // Requer produto(s) e evento(s) selecionados
        if (selectedProducts.length === 0 || selectedEvents.length === 0) {
          return [];
        }

        // Converte labels em português para valores do enum
        const enumEvents = selectedEvents
          .map((label) => lastlinkEventsMap[label])
          .filter(Boolean) as Database["public"]["Enums"]["lastlink_event_t"][];

        if (enumEvents.length === 0) return [];

        // Busca leads que tenham os eventos selecionados na tabela sales_events
        let query = supabase
          .from("leads")
          .select(
            `
            id, nome, produto, categoria, interesse, faturamento_2025, regiao, created_at, 
            responsavel, ultima_interacao, status, score_total, score_cor, deal_valor, 
            interesse_mentoria_fast, proximo_contato, tipo_pagamento, valor_a_vista, 
            valor_parcelado, valor_entrada, proximo_followup,
            sales_events!inner(evento)
          `,
          )
          .in("produto", selectedProducts as Database["public"]["Enums"]["produto_t"][])
          .in("sales_events.evento", enumEvents)
          .in("status", activeColumns as StatusDB[]);

        // Aplica outros filtros
        if (searchQuery.trim()) query = query.ilike("nome", `%${searchQuery.trim()}%`);
        if (responsavelFilter === "eu" && currentUser) query = query.eq("responsavel", currentUser.id);

        const { data, error } = await query;
        if (error) throw error;

        // Remove duplicatas (caso o lead tenha múltiplos eventos iguais)
        const uniqueLeads = Array.from(new Map(data.map((item) => [item.id, item])).values());
        const leadIds = uniqueLeads.map(l => l.id);
        
        // Buscar último evento de cada lead
        const { data: eventos } = await supabase
          .from("sales_events")
          .select("lead_id, evento, created_at")
          .in("lead_id", leadIds)
          .order("created_at", { ascending: false });
        
        const ultimoEventoPorLead: Record<string, string> = {};
        if (eventos) {
          eventos.forEach((ev) => {
            if (ev.lead_id && !ultimoEventoPorLead[ev.lead_id]) {
              ultimoEventoPorLead[ev.lead_id] = ev.evento;
            }
          });
        }
        
        return uniqueLeads.map(lead => ({
          ...lead,
          ultimo_evento: ultimoEventoPorLead[lead.id] || null
        })) as unknown as KanbanLead[];
      }

      // LÓGICA PADRÃO (MENTORIAS/GERAL)
      let query = supabase
        .from("leads")
        .select(
          "id, nome, produto, categoria, interesse, faturamento_2025, regiao, created_at, responsavel, ultima_interacao, status, score_total, score_cor, deal_valor, interesse_mentoria_fast, proximo_contato, tipo_pagamento, valor_a_vista, valor_parcelado, valor_entrada, proximo_followup",
        )
        .in("status", activeColumns as StatusDB[]);

      if (categoriaFilter !== "todos") query = query.eq("categoria", categoriaFilter as ProdutoCategoria);
      if (produtoFilter !== "todos") query = query.eq("produto", produtoFilter as Database["public"]["Enums"]["produto_t"]);
      if (responsavelFilter === "eu" && currentUser) query = query.eq("responsavel", currentUser.id);
      if (scoreRange) query = query.gte("score_total", scoreRange[0]).lte("score_total", scoreRange[1]);
      if (searchQuery.trim()) query = query.ilike("nome", `%${searchQuery.trim()}%`);

      // Ordenação
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

  const produtosDisponiveis = useMemo(() => {
    if (categoriaFilter === "todos") {
      return ["gbc", "mentoria_fast", "board", "masterclass"];
    }
    return produtosPorCategoria[categoriaFilter] || [];
  }, [categoriaFilter]);

  const handleCategoriaChange = (novaCategoria: string) => {
    setCategoriaFilter(novaCategoria);
    // Limpa eventos e produtos selecionados se sair de produtos
    if (novaCategoria !== "produtos") {
      setSelectedEvents([]);
      setSelectedProducts([]);
    }
    if (novaCategoria !== "todos" && produtoFilter !== "todos") {
      const produtosDaCategoria = produtosPorCategoria[novaCategoria] || [];
      if (!produtosDaCategoria.includes(produtoFilter)) {
        setProdutoFilter("todos");
      }
    }
  };

  // Função para alternar seleção de eventos no MultiSelect
  const toggleEvent = (event: string) => {
    setSelectedEvents((prev) => (prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]));
  };

  // Função para alternar seleção de produtos no MultiSelect
  const toggleProduct = (product: string) => {
    setSelectedProducts((prev) => (prev.includes(product) ? prev.filter((p) => p !== product) : [...prev, product]));
  };

  // ... (Mutations mantidas iguais - updateLeadMutation, createInteractionMutation)
  const updateLeadMutation = useMutation({
    mutationFn: async ({ leadId, updates }: { leadId: string; updates: any }) => {
      const { error } = await supabase.from("leads").update(updates).eq("id", leadId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kanban-leads"] });
      toast({ title: "Lead atualizado com sucesso!" });
    },
    onError: (error: any) => toast({ title: "Erro", description: error.message, variant: "destructive" }),
  });

  const createInteractionMutation = useMutation({
    mutationFn: async ({
      leadId,
      conteudo,
      tipo = "comentario",
    }: {
      leadId: string;
      conteudo: string;
      tipo?: string;
    }) => {
      const { error } = await supabase
        .from("interacoes")
        .insert({ lead_id: leadId, tipo: tipo as any, conteudo, autor: currentUser?.id } as any);
      if (error) throw error;
    },
  });

  // ... (Drag logic mantida igual)
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

    const validStatuses: Status[] = activeColumns;

    if (!validStatuses.includes(toStatus)) return;
    if (fromStatus === toStatus) return;

    if (!canDrag(lead)) {
      toast({ title: "Sem permissão", description: "Você não pode mover este lead.", variant: "destructive" });
      return;
    }

    // Validações Especiais (Mantidas)
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
      let dealValor = lead.deal_valor;
      if (!dealValor) {
        if (lead.produto === "mentoria_fast") dealValor = 18000;
        else if (lead.produto === "gbc") dealValor = lead.interesse_mentoria_fast ? 18000 : 120000;
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

    updateLeadMutation.mutate({
      leadId: lead.id,
      updates: { status: toStatus },
    });
  };

  // ... (Handlers dos Modais mantidos iguais - handleProximoContatoConfirm, etc.)
  const handleProximoContatoConfirm = (data: { proximo_contato: string }) => {
    if (editingProximoContato) {
      updateLeadMutation.mutate({
        leadId: editingProximoContato.leadId,
        updates: { proximo_contato: data.proximo_contato },
      });
      setEditingProximoContato(null);
      setProximoContatoOpen(false);
      return;
    }
    if (!pendingMove) return;
    updateLeadMutation.mutate({
      leadId: pendingMove.leadId,
      updates: { status: pendingMove.toStatus, proximo_contato: data.proximo_contato },
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
        updates: { status: pendingMove.toStatus, deal_valor: data.deal_valor },
      });
      if (data.observacao)
        await createInteractionMutation.mutateAsync({
          leadId: pendingMove.leadId,
          conteudo: `Lead ganho! Valor: R$ ${data.deal_valor.toFixed(2)}. ${data.observacao}`,
          tipo: "comentario",
        });
      setGanhoOpen(false);
      setPendingMove(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNegociandoConfirm = async (data: { produto: Produto; deal_valor: number }) => {
    if (!pendingMove) return;
    try {
      await updateLeadMutation.mutateAsync({
        leadId: pendingMove.leadId,
        updates: { status: pendingMove.toStatus, produto: data.produto, deal_valor: data.deal_valor },
      });
      await createInteractionMutation.mutateAsync({
        leadId: pendingMove.leadId,
        conteudo: `Lead movido para Negociando. Produto: ${data.produto}, Valor: R$ ${data.deal_valor.toFixed(2)}`,
        tipo: "comentario",
      });
      setNegociandoOpen(false);
      setPendingMove(null);
    } catch (error) {
      console.error(error);
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
      console.error(error);
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
        updates: { status: pendingMove.toStatus, ...data },
      });
      const pagamentoTexto =
        data.tipo_pagamento === "a_vista"
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
      console.error(error);
    }
  };

  const handleFollowUpConfirm = async (data: { proximo_followup: string }) => {
    if (!pendingMove) return;
    try {
      await updateLeadMutation.mutateAsync({
        leadId: pendingMove.leadId,
        updates: { status: pendingMove.toStatus, proximo_followup: data.proximo_followup },
      });
      await createInteractionMutation.mutateAsync({
        leadId: pendingMove.leadId,
        conteudo: `Follow-up agendado para ${new Date(data.proximo_followup).toLocaleString("pt-BR")}`,
        tipo: "comentario",
      });
      setFollowUpOpen(false);
      setPendingMove(null);
    } catch (error) {
      console.error(error);
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
              <Skeleton className="h-10 w-full max-w-md" />
            </div>
          </div>
          <div className="flex gap-4 px-8 pb-8 overflow-x-auto">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-[280px]">
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
        <div className="px-4 md:px-8 pt-8 pb-4">
          <h1 className="text-3xl font-bold text-foreground">Kanban</h1>
          <p className="text-muted-foreground mt-2">Pipeline visual de leads por etapa</p>
        </div>

        <div className="sticky top-0 z-10 bg-background border-b px-4 md:px-8 py-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3 flex-wrap w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar por nome..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={categoriaFilter} onValueChange={handleCategoriaChange}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mentorias">Mentorias</SelectItem>
                  <SelectItem value="produtos">Produtos</SelectItem>
                </SelectContent>
              </Select>

              {/* Renderiza Filtros de Produtos e Eventos APENAS se categoria for PRODUTOS */}
              {categoriaFilter === "produtos" ? (
                <>
                  {/* Multi-select de Produtos */}
                  <Popover open={productsComboboxOpen} onOpenChange={setProductsComboboxOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={productsComboboxOpen}
                        className="w-[200px] justify-between"
                      >
                        {selectedProducts.length > 0
                          ? `${selectedProducts.length} produto(s)`
                          : "Selecionar Produtos"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandList>
                          <CommandGroup>
                            {produtosPorCategoria["produtos"].map((produto) => (
                              <CommandItem key={produto} value={produto} onSelect={() => toggleProduct(produto)}>
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedProducts.includes(produto) ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                {produtoLabels[produto] || produto}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {/* Multi-select de Eventos */}
                  <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={comboboxOpen}
                        className="w-[250px] justify-between"
                      >
                        {selectedEvents.length > 0
                          ? `${selectedEvents.length} evento(s)`
                          : "Selecionar Eventos"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[250px] p-0">
                      <Command>
                        <CommandInput placeholder="Buscar evento..." />
                        <CommandList>
                          <CommandEmpty>Nenhum evento encontrado.</CommandEmpty>
                          <CommandGroup>
                            {lastlinkEvents.map((evento) => {
                              const enumValue = lastlinkEventsMap[evento];
                              const count = enumValue ? (eventCounts[enumValue] || 0) : 0;
                              return (
                                <CommandItem key={evento} value={evento} onSelect={() => toggleEvent(evento)}>
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedEvents.includes(evento) ? "opacity-100" : "opacity-0",
                                    )}
                                  />
                                  <span className="flex-1">{evento}</span>
                                  <span className="ml-2 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                                    {count}
                                  </span>
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </>
              ) : (
                // Se não for Produtos, mostra os filtros normais
                <>
                  <Select value={produtoFilter} onValueChange={setProdutoFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Produto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      {produtosDisponiveis.includes("gbc") && <SelectItem value="gbc">GBC</SelectItem>}
                      {produtosDisponiveis.includes("mentoria_fast") && (
                        <SelectItem value="mentoria_fast">Mentoria Fast</SelectItem>
                      )}
                      {produtosDisponiveis.includes("masterclass") && (
                        <SelectItem value="masterclass">Masterclass</SelectItem>
                      )}
                    </SelectContent>
                  </Select>

                  <Select value={responsavelFilter} onValueChange={setResponsavelFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Responsável" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="eu">Meus leads</SelectItem>
                    </SelectContent>
                  </Select>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="icon" title="Filtros avançados">
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setScoreRange(null)}
                            className="w-full mt-2"
                          >
                            Limpar filtro de score
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </>
              )}
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
                {/* Caso Produtos e sem seleção, mostra aviso amigável */}
                {categoriaFilter === "produtos" && selectedEvents.length === 0 ? (
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg bg-muted/20">
                    <Filter className="w-12 h-12 mb-4 opacity-20" />
                    <p className="font-medium">Selecione um ou mais eventos para visualizar os leads</p>
                    <p className="text-sm mt-2">
                      Utilize o filtro acima para escolher entre "Compra Completa", "Carrinho Abandonado", etc.
                    </p>
                  </div>
                ) : (
                  activeColumns.map((status) => (
                    <KanbanColumn
                      key={status}
                      status={status}
                      title={getColumnTitle(status)}
                      leads={getLeadsByStatus(status)}
                      canDrag={canDrag}
                      columnWidth="w-[280px]"
                      onEditProximoContato={handleEditProximoContato}
                    />
                  ))
                )}
              </div>

              <DragOverlay>
                {activeLead ? <KanbanCard lead={activeLead} status={activeLead.status} disabled={false} /> : null}
              </DragOverlay>
            </DndContext>
          </div>
        </div>
      </div>

      {/* Renderização dos Modais (omitida para brevidade, mantenha igual ao anterior) */}
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
        currentProduto={leads.find((l) => l.id === pendingMove?.leadId)?.produto}
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
        currentValor={leads.find((l) => l.id === pendingMove?.leadId)?.deal_valor || undefined}
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
