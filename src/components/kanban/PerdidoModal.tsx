import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PerdidoModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: { motivo_categoria?: string; motivo_texto: string }) => void;
  leadNome: string;
}

const motivosCategoria = [
  { value: "preco", label: "Preço alto" },
  { value: "tempo", label: "Momento errado" },
  { value: "sem_fit", label: "Não é o fit ideal" },
  { value: "concorrente", label: "Optou por concorrente" },
  { value: "sem_resposta", label: "Sem resposta" },
  { value: "outros", label: "Outro" },
];

export function PerdidoModal({ open, onClose, onConfirm, leadNome }: PerdidoModalProps) {
  const [motivoCategoria, setMotivoCategoria] = useState("");
  const [motivoTexto, setMotivoTexto] = useState("");

  const handleConfirm = () => {
    if (!motivoTexto.trim() && !motivoCategoria) return;
    
    onConfirm({ 
      motivo_categoria: motivoCategoria || undefined,
      motivo_texto: motivoTexto.trim(),
    });
    
    setMotivoCategoria("");
    setMotivoTexto("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Marcar como Perdido</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Lead: <strong>{leadNome}</strong>
          </p>
          
          <div className="space-y-2">
            <Label htmlFor="motivo_categoria">Categoria do Motivo</Label>
            <Select value={motivoCategoria} onValueChange={setMotivoCategoria}>
              <SelectTrigger id="motivo_categoria">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {motivosCategoria.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="motivo_texto">Detalhes do Motivo *</Label>
            <Textarea
              id="motivo_texto"
              placeholder="Descreva o motivo da perda..."
              value={motivoTexto}
              onChange={(e) => setMotivoTexto(e.target.value)}
              rows={4}
              required
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!motivoTexto.trim() && !motivoCategoria}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
