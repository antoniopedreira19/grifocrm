import { useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import grifoBackground from "@/assets/grifo-background.jpg";
import grifoIcon from "@/assets/grifo-icon.png";

export default function Obrigado() {
  const [searchParams] = useSearchParams();
  const leadId = searchParams.get("id");

  return (
    <>
      <Helmet>
        <script>
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1336671737870979');
            fbq('track', 'PageView');
          `}
        </script>
        <noscript>
          {`<img height="1" width="1" style="display:none"
            src="https://www.facebook.com/tr?id=1336671737870979&ev=PageView&noscript=1" />`}
        </noscript>
      </Helmet>
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
    </>
  );
}
