import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Loader2, Filter, ArrowUpDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { statusLabels, produtoLabels } from "@/utils/labels";
import { LeadDetailsModal } from "@/components/lead/LeadDetailsModal";
import { CreateLeadModal } from "@/components/lead/CreateLeadModal";
import { formatPhoneNumber, capitalizeName } from "@/lib/utils";

interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  produto: string;
  status: string;
  score_cor: string | null;
  score_total: number | null;
  created_at: string;
  origem: string | null;
}

export default function Leads() {
  const { currentRole } = useAuth();
  const canCreateLead = currentRole && ['admin', 'closer', 'sdr'].includes(currentRole);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [ordenacao, setOrdenacao] = useState<string>("data_criacao");
  const [scoreRange, setScoreRange] = useState<[number, number] | null>(null);
  const [produtoFilter, setProdutoFilter] = useState<string>("todos");
  const [categoriaFilter, setCategoriaFilter] = useState<string>("mentorias");
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const { data: leads, isLoading, error } = useQuery({
    queryKey: ['leads', ordenacao, scoreRange, produtoFilter, categoriaFilter],
    queryFn: async () => {
      let query = supabase
        .from('leads')
        .select('id, nome, email, telefone, produto, status, score_cor, score_total, created_at, origem');

      // Aplicar filtro de score apenas se definido
      if (scoreRange) {
        query = query.gte("score_total", scoreRange[0]).lte("score_total", scoreRange[1]);
      }

      // Aplicar filtro de categoria (obrigatório)
      query = query.eq("categoria", categoriaFilter as any);
      
      // Aplicar filtro de produto se definido
      if (produtoFilter !== "todos") {
        query = query.eq("produto", produtoFilter as "gbc" | "mentoria_fast" | "board" | "masterclass");
      }

      // Ordenação
      if (ordenacao === "score") {
        query = query.order("score_total", { ascending: false, nullsFirst: false });
      } else if (ordenacao === "chegada") {
        query = query.order("created_at", { ascending: true });
      } else {
        query = query.order("created_at", { ascending: false });
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as Lead[];
    },
  });

  const filteredLeads = useMemo(() => {
    if (!leads) return [];
    if (!searchTerm) return leads;

    const term = searchTerm.toLowerCase();
    return leads.filter(lead => 
      lead.nome.toLowerCase().includes(term) ||
      lead.email.toLowerCase().includes(term) ||
      lead.telefone.toLowerCase().includes(term)
    );
  }, [leads, searchTerm]);

  const getScoreBadgeColor = (cor: string | null) => {
    if (!cor) return "bg-gray-500";
    
    const colors: Record<string, string> = {
      'verde': 'bg-green-600',
      'verde_claro': 'bg-green-400',
      'amarelo': 'bg-yellow-500',
      'vermelho': 'bg-red-600',
      'cinza': 'bg-gray-500',
    };
    
    return colors[cor] || 'bg-gray-500';
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    if (status === 'ganho') return 'default';
    if (status === 'perdido') return 'destructive';
    if (status === 'primeiro_contato') return 'secondary';
    return 'outline';
  };

  return (
    <AppLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Leads</h1>
            <p className="text-muted-foreground mt-2">
              {leads ? `${leads.length} lead${leads.length !== 1 ? 's' : ''} cadastrado${leads.length !== 1 ? 's' : ''}` : 'Visualize e gerencie todos os leads'}
            </p>
          </div>
          {canCreateLead && (
            <Button onClick={() => setCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Lead
            </Button>
          )}
        </div>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, telefone, e-mail..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={ordenacao} onValueChange={setOrdenacao}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="data_criacao">Mais recentes</SelectItem>
              <SelectItem value="score">Score (maior)</SelectItem>
              <SelectItem value="chegada">Ordem de chegada</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoriaFilter} onValueChange={(v) => { setCategoriaFilter(v); setProdutoFilter("todos"); }}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mentorias">Mentorias</SelectItem>
              <SelectItem value="produtos">Produtos</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">

                <div>
                  <h4 className="font-medium text-sm mb-3">Filtrar por Produto</h4>
                  <Select value={produtoFilter} onValueChange={setProdutoFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o produto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os produtos</SelectItem>
                      <SelectItem value="gbc">GBC</SelectItem>
                      <SelectItem value="mentoria_fast">Mentoria Fast</SelectItem>
                      <SelectItem value="board">Board</SelectItem>
                      <SelectItem value="masterclass">Masterclass</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setScoreRange(null);
                    setProdutoFilter("todos");
                  }}
                  className="w-full"
                >
                  Limpar todos os filtros
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Button variant="outline">Exportar CSV</Button>
        </div>

        <div className="border rounded-lg bg-card">
          {isLoading ? (
            <div className="p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">Carregando leads...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-destructive">
              <p>Erro ao carregar leads</p>
              <p className="text-sm mt-2">{error.message}</p>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <p>{searchTerm ? 'Nenhum lead encontrado' : 'Nenhum lead cadastrado ainda'}</p>
              <p className="text-sm mt-2">
                {searchTerm ? 'Tente ajustar sua busca' : 'Comece adicionando seu primeiro lead ou compartilhe os formulários'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow 
                    key={lead.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedLeadId(lead.id)}
                  >
                    <TableCell className="font-medium">{capitalizeName(lead.nome)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{lead.email}</div>
                        <div className="text-muted-foreground">{formatPhoneNumber(lead.telefone)}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {produtoLabels[lead.produto as keyof typeof produtoLabels] || lead.produto}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(lead.status)}>
                        {statusLabels[lead.status as keyof typeof statusLabels] || lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getScoreBadgeColor(lead.score_cor)}`} />
                        <span className="text-sm font-medium">{lead.score_total ?? '-'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {lead.origem || '-'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(lead.created_at), "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <LeadDetailsModal
        leadId={selectedLeadId}
        open={!!selectedLeadId}
        onClose={() => setSelectedLeadId(null)}
      />

      <CreateLeadModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </AppLayout>
  );
}
