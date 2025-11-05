import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  rede_social: z.string().optional(),
  faturamento_2025: z.enum(["ate_500k", "entre_500k_1m", "entre_1m_10m", "entre_10m_50m"]),
  faturamento_2024: z.enum(["ate_500k", "entre_500k_1m", "entre_1m_10m", "entre_10m_50m"]).optional(),
  num_funcionarios: z.number().optional(),
  modelo_negocio: z.string().max(280, "Máximo 280 caracteres").optional(),
  regiao: z.string().optional(),
  conhece_daniel: z.enum(["nao_conhece", "lt_3m", "m3_12m", "gt_1a"]),
  interesse: z.enum(["quero_agora", "quero_entender", "nao_mas_posso", "nao_nao_consigo"]),
  faixa_investimento: z.string().optional(),
  lgpd: z.boolean().refine((val) => val === true, "Você deve aceitar os termos"),
});

type FormValues = z.infer<typeof formSchema>;

interface FormularioGBCProps {
  produto: "gbc" | "mentoria_fast";
  origem: string;
  tagForm: string;
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

const faturamentoLabels = {
  ate_500k: "Até R$ 500 mil",
  entre_500k_1m: "Entre R$ 500 mil e R$ 1 milhão",
  entre_1m_10m: "Entre R$ 1 milhão e R$ 10 milhões",
  entre_10m_50m: "Entre R$ 10 milhões e R$ 50 milhões",
};

const conheceDanielLabels = {
  nao_conhece: "Não conheço",
  lt_3m: "Menos de 3 meses",
  m3_12m: "Entre 3 e 12 meses",
  gt_1a: "Mais de 1 ano",
};

const interesseLabels = {
  quero_agora: "Sim, quero agora",
  quero_entender: "Quero entender melhor",
  nao_mas_posso: "Não, mas posso investir",
  nao_nao_consigo: "Não, não consigo investir",
};

export function FormularioGBC({ produto, origem, tagForm, utmParams }: FormularioGBCProps) {
  const [showFastRedirect, setShowFastRedirect] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lgpd: false,
    },
  });

  const onSubmit = async (data: FormValues) => {
    // Se GBC e usuário não pode investir, mostra Mentoria Fast
    if (produto === "gbc" && data.interesse === "nao_nao_consigo" && !showFastRedirect) {
      setShowFastRedirect(true);
      return;
    }

    setIsSubmitting(true);

    try {
      // Determina o produto final (se redirecionado para Fast)
      const produtoFinal = showFastRedirect ? "mentoria_fast" : produto;
      const origemFinal = showFastRedirect ? "lp_fast" : origem;
      const tagFormFinal = showFastRedirect ? "form_fast" : tagForm;

      // Monta form_answers
      const formAnswers: any = {
        schema_version: "1.1",
        form: produtoFinal === "gbc" ? "gbc" : "mentoria_fast",
        modelo_negocio_detalhe: data.modelo_negocio || "",
        lgpd: {
          consent: true,
        },
      };

      // Adiciona investimento baseado no produto
      if (produtoFinal === "gbc") {
        formAnswers.investimento = {
          resposta_raw: data.interesse,
          resposta_enum: data.interesse,
          valor_anual: 120000,
        };
      } else {
        // Mentoria Fast
        formAnswers.investimento = {
          resposta_raw: data.interesse,
          resposta_enum: data.interesse,
          parcelas_qtd: 12,
          valor_parcela: 1666.67,
          valor_pagamento_unico: 16000,
        };
      }

      // Empresa info
      if (data.regiao) {
        formAnswers.empresa = {
          uf: data.regiao,
          pais: "BR",
        };
      }

      // Chama RPC
      const { data: leadId, error } = await supabase.rpc("capture_lead_public" as any, {
        p_produto: produtoFinal,
        p_nome: data.nome,
        p_email: data.email,
        p_telefone: data.telefone,
        p_faturamento_2025: data.faturamento_2025,
        p_conhece_daniel: data.conhece_daniel,
        p_interesse: data.interesse,
        p_origem: origemFinal,
        p_rede_social: data.rede_social || null,
        p_faturamento_2024: data.faturamento_2024 || null,
        p_num_funcionarios: data.num_funcionarios || null,
        p_modelo_negocio: data.modelo_negocio || null,
        p_regiao: data.regiao || null,
        p_faixa_investimento: data.faixa_investimento || null,
        p_utm_source: utmParams.utm_source || null,
        p_utm_medium: utmParams.utm_medium || null,
        p_utm_campaign: utmParams.utm_campaign || null,
        p_utm_term: utmParams.utm_term || null,
        p_utm_content: utmParams.utm_content || null,
        p_gclid: utmParams.gclid || null,
        p_fbclid: utmParams.fbclid || null,
        p_tag_form: tagFormFinal,
        p_form_answers: formAnswers,
      });

      if (error) {
        console.error("Erro ao enviar lead:", error);
        toast.error("Não conseguimos enviar agora; tente novamente");
        return;
      }

      // Sucesso - redireciona para obrigado
      navigate(`/obrigado?id=${leadId}`);
    } catch (error) {
      console.error("Erro ao processar formulário:", error);
      toast.error("Não conseguimos enviar agora; tente novamente");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isGBC = !showFastRedirect && produto === "gbc";
  const isFast = showFastRedirect || produto === "mentoria_fast";

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          {isFast ? "Mentoria Fast" : "Formulário GBC"}
        </h2>
        {showFastRedirect && (
          <p className="text-muted-foreground">
            Entendemos! Veja se a Mentoria Fast faz mais sentido para você agora.
          </p>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome completo *</FormLabel>
                <FormControl>
                  <Input placeholder="Seu nome" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid md:grid-cols-2 gap-6">
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
                    <Input placeholder="(00) 00000-0000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="rede_social"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rede social</FormLabel>
                <FormControl>
                  <Input placeholder="@usuario ou URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="faturamento_2025"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Faturamento 2025 *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
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
                        <SelectValue placeholder="Selecione" />
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
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="num_funcionarios"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de funcionários</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </FormControl>
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
                    <Input placeholder="SP, RJ, etc" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="modelo_negocio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modelo de negócio</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Descreva brevemente seu modelo de negócio"
                    maxLength={280}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {field.value?.length || 0}/280 caracteres
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <FormField
            control={form.control}
            name="interesse"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {isFast
                    ? "O investimento é de 12× R$ 1.666,67 ou R$ 16.000 à vista. Você tem capacidade de investir agora? *"
                    : "O investimento anual é de R$ 120.000. Você tem capacidade de investir agora? *"
                  }
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
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

          {form.watch("interesse") === "nao_nao_consigo" && !showFastRedirect && (
            <FormField
              control={form.control}
              name="faixa_investimento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qual faixa de investimento faria sentido agora?</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: R$ 5.000 a R$ 10.000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="lgpd"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Aceito o tratamento dos meus dados conforme a LGPD *
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : (isFast ? "Enviar para Mentoria Fast" : "Enviar")}
          </Button>
        </form>
      </Form>
    </div>
  );
}
