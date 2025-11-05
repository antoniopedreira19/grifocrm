import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toZonedTime } from "date-fns-tz/toZonedTime";
import { MessageSquare, Send } from "lucide-react";

interface LeadCommentsTabProps {
  interactions: any[];
  isLoading: boolean;
  canComment: boolean;
  onAddComment: (comment: string) => Promise<void>;
  getUserName: (userId: string) => string;
  currentUserId?: string;
}

export function LeadCommentsTab({
  interactions,
  isLoading,
  canComment,
  onAddComment,
  getUserName,
  currentUserId,
}: LeadCommentsTabProps) {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddComment(newComment);
      setNewComment("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const zonedDate = toZonedTime(date, "America/Sao_Paulo");
    return formatDistanceToNow(zonedDate, {
      addSuffix: true,
      locale: ptBR,
    });
  };

  return (
    <div className="space-y-4">
      {/* Input de novo comentário */}
      {canComment ? (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <Textarea
                placeholder="Escrever um comentário..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px]"
                disabled={isSubmitting}
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleSubmit}
                  disabled={!newComment.trim() || isSubmitting}
                  size="sm"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Enviar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Alert>
          <AlertDescription>
            Você não tem permissão para comentar neste lead.
          </AlertDescription>
        </Alert>
      )}

      {/* Lista de comentários */}
      <div className="space-y-3">
        {isLoading ? (
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        ) : interactions.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Nenhum comentário ainda</p>
                <p className="text-sm mt-1">Seja o primeiro a comentar!</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          interactions.map((interaction) => (
            <Card key={interaction.id}>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-primary">
                      {getUserName(interaction.autor).charAt(0).toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">
                        {getUserName(interaction.autor)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        • {formatDate(interaction.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {interaction.conteudo}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
