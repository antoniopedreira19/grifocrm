import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { statusLabels } from "@/utils/labels";

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

  const { data: leads, isLoading, error } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('id, nome, email, telefone, produto, status, score_cor, score_total, created_at, origem')
        .order('created_at', { ascending: false });
      
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
            <Button>
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
          <Button variant="outline">Filtros</Button>
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
                  <TableRow key={lead.id} className="cursor-pointer">
                    <TableCell className="font-medium">{lead.nome}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{lead.email}</div>
                        <div className="text-muted-foreground">{lead.telefone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {lead.produto === 'gbc' ? 'GBC' : 'Mentoria Fast'}
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
    </AppLayout>
  );
}
