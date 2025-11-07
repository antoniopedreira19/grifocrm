import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";

type TipoPagamento = "a_vista" | "parcelado" | "entrada_parcelado";

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
  currentValorEntrada,
}: PropostaModalProps) {
  const [tipoPagamento, setTipoPagamento] = useState<TipoPagamento>("a_vista");
  const [valorAVista, setValorAVista] = useState("");
  const [valorParcelado, setValorParcelado] = useState("");
  const [valorEntrada, setValorEntrada] = useState("");

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

    if (tipoPagamento === "a_vista" && valorAVista) {
      data.valor_a_vista = parseFloat(valorAVista);
    } else if (tipoPagamento === "parcelado" && valorParcelado) {
      data.valor_parcelado = parseFloat(valorParcelado);
    } else if (tipoPagamento === "entrada_parcelado") {
      if (valorEntrada) data.valor_entrada = parseFloat(valorEntrada);
      if (valorParcelado) data.valor_parcelado = parseFloat(valorParcelado);
    }

    onConfirm(data);
    setTipoPagamento("a_vista");
    setValorAVista("");
    setValorParcelado("");
    setValorEntrada("");
  };

  const isValid = () => {
    if (tipoPagamento === "a_vista") return valorAVista && parseFloat(valorAVista) > 0;
    if (tipoPagamento === "parcelado") return valorParcelado && parseFloat(valorParcelado) > 0;
    if (tipoPagamento === "entrada_parcelado") {
      return (valorEntrada && parseFloat(valorEntrada) > 0) || (valorParcelado && parseFloat(valorParcelado) > 0);
    }
    return false;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Proposta Comercial</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Lead: <strong>{leadNome}</strong>
          </p>

          <div className="space-y-3">
            <Label>Tipo de Pagamento *</Label>
            <RadioGroup value={tipoPagamento} onValueChange={(value) => setTipoPagamento(value as TipoPagamento)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="a_vista" id="a_vista" />
                <Label htmlFor="a_vista" className="font-normal cursor-pointer">
                  À vista
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

          <Card className="border-primary/20">
            <CardContent className="pt-6 space-y-4">
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
                  />
                  <p className="text-xs text-muted-foreground">
                    Valor total considerando todas as parcelas
                  </p>
                </div>
              )}

              {tipoPagamento === "entrada_parcelado" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="valor_entrada">Valor da Entrada (R$)</Label>
                    <Input
                      id="valor_entrada"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="30000.00"
                      value={valorEntrada}
                      onChange={(e) => setValorEntrada(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="valor_parcelado_entrada">Valor Parcelado (R$)</Label>
                    <Input
                      id="valor_parcelado_entrada"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="90000.00"
                      value={valorParcelado}
                      onChange={(e) => setValorParcelado(e.target.value)}
                    />
                  </div>
                  {valorEntrada && valorParcelado && (
                    <div className="pt-2 border-t">
                      <p className="text-sm font-medium">
                        Valor Total: R${" "}
                        {(parseFloat(valorEntrada || "0") + parseFloat(valorParcelado || "0")).toLocaleString(
                          "pt-BR",
                          { minimumFractionDigits: 2 }
                        )}
                      </p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
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
