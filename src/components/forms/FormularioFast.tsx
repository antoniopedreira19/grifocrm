import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import InputMask from "react-input-mask";

const formSchema = z.object({
  nome: z.string().min(3, "Nome completo é obrigatório"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(14, "Telefone inválido"),
  rede_social: z.string().optional(),
  faturamento_2025: z.enum(["ate_500k", "entre_500k_1m", "entre_1m_10m", "entre_10m_50m"], {
    required_error: "Faturamento 2025 é obrigatório",
  }),
  faturamento_2024: z.enum(["ate_500k", "entre_500k_1m", "entre_1m_10m", "entre_10m_50m"]).optional(),
  num_funcionarios: z.enum(["ate_10", "11_25", "26_50", "51_100", "mais_100"]).optional(),
  regiao: z.string().optional(),
  modelo_negocio: z.string().max(280, "Máximo de 280 caracteres").optional(),
  conhece_daniel: z.enum(["nao_conhece", "lt_3m", "m3_12m", "gt_1a"], {
    required_error: "Campo obrigatório",
  }),
  interesse: z.enum(["quero_agora", "quero_entender", "nao_mas_posso", "nao_nao_consigo"], {
    required_error: "Campo obrigatório",
  }),
  faixa_investimento: z.string().optional(),
  maior_dor: z.string().optional(),
  prioridade_modulo: z.string().optional(),
  preferencia_canal: z.enum(["whatsapp", "telefone", "email"]).optional(),
  preferencia_horario: z.string().optional(),
  cidade: z.string().optional(),
  uf: z.string().optional(),
  lgpd: z.boolean().refine((val) => val === true, {
    message: "Você deve aceitar os termos",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface FormularioFastProps {
  utmParams: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
    gclid?: string;
    fbclid?: string;
  };
}

const faturamentoLabels: Record<string, string> = {
  ate_500k: "até R$ 500mil",
  entre_500k_1m: "entre R$ 500mil e R$ 1milhão",
  entre_1m_10m: "entre R$ 1milhão e R$ 10milhões",
  entre_10m_50m: "entre R$ 10milhões e R$ 50milhões",
};

const conheceDanielLabels: Record<string, string> = {
  nao_conhece: "Não conhece",
  lt_3m: "<3 meses",
  m3_12m: "3–12 meses",
  gt_1a: ">1 ano",
};

const interesseLabels: Record<string, string> = {
  quero_agora: "Sim, quero me inscrever agora!",
  quero_entender: "Sim, mas quero entender antes com o time.",
  nao_mas_posso: "Não, mas posso conseguir",
  nao_nao_consigo: "Não, não consigo",
};

const numFuncionariosLabels: Record<string, string> = {
  ate_10: "Até 10",
  "11_25": "11 a 25",
  "26_50": "26 a 50",
  "51_100": "51 a 100",
  mais_100: "Mais de 100",
};

export function FormularioFast({ utmParams }: FormularioFastProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lgpd: false,
    },
  });

  const interesseValue = form.watch("interesse");
  const showFaixaInvestimento = interesseValue === "nao_mas_posso" || interesseValue === "nao_nao_consigo";

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);

    try {
      const formAnswers = {
        schema_version: "1.1",
        form: "mentoria_fast",
        prioridade_modulo: values.prioridade_modulo,
        maior_dor: values.maior_dor,
        investimento: {
          pergunta_texto:
            "O investimento é de 12× R$ 1.666,67 ou R$ 16.000 à vista. Você tem capacidade de investir agora?",
          resposta_raw: interesseLabels[values.interesse],
          resposta_enum: values.interesse,
          parcelas_qtd: 12,
          valor_parcela: 1666.67,
          valor_pagamento_unico: 16000,
        },
        preferencia_contato: {
          canal: values.preferencia_canal,
          melhor_horario: values.preferencia_horario,
          timezone: "America/Sao_Paulo",
        },
        empresa: {
          cidade: values.cidade,
          uf: values.uf,
          pais: "BR",
        },
        lgpd: {
          consent: values.lgpd,
        },
      };

      const { data, error } = await supabase.rpc(
        "capture_lead_public" as any,
        {
          p_produto: "mentoria_fast",
          p_nome: values.nome,
          p_email: values.email,
          p_telefone: values.telefone.replace(/\D/g, ""),
          p_rede_social: values.rede_social || null,
          p_faturamento_2025: values.faturamento_2025,
          p_faturamento_2024: values.faturamento_2024 || null,
          p_num_funcionarios: values.num_funcionarios || null,
          p_modelo_negocio: values.modelo_negocio || null,
          p_regiao: values.regiao || null,
          p_conhece_daniel: values.conhece_daniel,
          p_interesse: values.interesse,
          p_faixa_investimento: values.faixa_investimento || null,
          p_origem: "lp_fast",
          p_utm_source: utmParams.utm_source || null,
          p_utm_medium: utmParams.utm_medium || null,
          p_utm_campaign: utmParams.utm_campaign || null,
          p_utm_term: utmParams.utm_term || null,
          p_utm_content: utmParams.utm_content || null,
          p_gclid: utmParams.gclid || null,
          p_fbclid: utmParams.fbclid || null,
          p_tag_form: "form_fast",
          p_form_answers: formAnswers,
        } as any,
      );

      if (error) {
        console.error("Erro RPC:", error);
        throw error;
      }

      if (!data) {
        throw new Error("Nenhum ID retornado do servidor");
      }

      form.reset();
      navigate(`/obrigado?id=${data}`);
    } catch (error: any) {
      console.error("Erro completo ao enviar formulário:", error);
      const errorMessage = error?.message || error?.hint || "Não conseguimos enviar agora; tente novamente";
      
      toast({
        title: "Erro ao enviar",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-[880px] mx-auto shadow-2xl border-0">
      <CardContent className="p-8 md:p-12">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
            {/* Seção 1: Seus dados */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground border-b border-border pb-3">Seus dados</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome completo *</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="seu@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="telefone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone *</FormLabel>
                      <FormControl>
                        <InputMask mask="(99) 99999-9999" {...field}>
                          {(inputProps: any) => <Input placeholder="(00) 00000-0000" {...inputProps} />}
                        </InputMask>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rede_social"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rede social</FormLabel>
                      <FormControl>
                        <Input placeholder="@instagram ou LinkedIn" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Seção 2: Perfil da empresa */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground border-b border-border pb-3">Perfil da empresa</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="faturamento_2025"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Faturamento 2025 *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a faixa" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(faturamentoLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="faturamento_2024"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Faturamento 2024</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a faixa" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(faturamentoLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="num_funcionarios"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de funcionários</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a faixa" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(numFuncionariosLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="regiao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Região/UF</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: SP, RJ, Sul" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="modelo_negocio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Modelo de negócio (resumo)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva brevemente seu modelo de negócio"
                            maxLength={280}
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Máximo de 280 caracteres</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Seção 3: Relação com Daniel */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground border-b border-border pb-3">Relação com Daniel</h2>
              <FormField
                control={form.control}
                name="conhece_daniel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Há quanto tempo conhece o Daniel? *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(conheceDanielLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Seção 4: Suas necessidades */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground border-b border-border pb-3">Suas necessidades</h2>

              <FormField
                control={form.control}
                name="maior_dor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maior dificuldade hoje (sua "dor")?</FormLabel>
                    <FormControl>
                      <Textarea rows={4} placeholder="Descreva o principal desafio que você enfrenta..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="prioridade_modulo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prioridade de módulo/tema que quer aprofundar?</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Marketing, Vendas, Gestão, Finanças" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Seção 5: Preferências de contato */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground border-b border-border pb-3">
                Preferências de contato
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="preferencia_canal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Canal preferido</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                          <SelectItem value="telefone">Telefone</SelectItem>
                          <SelectItem value="email">E-mail</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preferencia_horario"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Melhor horário</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Manhã, tarde, após 18h" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Sua cidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="uf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>UF</FormLabel>
                      <FormControl>
                        <Input placeholder="SP" maxLength={2} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Seção 6: Investimento (movida para depois de Preferências de contato) */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground border-b border-border pb-3">Investimento</h2>
              <FormField
                control={form.control}
                name="interesse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      O investimento é de 12× R$ 1.666,67 ou R$ 16.000 à vista. Você tem capacidade de investir agora? *
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione sua resposta" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(interesseLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {showFaixaInvestimento && (
                <FormField
                  control={form.control}
                  name="faixa_investimento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Qual faixa de investimento faria sentido agora?</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: até R$ 10.000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Seção 7: LGPD */}
            <div className="space-y-6 pt-4">
              <FormField
                control={form.control}
                name="lgpd"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-border p-4 bg-muted/30">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-medium">
                        Aceito os termos e autorizo o tratamento dos meus dados conforme a LGPD *
                      </FormLabel>
                      <FormDescription className="text-sm">
                        Seus dados serão utilizados exclusivamente para contato sobre o programa
                      </FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Enviando inscrição..." : "Enviar Inscrição"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
