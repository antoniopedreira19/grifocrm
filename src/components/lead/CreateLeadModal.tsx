import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface CreateLeadModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateLeadModal({ open, onClose }: CreateLeadModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    produto: "fast" as "fast" | "gbc",
    rede_social: "",
    regiao: "",
    faturamento_2025: "",
    faturamento_2024: "",
    num_funcionarios: "",
    interesse: "",
    conhece_daniel: "",
    interesse_mentoria_fast: false,
  });

  const createLeadMutation = useMutation({
    mutationFn: async () => {
      const leadData: any = {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        produto: formData.produto,
      };

      // Calcular deal_valor padrão baseado no produto e interesse
      if (formData.produto === "fast") {
        leadData.deal_valor = 18000;
      } else if (formData.produto === "gbc") {
        // Se marcou interesse na mentoria fast, valor é 18k, senão 120k
        leadData.deal_valor = formData.interesse_mentoria_fast ? 18000 : 120000;
        leadData.interesse_mentoria_fast = formData.interesse_mentoria_fast;
      }

      // Adicionar campos opcionais apenas se preenchidos
      if (formData.rede_social) leadData.rede_social = formData.rede_social;
      if (formData.regiao) leadData.regiao = formData.regiao;
      if (formData.faturamento_2025) leadData.faturamento_2025 = formData.faturamento_2025;
      if (formData.faturamento_2024) leadData.faturamento_2024 = formData.faturamento_2024;
      if (formData.num_funcionarios) leadData.num_funcionarios = parseInt(formData.num_funcionarios);
      if (formData.interesse) leadData.interesse = formData.interesse;
      if (formData.conhece_daniel) leadData.conhece_daniel = formData.conhece_daniel;

      const { error } = await supabase
        .from("leads")
        .insert(leadData);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["kanban-leads"] });
      toast({ title: "Lead criado com sucesso!" });
      handleClose();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar lead",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleClose = () => {
    setFormData({
      nome: "",
      email: "",
      telefone: "",
      produto: "fast",
      rede_social: "",
      regiao: "",
      faturamento_2025: "",
      faturamento_2024: "",
      num_funcionarios: "",
      interesse: "",
      conhece_daniel: "",
      interesse_mentoria_fast: false,
    });
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.nome || !formData.email || !formData.telefone) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome, e-mail e telefone",
        variant: "destructive",
      });
      return;
    }

    createLeadMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Lead</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Informações Básicas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Nome completo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@exemplo.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="produto">Produto *</Label>
                <Select
                  value={formData.produto}
                  onValueChange={(value: "fast" | "gbc") => setFormData({ ...formData, produto: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fast">Mentoria Fast</SelectItem>
                    <SelectItem value="gbc">GBC</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rede_social">Rede Social</Label>
                <Input
                  id="rede_social"
                  value={formData.rede_social}
                  onChange={(e) => setFormData({ ...formData, rede_social: e.target.value })}
                  placeholder="@usuario"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="regiao">Região</Label>
                <Input
                  id="regiao"
                  value={formData.regiao}
                  onChange={(e) => setFormData({ ...formData, regiao: e.target.value })}
                  placeholder="Ex: São Paulo - SP"
                />
              </div>
            </div>
          </div>

          {/* Dados Empresariais */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-sm font-semibold">Dados Empresariais</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="faturamento_2025">Faturamento 2025</Label>
                <Select
                  value={formData.faturamento_2025}
                  onValueChange={(value) => setFormData({ ...formData, faturamento_2025: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
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
                  value={formData.faturamento_2024}
                  onValueChange={(value) => setFormData({ ...formData, faturamento_2024: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
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
                <Label htmlFor="num_funcionarios">Nº de Funcionários</Label>
                <Input
                  id="num_funcionarios"
                  type="number"
                  value={formData.num_funcionarios}
                  onChange={(e) => setFormData({ ...formData, num_funcionarios: e.target.value })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interesse">Interesse</Label>
                <Select
                  value={formData.interesse}
                  onValueChange={(value) => setFormData({ ...formData, interesse: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
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
                  value={formData.conhece_daniel}
                  onValueChange={(value) => setFormData({ ...formData, conhece_daniel: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nao_conhece">Não conhece</SelectItem>
                    <SelectItem value="lt_3m">Menos de 3 meses</SelectItem>
                    <SelectItem value="m3_12m">3 a 12 meses</SelectItem>
                    <SelectItem value="gt_1a">Mais de 1 ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.produto === "gbc" && (
                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="interesse_mentoria_fast"
                      checked={formData.interesse_mentoria_fast}
                      onChange={(e) => setFormData({ ...formData, interesse_mentoria_fast: e.target.checked })}
                      className="h-4 w-4 rounded border-border"
                    />
                    <Label htmlFor="interesse_mentoria_fast" className="cursor-pointer">
                      Tem interesse na Mentoria Fast (valor: R$ 18.000)
                    </Label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createLeadMutation.isPending}>
              {createLeadMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Criar Lead
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
