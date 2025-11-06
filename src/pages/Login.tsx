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
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      
      <Card className="w-full max-w-md relative z-10 shadow-2xl border-grifo-gold/20 bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="flex justify-center">
            <img src={grifoLogo} alt="Grifo Logo" className="h-20 drop-shadow-lg" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-grifo-gold to-grifo-gold/80 bg-clip-text text-transparent">
            Bem-vindo ao Grifo CRM
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Entre com sua conta para continuar
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-8">
          <form onSubmit={handleEmailLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 bg-background/50 border-border/50 focus:border-grifo-gold/50 focus:ring-grifo-gold/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 bg-background/50 border-border/50 focus:border-grifo-gold/50 focus:ring-grifo-gold/20"
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
