import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Plus, Trash2, ExternalLink, Package, Briefcase } from "lucide-react";
import { produtoLabels } from "@/utils/labels";

type ProductCategory = "mentorias" | "produtos";

interface ProductLink {
  tipo: "formulario" | "landing_page";
  nome: string;
  url: string;
}

interface ProductConfig {
  id: string;
  produto: string;
  categoria: ProductCategory;
  links: ProductLink[];
  created_at: string;
  updated_at: string;
}

const categoryLabels: Record<ProductCategory, string> = {
  mentorias: "Mentorias",
  produtos: "Produtos",
};

const categoryIcons: Record<ProductCategory, typeof Package> = {
  mentorias: Briefcase,
  produtos: Package,
};

const linkTypeLabels: Record<string, string> = {
  formulario: "Formulário",
  landing_page: "Landing Page",
};

export default function ProductsConfig() {
  const queryClient = useQueryClient();
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [newLink, setNewLink] = useState<{ tipo: "formulario" | "landing_page"; nome: string; url: string }>({
    tipo: "formulario",
    nome: "",
    url: "",
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ["products-config"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products_config")
        .select("*")
        .order("categoria", { ascending: true });
      
      if (error) throw error;
      return (data || []).map(item => ({
        ...item,
        links: (item.links as unknown as ProductLink[]) || []
      })) as ProductConfig[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, categoria, links }: { id: string; categoria?: ProductCategory; links?: ProductLink[] }) => {
      const updateData: Record<string, unknown> = {};
      if (categoria) updateData.categoria = categoria;
      if (links) updateData.links = links;

      const { error } = await supabase
        .from("products_config")
        .update(updateData)
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products-config"] });
      toast.success("Produto atualizado com sucesso");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar produto: " + error.message);
    },
  });

  const handleCategoryChange = (productId: string, newCategory: ProductCategory) => {
    updateMutation.mutate({ id: productId, categoria: newCategory });
  };

  const handleAddLink = (product: ProductConfig) => {
    if (!newLink.nome || !newLink.url) {
      toast.error("Preencha todos os campos do link");
      return;
    }

    const updatedLinks = [...product.links, newLink];
    updateMutation.mutate({ id: product.id, links: updatedLinks });
    setNewLink({ tipo: "formulario", nome: "", url: "" });
    setEditingProduct(null);
  };

  const handleRemoveLink = (product: ProductConfig, linkIndex: number) => {
    const updatedLinks = product.links.filter((_, i) => i !== linkIndex);
    updateMutation.mutate({ id: product.id, links: updatedLinks });
  };

  const groupedProducts = products?.reduce((acc, product) => {
    const category = product.categoria;
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {} as Record<ProductCategory, ProductConfig[]>);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-64 bg-muted rounded" />
            <div className="h-48 bg-muted rounded" />
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configuração de Produtos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as categorias dos produtos e seus links associados
          </p>
        </div>

        {(["mentorias", "produtos"] as ProductCategory[]).map((category) => {
          const CategoryIcon = categoryIcons[category];
          const categoryProducts = groupedProducts?.[category] || [];

          return (
            <Card key={category}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CategoryIcon className="h-5 w-5 text-primary" />
                  <CardTitle>{categoryLabels[category]}</CardTitle>
                </div>
                <CardDescription>
                  {category === "mentorias" 
                    ? "Programas de mentoria e acompanhamento" 
                    : "Produtos avulsos e cursos"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {categoryProducts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Nenhum produto nesta categoria
                  </p>
                ) : (
                  categoryProducts.map((product) => (
                    <div
                      key={product.id}
                      className="border rounded-lg p-4 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-foreground">
                            {produtoLabels[product.produto as keyof typeof produtoLabels] || product.produto}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {product.produto}
                          </Badge>
                        </div>
                        <Select
                          value={product.categoria}
                          onValueChange={(value) => handleCategoryChange(product.id, value as ProductCategory)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mentorias">Mentorias</SelectItem>
                            <SelectItem value="produtos">Produtos</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Separator />

                      {/* Links associados */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Links Associados</Label>
                        {product.links.length === 0 ? (
                          <p className="text-sm text-muted-foreground">
                            Nenhum link associado
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {product.links.map((link, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between gap-2 bg-muted/50 rounded-md p-2"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <Badge variant="secondary" className="shrink-0">
                                    {linkTypeLabels[link.tipo]}
                                  </Badge>
                                  <span className="text-sm truncate">{link.nome}</span>
                                  <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline flex items-center gap-1 shrink-0"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                  onClick={() => handleRemoveLink(product, index)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Adicionar novo link */}
                        {editingProduct === product.id ? (
                          <div className="space-y-3 pt-2 border-t mt-3">
                            <div className="grid grid-cols-3 gap-2">
                              <Select
                                value={newLink.tipo}
                                onValueChange={(value) => setNewLink({ ...newLink, tipo: value as "formulario" | "landing_page" })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="formulario">Formulário</SelectItem>
                                  <SelectItem value="landing_page">Landing Page</SelectItem>
                                </SelectContent>
                              </Select>
                              <Input
                                placeholder="Nome do link"
                                value={newLink.nome}
                                onChange={(e) => setNewLink({ ...newLink, nome: e.target.value })}
                              />
                              <Input
                                placeholder="URL (ex: /form/gbc)"
                                value={newLink.url}
                                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleAddLink(product)}
                              >
                                Adicionar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingProduct(null);
                                  setNewLink({ tipo: "formulario", nome: "", url: "" });
                                }}
                              >
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => setEditingProduct(product.id)}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Adicionar Link
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AppLayout>
  );
}
