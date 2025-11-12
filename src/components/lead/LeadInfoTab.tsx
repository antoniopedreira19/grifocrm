import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { statusLabels, origemLabels, numFuncionariosLabels } from "@/utils/labels";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Mail, Phone, Hash, User, Building2, DollarSign, MapPin, Calendar, Target, Pencil, X, Save } from "lucide-react";

interface LeadInfoTabProps {
  lead: any;
  isEditing?: boolean;
  onCancel?: () => void;
  onSave?: (data: any) => void;
  isSaving?: boolean;
}

const interesseLabels: Record<string, string> = {
  quero_agora: "Quero agora",
  quero_entender: "Quero entender",
  nao_mas_posso: "Posso conseguir",
  nao_nao_consigo: "Não consigo",
};

const conheceDanielLabels: Record<string, string> = {
  nao_conhece: "Não conhece",
  lt_3m: "Menos de 3 meses",
  m3_12m: "3 a 12 meses",
  gt_1a: "Mais de 1 ano",
};

const faturamentoLabels: Record<string, string> = {
  ate_500k: "Até R$ 500k",
  entre_500k_1m: "R$ 500k - R$ 1M",
  entre_1m_10m: "R$ 1M - R$ 10M",
  entre_10m_50m: "R$ 10M - R$ 50M",
};

export function LeadInfoTab({ lead, isEditing = false, onCancel, onSave, isSaving = false }: LeadInfoTabProps) {
  const formAnswers = lead.form_answers || {};
  const isGBC = lead.produto === "gbc";
  const [editedData, setEditedData] = useState({
    nome: lead.nome,
    email: lead.email,
    telefone: lead.telefone,
    rede_social: lead.rede_social || "",
    regiao: lead.regiao || "",
    produto: lead.produto,
    faturamento_2025: lead.faturamento_2025,
    faturamento_2024: lead.faturamento_2024,
    num_funcionarios: lead.num_funcionarios,
    interesse: lead.interesse,
    conhece_daniel: lead.conhece_daniel,
    faixa_investimento: lead.faixa_investimento || "",
    origem: lead.origem || "",
    deal_valor: lead.deal_valor || "",
  });

  const handleSave = () => {
    if (onSave) {
      onSave(editedData);
    }
  };

  const handleCancelEdit = () => {
    setEditedData({
      nome: lead.nome,
      email: lead.email,
      telefone: lead.telefone,
      rede_social: lead.rede_social || "",
      regiao: lead.regiao || "",
      produto: lead.produto,
      faturamento_2025: lead.faturamento_2025,
      faturamento_2024: lead.faturamento_2024,
      num_funcionarios: lead.num_funcionarios,
      interesse: lead.interesse,
      conhece_daniel: lead.conhece_daniel,
      faixa_investimento: lead.faixa_investimento || "",
      origem: lead.origem || "",
      deal_valor: lead.deal_valor || "",
    });
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="space-y-6">
      {/* Botões de ação - mostrados apenas no modo edição */}
      {isEditing && (
        <div className="flex justify-end gap-2">
          <Button onClick={handleCancelEdit} variant="outline" size="sm" disabled={isSaving}>
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleSave} size="sm" disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informações Core */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">{isEditing ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input 
                    id="nome"
                    value={editedData.nome} 
                    onChange={(e) => setEditedData({...editedData, nome: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={editedData.email} 
                    onChange={(e) => setEditedData({...editedData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input 
                    id="telefone"
                    value={editedData.telefone} 
                    onChange={(e) => setEditedData({...editedData, telefone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rede_social">Rede Social</Label>
                  <Input 
                    id="rede_social"
                    value={editedData.rede_social} 
                    onChange={(e) => setEditedData({...editedData, rede_social: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="produto">Produto</Label>
                  <Select 
                    value={editedData.produto} 
                    onValueChange={(value) => setEditedData({...editedData, produto: value})}
                  >
                    <SelectTrigger id="produto">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gbc">GBC</SelectItem>
                      <SelectItem value="mentoria_fast">Mentoria Fast</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : (
              <>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Nome:</span>
              <span className="text-sm">{lead.nome}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">E-mail:</span>
              <span className="text-sm">{lead.email}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Telefone:</span>
              <span className="text-sm">{lead.telefone}</span>
            </div>

            {lead.rede_social && (
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Rede social:</span>
                <span className="text-sm">{lead.rede_social}</span>
              </div>
            )}

              <div className="pt-2 border-t">
                <Badge variant={lead.produto === "gbc" ? "default" : "secondary"}>
                  {lead.produto === "gbc" ? "GBC" : "Mentoria Fast"}
                </Badge>
                <Badge variant="outline" className="ml-2">
                  {statusLabels[lead.status as keyof typeof statusLabels]}
                </Badge>
              </div>
              </>
            )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dados Empresariais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">{isEditing ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="faturamento_2025">Faturamento 2025</Label>
                  <Select 
                    value={editedData.faturamento_2025} 
                    onValueChange={(value) => setEditedData({...editedData, faturamento_2025: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ate_500k">Até R$ 500k</SelectItem>
                      <SelectItem value="entre_500k_1m">R$ 500k - R$ 1M</SelectItem>
                      <SelectItem value="entre_1m_10m">R$ 1M - R$ 10M</SelectItem>
                      <SelectItem value="entre_10m_50m">R$ 10M - R$ 50M</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="faturamento_2024">Faturamento 2024</Label>
                  <Select 
                    value={editedData.faturamento_2024} 
                    onValueChange={(value) => setEditedData({...editedData, faturamento_2024: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ate_500k">Até R$ 500k</SelectItem>
                      <SelectItem value="entre_500k_1m">R$ 500k - R$ 1M</SelectItem>
                      <SelectItem value="entre_1m_10m">R$ 1M - R$ 10M</SelectItem>
                      <SelectItem value="entre_10m_50m">R$ 10M - R$ 50M</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="num_funcionarios">Nº Funcionários</Label>
                  <Select 
                    value={editedData.num_funcionarios} 
                    onValueChange={(value) => setEditedData({...editedData, num_funcionarios: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ate_10">Até 10</SelectItem>
                      <SelectItem value="11_25">11-25</SelectItem>
                      <SelectItem value="26_50">26-50</SelectItem>
                      <SelectItem value="51_100">51-100</SelectItem>
                      <SelectItem value="mais_100">Mais de 100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regiao">Região</Label>
                  <Input 
                    id="regiao"
                    value={editedData.regiao} 
                    onChange={(e) => setEditedData({...editedData, regiao: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interesse">Interesse</Label>
                  <Select 
                    value={editedData.interesse} 
                    onValueChange={(value) => setEditedData({...editedData, interesse: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quero_agora">Quero agora</SelectItem>
                      <SelectItem value="quero_entender">Quero entender</SelectItem>
                      <SelectItem value="nao_mas_posso">Posso conseguir</SelectItem>
                      <SelectItem value="nao_nao_consigo">Não consigo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="conhece_daniel">Conhece o Daniel</Label>
                  <Select 
                    value={editedData.conhece_daniel} 
                    onValueChange={(value) => setEditedData({...editedData, conhece_daniel: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nao_conhece">Não conhece</SelectItem>
                      <SelectItem value="lt_3m">Menos de 3 meses</SelectItem>
                      <SelectItem value="m3_12m">3 a 12 meses</SelectItem>
                      <SelectItem value="gt_1a">Mais de 1 ano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="faixa_investimento">Faixa de Investimento</Label>
                  <Input 
                    id="faixa_investimento"
                    value={editedData.faixa_investimento} 
                    onChange={(e) => setEditedData({...editedData, faixa_investimento: e.target.value})}
                  />
                </div>
              </>
            ) : (
              <>
            {lead.faturamento_2025 && (
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Faturamento 2025:</span>
                <span className="text-sm">{faturamentoLabels[lead.faturamento_2025]}</span>
              </div>
            )}

            {lead.faturamento_2024 && (
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Faturamento 2024:</span>
                <span className="text-sm">{faturamentoLabels[lead.faturamento_2024]}</span>
              </div>
            )}

            {lead.num_funcionarios && (
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Nº Funcionários:</span>
                <span className="text-sm">
                  {(() => {
                    const value = String(lead.num_funcionarios);
                    return numFuncionariosLabels[value] || 
                           numFuncionariosLabels[value.replace(/(\d+)(\d{2})$/, '$1_$2')] || 
                           value;
                  })()}
                </span>
              </div>
            )}

            {lead.regiao && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Região:</span>
                <span className="text-sm">{lead.regiao}</span>
              </div>
            )}

            {lead.interesse && (
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Interesse:</span>
                <span className="text-sm">{interesseLabels[lead.interesse]}</span>
              </div>
            )}

            {lead.conhece_daniel && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Conhece o Daniel:</span>
                <span className="text-sm">{conheceDanielLabels[lead.conhece_daniel]}</span>
              </div>
            )}

            {lead.faixa_investimento && (
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Faixa de investimento:</span>
                <span className="text-sm">{lead.faixa_investimento}</span>
                </div>
              )}
            </>
            )}
            </CardContent>
          </Card>

          {/* Informações Financeiras */}
          {(lead.status === 'negociando' || lead.status === 'proposta' || lead.status === 'followup' || lead.status === 'pode_fechar' || lead.status === 'pagamento' || lead.status === 'ganho') && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações Financeiras</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Valor do Deal - Editável quando ganho */}
                {isEditing && lead.status === 'ganho' ? (
                  <div className="space-y-2">
                    <Label htmlFor="deal_valor">Valor Final do Deal</Label>
                    <Input
                      id="deal_valor"
                      type="number"
                      step="0.01"
                      value={editedData.deal_valor || ""}
                      onChange={(e) => setEditedData({...editedData, deal_valor: e.target.value})}
                      placeholder="Ex: 120000.00"
                    />
                  </div>
                ) : lead.deal_valor ? (
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Valor do Deal:</span>
                    <span className="text-sm font-bold text-green-600">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lead.deal_valor)}
                    </span>
                  </div>
                ) : null}

                {/* Tipo de Pagamento */}
                {lead.tipo_pagamento && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Tipo de Pagamento:</span>
                    <Badge variant="outline">
                      {lead.tipo_pagamento === 'a_vista' ? 'À Vista' : 
                       lead.tipo_pagamento === 'parcelado' ? 'Parcelado' : 
                       'Entrada + Parcelado'}
                    </Badge>
                  </div>
                )}

                {/* Valor à Vista */}
                {lead.valor_a_vista && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Valor à Vista:</span>
                    <span className="text-sm">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lead.valor_a_vista)}
                    </span>
                  </div>
                )}

                {/* Valor Parcelado */}
                {lead.valor_parcelado && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Valor Parcelado:</span>
                    <span className="text-sm">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lead.valor_parcelado)}
                    </span>
                  </div>
                )}

                {/* Valor de Entrada */}
                {lead.valor_entrada && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Valor de Entrada:</span>
                    <span className="text-sm">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lead.valor_entrada)}
                    </span>
                  </div>
                )}

                {/* Follow-up */}
                {lead.proximo_followup && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Próximo Follow-up:</span>
                    <span className="text-sm">
                      {format(new Date(lead.proximo_followup), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                )}

                {/* Status do Deal */}
                {lead.status === 'ganho' && (
                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      ✅ Deal Fechado com Sucesso!
                    </p>
                  </div>
                )}

                {lead.status === 'pagamento' && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      💰 Aguardando Pagamento
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações do Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isEditing ? (
                <div className="space-y-2">
                  <Label htmlFor="origem">Origem</Label>
                  <Select 
                    value={editedData.origem || "none"} 
                    onValueChange={(value) => setEditedData({...editedData, origem: value === "none" ? "" : value})}
                  >
                    <SelectTrigger id="origem">
                      <SelectValue placeholder="Selecione a origem" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Não informado</SelectItem>
                      <SelectItem value="lp_gbc">LP GBC</SelectItem>
                      <SelectItem value="lp_fast">LP Fast</SelectItem>
                      <SelectItem value="criativo_x">Criativo X</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="board">Board</SelectItem>
                      <SelectItem value="meta_lead_ads">Meta Lead Ads</SelectItem>
                      <SelectItem value="social_seller">Social Seller</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="text-sm">
                  <span className="font-medium">Origem:</span>
                  <span className="ml-2 text-muted-foreground">
                    {lead.origem ? origemLabels[lead.origem as keyof typeof origemLabels] : "Não informado"}
                  </span>
                </div>
              )}
            
              <div className="text-sm">
                <span className="font-medium">Criado em:</span>
                <span className="ml-2 text-muted-foreground">
                  {format(new Date(lead.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Respostas do Formulário */}
        <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Respostas do Formulário</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isGBC ? (
              <>
                {formAnswers.modelo_negocio_detalhe && (
                  <div>
                    <p className="text-sm font-medium mb-1">Modelo de Negócio:</p>
                    <p className="text-sm text-muted-foreground">{formAnswers.modelo_negocio_detalhe}</p>
                  </div>
                )}

                {formAnswers.anos_empresa && (
                  <div>
                    <p className="text-sm font-medium mb-1">Anos de Empresa:</p>
                    <p className="text-sm text-muted-foreground">{formAnswers.anos_empresa}</p>
                  </div>
                )}

                {formAnswers.motivo_mentoria && (
                  <div>
                    <p className="text-sm font-medium mb-1">Motivo da Mentoria:</p>
                    <p className="text-sm text-muted-foreground">{formAnswers.motivo_mentoria}</p>
                  </div>
                )}

                {formAnswers.por_que_escolher_voce && (
                  <div>
                    <p className="text-sm font-medium mb-1">Por que escolher você:</p>
                    <p className="text-sm text-muted-foreground">{formAnswers.por_que_escolher_voce}</p>
                  </div>
                )}

                {formAnswers.objetivo_12m && (
                  <div>
                    <p className="text-sm font-medium mb-1">Objetivo em 12 meses:</p>
                    <p className="text-sm text-muted-foreground">{formAnswers.objetivo_12m}</p>
                  </div>
                )}

                {formAnswers.investimento && (
                  <div>
                    <p className="text-sm font-medium mb-1">Investimento:</p>
                    <p className="text-sm text-muted-foreground">
                      {formAnswers.investimento.resposta_raw}
                      {formAnswers.investimento.valor_anual && ` - R$ ${formAnswers.investimento.valor_anual}`}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                {formAnswers.maior_dor && (
                  <div>
                    <p className="text-sm font-medium mb-1">Maior Dor:</p>
                    <p className="text-sm text-muted-foreground">{formAnswers.maior_dor}</p>
                  </div>
                )}

                {formAnswers.prioridade_modulo && (
                  <div>
                    <p className="text-sm font-medium mb-1">Prioridade de Módulo:</p>
                    <p className="text-sm text-muted-foreground">{formAnswers.prioridade_modulo}</p>
                  </div>
                )}

                {formAnswers.investimento && (
                  <div>
                    <p className="text-sm font-medium mb-1">Investimento:</p>
                    <p className="text-sm text-muted-foreground">
                      {formAnswers.investimento.resposta_raw}
                      {formAnswers.investimento.parcelas_qtd && ` - ${formAnswers.investimento.parcelas_qtd}x`}
                      {formAnswers.investimento.valor_parcela && ` de R$ ${formAnswers.investimento.valor_parcela}`}
                      {formAnswers.investimento.valor_pagamento_unico && ` - À vista: R$ ${formAnswers.investimento.valor_pagamento_unico}`}
                    </p>
                  </div>
                )}

                {formAnswers.fast_peso?.geral && (
                  <div>
                    <p className="text-sm font-medium mb-1">Peso Geral (Fast):</p>
                    <p className="text-sm text-muted-foreground">{formAnswers.fast_peso.geral}</p>
                  </div>
                )}
              </>
            )}

            {formAnswers.preferencia_contato && (
              <div className="pt-3 border-t">
                <p className="text-sm font-medium mb-2">Preferência de Contato:</p>
                {formAnswers.preferencia_contato.canal && (
                  <p className="text-sm text-muted-foreground">
                    Canal: {formAnswers.preferencia_contato.canal}
                  </p>
                )}
                {formAnswers.preferencia_contato.melhor_horario && (
                  <p className="text-sm text-muted-foreground">
                    Melhor horário: {formAnswers.preferencia_contato.melhor_horario}
                  </p>
                )}
              </div>
            )}

            {formAnswers.empresa && (
              <div className="pt-3 border-t">
                <p className="text-sm font-medium mb-2">Localização da Empresa:</p>
                {formAnswers.empresa.cidade && (
                  <p className="text-sm text-muted-foreground">
                    {formAnswers.empresa.cidade}{formAnswers.empresa.uf && ` - ${formAnswers.empresa.uf}`}
                  </p>
                )}
              </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
