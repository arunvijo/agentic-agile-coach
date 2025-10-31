import React, { useState } from 'react';
import {
  AlertCircle, TrendingUp, TrendingDown, CheckCircle, Coffee,
  AlertTriangle, Users, Calendar, LogOut, MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { handleLogout } from '../Index';

const ActionCenterPage = () => {
  const [selectedWeek, setSelectedWeek] = useState(4);
  const { toast } = useToast();
  const mockUser = { email: 'test.scrum@example.com' };

  const weeklyData = {
    1: { sentiment: 4.2, attendance: 95, productivity: 98, absences: 0, trend: 'stable' },
    2: { sentiment: 3.8, attendance: 92, productivity: 95, absences: 1, trend: 'slight_decrease' },
    3: { sentiment: 3.3, attendance: 85, productivity: 88, absences: 2, trend: 'decreasing' },
    4: { sentiment: 2.7, attendance: 78, productivity: 72, absences: 3, trend: 'critical' },
  } as const;

  const currentData = weeklyData[selectedWeek as keyof typeof weeklyData];

  // Status banner styles (emerald = healthy, amber = moderate, rose = risk)
  const getStatus = (score: number) => {
    if (score >= 4.0) return { label: 'Healthy', wrap: 'bg-emerald-600 text-emerald-50' };
    if (score >= 3.0) return { label: 'Moderate', wrap: 'bg-amber-500 text-white' };
    return { label: 'At Risk', wrap: 'bg-rose-600 text-rose-50' };
  };
  const status = getStatus(currentData.sentiment);

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
    const nudges: Array<{
      type: 'positive' | 'attention' | 'urgent';
      icon: JSX.Element;
      message: string;
      action?: string;
      priority: 'low' | 'medium' | 'high';
    }> = [];

    if (currentData.sentiment >= 4.0) {
      if (currentData.productivity >= 95 && currentData.attendance > 90) {
        nudges.push({
          type: 'positive',
          icon: <CheckCircle className="h-5 w-5" />,
          message: 'Team morale and productivity are in a good state 🎉',
          priority: 'low',
        });
      }
    } else if (currentData.sentiment >= 3.0) {
      nudges.push({
        type: 'attention',
        icon: <AlertTriangle className="h-5 w-5" />,
        message: 'Moderate morale detected. Stress signals may be present.',
        action: 'Consider quick pulse check during standup.',
        priority: 'medium',
      });
    } else {
      nudges.push({
        type: 'urgent',
        icon: <AlertCircle className="h-5 w-5" />,
        message: 'Team morale is low. Burnout risk detected.',
        action: 'Urgently check in with the team. Consider workload redistribution.',
        priority: 'high',
      });
    }

    if (selectedWeek > 1) {
      const prevSentiment = weeklyData[(selectedWeek - 1) as keyof typeof weeklyData].sentiment;
      const drop = prevSentiment - currentData.sentiment;
      if (drop >= 1.5) {
        nudges.push({
          type: 'urgent',
          icon: <TrendingDown className="h-5 w-5" />,
          message: 'Sudden morale drop detected 🚨',
          action: 'Recommend immediate check-in with team.',
          priority: 'high',
        });
      }
    }
    return nudges;
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
          <h1 className="text-2xl font-semibold tracking-tight">
            Sentiment Diagnostics &amp; Action Center
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Welcome, {mockUser.email}</span>
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
            {/* Overall Status */}
            <div className={`${status.wrap} rounded-xl p-6 shadow-md`}>
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

            {/* Key Metrics */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className={`${getMetricStatus('sentiment', currentData.sentiment)} rounded-xl p-4`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-sm font-medium">Team Sentiment</p>
                    <p className="text-2xl font-bold">{currentData.sentiment.toFixed(1)}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 opacity-50" />
                </div>
                <div className="mt-2 text-xs">Target: ≥4.0</div>
              </div>

              <div className={`${getMetricStatus('attendance', currentData.attendance)} rounded-xl p-4`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-sm font-medium">Attendance</p>
                    <p className="text-2xl font-bold">{currentData.attendance}%</p>
                  </div>
                  <Users className="h-8 w-8 opacity-50" />
                </div>
                <div className="mt-2 text-xs">Target: &gt;90%</div>
              </div>

              <div className={`${getMetricStatus('productivity', currentData.productivity)} rounded-xl p-4`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-sm font-medium">Productivity</p>
                    <p className="text-2xl font-bold">{currentData.productivity}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 opacity-50" />
                </div>
                <div className="mt-2 text-xs">Target: &gt;95%</div>
              </div>
            </div>

            {/* 4-Week Trend (bars with unified palette) */}
            <div className="rounded-xl bg-muted p-6">
              <h3 className="mb-6 text-lg font-semibold text-foreground">4-Week Sentiment Trend</h3>
              <div className="flex h-40 items-end justify-around px-4">
                {Object.entries(weeklyData).map(([week, data]) => {
                  const heightPercentage = (data.sentiment / 5) * 100;
                  const barColor =
                    data.sentiment >= 4.0
                      ? 'bg-emerald-500'
                      : data.sentiment >= 3.0
                        ? 'bg-amber-500'
                        : 'bg-rose-500';

                  return (
                    <div key={week} className="flex max-w-[100px] flex-1 flex-col items-center">
                      <div className="relative flex h-32 w-full items-end justify-center">
                        <div
                          className={`w-16 rounded-t-lg transition-all ${selectedWeek === Number(week) ? 'ring-4 ring-primary shadow-lg' : ''} ${barColor}`}
                          style={{
                            height: `${Math.max(heightPercentage, 5)}%`,
                            minHeight: '20px',
                          }}
                        >
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-bold text-foreground">
                            {data.sentiment.toFixed(1)}
                          </div>
                        </div>
                      </div>
                      <p className="mt-2 text-xs font-medium text-muted-foreground">Week {week}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nudge Feed & Quick Actions */}
        <Card className="rounded-2xl border bg-card/80 shadow-md backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <CardHeader>
            <CardTitle className="text-2xl">🔔 Nudge Feed &amp; Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-3">
              {nudges.map((nudge, index) => {
                const toneWrap =
                  nudge.type === 'positive'
                    ? 'border-emerald-500 bg-emerald-50'
                    : nudge.type === 'attention'
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-rose-600 bg-rose-50';

                const iconTone =
                  nudge.type === 'positive'
                    ? 'text-emerald-700'
                    : nudge.type === 'attention'
                      ? 'text-amber-700'
                      : 'text-rose-700';

                const priorityWrap =
                  nudge.priority === 'high'
                    ? 'bg-rose-100 text-rose-700'
                    : nudge.priority === 'medium'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700';

                return (
                  <div key={index} className={`rounded-lg border-l-4 p-4 ${toneWrap}`}>
                    <div className="flex items-start gap-3">
                      <div className={iconTone}>{nudge.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-foreground">{nudge.message}</p>
                          <span className={`rounded-full px-2 py-1 text-xs ${priorityWrap}`}>
                            {nudge.priority.toUpperCase()}
                          </span>
                        </div>
                        {nudge.action && (
                          <p className="mt-2 text-sm text-muted-foreground">
                            <strong>Suggested Action:</strong> {nudge.action}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

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

        {/* Thresholds Reference */}
        <Card className="rounded-2xl border bg-card/80 shadow-md backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <CardHeader>
            <CardTitle className="text-xl">📊 Threshold Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-muted-foreground">Metric</th>
                    <th className="px-4 py-2 text-center font-semibold text-emerald-700">🟢 Green</th>
                    <th className="px-4 py-2 text-center font-semibold text-amber-700">🟡 Yellow</th>
                    <th className="px-4 py-2 text-center font-semibold text-rose-700">🔴 Red</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-2">Team Sentiment (avg)</td>
                    <td className="px-4 py-2 text-center">≥4.0</td>
                    <td className="px-4 py-2 text-center">3.0–3.9</td>
                    <td className="px-4 py-2 text-center">&lt;3.0</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Attendance</td>
                    <td className="px-4 py-2 text-center">&gt;90%</td>
                    <td className="px-4 py-2 text-center">80–90%</td>
                    <td className="px-4 py-2 text-center">&lt;80%</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Productivity</td>
                    <td className="px-4 py-2 text-center">&gt;95%</td>
                    <td className="px-4 py-2 text-center">85–95%</td>
                    <td className="px-4 py-2 text-center">&lt;85%</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Mood Drop (week-to-week)</td>
                    <td className="px-4 py-2 text-center">&lt;0.5</td>
                    <td className="px-4 py-2 text-center">0.5–1.4</td>
                    <td className="px-4 py-2 text-center">≥1.5</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ActionCenterPage;
