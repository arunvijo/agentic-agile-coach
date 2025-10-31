import { Link } from 'react-router-dom';
import {
  AlertCircle, LogOut, Activity, MessageSquare, Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { handleLogout } from './Index';

// Scrum Master Dashboard Page (Modern Data / Intelligence Theme)
const ScrumMasterDashboardPage = () => {
  const { toast } = useToast();
  const user = { email: 'test.sm@example.com' };

  // Dashboard status (placeholder)
  const sentimentStatus = {
    score: 2.7,
    label: 'At Risk',
    // using Tailwind colors for reliability across setups
    tone: 'bg-rose-600',
    emoji: '😟',
    message: 'Low morale detected. Check-in urgently.',
  };

  return (
    <div
      className="
        min-h-screen w-full
        bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))]
        from-muted/40 via-background to-muted/30
      "
    >
      {/* Header */}
      <header
        className="
          sticky top-0 z-10
          bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60
          border-b border-border
          shadow-sm
        "
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-semibold tracking-tight">Scrum Master Dashboard</h1>
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
        {/* Sentiment summary (glassy, on-brand) */}
        <div
          className={`
            relative mb-8 overflow-hidden rounded-3xl
            ${sentimentStatus.tone} text-white shadow-xl
          `}
        >
          <div
            className="
              pointer-events-none absolute -right-16 -top-16 h-56 w-56
              rounded-full bg-white/10 blur-3xl
            "
          />
          <div className="flex items-center justify-between gap-6 p-6 sm:p-8">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="text-2xl font-bold">Status: {sentimentStatus.label}</span>
              </div>
              <p className="text-lg/7 opacity-95">
                Team Sentiment Score: {sentimentStatus.score.toFixed(1)} / 5.0
              </p>
              <p className="mt-4 text-sm font-medium">
                💡 Action Needed: {sentimentStatus.message}
              </p>
            </div>
            <div className="text-6xl opacity-90">{sentimentStatus.emoji}</div>
          </div>
        </div>

        {/* Trackers */}
        <h2 className="mb-4 text-2xl font-bold tracking-tight">Drill-Down Trackers</h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Team Sentiment */}
          <Link
            to="/sm/sentiment"
            className="
              group block h-full transition-transform duration-200
              hover:scale-[1.02]
            "
          >
            <Card
              className="
                h-full rounded-2xl border shadow-md
                hover:border-primary
                transition-colors
                bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60
              "
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5 text-rose-600" />
                  Team Sentiment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2 text-3xl font-bold text-rose-600">2.7/5.0</div>
                <p className="text-sm text-muted-foreground">Morale Deep Dive</p>
              </CardContent>
            </Card>
          </Link>

          {/* AI Knowledge Keeper */}
          <Link
            to="/sm/ai-chat"
            className="
              group block h-full transition-transform duration-200
              hover:scale-[1.02]
            "
          >
            <Card
              className="
                h-full rounded-2xl border shadow-md
                hover:border-primary
                transition-colors
                bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60
              "
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  AI Knowledge Keeper
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2 text-3xl font-bold text-primary">Launch Chat</div>
                <p className="text-sm text-muted-foreground">Sprint Insights & Q&amp;A</p>
              </CardContent>
            </Card>
          </Link>

          {/* Sprint Risks & Health */}
          <Link
            to="/sm/action-center"
            className="
              group block h-full transition-transform duration-200
              hover:scale-[1.02]
            "
          >
            <Card
              className="
                h-full rounded-2xl border shadow-md
                hover:border-primary
                transition-colors
                bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60
              "
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  Sprint Risks &amp; Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2 text-3xl font-bold text-amber-500">3 Active</div>
                <p className="text-sm text-muted-foreground">Unresolved Alerts</p>
              </CardContent>
            </Card>
          </Link>

          {/* Ritual Adherence & Badges */}
          <Link
            to="/sm/rituals"
            className="
              group block h-full transition-transform duration-200
              hover:scale-[1.02]
            "
          >
            <Card
              className="
                h-full rounded-2xl border shadow-md
                hover:border-primary
                transition-colors
                bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60
              "
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="h-5 w-5 text-emerald-600" />
                  Ritual Adherence &amp; Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2 text-3xl font-bold text-emerald-600">82% Score</div>
                <p className="text-sm text-muted-foreground">Gamification Metrics</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* CTA */}
        <div className="mt-8">
          <Link to="/sm/ai-chat" className="block">
            <Button
              variant="outline"
              className="
                h-12 w-full justify-center gap-2 rounded-xl
                hover:shadow-lg active:scale-[0.99] transition-all
              "
            >
              <MessageSquare className="h-5 w-5" />
              Launch AI Knowledge Keeper
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default ScrumMasterDashboardPage;
