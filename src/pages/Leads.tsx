import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

export default function Leads() {
  return (
    <AppLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Leads</h1>
            <p className="text-muted-foreground mt-2">
              Visualize e gerencie todos os leads
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Lead
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, telefone, e-mail..."
              className="pl-10"
            />
          </div>
          <Button variant="outline">Filtros</Button>
          <Button variant="outline">Exportar CSV</Button>
        </div>

        {/* Table */}
        <div className="border rounded-lg bg-card">
          <div className="p-8 text-center text-muted-foreground">
            <p>Nenhum lead cadastrado ainda</p>
            <p className="text-sm mt-2">
              Comece adicionando seu primeiro lead ou compartilhe os formulários
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
