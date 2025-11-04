import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { faturamentoLabels, conheceDanielLabels, interesseLabels } from "@/utils/labels";

const formSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  rede_social: z.string().optional(),
  faturamento_2025: z.enum(["ate_500mil", "entre_500mil_e_1milhao", "entre_1milhao_e_10milhoes", "entre_10milhoes_e_50milhoes"]),
  faturamento_2024: z.enum(["ate_500mil", "entre_500mil_e_1milhao", "entre_1milhao_e_10milhoes", "entre_10milhoes_e_50milhoes"]).optional(),
  num_funcionarios: z.number().optional(),
  modelo_negocio: z.string().max(280, "Máximo 280 caracteres").optional(),
  regiao: z.string().optional(),
  conhece_daniel: z.enum(["nao_conhece", "menos_3_meses", "3_12_meses", "mais_1_ano"]),
  interesse: z.enum(["quero_agora", "quero_entender", "nao_mas_posso", "nao_nao_consigo"]),
  faixa_investimento: z.string().optional(),
  lgpd: z.boolean().refine((val) => val === true, "Você deve aceitar os termos"),
});

type FormValues = z.infer<typeof formSchema>;

export function FormularioGBC() {
  const [showFastRedirect, setShowFastRedirect] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lgpd: false,
    },
  });

  const onSubmit = (data: FormValues) => {
    // Check if user can't invest in GBC
    if (data.interesse === "nao_nao_consigo" && !showFastRedirect) {
      setShowFastRedirect(true);
      return;
    }

    console.log("Form submitted:", { ...data, produto: showFastRedirect ? "Mentoria Fast" : "GBC" });
    toast.success("Lead cadastrado com sucesso!");
    form.reset();
    setShowFastRedirect(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          {showFastRedirect ? "Mentoria Fast" : "Formulário GBC"}
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
                  {showFastRedirect 
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

          <Button type="submit" className="w-full" size="lg">
            {showFastRedirect ? "Enviar para Mentoria Fast" : "Enviar"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
