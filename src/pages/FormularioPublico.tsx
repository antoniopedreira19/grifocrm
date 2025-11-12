import { useParams, Navigate, useSearchParams } from "react-router-dom";
import { FormularioGBC } from "@/components/forms/FormularioGBC";
import { FormularioFast } from "@/components/forms/FormularioFast";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import grifoIcon from "@/assets/grifo-icon.png";
import grifoBackground from "@/assets/grifo-background.jpg";

interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  utm_id?: string;
  gclid?: string;
  fbclid?: string;
  referrer?: string;
  landing_page?: string;
}

export default function FormularioPublico() {
  const { tipo } = useParams();
  const [searchParams] = useSearchParams();
  const [utmParams, setUtmParams] = useState<UTMParams>({});

  useEffect(() => {
    // Captura UTMs, CLIDs, referrer e landing page
    const params: UTMParams = {
      utm_source: searchParams.get("utm_source") || "",
      utm_medium: searchParams.get("utm_medium") || "",
      utm_campaign: searchParams.get("utm_campaign") || "",
      utm_term: searchParams.get("utm_term") || "",
      utm_content: searchParams.get("utm_content") || "",
      utm_id: searchParams.get("utm_id") || "",
      gclid: searchParams.get("gclid") || "",
      fbclid: searchParams.get("fbclid") || "",
      referrer: document.referrer || "",
      landing_page: window.location.href || "",
    };
    setUtmParams(params);
  }, [searchParams]);

  useEffect(() => {
    // Atualiza o título do navegador baseado no tipo de formulário
    if (tipo === "gbc") {
      document.title = "Formulário GBC";
    } else if (tipo === "fast") {
      document.title = "Formulário Mentoria Fast";
    }

    // Restaura o título original quando o componente é desmontado
    return () => {
      document.title = "GrifoCRM";
    };
  }, [tipo]);

  if (tipo !== "gbc" && tipo !== "fast") {
    return <Navigate to="/" replace />;
  }

  const formTitle = tipo === "gbc" ? "GRIFO BUILDERS CLUB" : "Mentoria Fast";
  const formSubtitle =
    tipo === "gbc"
      ? "Programa exclusivo para empresários que querem acelerar seus resultados"
      : "Mentoria intensiva para transformar seu negócio";

  const pixelId = tipo === "gbc" ? "1315010886552983" : "1336671737870979";

  return (
    <div className="min-h-screen relative overflow-hidden">
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
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `}
        </script>
        <noscript>
          {`<img height="1" width="1" style="display:none"
          src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1" />`}
        </noscript>
      </Helmet>
      {/* Background with overlay */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${grifoBackground})` }}
      />
      <div className="fixed inset-0" style={{ background: "var(--gradient-grifo-overlay)" }} />

      {/* Content */}
      <div className="relative z-10 container py-8 md:py-12">
        {/* Hero Header */}
        <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-12">
          <img src={grifoIcon} alt="Grifo" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
          <div>
            <h1 className="text-2xl md:text-4xl font-semibold text-white mb-1">{formTitle}</h1>
            <p className="text-sm md:text-base text-white/80">{formSubtitle}</p>
          </div>
        </div>

        {/* Form Card */}
        {tipo === "gbc" ? <FormularioGBC utmParams={utmParams} /> : <FormularioFast utmParams={utmParams} />}
      </div>
    </div>
  );
}
