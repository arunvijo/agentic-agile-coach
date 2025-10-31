import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@supabase/supabase-js';
import LoginPage from './LoginPage';
import RegistrationPage from './RegisterPage';

// ---------- Utils ----------
export const handleLogout = async (
  toast: ReturnType<typeof useToast>['toast']
) => {
  await supabase.auth.signOut();
  toast({
    title: 'Logged out',
    description: 'See you next time!',
  });
};

// ---------- Auth hook (no roles) ----------
export const useAuthStatus = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setIsAuthReady(true);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsAuthReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, isAuthReady };
};

// ---------- Redirector (single dashboard) ----------
export const AuthRedirector = () => {
  const { user, isAuthReady } = useAuthStatus();

  if (!isAuthReady) {
    return (
      <div className="min-h-screen w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-background via-muted/40 to-background flex items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border bg-card px-5 py-3 shadow-sm">
          <Activity className="h-5 w-5 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Authenticating…</span>
        </div>
      </div>
    );
  }

  // If logged in → go to a single dashboard route
  if (user) return <Navigate to="/dashboard" replace />;

  // Not logged in → go to login
  return <Navigate to="/login" replace />;
};

// ---------- Auth pages index (modern wrapper) ----------
const AuthSurface: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-muted/40 via-background to-muted/30">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 p-6 shadow-lg">
          {children}
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  const path = window.location.pathname;
  if (path === '/register') {
    return (
      <AuthSurface>
        <RegistrationPage />
      </AuthSurface>
    );
  }

  // default: /login
  return (
    <AuthSurface>
      <LoginPage />
    </AuthSurface>
  );
};

export default Index;
