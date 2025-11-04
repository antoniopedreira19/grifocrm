import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { statusLabels } from "@/utils/labels";
import type { Status } from "@/types/lead";

const columns: Status[] = [
  "backlog",
  "primeiro_contato",
  "proximo_contato",
  "negociando",
  "stand_by",
  "pode_fechar",
  "pagamento",
  "ganho",
  "perdido",
];

export default function Kanban() {
  return (
    <AppLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Kanban</h1>
          <p className="text-muted-foreground mt-2">
            Pipeline visual de leads por etapa
          </p>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((status) => (
            <div key={status} className="flex-shrink-0 w-80">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold">
                      {statusLabels[status]}
                    </CardTitle>
                    <Badge variant="secondary" className="rounded-full">
                      0
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground text-center py-8">
                    Nenhum lead nesta etapa
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
