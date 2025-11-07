import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TipoPagamento } from "@/types/lead";

interface PropostaModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: { 
    tipo_pagamento: TipoPagamento;
    valor_a_vista?: number;
    valor_parcelado?: number;
    valor_entrada?: number;
  }) => void;
  leadNome: string;
  currentValor?: number;
}

export function PropostaModal({ open, onClose, onConfirm, leadNome, currentValor }: PropostaModalProps) {
  const [tipoPagamento, setTipoPagamento] = useState<TipoPagamento>("a_vista");
  const [valorAVista, setValorAVista] = useState<string>(currentValor?.toString() || "");
  const [valorParcelado, setValorParcelado] = useState<string>(currentValor?.toString() || "");
  const [valorEntrada, setValorEntrada] = useState<string>("");

  const handleSubmit = () => {
    const data: any = {
      tipo_pagamento: tipoPagamento,
    };

    if (tipoPagamento === "a_vista" && valorAVista) {
      data.valor_a_vista = parseFloat(valorAVista);
    } else if (tipoPagamento === "parcelado" && valorParcelado) {
      data.valor_parcelado = parseFloat(valorParcelado);
    } else if (tipoPagamento === "entrada_parcelado") {
      if (valorEntrada) data.valor_entrada = parseFloat(valorEntrada);
      if (valorParcelado) data.valor_parcelado = parseFloat(valorParcelado);
    }

    onConfirm(data);
  };

  const handleClose = () => {
    setTipoPagamento("a_vista");
    setValorAVista(currentValor?.toString() || "");
    setValorParcelado(currentValor?.toString() || "");
    setValorEntrada("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enviar Proposta</DialogTitle>
          <DialogDescription>
            Configure os detalhes da proposta para <strong>{leadNome}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="tipo_pagamento">Tipo de Pagamento</Label>
            <Select value={tipoPagamento} onValueChange={(value) => setTipoPagamento(value as TipoPagamento)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a_vista">À Vista</SelectItem>
                <SelectItem value="parcelado">Parcelado</SelectItem>
                <SelectItem value="entrada_parcelado">Entrada + Parcelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {tipoPagamento === "a_vista" && (
            <div className="space-y-2">
              <Label htmlFor="valor_a_vista">Valor à Vista (R$)</Label>
              <Input
                id="valor_a_vista"
                type="number"
                step="0.01"
                value={valorAVista}
                onChange={(e) => setValorAVista(e.target.value)}
                placeholder="Ex: 18000.00"
              />
            </div>
          )}

          {tipoPagamento === "parcelado" && (
            <div className="space-y-2">
              <Label htmlFor="valor_parcelado">Valor Total Parcelado (R$)</Label>
              <Input
                id="valor_parcelado"
                type="number"
                step="0.01"
                value={valorParcelado}
                onChange={(e) => setValorParcelado(e.target.value)}
                placeholder="Ex: 20000.00"
              />
            </div>
          )}

          {tipoPagamento === "entrada_parcelado" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="valor_entrada">Valor de Entrada (R$)</Label>
                <Input
                  id="valor_entrada"
                  type="number"
                  step="0.01"
                  value={valorEntrada}
                  onChange={(e) => setValorEntrada(e.target.value)}
                  placeholder="Ex: 5000.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valor_parcelado_entrada">Valor a Parcelar (R$)</Label>
                <Input
                  id="valor_parcelado_entrada"
                  type="number"
                  step="0.01"
                  value={valorParcelado}
                  onChange={(e) => setValorParcelado(e.target.value)}
                  placeholder="Ex: 15000.00"
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            Enviar Proposta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
