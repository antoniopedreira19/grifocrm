import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  currentTipoPagamento?: TipoPagamento;
  currentValorAVista?: number;
  currentValorParcelado?: number;
  currentValorEntrada?: number;
}

export function PropostaModal({ 
  open, 
  onClose, 
  onConfirm, 
  leadNome,
  currentTipoPagamento,
  currentValorAVista,
  currentValorParcelado,
  currentValorEntrada
}: PropostaModalProps) {
  const [tipoPagamento, setTipoPagamento] = useState<TipoPagamento>("a_vista");
  const [valorAVista, setValorAVista] = useState("");
  const [valorParcelado, setValorParcelado] = useState("");
  const [valorEntrada, setValorEntrada] = useState("");

  // Atualiza os valores quando o modal abre
  useEffect(() => {
    if (open) {
      setTipoPagamento(currentTipoPagamento || "a_vista");
      setValorAVista(currentValorAVista?.toString() || "");
      setValorParcelado(currentValorParcelado?.toString() || "");
      setValorEntrada(currentValorEntrada?.toString() || "");
    }
  }, [open, currentTipoPagamento, currentValorAVista, currentValorParcelado, currentValorEntrada]);

  const handleConfirm = () => {
    const data: any = {
      tipo_pagamento: tipoPagamento,
    };

    if (tipoPagamento === "a_vista") {
      const valor = parseFloat(valorAVista);
      if (!valor || valor <= 0) {
        return;
      }
      data.valor_a_vista = valor;
    } else if (tipoPagamento === "parcelado") {
      const valor = parseFloat(valorParcelado);
      if (!valor || valor <= 0) {
        return;
      }
      data.valor_parcelado = valor;
    } else if (tipoPagamento === "entrada_parcelado") {
      const entrada = parseFloat(valorEntrada);
      const parcelado = parseFloat(valorParcelado);
      if (!entrada || entrada <= 0 || !parcelado || parcelado <= 0) {
        return;
      }
      data.valor_entrada = entrada;
      data.valor_parcelado = parcelado;
    }
    
    onConfirm(data);
    
    // Reset
    setTipoPagamento("a_vista");
    setValorAVista("");
    setValorParcelado("");
    setValorEntrada("");
  };

  const isValid = () => {
    if (tipoPagamento === "a_vista") {
      return valorAVista && parseFloat(valorAVista) > 0;
    } else if (tipoPagamento === "parcelado") {
      return valorParcelado && parseFloat(valorParcelado) > 0;
    } else if (tipoPagamento === "entrada_parcelado") {
      return valorEntrada && parseFloat(valorEntrada) > 0 && 
             valorParcelado && parseFloat(valorParcelado) > 0;
    }
    return false;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Definir Proposta</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <p className="text-sm text-muted-foreground">
            Lead: <strong>{leadNome}</strong>
          </p>
          
          <div className="space-y-3">
            <Label>Tipo de Pagamento *</Label>
            <RadioGroup value={tipoPagamento} onValueChange={(value) => setTipoPagamento(value as TipoPagamento)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="a_vista" id="a_vista" />
                <Label htmlFor="a_vista" className="font-normal cursor-pointer">
                  À Vista
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="parcelado" id="parcelado" />
                <Label htmlFor="parcelado" className="font-normal cursor-pointer">
                  Parcelado
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="entrada_parcelado" id="entrada_parcelado" />
                <Label htmlFor="entrada_parcelado" className="font-normal cursor-pointer">
                  Entrada + Parcelado
                </Label>
              </div>
            </RadioGroup>
          </div>

          {tipoPagamento === "a_vista" && (
            <div className="space-y-2">
              <Label htmlFor="valor_a_vista">Valor à Vista (R$) *</Label>
              <Input
                id="valor_a_vista"
                type="number"
                step="0.01"
                min="0"
                placeholder="120000.00"
                value={valorAVista}
                onChange={(e) => setValorAVista(e.target.value)}
                required
              />
            </div>
          )}

          {tipoPagamento === "parcelado" && (
            <div className="space-y-2">
              <Label htmlFor="valor_parcelado">Valor Total Parcelado (R$) *</Label>
              <Input
                id="valor_parcelado"
                type="number"
                step="0.01"
                min="0"
                placeholder="120000.00"
                value={valorParcelado}
                onChange={(e) => setValorParcelado(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Valor total do parcelamento
              </p>
            </div>
          )}

          {tipoPagamento === "entrada_parcelado" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="valor_entrada">Valor da Entrada (R$) *</Label>
                <Input
                  id="valor_entrada"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="30000.00"
                  value={valorEntrada}
                  onChange={(e) => setValorEntrada(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valor_parcelado_resto">Valor Restante Parcelado (R$) *</Label>
                <Input
                  id="valor_parcelado_resto"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="90000.00"
                  value={valorParcelado}
                  onChange={(e) => setValorParcelado(e.target.value)}
                  required
                />
              </div>
              {valorEntrada && valorParcelado && (
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm font-medium">
                    Valor Total: R$ {(parseFloat(valorEntrada) + parseFloat(valorParcelado)).toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!isValid()}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
