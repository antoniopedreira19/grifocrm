import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

interface FollowUpModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: { proximo_followup: string }) => void;
  leadNome: string;
  initialDate?: string;
}

export function FollowUpModal({ open, onClose, onConfirm, leadNome, initialDate }: FollowUpModalProps) {
  const [proximoFollowup, setProximoFollowup] = useState<string>(
    initialDate || format(new Date(), "yyyy-MM-dd'T'HH:mm")
  );

  const handleSubmit = () => {
    onConfirm({ proximo_followup: proximoFollowup });
  };

  const handleClose = () => {
    setProximoFollowup(initialDate || format(new Date(), "yyyy-MM-dd'T'HH:mm"));
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agendar Follow-Up</DialogTitle>
          <DialogDescription>
            Defina a data e hora do próximo follow-up para <strong>{leadNome}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="proximo_followup">Data e Hora do Próximo Follow-Up</Label>
            <Input
              id="proximo_followup"
              type="datetime-local"
              value={proximoFollowup}
              onChange={(e) => setProximoFollowup(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Agende quando você fará o próximo contato com este lead
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            Agendar Follow-Up
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
