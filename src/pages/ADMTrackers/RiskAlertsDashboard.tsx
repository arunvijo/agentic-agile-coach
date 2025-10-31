import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle, TrendingDown, Clock, Bug, Users, CheckCircle, X, Eye, Bell, BellOff, Archive, LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { handleLogout, useAuthStatus } from '../Index';

// Minimal keyframes only for slide-in (no color overrides)
const SlideInKeyframes = (
  <style>
    {`
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      .animate-slide-in { animation: slideIn 0.3s ease-out forwards; }
    `}
  </style>
);

type Risk = {
  id: number;
  type: string;
  team: string;
  severity: 'High' | 'Medium' | 'Low';
  detectedOn: string;
  trend: 'Downward' | 'Flat' | 'Upward';
  status: 'active' | 'reviewed' | 'snoozed';
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description: string;
  metric: string;
  aiInsight: string;
  suggestedAction: string;
  snoozedUntil?: Date;
  reviewedAt?: Date;
};

const RiskAlertsDashboard = () => {
  const [showNotification, setShowNotification] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);

  const { user, isAuthReady } = useAuthStatus();
  const { toast } = useToast();

  const [risks, setRisks] = useState<Risk[]>([
    {
      id: 1,
      type: 'Velocity drop',
      team: 'Alpha',
      severity: 'High',
      detectedOn: '2 Oct',
      trend: 'Downward',
      status: 'active',
      icon: TrendingDown,
      description: "Team Alpha's velocity dropped by 18% in Sprint 6 and 20% in Sprint 7.",
      metric: 'Velocity decreased by 20%',
      aiInsight:
        'Historical pattern shows 70% probability of sprint delay if velocity drops >15% for 2 consecutive sprints.',
      suggestedAction: 'Recommend retrospective focus on capacity planning.',
    },
    {
      id: 2,
      type: 'Blockers > 3',
      team: 'Delta',
      severity: 'Medium',
      detectedOn: '1 Oct',
      trend: 'Flat',
      status: 'active',
      icon: Clock,
      description: '4 blockers unresolved for over 2 days in Sprint 8.',
      metric: '4 blockers (>48 hours)',
      aiInsight:
        'Teams with >3 blockers for 2+ days experience 60% increase in sprint carryover.',
      suggestedAction: 'Auto-schedule blocker review stand-up.',
    },
    {
      id: 3,
      type: 'Test failures',
      team: 'Beta',
      severity: 'Low',
      detectedOn: '3 Oct',
      trend: 'Upward',
      status: 'active',
      icon: Bug,
      description: 'Automated test failures up by 15% this week.',
      metric: 'Test failures +15%',
      aiInsight:
        'Rising test failures correlate with 45% higher bug escape rate to production.',
      suggestedAction: 'Send quality risk summary to QA Manager.',
    },
  ]);

  const activeRisks = risks.filter((r) => r.status === 'active');
  const reviewedRisks = risks.filter((r) => r.status === 'reviewed');

  const handleSnooze = (riskId: number) => {
    setRisks((prev) =>
      prev.map((r) =>
        r.id === riskId ? { ...r, status: 'snoozed', snoozedUntil: new Date(Date.now() + 86400000) } : r
      )
    );
    toast({ title: 'Risk Snoozed', description: `Risk ID ${riskId} snoozed for 24 hours.` });
    setShowNotification(false);
    setShowDetailsModal(false);
  };

  const handleReview = (riskId: number) => {
    setRisks((prev) =>
      prev.map((r) => (r.id === riskId ? { ...r, status: 'reviewed', reviewedAt: new Date() } : r))
    );
    toast({ title: 'Risk Reviewed', description: `Risk ID ${riskId} marked as reviewed.` });
    setShowDetailsModal(false);
  };

  const handleViewDetails = (risk: Risk) => {
    setSelectedRisk(risk);
    setShowDetailsModal(true);
    setShowNotification(false);
  };

  const severityPill = (severity: Risk['severity']) => {
    switch (severity) {
      case 'High':
        return 'border-rose-600 text-rose-600';
      case 'Medium':
        return 'border-amber-500 text-amber-600';
      case 'Low':
        return 'border-amber-300 text-amber-700';
      default:
        return 'border-border text-muted-foreground';
    }
  };

  const severityIconColor = (severity: Risk['severity']) => {
    switch (severity) {
      case 'High':
        return 'text-rose-600';
      case 'Medium':
        return 'text-amber-500';
      case 'Low':
        return 'text-amber-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const trendTone = (trend: Risk['trend']) =>
    trend === 'Downward' ? 'text-rose-600' : trend === 'Upward' ? 'text-amber-600' : 'text-foreground';

  // Guard (consistent with other pages)
  if (!isAuthReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-muted/40 via-background to-muted/30">
        <div className="rounded-2xl border bg-card/80 px-5 py-3 text-muted-foreground shadow-sm backdrop-blur">
          Loading Risk Dashboard…
        </div>
      </div>
    );
  }
  if (!user) return <div />;

  return (
    <div
      className="
        min-h-screen w-full
        bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))]
        from-muted/40 via-background to-muted/30
      "
    >
      {SlideInKeyframes}

      {/* Header (glassy) */}
      <header
        className="
          sticky top-0 z-10
          border-b border-border
          bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60
          shadow-sm
        "
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-semibold tracking-tight">Risk Alerts Dashboard</h1>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              Welcome, {user?.email}
            </span>

            <div className="relative">
              {activeRisks.length > 0 ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-10 w-10"
                  onClick={() => setShowNotification((s) => !s)}
                >
                  <Bell className="h-6 w-6 text-rose-600 animate-pulse" />
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white">
                    {activeRisks.length}
                  </span>
                </Button>
              ) : (
                <Button variant="ghost" size="icon" className="h-10 w-10 cursor-default">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </Button>
              )}
            </div>

            <Button onClick={() => handleLogout(useToast().toast)} variant="outline" size="sm" className="gap-2 rounded-xl">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 p-6">
        {/* Slide-in Notification */}
        {showNotification && activeRisks.length > 0 && (
          <Card
            className="
              fixed right-6 top-20 z-50 w-96 animate-slide-in
              rounded-2xl border shadow-2xl
              bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/70
            "
          >
            <CardHeader className="flex items-start justify-between gap-3 border-b p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-rose-600" />
                <CardTitle className="text-lg">Early Risk Alerts Detected</CardTitle>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowNotification(false)} className="h-6 w-6">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 p-4">
              <div className="mb-2 space-y-2">
                {activeRisks.map((risk) => (
                  <div key={risk.id} className="flex items-center gap-2 text-sm">
                    <risk.icon className={`h-4 w-4 ${severityIconColor(risk.severity)}`} />
                    <span>{risk.type} (Team {risk.team})</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleViewDetails(activeRisks[0])} className="flex-1 rounded-xl">
                  View Details
                </Button>
                <Button onClick={() => handleSnooze(activeRisks[0].id)} variant="outline" className="flex-1 rounded-xl">
                  Snooze 1 Day
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 3-column overview */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Summary */}
          <Card className="rounded-2xl bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Risk Status Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Active Risks</span>
                <span className="text-2xl font-bold text-rose-600">{activeRisks.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Reviewed</span>
                <span className="text-2xl font-bold text-emerald-600">{reviewedRisks.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Sprint Health</span>
                <span className="text-2xl font-bold text-primary">85%</span>
              </div>
            </CardContent>
          </Card>

          {/* Team Overview */}
          <Card className="rounded-2xl bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Team Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-md bg-rose-50 p-2">
                <span className="font-medium">Team Alpha</span>
                <span className="text-sm text-rose-600">⚠️ At Risk</span>
              </div>
              <div className="flex items-center justify-between rounded-md bg-amber-50 p-2">
                <span className="font-medium">Team Delta</span>
                <span className="text-sm text-amber-600">⚠️ At Risk</span>
              </div>
              <div className="flex items-center justify-between rounded-md bg-amber-50/80 p-2">
                <span className="font-medium">Team Beta</span>
                <span className="text-sm text-amber-600">⚠️ At Risk</span>
              </div>
              <div className="flex items-center justify-between rounded-md bg-emerald-50 p-2">
                <span className="font-medium">Team Charlie</span>
                <span className="text-sm text-emerald-600">✅ Stable</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="rounded-2xl bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start rounded-xl text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Schedule Retrospective
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start rounded-xl text-amber-600 hover:bg-amber-500 hover:text-white transition-colors"
              >
                Review Blockers
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start rounded-xl text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors"
              >
                View Sprint Reports
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Risk Alerts Table */}
        <Card className="rounded-2xl bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <CardHeader>
            <CardTitle className="text-xl">Active Risk Alerts</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {activeRisks.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 bg-muted/50">
                      <th className="py-3 px-4 text-left text-sm font-semibold text-muted-foreground">Risk</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-muted-foreground">Team</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-muted-foreground">Severity</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-muted-foreground">Detected On</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-muted-foreground">Trend</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeRisks.map((risk) => (
                      <tr key={risk.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <risk.icon className={`h-5 w-5 ${severityIconColor(risk.severity)}`} />
                            <span className="font-medium">{risk.type}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">{risk.team}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${severityPill(
                              risk.severity
                            )}`}
                          >
                            {risk.severity === 'High' ? '🔴' : risk.severity === 'Medium' ? '🟠' : '🟡'}{' '}
                            {risk.severity}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{risk.detectedOn}</td>
                        <td className="py-3 px-4">
                          <span className={`text-sm ${trendTone(risk.trend)}`}>
                            {risk.trend === 'Downward' ? '↓' : risk.trend === 'Upward' ? '↑' : '→'} {risk.trend}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleViewDetails(risk)}
                              variant="ghost"
                              size="icon"
                              className="rounded-xl text-primary hover:bg-primary/10"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => handleReview(risk.id)}
                              variant="ghost"
                              size="icon"
                              className="rounded-xl text-emerald-600 hover:bg-emerald-600/10"
                              title="Mark as Reviewed"
                            >
                              <Archive className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => handleSnooze(risk.id)}
                              variant="ghost"
                              size="icon"
                              className="rounded-xl text-muted-foreground hover:bg-muted/10"
                              title="Snooze"
                            >
                              <BellOff className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center">
                <CheckCircle className="mx-auto mb-4 h-16 w-16 text-emerald-600" />
                <h3 className="mb-2 text-xl font-semibold">All Clear!</h3>
                <p className="text-muted-foreground">No significant delivery risks detected this sprint.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Details Modal */}
      {showDetailsModal && selectedRisk && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl">
            <CardHeader className="sticky top-0 flex flex-row items-center justify-between border-b bg-card/95 p-6 backdrop-blur">
              <CardTitle className="text-2xl">Risk Insights: {selectedRisk.type}</CardTitle>
              <Button onClick={() => setShowDetailsModal(false)} variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </CardHeader>

            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Selected Risk Details */}
                <Card className="border-primary/40 bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <selectedRisk.icon className={`mt-1 h-10 w-10 ${severityIconColor(selectedRisk.severity)}`} />
                      <div className="flex-1">
                        <h3 className="mb-2 text-xl font-bold">
                          {selectedRisk.type} — Team {selectedRisk.team}
                        </h3>
                        <p className="mb-3 text-muted-foreground">{selectedRisk.description}</p>
                        <div className="flex flex-wrap gap-2 text-sm">
                          <span className={`rounded-full border px-3 py-1 font-semibold ${severityPill(selectedRisk.severity)}`}>
                            {selectedRisk.severity} Severity
                          </span>
                          <span className="rounded-full border px-3 py-1 text-muted-foreground">Detected: {selectedRisk.detectedOn}</span>
                          <span className="rounded-full border px-3 py-1 text-muted-foreground">Trend: {selectedRisk.trend}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Insight */}
                <Card className="border-secondary bg-secondary/30">
                  <CardContent className="p-4">
                    <h4 className="mb-2 flex items-center gap-2 font-bold">
                      <span className="text-primary">🤖</span> AI-Powered Insight
                    </h4>
                    <p>{selectedRisk.aiInsight}</p>
                  </CardContent>
                </Card>

                {/* Suggested Action */}
                <Card className="border-emerald-500/50 bg-emerald-50">
                  <CardContent className="p-4">
                    <h4 className="mb-2 flex items-center gap-2 font-bold text-emerald-700">
                      <span>💡</span> Suggested Action
                    </h4>
                    <p className="mb-4">{selectedRisk.suggestedAction}</p>
                    <Button onClick={() => handleReview(selectedRisk.id)} className="rounded-xl bg-emerald-600 text-white hover:bg-emerald-600/90">
                      Mark as Reviewed &amp; Take Action
                    </Button>
                  </CardContent>
                </Card>

                {/* Metric Visualization Placeholder */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Metric Trend</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex h-48 items-center justify-center rounded-lg border border-dashed bg-muted text-muted-foreground">
                      <div className="text-center">
                        <TrendingDown className="mx-auto mb-2 h-16 w-16 text-rose-600" />
                        <p className="font-semibold">{selectedRisk.metric}</p>
                        <p className="mt-2 text-sm text-muted-foreground">Trend visualization placeholder</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RiskAlertsDashboard;
