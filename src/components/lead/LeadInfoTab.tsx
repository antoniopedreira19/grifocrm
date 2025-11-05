import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { statusLabels } from "@/utils/labels";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Mail, Phone, Hash, User, Building2, DollarSign, MapPin, Calendar, Target } from "lucide-react";

interface LeadInfoTabProps {
  lead: any;
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

export function LeadInfoTab({ lead }: LeadInfoTabProps) {
  const formAnswers = lead.form_answers || {};
  const isGBC = lead.produto === "gbc";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Informações Core */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dados Empresariais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
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
  );
}
