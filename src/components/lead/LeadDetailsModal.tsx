import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { LeadInfoTab } from "./LeadInfoTab";
import { LeadCommentsTab } from "./LeadCommentsTab";

interface LeadDetailsModalProps {
  leadId: string | null;
  open: boolean;
  onClose: () => void;
}

export function LeadDetailsModal({ leadId, open, onClose }: LeadDetailsModalProps) {
  const { currentUser, currentRole } = useAuth();
  const queryClient = useQueryClient();

  // Fetch lead details
  const { data: lead, isLoading } = useQuery({
    queryKey: ["lead-details", leadId],
    queryFn: async () => {
      if (!leadId) return null;
      
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("id", leadId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!leadId && open,
  });

  // Fetch interactions
  const { data: interactions = [], isLoading: isLoadingInteractions } = useQuery({
    queryKey: ["lead-interactions", leadId],
    queryFn: async () => {
      if (!leadId) return [];
      
      const { data, error } = await supabase
        .from("interacoes")
        .select("*")
        .eq("lead_id", leadId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!leadId && open,
  });

  // Fetch user names for interactions
  const { data: users = [] } = useQuery({
    queryKey: ["users-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("app_users")
        .select("id, user_nome");

      if (error) throw error;
      return data;
    },
  });

  // Setup realtime subscription for interactions
  useEffect(() => {
    if (!leadId || !open) return;

    const channel = supabase
      .channel(`lead-interactions-${leadId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "interacoes",
          filter: `lead_id=eq.${leadId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["lead-interactions", leadId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [leadId, open, queryClient]);

  // Create interaction mutation
  const createInteractionMutation = useMutation({
    mutationFn: async (conteudo: string) => {
      const { error } = await supabase
        .from("interacoes")
        .insert({
          lead_id: leadId,
          tipo: "comentario",
          conteudo,
          autor: currentUser?.id,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead-interactions", leadId] });
      toast({ title: "Comentário adicionado com sucesso!" });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao adicionar comentário",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAddComment = async (comment: string) => {
    await createInteractionMutation.mutateAsync(comment);
  };

  // Check permissions
  const canComment = () => {
    if (!currentRole || !currentUser) return false;
    if (currentRole === "viewer") return false;
    if (currentRole === "admin") return true;
    if (currentRole === "closer" || currentRole === "sdr") {
      return lead?.responsavel === currentUser.id;
    }
    return false;
  };

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user?.user_nome || "Usuário desconhecido";
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-2xl">
            {isLoading ? <Skeleton className="h-8 w-64" /> : `Detalhes do Lead: ${lead?.nome}`}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-[400px] w-full" />
          </div>
        ) : lead ? (
          <Tabs defaultValue="info" className="flex-1">
            <TabsList className="w-full justify-start border-b rounded-none px-6">
              <TabsTrigger value="info">Informações</TabsTrigger>
              <TabsTrigger value="comments">
                Comentários ({interactions.length})
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[calc(90vh-180px)]">
              <TabsContent value="info" className="m-0 p-6">
                <LeadInfoTab lead={lead} />
              </TabsContent>

              <TabsContent value="comments" className="m-0 p-6">
                <LeadCommentsTab
                  interactions={interactions}
                  isLoading={isLoadingInteractions}
                  canComment={canComment()}
                  onAddComment={handleAddComment}
                  getUserName={getUserName}
                  currentUserId={currentUser?.id}
                />
              </TabsContent>
            </ScrollArea>
          </Tabs>
        ) : (
          <div className="p-6 text-center text-muted-foreground">
            Lead não encontrado
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
