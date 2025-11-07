import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, Target, DollarSign } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const statusLabels: Record<string, string> = {
  primeiro_contato: "Primeiro Contato",
  proximo_contato: "Próximo Contato",
  negociando: "Negociando",
  ganho: "Ganho",
  perdido: "Perdido"
};

const produtoLabels: Record<string, string> = {
  gbc: "GBC",
  mentoria_fast: "Mentoria FAST"
};

const statusColors: Record<string, string> = {
  primeiro_contato: "hsl(var(--chart-1))",
  proximo_contato: "hsl(var(--chart-2))",
  negociando: "hsl(var(--chart-3))",
  ganho: "hsl(var(--chart-4))",
  perdido: "hsl(var(--chart-5))"
};

export default function Dashboard() {
  const [produtoFilter, setProdutoFilter] = useState<string>("todos");

  const { data: leadsData, isLoading } = useQuery({
    queryKey: ["dashboard-leads", produtoFilter],
    queryFn: async () => {
      let query = supabase
        .from("leads")
        .select("id, status, produto, score_total, nome, deal_valor, interesse_mentoria_fast, created_at, perdido_motivo_cat");
      
      if (produtoFilter !== "todos") {
        query = query.eq("produto", produtoFilter as any);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const totalLeads = leadsData?.length || 0;
  const leadsNegociando = leadsData?.filter(l => l.status === "negociando").length || 0;
  const leadsGanhos = leadsData?.filter(l => l.status === "ganho").length || 0;
  const taxaConversao = totalLeads > 0 ? ((leadsGanhos / totalLeads) * 100).toFixed(1) : "0";
  
  // Cálculo do valor total de deals ganhos
  const valorTotalGanho = leadsData
    ?.filter(l => l.status === "ganho")
    .reduce((sum, l) => sum + (Number(l.deal_valor) || 0), 0) || 0;
  
  // Ticket médio dos ganhos
  const ticketMedio = leadsGanhos > 0 ? valorTotalGanho / leadsGanhos : 0;
  
  // Leads ganhos por produto
  const ganhosGBC = leadsData?.filter(l => l.status === "ganho" && l.produto === "gbc").length || 0;
  const ganhosFast = leadsData?.filter(l => l.status === "ganho" && l.produto === "mentoria_fast").length || 0;
  
  // Valor ganho por produto
  const valorGanhoGBC = leadsData
    ?.filter(l => l.status === "ganho" && l.produto === "gbc")
    .reduce((sum, l) => sum + (Number(l.deal_valor) || 0), 0) || 0;
  
  const valorGanhoFast = leadsData
    ?.filter(l => l.status === "ganho" && l.produto === "mentoria_fast")
    .reduce((sum, l) => sum + (Number(l.deal_valor) || 0), 0) || 0;
  
  const valorPipeline = leadsData
    ?.filter(l => l.status === "negociando")
    .reduce((sum, l) => {
      // Se já tem deal_valor definido, usa ele
      if (l.deal_valor && l.deal_valor > 0) {
        return sum + Number(l.deal_valor);
      }
      
      // Senão, calcula baseado no produto
      if (l.produto === "mentoria_fast") {
        return sum + 18000;
      } else if (l.produto === "gbc") {
        // Se for GBC mas tem interesse em Mentoria Fast, valor é 18k
        return sum + (l.interesse_mentoria_fast ? 18000 : 120000);
      }
      
      return sum;
    }, 0) || 0;

  const distribuicaoStatus = leadsData?.reduce((acc, lead) => {
    const status = lead.status;
    const existing = acc.find(item => item.status === status);
    if (existing) {
      existing.total += 1;
    } else {
      acc.push({ status, total: 1 });
    }
    return acc;
  }, [] as Array<{ status: string; total: number }>);

  const distribuicaoProduto = leadsData?.reduce((acc, lead) => {
    const produto = lead.produto;
    const existing = acc.find(item => item.produto === produto);
    if (existing) {
      existing.total += 1;
    } else {
      acc.push({ produto, total: 1 });
    }
    return acc;
  }, [] as Array<{ produto: string; total: number }>);

  const topLeads = [...(leadsData || [])]
    .filter(l => l.score_total !== null)
    .sort((a, b) => (b.score_total || 0) - (a.score_total || 0))
    .slice(0, 10);

  // Principais causas de perda
  const causasPerda = leadsData
    ?.filter(l => l.status === "perdido" && l.perdido_motivo_cat)
    .reduce((acc, lead) => {
      const motivo = lead.perdido_motivo_cat!;
      const existing = acc.find(item => item.motivo === motivo);
      if (existing) {
        existing.total += 1;
      } else {
        acc.push({ motivo, total: 1 });
      }
      return acc;
    }, [] as Array<{ motivo: string; total: number }>)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5) || [];

  const totalPerdidos = leadsData?.filter(l => l.status === "perdido").length || 0;

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Visão geral do pipeline e métricas principais
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Visão geral do pipeline e métricas principais
              </p>
            </div>
            <Select value={produtoFilter} onValueChange={setProdutoFilter}>
              <SelectTrigger className="w-[200px]">
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

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Leads
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLeads}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Cadastrados no sistema
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Em Negociação
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leadsNegociando}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Leads ativos no pipeline
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Taxa de Conversão
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{taxaConversao}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Leads ganhos / total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Valor em Pipeline
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {valorPipeline.toLocaleString("pt-BR")}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Deals em negociação
              </p>
            </CardContent>
          </Card>
        </div>

        {/* KPIs de Vendas Fechadas */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">📊 Análise de Vendas Fechadas</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Leads Ganhos
                </CardTitle>
                <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{leadsGanhos}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Deals fechados com sucesso
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Valor Total Ganho
                </CardTitle>
                <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorTotalGanho)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Receita total fechada
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Ticket Médio
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(ticketMedio)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Valor médio por deal
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Potencial em Pipeline
                </CardTitle>
                <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorPipeline)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {leadsNegociando} deals em negociação
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Vendas por Produto e Causas de Perda */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Vendas por Produto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                  <div>
                    <p className="font-medium">GBC</p>
                    <p className="text-sm text-muted-foreground">{ganhosGBC} deals fechados</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(valorGanhoGBC)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {ganhosGBC > 0 ? `Média: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(valorGanhoGBC / ganhosGBC)}` : '-'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                  <div>
                    <p className="font-medium">Mentoria FAST</p>
                    <p className="text-sm text-muted-foreground">{ganhosFast} deals fechados</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(valorGanhoFast)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {ganhosFast > 0 ? `Média: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(valorGanhoFast / ganhosFast)}` : '-'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Principais Causas de Perda</CardTitle>
            </CardHeader>
            <CardContent>
              {causasPerda.length > 0 ? (
                <div className="space-y-3">
                  {causasPerda.map((item, idx) => (
                    <div key={item.motivo} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 font-bold text-sm">
                          {idx + 1}
                        </div>
                        <span className="text-sm font-medium">{item.motivo}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-red-600">{item.total}</p>
                        <p className="text-xs text-muted-foreground">
                          {((item.total / totalPerdidos) * 100).toFixed(0)}%
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="mt-4 pt-3 border-t">
                    <p className="text-xs text-muted-foreground text-center">
                      Total de {totalPerdidos} leads perdidos
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground text-center py-8">
                  Nenhum lead perdido com motivo registrado
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Performance de Conversão */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Performance de Conversão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Taxa de Fechamento</span>
                    <span className="text-2xl font-bold text-green-600">{taxaConversao}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-green-600"
                      style={{ width: `${taxaConversao}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {leadsGanhos} ganhos de {totalLeads} leads totais
                  </p>
                </div>

                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Em Negociação</span>
                    <span className="text-2xl font-bold text-blue-600">{leadsNegociando}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Potencial de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(valorPipeline)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Distribution Cards */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Status</CardTitle>
            </CardHeader>
            <CardContent>
              {distribuicaoStatus && distribuicaoStatus.length > 0 ? (
                <div className="space-y-4">
                  {distribuicaoStatus.map((item) => (
                    <div key={item.status} className="flex items-center justify-between">
                      <span className="text-sm">{statusLabels[item.status] || item.status}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${(item.total / totalLeads) * 100}%`,
                              backgroundColor: statusColors[item.status]
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">{item.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground text-center py-8">
                  Nenhum lead cadastrado ainda
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Produto</CardTitle>
            </CardHeader>
            <CardContent>
              {distribuicaoProduto && distribuicaoProduto.length > 0 ? (
                <div className="space-y-4">
                  {distribuicaoProduto.map((item, idx) => (
                    <div key={item.produto} className="flex items-center justify-between">
                      <span className="text-sm">{produtoLabels[item.produto] || item.produto}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${(item.total / totalLeads) * 100}%`,
                              backgroundColor: `hsl(var(--chart-${idx + 1}))`
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">{item.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground text-center py-8">
                  Nenhum lead cadastrado ainda
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Leads */}
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Leads por Score</CardTitle>
          </CardHeader>
          <CardContent>
            {topLeads.length > 0 ? (
              <div className="space-y-3">
                {topLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex-1">
                      <p className="font-medium">{lead.nome}</p>
                      <p className="text-sm text-muted-foreground">
                        {statusLabels[lead.status]} • {produtoLabels[lead.produto]}
                      </p>
                    </div>
                    <Badge variant="secondary" className="ml-4">
                      Score: {lead.score_total}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground text-center py-8">
                Nenhum lead cadastrado ainda
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
