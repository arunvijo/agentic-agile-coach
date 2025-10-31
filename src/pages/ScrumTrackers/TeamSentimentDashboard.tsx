import { useState } from 'react';
import {
  AlertCircle, CheckCircle, Coffee, Users, Calendar, LogOut, MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { handleLogout } from '../Index';

const TeamSentimentDashboardPage = () => {
  const [selectedWeek, setSelectedWeek] = useState(4);
  const { toast } = useToast();

  // Mock user for header
  const user = { email: 'test.sm@example.com' };

  const weeklyData = {
    1: { sentiment: 4.2, attendance: 95, productivity: 98, absences: 0, trend: 'stable' },
    2: { sentiment: 3.8, attendance: 92, productivity: 95, absences: 1, trend: 'slight_decrease' },
    3: { sentiment: 3.3, attendance: 85, productivity: 88, absences: 2, trend: 'decreasing' },
    4: { sentiment: 2.7, attendance: 78, productivity: 72, absences: 3, trend: 'critical' },
  } as const;

  const currentData = weeklyData[selectedWeek as keyof typeof weeklyData];

  // Status banner color mapping (emerald = healthy, amber = moderate, rose = risk)
  const getStatus = (score: number) => {
    if (score >= 4.0) {
      return {
        label: 'Healthy',
        wrap: 'bg-emerald-600 text-emerald-50',
      };
    }
    if (score >= 3.0) {
      return {
        label: 'Moderate',
        wrap: 'bg-amber-500 text-white',
      };
    }
    return {
      label: 'At Risk',
      wrap: 'bg-rose-600 text-rose-50',
    };
  };
  const status = getStatus(currentData.sentiment);

  // Metric pill color mapping
  const metricPill = (tone: 'good' | 'warn' | 'bad') => {
    if (tone === 'good') return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    if (tone === 'warn') return 'bg-amber-50 text-amber-700 border border-amber-200';
    return 'bg-rose-50 text-rose-700 border border-rose-200';
  };

  const getMetricStatus = (metric: 'sentiment' | 'attendance' | 'productivity', value: number) => {
    const thresholds = {
      sentiment: { green: 4.0, yellow: 3.0 },
      attendance: { green: 90, yellow: 80 },
      productivity: { green: 95, yellow: 85 },
    } as const;

    const t = thresholds[metric];
    if (value >= t.green) return metricPill('good');
    if (value >= t.yellow) return metricPill('warn');
    return metricPill('bad');
  };

  const generateNudges = () => {
    const list: Array<{ type: 'urgent' | 'positive'; icon: JSX.Element; message: string; }> = [];
    if (currentData.sentiment < 3.0) {
      list.push({
        type: 'urgent',
        icon: <AlertCircle className="h-5 w-5" />,
        message: 'Team morale is low. Consider shortening sprints or a team-bonding activity.',
      });
    } else {
      list.push({
        type: 'positive',
        icon: <CheckCircle className="h-5 w-5" />,
        message: 'Team is stable. Keep up the great work!',
      });
    }
    return list;
  };
  const nudges = generateNudges();

  return (
    <div
      className="
        min-h-screen
        bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))]
        from-muted/40 via-background to-muted/30
      "
    >
      {/* Glassy header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-semibold tracking-tight">Team Sentiment Deep Dive</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Welcome, {user.email}</span>
            <Button
              onClick={() => handleLogout(toast)}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 p-6">
        {/* Sentiment meter */}
        <Card className="rounded-2xl border bg-card/80 shadow-md backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="text-3xl">Team Sentiment Meter</CardTitle>
                <CardDescription className="mt-2 text-base">
                  Real-time morale tracking & intelligent nudges
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <select
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(Number(e.target.value))}
                  className="rounded-lg border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={1}>Week 1 (Sprint Start)</option>
                  <option value={2}>Week 2</option>
                  <option value={3}>Week 3</option>
                  <option value={4}>Week 4 (Current)</option>
                </select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Status banner */}
            <div className={`${status.wrap} rounded-xl p-6 shadow-md transition-colors`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="mb-2 text-2xl font-bold">Status: {status.label}</h2>
                  <p className="text-lg">
                    Team Sentiment Score: {currentData.sentiment.toFixed(1)} / 5.0
                  </p>
                </div>
                <div className="text-6xl font-bold opacity-80">
                  {currentData.sentiment >= 4.0 ? '😊' : currentData.sentiment >= 3.0 ? '😐' : '😟'}
                </div>
              </div>
            </div>

            {/* Metric pills */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className={`${getMetricStatus('sentiment', currentData.sentiment)} rounded-xl p-4 transition-all`}>
                <p className="mb-1 text-sm font-medium">Team Sentiment</p>
                <p className="text-2xl font-bold">{currentData.sentiment.toFixed(1)}</p>
              </div>
              <div className={`${getMetricStatus('attendance', currentData.attendance)} rounded-xl p-4 transition-all`}>
                <p className="mb-1 text-sm font-medium">Attendance</p>
                <p className="text-2xl font-bold">{currentData.attendance}%</p>
              </div>
              <div className={`${getMetricStatus('productivity', currentData.productivity)} rounded-xl p-4 transition-all`}>
                <p className="mb-1 text-sm font-medium">Productivity</p>
                <p className="text-2xl font-bold">{currentData.productivity}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nudge feed & actions */}
        <Card className="rounded-2xl border bg-card/80 shadow-md backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <CardHeader>
            <CardTitle className="text-2xl">🔔 Nudge Feed & Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {nudges.map((nudge, idx) => {
              const isPositive = nudge.type === 'positive';
              const wrap =
                isPositive
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-rose-600 bg-rose-50';
              const iconTone = isPositive ? 'text-emerald-700' : 'text-rose-700';
              return (
                <div
                  key={idx}
                  className={`rounded-lg border-l-4 p-4 transition-colors ${wrap}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={iconTone}>{nudge.icon}</div>
                    <p className="font-semibold text-foreground">{nudge.message}</p>
                  </div>
                </div>
              );
            })}

            <div className="mt-4 grid grid-cols-1 gap-3 border-t border-border pt-4 md:grid-cols-3">
              <Button variant="outline" className="h-auto justify-start gap-2 rounded-xl py-3">
                <Coffee className="h-5 w-5 text-primary" />
                <span>Schedule Team Coffee Chat</span>
              </Button>
              <Button variant="outline" className="h-auto justify-start gap-2 rounded-xl py-3">
                <Users className="h-5 w-5 text-primary" />
                <span>Arrange 1:1 Check-ins</span>
              </Button>
              <Button variant="outline" className="h-auto justify-start gap-2 rounded-xl py-3">
                <MessageSquare className="h-5 w-5 text-primary" />
                <span>Start AI Retrospective Guide</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TeamSentimentDashboardPage;
