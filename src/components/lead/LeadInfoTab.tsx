import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { statusLabels } from "@/utils/labels";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Mail, Phone, Hash, User, Building2, DollarSign, MapPin, Calendar, Target, Pencil, X, Save } from "lucide-react";

interface LeadInfoTabProps {
  lead: any;
  isEditing?: boolean;
  canEdit?: boolean;
  onToggleEdit?: () => void;
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

export function LeadInfoTab({ lead, isEditing = false, canEdit = false, onToggleEdit, onSave, isSaving = false }: LeadInfoTabProps) {
  const formAnswers = lead.form_answers || {};
  const isGBC = lead.produto === "gbc";
  const [editedData, setEditedData] = useState({
    nome: lead.nome,
    email: lead.email,
    telefone: lead.telefone,
    rede_social: lead.rede_social || "",
    regiao: lead.regiao || "",
    faturamento_2025: lead.faturamento_2025,
    faturamento_2024: lead.faturamento_2024,
    num_funcionarios: lead.num_funcionarios,
    interesse: lead.interesse,
    conhece_daniel: lead.conhece_daniel,
    faixa_investimento: lead.faixa_investimento || "",
  });

  const handleSave = () => {
    if (onSave) {
      onSave(editedData);
    }
  };

  const handleCancel = () => {
    setEditedData({
      nome: lead.nome,
      email: lead.email,
      telefone: lead.telefone,
      rede_social: lead.rede_social || "",
      regiao: lead.regiao || "",
      faturamento_2025: lead.faturamento_2025,
      faturamento_2024: lead.faturamento_2024,
      num_funcionarios: lead.num_funcionarios,
      interesse: lead.interesse,
      conhece_daniel: lead.conhece_daniel,
      faixa_investimento: lead.faixa_investimento || "",
    });
    if (onToggleEdit) {
      onToggleEdit();
    }
  };

  return (
    <div className="space-y-6">
      {/* Botões de ação */}
      {canEdit && (
        <div className="flex justify-end gap-2">
          {!isEditing ? (
            <Button onClick={onToggleEdit} variant="outline" size="sm">
              <Pencil className="w-4 h-4 mr-2" />
              Editar
            </Button>
          ) : (
            <>
              <Button onClick={handleCancel} variant="outline" size="sm" disabled={isSaving}>
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={handleSave} size="sm" disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Salvando..." : "Salvar"}
              </Button>
            </>
          )}
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
                  <Input 
                    id="num_funcionarios"
                    type="number"
                    value={editedData.num_funcionarios || ""} 
                    onChange={(e) => setEditedData({...editedData, num_funcionarios: parseInt(e.target.value) || null})}
                  />
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
                <span className="text-sm">{lead.num_funcionarios}</span>
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

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações do Sistema</CardTitle>
            </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              <span className="font-medium">Origem:</span>
              <span className="ml-2 text-muted-foreground">{lead.origem || "Não informado"}</span>
            </div>
            
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
