import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProximoContatoModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: { proximo_contato: string }) => void;
  leadNome: string;
}

export function ProximoContatoModal({ open, onClose, onConfirm, leadNome }: ProximoContatoModalProps) {
  const [proximoContato, setProximoContato] = useState("");

  const handleConfirm = () => {
    if (!proximoContato) return;
    onConfirm({ proximo_contato: proximoContato });
    setProximoContato("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agendar Próximo Contato</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Lead: <strong>{leadNome}</strong>
          </p>
          
          <div className="space-y-2">
            <Label htmlFor="proximo_contato">Data e Hora do Próximo Contato *</Label>
            <Input
              id="proximo_contato"
              type="datetime-local"
              value={proximoContato}
              onChange={(e) => setProximoContato(e.target.value)}
              required
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!proximoContato}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
