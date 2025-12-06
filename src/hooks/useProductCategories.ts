import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProductConfig {
  produto: string;
  categoria: string;
}

export function useProductCategories() {
  const { data: productsConfig = [], isLoading } = useQuery({
    queryKey: ["products-config"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products_config")
        .select("produto, categoria");

      if (error) throw error;
      return data as ProductConfig[];
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const getProductsByCategory = (categoria: string): string[] => {
    return productsConfig
      .filter((p) => p.categoria === categoria)
      .map((p) => p.produto);
  };

  const getCategoryByProduct = (produto: string): string | undefined => {
    return productsConfig.find((p) => p.produto === produto)?.categoria;
  };

  return {
    productsConfig,
    isLoading,
    getProductsByCategory,
    getCategoryByProduct,
  };
}
