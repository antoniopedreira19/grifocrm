import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, ExternalLink, Link2 } from "lucide-react";
import { toast } from "sonner";

export function UTMBuilder() {
  const [formType, setFormType] = useState<"gbc" | "fast">("gbc");
  const [utmSource, setUtmSource] = useState("");
  const [utmMedium, setUtmMedium] = useState("");
  const [utmCampaign, setUtmCampaign] = useState("");
  const [utmTerm, setUtmTerm] = useState("");
  const [utmContent, setUtmContent] = useState("");
  const [utmId, setUtmId] = useState("");

  const baseUrl = `${window.location.origin}/form/${formType}`;

  const generateURL = () => {
    const params = new URLSearchParams();
    
    if (utmSource) params.append("utm_source", utmSource);
    if (utmMedium) params.append("utm_medium", utmMedium);
    if (utmCampaign) params.append("utm_campaign", utmCampaign);
    if (utmTerm) params.append("utm_term", utmTerm);
    if (utmContent) params.append("utm_content", utmContent);
    if (utmId) params.append("utm_id", utmId);

    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  const generatedURL = generateURL();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedURL);
    toast.success("URL copiada para a área de transferência!");
  };

  const openInNewTab = () => {
    window.open(generatedURL, "_blank");
  };

  const resetForm = () => {
    setUtmSource("");
    setUtmMedium("");
    setUtmCampaign("");
    setUtmTerm("");
    setUtmContent("");
    setUtmId("");
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Link2 className="w-5 h-5 text-primary" />
          <CardTitle>Gerador de Links com UTM</CardTitle>
        </div>
        <CardDescription>
          Crie links rastreáveis para suas campanhas de marketing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Seleção do Formulário */}
        <div className="space-y-2">
          <Label htmlFor="formType">Tipo de Formulário *</Label>
          <Select value={formType} onValueChange={(value: "gbc" | "fast") => setFormType(value)}>
            <SelectTrigger id="formType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gbc">GBC</SelectItem>
              <SelectItem value="fast">Mentoria Fast</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* UTM Source */}
          <div className="space-y-2">
            <Label htmlFor="utm_source">
              Origem (utm_source)
              <span className="text-muted-foreground text-xs ml-1">ex: google, facebook</span>
            </Label>
            <Input
              id="utm_source"
              placeholder="google"
              value={utmSource}
              onChange={(e) => setUtmSource(e.target.value)}
            />
          </div>

          {/* UTM Medium */}
          <div className="space-y-2">
            <Label htmlFor="utm_medium">
              Mídia (utm_medium)
              <span className="text-muted-foreground text-xs ml-1">ex: cpc, email</span>
            </Label>
            <Input
              id="utm_medium"
              placeholder="cpc"
              value={utmMedium}
              onChange={(e) => setUtmMedium(e.target.value)}
            />
          </div>

          {/* UTM Campaign */}
          <div className="space-y-2">
            <Label htmlFor="utm_campaign">
              Campanha (utm_campaign)
              <span className="text-muted-foreground text-xs ml-1">ex: lancamento_2024</span>
            </Label>
            <Input
              id="utm_campaign"
              placeholder="lancamento_2024"
              value={utmCampaign}
              onChange={(e) => setUtmCampaign(e.target.value)}
            />
          </div>

          {/* UTM Term */}
          <div className="space-y-2">
            <Label htmlFor="utm_term">
              Termo (utm_term)
              <span className="text-muted-foreground text-xs ml-1">ex: mentoria</span>
            </Label>
            <Input
              id="utm_term"
              placeholder="mentoria+empresarial"
              value={utmTerm}
              onChange={(e) => setUtmTerm(e.target.value)}
            />
          </div>

          {/* UTM Content */}
          <div className="space-y-2">
            <Label htmlFor="utm_content">
              Conteúdo (utm_content)
              <span className="text-muted-foreground text-xs ml-1">ex: banner_topo</span>
            </Label>
            <Input
              id="utm_content"
              placeholder="banner_topo"
              value={utmContent}
              onChange={(e) => setUtmContent(e.target.value)}
            />
          </div>

          {/* UTM ID */}
          <div className="space-y-2">
            <Label htmlFor="utm_id">
              ID (utm_id)
              <span className="text-muted-foreground text-xs ml-1">ex: abc123</span>
            </Label>
            <Input
              id="utm_id"
              placeholder="abc123"
              value={utmId}
              onChange={(e) => setUtmId(e.target.value)}
            />
          </div>
        </div>

        {/* URL Gerada */}
        <div className="space-y-2">
          <Label>URL Gerada</Label>
          <div className="p-3 bg-muted rounded-lg text-sm font-mono break-all">
            {generatedURL}
          </div>
        </div>

        {/* Ações */}
        <div className="flex gap-2 flex-wrap">
          <Button onClick={copyToClipboard} className="flex-1">
            <Copy className="w-4 h-4 mr-2" />
            Copiar URL
          </Button>
          <Button variant="outline" onClick={openInNewTab}>
            <ExternalLink className="w-4 h-4 mr-2" />
            Abrir
          </Button>
          <Button variant="ghost" onClick={resetForm}>
            Limpar
          </Button>
        </div>

        {/* Dicas */}
        <div className="p-4 bg-muted/50 rounded-lg space-y-2 text-sm">
          <p className="font-semibold text-foreground">💡 Dicas de uso:</p>
          <ul className="space-y-1 text-muted-foreground ml-4">
            <li>• <strong>utm_source:</strong> De onde vem o tráfego (google, facebook, instagram, email)</li>
            <li>• <strong>utm_medium:</strong> Tipo de mídia (cpc, organic, social, email, referral)</li>
            <li>• <strong>utm_campaign:</strong> Nome da campanha específica</li>
            <li>• <strong>utm_term:</strong> Palavras-chave para anúncios pagos</li>
            <li>• <strong>utm_content:</strong> Diferenciar versões de anúncios ou links</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
