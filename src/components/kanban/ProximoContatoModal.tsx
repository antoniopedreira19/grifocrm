import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface ProximoContatoModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: { proximo_contato: string }) => void;
  leadNome: string;
}

export function ProximoContatoModal({ open, onClose, onConfirm, leadNome }: ProximoContatoModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [hora, setHora] = useState("09:00");

  const handleConfirm = () => {
    if (!selectedDate) return;
    
    // Combinar data e hora
    const [hours, minutes] = hora.split(':');
    const dateTime = new Date(selectedDate);
    dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    onConfirm({ proximo_contato: dateTime.toISOString() });
    setSelectedDate(undefined);
    setHora("09:00");
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
            <Label>Data do Próximo Contato *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP", { locale: ptBR }) : "Selecione a data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  className="pointer-events-auto"
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hora">Hora do Contato *</Label>
            <Input
              id="hora"
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              required
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedDate}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
