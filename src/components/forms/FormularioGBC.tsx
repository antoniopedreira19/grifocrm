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
  codigo_pais: z.string().default("+55"),
  telefone: z.string()
    .min(8, "Telefone muito curto")
    .refine((val) => {
      const digits = val.replace(/\D/g, "");
      return digits.length >= 10;
    }, {
      message: "Digite um número válido",
    }),
  rede_social: z.string().optional(),
  faturamento_2025: z.enum(["ate_500k", "entre_500k_1m", "entre_1m_10m", "entre_10m_50m", "acima_50m"], {
    required_error: "Faturamento 2025 é obrigatório",
  }),
  faturamento_2024: z.enum(["ate_500k", "entre_500k_1m", "entre_1m_10m", "entre_10m_50m", "acima_50m"]).optional(),
  num_funcionarios: z.enum(["ate_10", "11_25", "26_50", "51_100", "mais_100"]).optional(),
  regiao: z.string().optional(),
  conhece_daniel: z.enum(["nao_conhece", "lt_3m", "m3_12m", "gt_1a"], {
    required_error: "Campo obrigatório",
  }),
  interesse: z.enum(["quero_agora", "quero_entender", "nao_mas_posso", "nao_nao_consigo"], {
    required_error: "Campo obrigatório",
  }),
  faixa_investimento: z.string().optional(),
  anos_empresa: z.coerce.number().optional(),
  modelo_negocio: z.string().max(200, "Máximo de 200 caracteres").optional(),
  motivo_mentoria: z.string().optional(),
  por_que_escolher_voce: z.string().optional(),
  objetivo_12m: z.string().optional(),
  preferencia_canal: z.enum(["whatsapp", "telefone", "email"]).optional(),
  preferencia_horario: z.string().optional(),
  interesse_mentoria_fast: z.boolean().optional(),
  lgpd: z.boolean().refine((val) => val === true, {
    message: "Você deve aceitar os termos",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface FormularioGBCProps {
  utmParams: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
    utm_id?: string;
    gclid?: string;
    fbclid?: string;
    referrer?: string;
    landing_page?: string;
  };
}

const faturamentoLabels: Record<string, string> = {
  ate_500k: "até R$ 500mil",
  entre_500k_1m: "entre R$ 500mil e R$ 1milhão",
  entre_1m_10m: "entre R$ 1milhão e R$ 10milhões",
  entre_10m_50m: "entre R$ 10milhões e R$ 50milhões",
  acima_50m: "acima de R$ 50milhões",
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
  "11_25": "11-25",
  "26_50": "26-50",
  "51_100": "51-100",
  mais_100: "Mais de 100",
};

const paisesLabels: Record<string, string> = {
  "+55": "🇧🇷 Brasil (+55)",
  "+351": "🇵🇹 Portugal (+351)",
  "+1": "🇺🇸 EUA/Canadá (+1)",
  "+44": "🇬🇧 Reino Unido (+44)",
  "+34": "🇪🇸 Espanha (+34)",
  "+54": "🇦🇷 Argentina (+54)",
  "+56": "🇨🇱 Chile (+56)",
  "+57": "🇨🇴 Colômbia (+57)",
  "+52": "🇲🇽 México (+52)",
};

export function FormularioGBC({ utmParams }: FormularioGBCProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lgpd: false,
      codigo_pais: "+55",
    },
  });

  const interesseValue = form.watch("interesse");
  const showFaixaInvestimento = interesseValue === "nao_mas_posso" || interesseValue === "nao_nao_consigo";
  const showMentoriaFast = interesseValue === "nao_nao_consigo";

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);

    try {
      // Calcula origem automaticamente baseado nas regras
      let calculatedOrigem = "lp_gbc"; // default
      const medium = (utmParams.utm_medium || "").toLowerCase();
      const source = (utmParams.utm_source || "").toLowerCase();
      const ref = (utmParams.referrer || "").toLowerCase();

      if (["cpc", "paid", "ads"].includes(medium)) {
        calculatedOrigem = "meta_lead_ads";
      } else if (["lp_fast", "lp_gbc"].includes(source)) {
        calculatedOrigem = source;
      } else if (ref.includes("instagram.com")) {
        calculatedOrigem = "instagram";
      } else if (ref.includes("google.")) {
        calculatedOrigem = "instagram"; // organic google -> instagram como fallback
      }

      const formAnswers = {
        schema_version: "1.1",
        form: "gbc",
        anos_empresa: values.anos_empresa,
        modelo_negocio: values.modelo_negocio,
        motivo_mentoria: values.motivo_mentoria,
        por_que_escolher_voce: values.por_que_escolher_voce,
        objetivo_12m: values.objetivo_12m,
        investimento: {
          pergunta_texto: "O investimento anual é de R$ 120.000. Você tem capacidade de investir agora?",
          resposta_raw: interesseLabels[values.interesse],
          resposta_enum: values.interesse,
          valor_anual: 120000,
        },
        preferencia_contato: {
          canal: values.preferencia_canal,
          melhor_horario: values.preferencia_horario,
          timezone: "America/Sao_Paulo",
        },
        lgpd: {
          consent: values.lgpd,
        },
      };

      // Processa o telefone: se já veio com código do país, usa direto; senão, adiciona
      const cleanPhone = values.telefone.replace(/\D/g, "");
      const finalPhone = cleanPhone.length === 13 ? cleanPhone : values.codigo_pais + cleanPhone;

      const { data, error } = await supabase.rpc(
        "capture_lead_public" as any,
        {
          p_produto: "gbc",
          p_nome: values.nome,
          p_email: values.email,
          p_telefone: finalPhone,
          p_rede_social: values.rede_social || null,
          p_faturamento_2025: values.faturamento_2025,
          p_faturamento_2024: values.faturamento_2024 || null,
          p_num_funcionarios: values.num_funcionarios || null,
          p_modelo_negocio: values.modelo_negocio || null,
          p_regiao: values.regiao || null,
          p_conhece_daniel: values.conhece_daniel,
          p_interesse: values.interesse,
          p_faixa_investimento: values.faixa_investimento || null,
          p_origem: calculatedOrigem,
          p_utm_source: utmParams.utm_source || "",
          p_utm_medium: utmParams.utm_medium || "",
          p_utm_campaign: utmParams.utm_campaign || "",
          p_utm_term: utmParams.utm_term || "",
          p_utm_content: utmParams.utm_content || "",
          p_utm_id: utmParams.utm_id || "",
          p_referrer: utmParams.referrer || "",
          p_landing_page: utmParams.landing_page || "",
          p_gclid: utmParams.gclid || "",
          p_fbclid: utmParams.fbclid || "",
          p_tag_form: "form_gbc",
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

      // Se o lead demonstrou interesse na Mentoria Fast, atualiza o registro
      if (values.interesse_mentoria_fast && data) {
        await supabase
          .from("leads")
          .update({ interesse_mentoria_fast: true })
          .eq("id", data);
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
                  name="codigo_pais"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>País *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o país" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(paisesLabels).map(([value, label]) => (
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
                  name="telefone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone *</FormLabel>
                      <FormControl>
                        <Input 
                          type="tel" 
                          placeholder="" 
                          {...field} 
                        />
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

            {/* Seção 4: Perguntas abertas */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground border-b border-border pb-3">
                Sobre você e seu negócio
              </h2>

              <FormField
                control={form.control}
                name="anos_empresa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantos anos de empresa você tem?</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="modelo_negocio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descreva de forma clara e objetiva seu modelo de negócio atual:</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        placeholder="Explique como sua empresa gera valor e receita..."
                        maxLength={200}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Máximo de 200 caracteres</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="motivo_mentoria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Por que você acredita que participar dessa Mentoria é a oportunidade ideal para você e para o
                      crescimento do seu negócio?
                    </FormLabel>
                    <FormControl>
                      <Textarea rows={5} placeholder="Compartilhe suas motivações..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="por_que_escolher_voce"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Esse é um Grupo seleto e restrito… por que devo escolher você entre os interessados?
                    </FormLabel>
                    <FormControl>
                      <Textarea rows={5} placeholder="O que torna você especial para este grupo..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="objetivo_12m"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Caso você seja aceito no Grifo Builders Club, o que precisa acontecer nos 12 meses para dizer que
                      valeu?
                    </FormLabel>
                    <FormControl>
                      <Textarea rows={5} placeholder="Defina seus objetivos e metas..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Seção 6: Preferências de contato */}
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
              </div>
            </div>

            {/* Seção 5: Investimento */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground border-b border-border pb-3">Investimento</h2>
              <FormField
                control={form.control}
                name="interesse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      O investimento anual é de R$ 120.000. Você tem capacidade de investir agora? *
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
                        <Input placeholder="Ex: até R$ 50.000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Mentoria Fast - Exibido quando seleciona "Não, não consigo" */}
              {showMentoriaFast && (
                <div className="mt-8 p-6 border-2 border-primary/20 rounded-lg bg-primary/5 space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Mentoria Fast – Resultados rápidos com o método Grifo</h3>
                  
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>
                      Sabemos que nem todo empresário está no momento de investir no GBC, mas isso não significa que você precise esperar para profissionalizar sua gestão.
                    </p>
                    <p>
                      A <strong className="text-foreground">Mentoria Fast</strong> foi criada exatamente para quem quer dar o próximo passo agora, aplicando os mesmos modelos e ferramentas que sustentam a performance da Grifo em mais de 250 obras — de forma enxuta, prática e com investimento reduzido.
                    </p>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">✅ Modelos de Gestão Comprovados</h4>
                      <p className="text-muted-foreground">
                        Acesso imediato às ferramentas e metodologias validadas pela Grifo: <strong>BI</strong> (inteligência de dados para tomada de decisão), <strong>Sienge</strong> (gestão integrada de obras e financeiro), <strong>Prevision</strong> (planejamento e simulação de cenários), <strong>PCP, PMP, PPC</strong> (gestão de curto, médio e longo prazo).
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground mb-2">✅ Grupo Exclusivo de Mentoria no WhatsApp</h4>
                      <p className="text-muted-foreground">
                        Um ambiente de troca com empresários e profissionais selecionados, com suporte direto da equipe Grifo e insights práticos de quem enfrenta os mesmos desafios que você.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground mb-2">✅ Aulas Práticas e Estudos de Caso Reais</h4>
                      <p className="text-muted-foreground">
                        Quatro aulas gravadas mostrando casos reais de empresas e obras que aplicaram o método, com passo a passo, erros, soluções e resultados.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-4">
                      Uma mentoria curta, direta e de alto impacto — feita para quem quer aplicar gestão de verdade e ver resultado rápido, sem precisar esperar o momento ideal.
                    </p>
                    
                    <p className="text-base font-semibold text-foreground mb-4">
                      💰 Investimento da Mentoria Fast: <span className="text-primary">12x R$ 1.750</span> ou <span className="text-primary">R$ 18.000 à vista</span>
                    </p>

                    <FormField
                      control={form.control}
                      name="interesse_mentoria_fast"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-border p-4 bg-background">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="font-medium text-base">
                              Tenho interesse na Mentoria Fast
                            </FormLabel>
                            <FormDescription className="text-sm">
                              Marque esta opção se deseja receber mais informações sobre a Mentoria Fast
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
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
