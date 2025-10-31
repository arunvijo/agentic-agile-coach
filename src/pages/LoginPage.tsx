import { useNavigate } from 'react-router-dom';
import { Activity, Users, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleQuickLogin = (role: 'sm' | 'adm') => {
    const path = role === 'sm' ? '/sm-dashboard' : '/adm-dashboard';
    navigate(path);
  };

  return (
    <div
      className="
        min-h-screen w-full
        bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))]
        from-muted/40 via-background to-muted/30
        flex items-center justify-center p-4
      "
    >
      <Card
        className="
          w-full max-w-lg
          rounded-3xl
          border
          bg-card/80
          backdrop-blur supports-[backdrop-filter]:bg-card/60
          shadow-xl
          transition-transform duration-200
          hover:shadow-2xl
        "
      >
        <CardHeader className="text-center space-y-3">
          <div
            className="
              mx-auto h-16 w-16
              rounded-2xl
              bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]
              from-primary/90 via-primary to-primary/80
              flex items-center justify-center
              shadow-md
            "
            aria-hidden="true"
          >
            <Activity className="h-8 w-8 text-primary-foreground animate-pulse" />
          </div>

          <CardTitle className="text-2xl font-bold tracking-tight">
            Agentic AI Coach — Access
          </CardTitle>

          <CardDescription className="text-base">
            Use the quick launch to simulate access and preview dashboards.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-3">
            <Button
              onClick={() => handleQuickLogin('sm')}
              className="
                h-12 w-full gap-3
                rounded-xl
                bg-emerald-600 hover:bg-emerald-600/90
                text-white
                shadow-md hover:shadow-lg
                active:scale-[0.99]
                transition-all
              "
            >
              <Users className="h-5 w-5" />
              Launch as Scrum Master
            </Button>

            <Button
              onClick={() => handleQuickLogin('adm')}
              className="
                h-12 w-full gap-3
                rounded-xl
                bg-primary hover:bg-primary/90
                text-primary-foreground
                shadow-md hover:shadow-lg
                active:scale-[0.99]
                transition-all
              "
            >
              <MapPin className="h-5 w-5" />
              Launch as ADM (Agile Delivery Manager)
            </Button>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute inset-0 mx-8 border-t border-border/60" />
            <div className="relative flex justify-center">
              <span className="bg-card/80 px-3 text-xs text-muted-foreground">
                or
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/register')}
              className="
                text-sm font-medium
                text-muted-foreground hover:text-foreground
                underline-offset-4 hover:underline
                transition-colors
              "
            >
              Go to Registration (UI Test)
            </button>

            <div className="text-xs text-muted-foreground">
              Theme: <span className="font-medium">Modern Data / Intelligence</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
