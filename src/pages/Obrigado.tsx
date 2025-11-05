import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function Obrigado() {
  const [searchParams] = useSearchParams();
  const leadId = searchParams.get("id");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Obrigado pelo interesse!
          </h1>
          <p className="text-muted-foreground">
            Recebemos suas informações e entraremos em contato em breve.
          </p>
        </div>

        {leadId && (
          <p className="text-sm text-muted-foreground">
            Protocolo: {leadId.slice(0, 8)}
          </p>
        )}

        <Button asChild className="w-full">
          <Link to="/">Voltar ao início</Link>
        </Button>
      </div>
    </div>
  );
}
