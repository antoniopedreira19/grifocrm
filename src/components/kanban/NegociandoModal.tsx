import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Produto } from "@/types/lead";

interface NegociandoModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: { produto: Produto; deal_valor: number }) => void;
  leadNome: string;
  currentProduto?: string;
  currentValor?: number;
}

export function NegociandoModal({ 
  open, 
  onClose, 
  onConfirm, 
  leadNome,
  currentProduto,
  currentValor
}: NegociandoModalProps) {
  const [produto, setProduto] = useState<Produto>("gbc");
  const [dealValor, setDealValor] = useState("");

  // Atualiza os valores quando o modal abre
  useEffect(() => {
    if (open) {
      if (currentProduto) {
        setProduto(currentProduto as Produto);
      }
      if (currentValor) {
        setDealValor(currentValor.toString());
      } else {
        // Define valor padrão baseado no produto
        const defaultValue = currentProduto === "mentoria_fast" ? 18000 : currentProduto === "board" ? 2000 : 120000;
        setDealValor(defaultValue.toString());
      }
    }
  }, [open, currentProduto, currentValor]);

  // Atualiza o valor quando o produto muda
  const handleProdutoChange = (newProduto: Produto) => {
    setProduto(newProduto);
    // Atualiza valor padrão baseado no produto
    const defaultValue = newProduto === "mentoria_fast" ? 18000 : newProduto === "board" ? 2000 : 120000;
    setDealValor(defaultValue.toString());
  };

  const handleConfirm = () => {
    const valor = parseFloat(dealValor);
    if (!valor || valor <= 0) return;
    
    onConfirm({ 
      produto,
      deal_valor: valor,
    });
    
    setProduto("gbc");
    setDealValor("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Atualizar Produto e Valor</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Lead: <strong>{leadNome}</strong>
          </p>
          
          <div className="space-y-2">
            <Label htmlFor="produto">Produto *</Label>
            <Select value={produto} onValueChange={handleProdutoChange}>
              <SelectTrigger id="produto">
                <SelectValue placeholder="Selecione o produto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gbc">GBC</SelectItem>
                <SelectItem value="mentoria_fast">Mentoria Fast</SelectItem>
                <SelectItem value="board">Board</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
            <p className="text-xs text-muted-foreground">
              Valor padrão: GBC = R$ 120.000 | Mentoria Fast = R$ 18.000
            </p>
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
