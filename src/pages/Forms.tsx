import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Copy, FileText, Globe } from "lucide-react";
import { toast } from "sonner";
import { UTMBuilder } from "@/components/forms/UTMBuilder";

export default function Forms() {
  const gbcUrl = `https://grifocrm.com.br/form/gbc`;
  const fastUrl = `https://grifocrm.com.br/form/fast`;

  const copyToClipboard = (url: string, name: string) => {
    navigator.clipboard.writeText(url);
    toast.success(`Link do ${name} copiado!`);
  };

  return (
    <AppLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Links</h1>
          <p className="text-muted-foreground mt-2">
            Formulários, Landing Pages e gerador de URLs com rastreamento
          </p>
        </div>

        <Tabs defaultValue="formularios" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="formularios" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Formulários
            </TabsTrigger>
            <TabsTrigger value="landing-pages" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Landing Pages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="formularios">
            {/* Links Base dos Formulários */}
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-foreground">Links Base</h2>
              <p className="text-sm text-muted-foreground mt-1">
                URLs dos formulários sem parâmetros de rastreamento
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 max-w-4xl">
              <Card>
                <CardHeader>
                  <CardTitle>Formulário GBC</CardTitle>
                  <CardDescription>
                    Formulário de captação para o programa GBC
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-muted rounded-lg text-sm font-mono break-all">
                    {gbcUrl}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => copyToClipboard(gbcUrl, "Formulário GBC")}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar Link
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.open(gbcUrl, "_blank")}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Formulário Mentoria Fast</CardTitle>
                  <CardDescription>
                    Formulário de captação para o programa Mentoria Fast
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-muted rounded-lg text-sm font-mono break-all">
                    {fastUrl}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => copyToClipboard(fastUrl, "Formulário Mentoria Fast")}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar Link
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.open(fastUrl, "_blank")}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* UTM Builder */}
            <div className="mt-8">
              <UTMBuilder />
            </div>
          </TabsContent>

          <TabsContent value="landing-pages">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-foreground">Landing Pages</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Páginas de captura públicas para campanhas de marketing
              </p>
            </div>

            <Card className="max-w-2xl">
              <CardContent className="pt-6">
                <div className="text-center py-8 text-muted-foreground">
                  <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Em breve</p>
                  <p className="text-sm mt-2">
                    Landing pages personalizadas para suas campanhas serão adicionadas aqui.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
