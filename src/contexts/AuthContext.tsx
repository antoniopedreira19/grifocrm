import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

type UserRole = 'admin' | 'closer' | 'sdr' | 'viewer';

interface CurrentUser {
  id: string;
  user_email: string;
  user_nome: string;
  user_role: UserRole;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  currentUser: CurrentUser | null;
  currentRole: UserRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithMagicLink: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  canEdit: (leadResponsavel?: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        // Defer RPC call with setTimeout to avoid deadlock
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile();
          }, 0);
        } else {
          setCurrentUser(null);
          setCurrentRole(null);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile();
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase.rpc('me');
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const profile = data[0];
        const userProfile: CurrentUser = {
          id: profile.id,
          user_email: profile.user_email,
          user_nome: profile.user_nome,
          user_role: profile.user_role as UserRole,
        };
        setCurrentUser(userProfile);
        setCurrentRole(userProfile.user_role);
      }
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      toast({
        title: 'Erro ao carregar perfil',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Erro ao fazer login',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const signInWithMagicLink = async (email: string) => {
    try {
      const redirectUrl = `${window.location.origin}/dashboard`;
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });
      
      if (error) throw error;
      
      toast({
        title: 'Link enviado!',
        description: 'Verifique seu e-mail para fazer login.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao enviar link',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setCurrentUser(null);
      setCurrentRole(null);
      navigate('/login');
    } catch (error: any) {
      toast({
        title: 'Erro ao fazer logout',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const canEdit = (leadResponsavel?: string): boolean => {
    if (!currentRole || !currentUser) return false;
    if (currentRole === 'admin') return true;
    if (currentRole === 'viewer') return false;
    if (currentRole === 'closer' || currentRole === 'sdr') {
      return leadResponsavel === currentUser.id;
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        currentUser,
        currentRole,
        loading,
        signIn,
        signInWithMagicLink,
        signOut,
        canEdit,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
