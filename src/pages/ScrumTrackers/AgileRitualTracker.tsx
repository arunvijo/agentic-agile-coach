import React, { useState } from 'react';
import {
  Trophy, Clock, Calendar, Lightbulb, CheckSquare, Award,
  X, TrendingUp, Send, LogOut
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { handleLogout } from '../Index';

type Ritual = {
  id: 'standup' | 'planning' | 'retro' | 'review';
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  status: string;
  info: string;
  tone: 'primary' | 'violet' | 'amber' | 'emerald';
  participation: number[] | number[]; // list for trend or single-value array
  showTrend: boolean;
  badges: { name: string; icon: string; desc: string }[];
  improvement?: number;
  lowParticipation?: string[];
};

const themeFor = (tone: Ritual['tone']) => {
  // Unified palette + matching text colors
  switch (tone) {
    case 'primary':
      return { bg: 'bg-primary', text: 'text-primary', chip: 'bg-primary/10 text-primary', border: 'border-primary/40' };
    case 'violet':
      return { bg: 'bg-violet-500', text: 'text-violet-600', chip: 'bg-violet-100 text-violet-700', border: 'border-violet-300' };
    case 'amber':
      return { bg: 'bg-amber-500', text: 'text-amber-600', chip: 'bg-amber-100 text-amber-700', border: 'border-amber-300' };
    case 'emerald':
      return { bg: 'bg-emerald-500', text: 'text-emerald-600', chip: 'bg-emerald-100 text-emerald-700', border: 'border-emerald-300' };
  }
};

const AgileRitualTracker = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedRitual, setSelectedRitual] = useState<Ritual | null>(null);
  const [activeTab, setActiveTab] = useState<'badges' | 'leaderboard'>('badges');
  const [showCelebration, setShowCelebration] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const { toast } = useToast();

  const scrumMasterName = 'Sarah';
  const teamScore = 82;
  const mockUser = { email: 'test.sm@example.com' };

  const rituals: Ritual[] = [
    {
      id: 'standup',
      name: 'Daily Standup',
      icon: Clock,
      status: '90% team participation',
      info: 'Consistent attendance this week!',
      tone: 'primary',
      participation: [85, 88, 90, 92, 90],
      showTrend: true,
      badges: [
        { name: 'Punctual Participant', icon: '👑', desc: '5 days consecutive attendance' },
        { name: 'Standup Streak Star', icon: '🎯', desc: '10 days streak' },
        { name: 'On-Time Achiever', icon: '🕓', desc: 'Always joins within 2 minutes' },
      ],
      improvement: 15,
      lowParticipation: ['Alex', 'Jordan', 'Sam'],
    },
    {
      id: 'planning',
      name: 'Sprint Planning',
      icon: Calendar,
      status: '1 missed last sprint',
      info: 'Plan completion at 95% accuracy',
      tone: 'violet',
      participation: [95],
      showTrend: false,
      badges: [
        { name: 'Master Planner', icon: '📋', desc: 'Accurate estimation record' },
        { name: 'Strategy Star', icon: '⭐', desc: 'Perfect planning attendance' },
      ],
    },
    {
      id: 'retro',
      name: 'Retrospective',
      icon: Lightbulb,
      status: 'Completed',
      info: 'Top badges awarded: Team Reflector',
      tone: 'amber',
      participation: [100],
      showTrend: false,
      badges: [
        { name: 'Team Reflector', icon: '🌱', desc: 'Shared valuable insights' },
        { name: 'Growth Mindset', icon: '🧠', desc: 'Continuous improvement focus' },
      ],
    },
    {
      id: 'review',
      name: 'Sprint Review',
      icon: CheckSquare,
      status: 'In progress',
      info: '2 members yet to log feedback',
      tone: 'emerald',
      participation: [85],
      showTrend: false,
      badges: [
        { name: 'Demo Champion', icon: '🎬', desc: 'Excellent presentation skills' },
        { name: 'Feedback Pro', icon: '💬', desc: 'Valuable stakeholder insights' },
      ],
    },
  ];

  const allBadges = [
    {
      category: 'Consistency Badges',
      icon: '🏅',
      badges: [
        { name: 'Perfect Attendance', criteria: '100% attendance across 2 sprints', progress: 75, eligible: ['Aisha (90%)', 'Raj (85%)', 'Meena (80%)'] },
        { name: 'Ritual Master', criteria: 'Attended all ceremonies for 1 month', progress: 60, eligible: ['Aisha (90%)', 'Dev (70%)'] },
      ],
    },
    {
      category: 'Engagement Badges',
      icon: '💬',
      badges: [
        { name: 'Active Contributor', criteria: 'Shared updates in 95% standups', progress: 85, eligible: ['Raj (95%)', 'Meena (88%)'] },
        { name: 'Blocker Buster', criteria: 'Raised and resolved 5 blockers', progress: 40, eligible: ['Dev (60%)', 'Sam (55%)'] },
      ],
    },
    {
      category: 'Improvement Badges',
      icon: '🌱',
      badges: [
        { name: 'Insight Champion', criteria: 'Provided 10 retro action items', progress: 90, eligible: ['Aisha (95%)', 'Raj (92%)'] },
        { name: 'Growth Advocate', criteria: 'Implemented 5 improvement suggestions', progress: 50, eligible: ['Meena (75%)'] },
      ],
    },
    {
      category: 'Planning Badges',
      icon: '🧠',
      badges: [
        { name: 'Estimation Expert', criteria: '90% accurate sprint estimates', progress: 70, eligible: ['Raj (88%)', 'Dev (82%)'] },
        { name: 'Velocity Keeper', criteria: 'Maintained consistent team velocity', progress: 100, eligible: ['Team achieved!'] },
      ],
    },
  ];

  const leaderboard = [
    { name: 'Aisha Kumar', badges: 12, level: 'Agile Master', avatar: '👩‍💼', participation: 98 },
    { name: 'Raj Patel', badges: 10, level: 'Agile Expert', avatar: '👨‍💻', participation: 95 },
    { name: 'Meena Singh', badges: 9, level: 'Agile Achiever', avatar: '👩‍🔬', participation: 92 },
    { name: 'Dev Sharma', badges: 7, level: 'Agile Enthusiast', avatar: '👨‍🎨', participation: 85 },
    { name: 'Sam Chen', badges: 5, level: 'Agile Learner', avatar: '👨‍🏫', participation: 78 },
  ];

  const RitualCard = ({ ritual }: { ritual: Ritual }) => {
    const t = themeFor(ritual.tone);
    return (
      <Card
        className="rounded-2xl border bg-card/80 p-6 shadow-md backdrop-blur transition-all hover:shadow-lg supports-[backdrop-filter]:bg-card/60 cursor-pointer"
        onClick={() => setSelectedRitual(ritual)}
      >
        <div className="mb-4 flex items-start justify-between">
          <div className={`${t.bg} rounded-lg p-3`}>
            <ritual.icon className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl">{ritual.id === 'standup' ? '🕐' : ritual.id === 'planning' ? '🗓' : ritual.id === 'retro' ? '🔍' : '🧾'}</span>
        </div>
        <CardTitle className="mb-2 text-lg">{ritual.name}</CardTitle>
        <p className="mb-1 text-sm text-muted-foreground">{ritual.status}</p>
        <p className={`text-xs font-medium ${t.text}`}>{ritual.info}</p>
        <div className="mt-4 text-xs text-muted-foreground">Click to view badges and trends →</div>
      </Card>
    );
  };

  const RitualDetail = ({ ritual }: { ritual: Ritual }) => {
    const t = themeFor(ritual.tone);
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <Card className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl">
          <div className="sticky top-0 flex items-center justify-between border-b bg-card/80 p-6 backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <div className="flex items-center gap-3">
              <div className={`${t.bg} rounded-lg p-3`}>
                <ritual.icon className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl">{ritual.name}</CardTitle>
            </div>
            <Button onClick={() => setSelectedRitual(null)} variant="ghost" size="icon">
              <X className="h-6 w-6" />
            </Button>
          </div>

          <div className="p-6">
            {ritual.improvement && (
              <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                  <span className="font-semibold text-emerald-700">Great Progress!</span>
                </div>
                <p className="text-sm text-emerald-700">
                  This week's attendance improved by {ritual.improvement}% compared to last sprint!
                </p>
              </div>
            )}

            {ritual.showTrend ? (
              <div className="mb-6">
                <h3 className="mb-4 text-lg font-semibold">Team Participation Trend</h3>
                <div className="flex h-40 items-end justify-between gap-2">
                  {ritual.participation.map((value, idx) => (
                    <div key={idx} className="flex flex-1 flex-col items-center">
                      <div className="relative h-full w-full rounded-t bg-muted">
                        <div
                          className={`${t.bg} absolute bottom-0 w-full rounded-t transition-all`}
                          style={{ height: `${value}%` }}
                        />
                      </div>
                      <span className="mt-2 text-xs text-muted-foreground">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][idx]}</span>
                      <span className="text-xs font-semibold text-foreground">{value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <h3 className="mb-4 text-lg font-semibold">Last Meeting Attendance</h3>
                <div className="rounded-lg bg-muted p-6 text-center">
                  <div className={`mb-2 text-6xl font-bold ${t.text}`}>{(ritual.participation[0] ?? 0)}%</div>
                  <p className="text-muted-foreground">Team members attended</p>
                </div>
              </div>
            )}

            <div className="mb-6">
              <h3 className="mb-4 text-lg font-semibold">Badges Earned</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {ritual.badges.map((badge, idx) => (
                  <div key={idx} className="rounded-lg border border-border bg-card/80 p-4 backdrop-blur supports-[backdrop-filter]:bg-card/60">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{badge.icon}</span>
                      <div>
                        <h4 className="font-semibold text-foreground">{badge.name}</h4>
                        <p className="text-sm text-muted-foreground">{badge.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {ritual.lowParticipation && (
              <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-xl">⚠️</span>
                      <span className="font-semibold text-amber-700">Attention Needed</span>
                    </div>
                    <p className="mb-3 text-sm text-amber-800">
                      {ritual.lowParticipation.length} members are falling behind in daily standups. Would you like to send them a reminder?
                    </p>
                    <p className="text-xs text-amber-700">Members: {ritual.lowParticipation.join(', ')}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <Button
                    onClick={() => setShowNudge(true)}
                    className="bg-amber-600 text-white hover:bg-amber-600/90"
                    size="sm"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Send Nudge
                  </Button>
                  <Button variant="outline" size="sm">
                    Ignore
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  };

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
          <h1 className="text-2xl font-semibold tracking-tight">Agile Ritual & Badge Tracker</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Welcome, {mockUser.email}</span>
            <Button onClick={() => handleLogout(toast)} variant="outline" size="sm" className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Welcome Popup */}
      {showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md rounded-2xl p-8 shadow-2xl">
            <div className="text-center">
              <div className="mb-4 text-6xl">🎉</div>
              <CardTitle className="mb-4 text-2xl font-bold">Welcome back, {scrumMasterName}!</CardTitle>
              <p className="mb-2 text-muted-foreground">
                Your team's Agile participation score this sprint is{' '}
                <span className="text-xl font-bold text-primary">{teamScore}%</span>
              </p>
              <p className="mb-6 font-semibold text-emerald-600">Keep up the momentum! 🚀</p>
              <Button onClick={() => setShowWelcome(false)} className="h-10 w-full">
                Continue
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Nudge Sent Popup */}
      {showNudge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md rounded-2xl p-8 shadow-2xl">
            <div className="text-center">
              <div className="mb-4 text-6xl">📬</div>
              <CardTitle className="mb-4 text-2xl font-bold">Nudge Sent!</CardTitle>
              <p className="mb-4 text-muted-foreground">The following message was sent to team members on Slack:</p>
              <div className="mb-6 rounded-lg border border-border bg-muted p-4 text-left">
                <p className="text-sm text-foreground">
                  "Hi @teammember, don't miss the next standup! You're just 1 day away from earning your 'Standup Streak Star' badge 🏅."
                </p>
              </div>
              <Button onClick={() => setShowNudge(false)} className="h-10 w-full">
                Got it!
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Celebration Popup */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md rounded-2xl p-8 shadow-2xl">
            <div className="text-center">
              <div className="mb-4 text-6xl">🎊</div>
              <CardTitle className="mb-4 text-2xl font-bold text-emerald-700">Sprint Complete!</CardTitle>
              <p className="mb-4 text-muted-foreground">
                Your team achieved 100% adherence to all Agile rituals this sprint. You've unlocked the{' '}
                <span className="font-bold text-primary">'Agile Harmony'</span> team badge!
              </p>
              <div className="mb-6 text-7xl">🏆</div>
              <div className="flex gap-3">
                <Button onClick={() => setShowCelebration(false)} className="flex-1">
                  View Badge Wall
                </Button>
                <Button className="flex-1 bg-emerald-600 text-white hover:bg-emerald-600/90">Share on Slack</Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="mx-auto max-w-7xl p-6">
        <header className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-foreground">Agile Ritual Adherence</h1>
          <p className="text-muted-foreground">Track participation, engagement, and team gamification metrics.</p>
        </header>

        <nav className="mb-8 flex gap-2 rounded-lg bg-card p-2 shadow-md">
          <Button
            onClick={() => setActiveTab('badges')}
            className={`h-10 flex-1 rounded-lg px-4 font-semibold transition-colors ${
              activeTab === 'badges' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-transparent text-foreground hover:bg-muted'
            }`}
            variant={activeTab === 'badges' ? 'default' : 'ghost'}
          >
            Ritual Tracker
          </Button>
          <Button
            onClick={() => setActiveTab('leaderboard')}
            className={`h-10 flex-1 rounded-lg px-4 font-semibold transition-colors ${
              activeTab === 'leaderboard' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-transparent text-foreground hover:bg-muted'
            }`}
            variant={activeTab === 'leaderboard' ? 'default' : 'ghost'}
          >
            Leaderboard
          </Button>
        </nav>

        {activeTab === 'badges' && (
          <>
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {rituals.map((ritual) => (
                <RitualCard key={ritual.id} ritual={ritual} />
              ))}
            </div>

            <div className="space-y-6">
              {allBadges.map((category, idx) => (
                <Card key={idx} className="rounded-2xl border bg-card/80 shadow-md backdrop-blur supports-[backdrop-filter]:bg-card/60">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{category.icon}</span>
                      <CardTitle className="text-2xl font-bold">{category.category}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {category.badges.map((badge, bidx) => (
                        <div key={bidx} className="rounded-lg border border-border bg-muted/50 p-4">
                          <div className="mb-3 flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-foreground">{badge.name}</h3>
                              <p className="text-sm text-muted-foreground">{badge.criteria}</p>
                            </div>
                            <Award className="h-6 w-6 text-amber-500" />
                          </div>
                          <div className="mb-3">
                            <div className="mb-1 flex justify-between text-sm">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-semibold text-foreground">{badge.progress}%</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-border">
                              <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${badge.progress}%` }} />
                            </div>
                          </div>
                          <div className="rounded bg-card p-3">
                            <div className="mb-1 text-xs text-muted-foreground">Eligible Members:</div>
                            <div className="text-sm font-medium text-primary">{badge.eligible.join(', ')}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {activeTab === 'leaderboard' && (
          <Card className="rounded-2xl border bg-card/80 shadow-md backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <CardHeader>
              <CardTitle className="text-2xl">Team Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="rounded-lg bg-gradient-to-r from-primary to-indigo-600 p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm opacity-90">Team Progress</div>
                      <div className="text-2xl font-bold">Team 'Agile Avengers'</div>
                      <div className="text-sm">42 Badges Earned | Level 4: Agile Achievers 🌟</div>
                    </div>
                    <Trophy className="h-12 w-12" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {leaderboard.map((member, idx) => (
                  <div
                    key={idx}
                    className={`rounded-lg border-2 p-4 transition-all hover:shadow-lg ${
                      idx < 3 ? 'border-amber-400 bg-amber-50' : 'border-border bg-card'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`text-3xl font-bold ${
                            idx === 0 ? 'text-amber-600' : idx === 1 ? 'text-zinc-500' : idx === 2 ? 'text-amber-500' : 'text-muted-foreground'
                          }`}
                        >
                          {idx < 3 ? ['🥇', '🥈', '🥉'][idx] : `#${idx + 1}`}
                        </div>
                        <div className="text-4xl">{member.avatar}</div>
                        <div>
                          <div className="text-lg font-semibold text-foreground">{member.name}</div>
                          <div className="text-sm text-muted-foreground">{member.level}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="mb-1 flex items-center gap-2">
                          <Award className="h-5 w-5 text-amber-500" />
                          <span className="text-xl font-bold text-foreground">{member.badges}</span>
                          <span className="text-sm text-muted-foreground">badges</span>
                        </div>
                        <div className="text-sm text-muted-foreground">{member.participation}% participation</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {selectedRitual && <RitualDetail ritual={selectedRitual} />}
    </div>
  );
};

export default AgileRitualTracker;
