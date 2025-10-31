import { Link } from 'react-router-dom';
import { AlertCircle, LogOut, Clock, Users, MapPin, Lock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { handleLogout } from './Index';

const ADMDashboardPage = () => {
  const { toast } = useToast();
  const user = { email: 'test.adm@example.com' };

  return (
    <div
      className="
        min-h-screen w-full
        bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))]
        from-muted/40 via-background to-muted/30
      "
    >
      {/* Header (glassy) */}
      <header
        className="
          sticky top-0 z-10
          bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60
          border-b border-border shadow-sm
        "
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-semibold tracking-tight">ADM Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Welcome, {user.email}</span>
            <Button
              onClick={() => handleLogout(toast)}
              variant="outline"
              size="sm"
              className="gap-2 rounded-xl"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl p-6">
        <h2 className="mb-4 text-2xl font-bold tracking-tight">Portfolio &amp; Program Trackers</h2>

        {/* Trackers */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Delivery Status & Alerts */}
          <Link to="/adm/risks" className="group block h-full transition-transform duration-200 hover:scale-[1.02]">
            <Card className="h-full rounded-2xl border shadow-md hover:border-primary transition-colors bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertCircle className="h-5 w-5 text-rose-600" />
                  Delivery Status &amp; Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-3xl font-bold text-rose-600">HIGH Risk</div>
                <p className="text-sm text-muted-foreground">2 Active Incidents (Click for details)</p>
              </CardContent>
            </Card>
          </Link>

          {/* Delivery Countdown */}
          <Link to="/adm/tracker" className="group block h-full transition-transform duration-200 hover:scale-[1.02]">
            <Card className="h-full rounded-2xl border shadow-md hover:border-primary transition-colors bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5 text-primary" />
                  Delivery Countdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-3xl font-bold text-primary">12 Days</div>
                <p className="text-sm text-muted-foreground">To Major Milestone</p>
              </CardContent>
            </Card>
          </Link>

          {/* Team Bandwidth */}
          <Link to="/adm/capacity" className="group block h-full transition-transform duration-200 hover:scale-[1.02]">
            <Card className="h-full rounded-2xl border shadow-md hover:border-primary transition-colors bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5 text-amber-500" />
                  Team Bandwidth
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-3xl font-bold text-amber-500">80% Capacity</div>
                <p className="text-sm text-muted-foreground">3 PTO next week (Click for team deep-dive)</p>
              </CardContent>
            </Card>
          </Link>

          {/* Dependency Heatmap */}
          <Link to="/adm/dependencies" className="group block h-full transition-transform duration-200 hover:scale-[1.02]">
            <Card className="h-full rounded-2xl border shadow-md hover:border-primary transition-colors bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                  Dependency Heatmap
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-3xl font-bold text-primary">Medium Risk</div>
                <p className="text-sm text-muted-foreground">AI Suggests Path Split</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 border-t border-border pt-6">
          <h3 className="mb-4 text-xl font-bold tracking-tight">Quick ADM Actions</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Button className="h-auto justify-start gap-2 rounded-xl py-3 hover:shadow-lg active:scale-[0.99] transition-all">
              <Zap className="h-5 w-5" />
              Generate Mitigation Plan
            </Button>
            <Button className="h-auto justify-start gap-2 rounded-xl py-3 hover:shadow-lg active:scale-[0.99] transition-all">
              <Zap className="h-5 w-5" />
              Generate Stakeholder Report
            </Button>
            <Button variant="outline" className="h-auto justify-start gap-2 rounded-xl py-3 hover:shadow-lg active:scale-[0.99] transition-all">
              <Lock className="h-5 w-5" />
              Lock Capacity Next Sprint
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ADMDashboardPage;
