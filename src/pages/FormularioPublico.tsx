import { useParams, Navigate, useSearchParams } from "react-router-dom";
import { FormularioGBC } from "@/components/forms/FormularioGBC";
import { FormularioFast } from "@/components/forms/FormularioFast";
import { useEffect, useState } from "react";
import grifoIcon from "@/assets/grifo-icon.png";
import grifoBackground from "@/assets/grifo-background.jpg";

interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
}

export default function FormularioPublico() {
  const { tipo } = useParams();
  const [searchParams] = useSearchParams();
  const [utmParams, setUtmParams] = useState<UTMParams>({});

  useEffect(() => {
    // Captura UTMs e CLIDs da URL ao carregar
    const params: UTMParams = {
      utm_source: searchParams.get("utm_source") || undefined,
      utm_medium: searchParams.get("utm_medium") || undefined,
      utm_campaign: searchParams.get("utm_campaign") || undefined,
      utm_term: searchParams.get("utm_term") || undefined,
      utm_content: searchParams.get("utm_content") || undefined,
      gclid: searchParams.get("gclid") || undefined,
      fbclid: searchParams.get("fbclid") || undefined,
    };
    setUtmParams(params);
  }, [searchParams]);

  if (tipo !== "gbc" && tipo !== "fast") {
    return <Navigate to="/" replace />;
  }

  const formTitle = tipo === "gbc" ? "GRIFO BUILDERS CLUB" : "MENTORIA FAST";
  const formSubtitle =
    tipo === "gbc"
      ? "Programa exclusivo para empresários que querem acelerar seus resultados"
      : "Mentoria intensiva para transformar seu negócio";

  return (
    <div className="min-h-screen relative overflow-hidden">
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
