import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye } from 'lucide-react';

export function ReadOnlyBanner() {
  const { currentRole } = useAuth();

  if (currentRole !== 'viewer') return null;

  return (
    <Alert className="rounded-none border-x-0 border-t-0 bg-muted/50">
      <Eye className="h-4 w-4" />
      <AlertDescription>
        Acesso: somente leitura
      </AlertDescription>
    </Alert>
  );
}
