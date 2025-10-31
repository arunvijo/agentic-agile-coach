import React, { useState, useEffect } from 'react';
import {
  Calendar, Users, AlertTriangle, CheckCircle, TrendingUp, Download, LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { handleLogout } from '../Index';
import { useToast } from '@/hooks/use-toast';

const TeamCapacityTracker = () => {
  const [step, setStep] = useState<'loading' | 'dashboard'>('loading');
  const [showPopup, setShowPopup] = useState<string | null>(null);
  const [teamData, setTeamData] = useState<any[]>([]);
  const [avgBandwidth, setAvgBandwidth] = useState(0);
  const [adjustedCapacity, setAdjustedCapacity] = useState(0);
  const managerName = 'Sarah Mitchell (ADM)';
  const { toast } = useToast();

  // Sample team data
  const initialTeamData = [
    { name: 'Alex Chen', bandwidth: 85, onLeave: false, leaveDate: '', skills: 'Frontend' },
    { name: 'Maria Garcia', bandwidth: 95, onLeave: false, leaveDate: '', skills: 'Backend' },
    { name: 'James Wilson', bandwidth: 60, onLeave: true, leaveDate: 'Oct 8–10', skills: 'DevOps' },
    { name: 'Priya Sharma', bandwidth: 78, onLeave: false, leaveDate: '', skills: 'Full Stack' },
    { name: 'Tom Anderson', bandwidth: 92, onLeave: false, leaveDate: '', skills: 'QA' },
    { name: 'Lisa Brown', bandwidth: 55, onLeave: false, leaveDate: '', skills: 'Frontend' },
  ];

  useEffect(() => {
    setShowPopup('welcome');
    const t = setTimeout(() => {
      setTeamData(initialTeamData);
      calculateMetrics(initialTeamData);
      setStep('dashboard');
      setShowPopup('bandwidthCheck');
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  const calculateMetrics = (data: any[]) => {
    const avg = data.reduce((sum, m) => sum + m.bandwidth, 0) / data.length;
    setAvgBandwidth(Math.round(avg));

    // Adjusted capacity (50% availability when on leave)
    const adjusted =
      data.reduce((sum, m) => sum + m.bandwidth * (m.onLeave ? 0.5 : 1), 0) / data.length;
    setAdjustedCapacity(Math.round(adjusted));
  };

  // Consistent color system (rose = critical, amber = warning, emerald = success)
  const barColor = (bandwidth: number, onLeave = false) => {
    if (onLeave || bandwidth > 90) return 'bg-rose-600';
    if (bandwidth >= 75) return 'bg-amber-500';
    return 'bg-emerald-600';
  };
  const textColor = (bandwidth: number, onLeave = false) => {
    if (onLeave || bandwidth > 90) return 'text-rose-600';
    if (bandwidth >= 75) return 'text-amber-600';
    return 'text-emerald-600';
  };
  const dotIcon = (bandwidth: number, onLeave = false) =>
    onLeave || bandwidth > 90 ? '🔴' : bandwidth >= 75 ? '🟡' : '🟢';

  const handleAlert = (message: string) => {
    toast({ title: 'Quick Action', description: message });
    setShowPopup(null);
  };

  const closePopup = () => {
    if (showPopup === 'welcome') return;
    if (showPopup === 'bandwidthCheck') {
      const hasLeaves = teamData.some((m) => m.onLeave);
      setShowPopup(hasLeaves ? 'leaveDetected' : 'noLeave');
    } else if (showPopup === 'leaveDetected' || showPopup === 'noLeave') {
      setShowPopup('capacityAssessment');
    } else {
      setShowPopup(null);
    }
  };

  const renderPopup = () => {
    if (!showPopup) return null;

    const popups: Record<string, any> = {
      welcome: {
        title: `Welcome back, ${managerName}!`,
        message: "Retrieving your team's bandwidth and availability summary...",
        icon: <Users className="mb-4 h-12 w-12 text-primary" />,
        buttons: [],
      },
      bandwidthCheck:
        avgBandwidth < 70
          ? {
              title: '⚠️ Team Underutilized',
              message:
                'Team is underutilized this sprint. Consider reallocating stories or pulling from backlog.',
              icon: <AlertTriangle className="mb-4 h-12 w-12 text-amber-600" />,
              buttons: [
                { label: 'View Recommendations', action: () => handleAlert('Opening backlog suggestions...') },
                { label: 'Ignore for Now', action: closePopup },
              ],
            }
          : avgBandwidth <= 90
          ? {
              title: '✅ Team Capacity Balanced',
              message: 'Team capacity looks balanced. No action needed.',
              icon: <CheckCircle className="mb-4 h-12 w-12 text-emerald-600" />,
              buttons: [{ label: 'Continue', action: closePopup }],
            }
          : {
              title: '🚨 Team Nearing Overload',
              message:
                'Team is nearing overload! Some members have high workload or upcoming leaves.',
              icon: <AlertTriangle className="mb-4 h-12 w-12 text-rose-600" />,
              buttons: [
                { label: 'View Affected Members', action: () => handleAlert('Showing overloaded members...') },
                { label: 'Notify Scrum Masters', action: () => handleAlert('Alert sent to Scrum Masters') },
                { label: 'Postpone Decision', action: closePopup },
              ],
            },
      leaveDetected: {
        title: '🗓️ Leave Detected',
        message: teamData
          .filter((m) => m.onLeave)
          .map((m) => `${m.name} will be on leave ${m.leaveDate}`)
          .join(', '),
        icon: <Calendar className="mb-4 h-12 w-12 text-amber-600" />,
        buttons: [
          { label: 'Adjust Capacity', action: () => setShowPopup('selectReplacement') },
          { label: 'Acknowledge', action: closePopup },
        ],
      },
      selectReplacement: {
        title: '👥 Select Replacement Member',
        message: 'Choose a team member to reallocate work (sorted by lowest bandwidth):',
        icon: <Users className="mb-4 h-12 w-12 text-primary" />,
        buttons: [
          ...teamData
            .filter((m) => !m.onLeave && m.bandwidth < 85)
            .sort((a, b) => a.bandwidth - b.bandwidth)
            .slice(0, 3)
            .map((member: any) => ({
              label: `${member.name} (${member.bandwidth}% occupied – ${member.skills})`,
              action: () => {
                handleAlert(`Work reallocated to ${member.name}. Capacity metrics recalculated.`);
                calculateMetrics(teamData);
                closePopup();
              },
            })),
          { label: "No, Don't Proceed", action: closePopup },
        ],
      },
      noLeave: {
        title: '👍 No Leaves Reported',
        message: 'No team leaves reported for the sprint period.',
        icon: <CheckCircle className="mb-4 h-12 w-12 text-emerald-600" />,
        buttons: [{ label: 'Continue', action: closePopup }],
      },
      capacityAssessment:
        adjustedCapacity < 80
          ? {
              title: '🚩 Delivery Risk Flagged',
              message: `Warning: Overall team capacity dropped to ${adjustedCapacity}%. Delivery risk flagged.`,
              icon: <AlertTriangle className="mb-4 h-12 w-12 text-rose-600" />,
              buttons: [
                { label: 'View Risk Report', action: () => handleAlert('Opening sprint slippage projection...') },
                { label: 'Notify Product Owner', action: () => handleAlert('Alert sent to Product Owner') },
                { label: 'Acknowledge', action: closePopup },
              ],
            }
          : adjustedCapacity <= 95
          ? {
              title: '🟡 Capacity Slightly Constrained',
              message: `Team capacity at ${adjustedCapacity}%. Monitor progress mid-sprint.`,
              icon: <AlertTriangle className="mb-4 h-12 w-12 text-amber-600" />,
              buttons: [
                { label: 'Set Reminder', action: () => handleAlert('Mid-sprint reminder created') },
                { label: 'Ignore', action: closePopup },
              ],
            }
          : {
              title: '🟢 Optimal Capacity',
              message: `Team operating at ${adjustedCapacity}% capacity. No risks detected.`,
              icon: <CheckCircle className="mb-4 h-12 w-12 text-emerald-600" />,
              buttons: [
                { label: 'View Insights', action: () => handleAlert('Opening performance trends...') },
                { label: 'Continue', action: closePopup },
              ],
            },
    };

    const popup = popups[showPopup];

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <Card className="w-full max-w-md rounded-2xl border bg-card/90 shadow-2xl backdrop-blur supports-[backdrop-filter]:bg-card/70 animate-in fade-in-0 zoom-in-95">
          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center">
              {popup.icon}
              <h2 className="mb-4 text-2xl font-bold text-foreground">{popup.title}</h2>
              <p className="mb-6 text-muted-foreground">{popup.message}</p>
              <div className="w-full space-y-2">
                {popup.buttons.map((btn: any, idx: number) => (
                  <Button
                    key={idx}
                    onClick={btn.action}
                    variant={
                      btn.label.includes('Acknowledge') || btn.label.includes('Ignore') ? 'outline' : 'default'
                    }
                    className="w-full rounded-xl"
                  >
                    {btn.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (step === 'loading') {
    return (
      <div
        className="
          flex min-h-screen items-center justify-center
          bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))]
          from-muted/40 via-background to-muted/30
          p-8
        "
      >
        {renderPopup()}
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-b-4 border-primary" />
          <p className="text-xl text-muted-foreground">Analyzing team capacity...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen
        bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))]
        from-muted/40 via-background to-muted/30
        p-4 md:p-8
      "
    >
      {/* Glassy header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card/80 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Team Capacity Tracker</h1>
            <p className="text-sm text-muted-foreground">Manager: {managerName}</p>
          </div>
          <Button onClick={() => handleLogout(toast)} variant="outline" size="sm" className="gap-2 rounded-xl">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {renderPopup()}

      <div className="mx-auto max-w-7xl pt-6">
        {/* Capacity Meters */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="rounded-2xl bg-card/80 p-6 shadow-md backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <h3 className="mb-2 text-lg font-semibold">Average Bandwidth</h3>
            <div className={`text-4xl font-bold ${textColor(avgBandwidth)}`}>{avgBandwidth}%</div>
            <div className="mt-3 h-3 w-full rounded-full bg-muted">
              <div className={`h-3 rounded-full ${barColor(avgBandwidth)}`} style={{ width: `${avgBandwidth}%` }} />
            </div>
          </Card>

          <Card className="rounded-2xl bg-card/80 p-6 shadow-md backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <h3 className="mb-2 text-lg font-semibold">Adjusted Capacity</h3>
            <div className={`text-4xl font-bold ${textColor(adjustedCapacity)}`}>{adjustedCapacity}%</div>
            <div className="mt-3 h-3 w-full rounded-full bg-muted">
              <div
                className={`h-3 rounded-full ${barColor(adjustedCapacity)}`}
                style={{ width: `${adjustedCapacity}%` }}
              />
            </div>
          </Card>

          <Card className="rounded-2xl bg-card/80 p-6 shadow-md backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <h3 className="mb-2 text-lg font-semibold">Team Status</h3>
            <div className="mt-2 text-2xl font-bold">
              {teamData.filter((m) => !m.onLeave && m.bandwidth < 75).length} Available
            </div>
            <div className="mt-1 text-sm text-muted-foreground">{teamData.filter((m) => m.onLeave).length} on leave</div>
          </Card>
        </div>

        {/* Team Members */}
        <Card className="mb-6 rounded-2xl bg-card/80 p-6 shadow-md backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <h2 className="mb-4 text-2xl font-bold">Team Members</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {teamData.map((member, idx) => (
              <div
                key={idx}
                className="rounded-xl border bg-card p-4 transition-shadow hover:shadow-md"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${barColor(member.bandwidth, member.onLeave)}`} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.skills}</p>
                  </div>
                  <span className="text-2xl">{dotIcon(member.bandwidth, member.onLeave)}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Bandwidth:</span>
                    <span className={`font-semibold ${textColor(member.bandwidth, member.onLeave)}`}>
                      {member.bandwidth}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className={`h-2 rounded-full ${barColor(member.bandwidth, member.onLeave)}`}
                      style={{ width: `${member.bandwidth}%` }}
                    />
                  </div>
                  {member.onLeave && (
                    <div className="mt-2 text-xs font-medium text-rose-600">
                      <Calendar className="mr-1 inline-block h-3 w-3" />
                      On leave: {member.leaveDate}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Button
            onClick={() => handleAlert('Showing bandwidth trends...')}
            variant="outline"
            className="h-auto justify-start gap-3 rounded-xl py-4"
          >
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="font-medium">Compare Weeks</span>
          </Button>

          <Button
            onClick={() => handleAlert('Downloading report...')}
            variant="outline"
            className="h-auto justify-start gap-3 rounded-xl py-4"
          >
            <Download className="h-6 w-6 text-emerald-600" />
            <span className="font-medium">Download Report</span>
          </Button>

          <Button
            onClick={() => handleAlert('Generating forecast...')}
            variant="outline"
            className="h-auto justify-start gap-3 rounded-xl py-4"
          >
            <Calendar className="h-6 w-6 text-amber-600" />
            <span className="font-medium">Team Forecast</span>
          </Button>

          <Button
            onClick={() => setShowPopup('capacityAssessment')}
            className="h-auto justify-start gap-3 rounded-xl py-4"
          >
            <CheckCircle className="h-6 w-6" />
            <span className="font-medium">Run Assessment</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TeamCapacityTracker;
