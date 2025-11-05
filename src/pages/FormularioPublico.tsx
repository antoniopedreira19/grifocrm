import { useParams, Navigate, useSearchParams } from "react-router-dom";
import { FormularioGBC } from "@/components/forms/FormularioGBC";
import { useEffect, useState } from "react";

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

  const produto = tipo === "gbc" ? "gbc" : "mentoria_fast";
  const origem = tipo === "gbc" ? "lp_gbc" : "lp_fast";
  const tagForm = tipo === "gbc" ? "form_gbc" : "form_fast";

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
        <FormularioGBC 
          produto={produto}
          origem={origem}
          tagForm={tagForm}
          utmParams={utmParams}
        />
      </div>
    </div>
  );
}
