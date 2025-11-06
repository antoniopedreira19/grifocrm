import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import grifoLogo from '@/assets/grifo-logo.png';
import grifoBackground from '@/assets/grifo-login-background.jpg';

export default function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (error) {
      // Error handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `url(${grifoBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-black/40" />
      
      <Card className="w-full max-w-md relative z-10 shadow-2xl border-0 bg-white">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="flex justify-center">
            <img 
              src={grifoLogo} 
              alt="Grifo Logo" 
              className="h-24"
              style={{
                filter: 'drop-shadow(0 4px 8px rgba(184, 134, 11, 0.4)) drop-shadow(0 8px 16px rgba(184, 134, 11, 0.3)) brightness(1.1) contrast(1.1)',
              }}
            />
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">
            Bem-vindo ao Grifo CRM
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Entre com sua conta para continuar
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-8">
          <form onSubmit={handleEmailLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 border-input focus:border-grifo-gold focus:ring-grifo-gold/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 border-input focus:border-grifo-gold focus:ring-grifo-gold/20"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-11 text-base font-semibold bg-grifo-gold hover:bg-grifo-gold/90 text-white shadow-lg hover:shadow-xl transition-all duration-200" 
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
