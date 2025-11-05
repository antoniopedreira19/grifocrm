import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import grifoBackground from "@/assets/grifo-background.jpg";
import grifoIcon from "@/assets/grifo-icon.png";

export default function Obrigado() {
  const [searchParams] = useSearchParams();
  const leadId = searchParams.get("id");

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-6">
      {/* Background with overlay */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${grifoBackground})` }}
      />
      <div 
        className="fixed inset-0"
        style={{ background: 'var(--gradient-grifo-overlay)' }}
      />
      
      {/* Content */}
      <Card className="relative z-10 max-w-md w-full shadow-2xl">
        <CardContent className="pt-12 pb-8 px-8 text-center space-y-6">
          <div className="flex justify-center mb-4">
            <img 
              src={grifoIcon} 
              alt="Grifo" 
              className="w-16 h-16 object-contain opacity-90"
            />
          </div>
          
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 border-2 border-green-500 mb-2">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold text-foreground">
              Obrigado pelo interesse!
            </h1>
            <p className="text-muted-foreground text-base">
              Recebemos suas informações e entraremos em contato em breve para dar continuidade ao processo.
            </p>
          </div>

          {leadId && (
            <div className="pt-4 pb-2">
              <p className="text-sm font-medium text-muted-foreground">
                Protocolo de inscrição
              </p>
              <p className="text-lg font-mono font-semibold text-foreground mt-1">
                {leadId.slice(0, 8).toUpperCase()}
              </p>
            </div>
          )}

          <Button asChild className="w-full mt-6" size="lg">
            <Link to="/">Voltar ao início</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
