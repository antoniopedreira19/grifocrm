import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface GanhoModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: { deal_valor: number; observacao: string }) => void;
  leadNome: string;
  defaultValor?: number;
}

export function GanhoModal({ open, onClose, onConfirm, leadNome, defaultValor }: GanhoModalProps) {
  const [dealValor, setDealValor] = useState("");
  const [observacao, setObservacao] = useState("");

  // Atualiza o valor quando o modal abre com um novo defaultValor
  useEffect(() => {
    if (open && defaultValor) {
      setDealValor(defaultValor.toString());
    }
  }, [open, defaultValor]);

  const handleConfirm = () => {
    const valor = parseFloat(dealValor);
    if (!valor || valor <= 0) return;
    
    onConfirm({ 
      deal_valor: valor,
      observacao: observacao.trim(),
    });
    
    setDealValor("");
    setObservacao("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Marcar como Ganho</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Lead: <strong>{leadNome}</strong>
          </p>
          
          <div className="space-y-2">
            <Label htmlFor="deal_valor">Valor do Negócio (R$) *</Label>
            <Input
              id="deal_valor"
              type="number"
              step="0.01"
              min="0"
              placeholder="120000.00"
              value={dealValor}
              onChange={(e) => setDealValor(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacao">Observação</Label>
            <Textarea
              id="observacao"
              placeholder="Detalhes sobre o fechamento..."
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!dealValor || parseFloat(dealValor) <= 0}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
