import { useParams, Navigate } from "react-router-dom";
import { FormularioGBC } from "@/components/forms/FormularioGBC";

export default function FormularioPublico() {
  const { tipo } = useParams();

  if (tipo !== "gbc" && tipo !== "mentoria-fast") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
        <FormularioGBC />
      </div>
    </div>
  );
}
