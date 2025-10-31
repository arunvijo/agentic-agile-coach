import React, { useState } from 'react';
import {
  AlertCircle, Brain, Filter, LogOut, MessageSquare, X, Download, Send
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { handleLogout } from '../Index';

const AgileDependencyHeatmap = () => {
  const [screen, setScreen] = useState<'dashboard' | 'heatmap'>('dashboard');
  const [showNotification, setShowNotification] = useState(true);
  const [showImpactChain, setShowImpactChain] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showModifyPlan, setShowModifyPlan] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [aiInsightsOn, setAiInsightsOn] = useState(true);
  const [highlightedDep, setHighlightedDep] = useState<number | null>(null);
  const { toast } = useToast();

  const dependencies = [
    { id: 1, from: 'Team Gamma', to: 'Team Delta', risk: 'high', status: 'blocked', resolved: false },
    { id: 2, from: 'Team Alpha', to: 'Team Beta', risk: 'medium', status: 'active', resolved: false },
    { id: 3, from: 'Team Beta', to: 'Team Delta', risk: 'low', status: 'active', resolved: false }
  ];
  const [deps, setDeps] = useState(dependencies);

  const teams = [
    { id: 'alpha', name: 'Team Alpha', x: 100, y: 100, progress: 75, dependencies: 2, highRisk: 0 },
    { id: 'beta', name: 'Team Beta', x: 450, y: 100, progress: 60, dependencies: 3, highRisk: 0 },
    { id: 'gamma', name: 'Team Gamma', x: 100, y: 300, progress: 45, dependencies: 1, highRisk: 1 },
    { id: 'delta', name: 'Team Delta', x: 450, y: 300, progress: 50, dependencies: 5, highRisk: 1 }
  ];

  const [hoveredTeam, setHoveredTeam] = useState<any>(null);

  const showToast = (message: string) => {
    toast({ title: 'System Update', description: message, duration: 3500 });
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'hsl(0 84% 60%)';      // rose-600
      case 'medium': return 'hsl(38 92% 50%)';   // amber-500
      case 'low': return 'hsl(142 76% 36%)';     // emerald-600
      default: return 'hsl(215 16% 47%)';        // slate-500
    }
  };
  const getRiskLabel = (risk: string) =>
    risk === 'high' ? '🔴 High' : risk === 'medium' ? '🟡 Medium' : risk === 'low' ? '🟢 Low' : 'Unknown';

  const handleApplyFix = () => {
    setDeps(prev => prev.map(d => d.id === 1 ? { ...d, risk: 'medium', status: 'active', resolved: true } : d));
    showToast('🧩 Heatmap updated. Risk reduced from High → Medium.');
    setShowRecommendations(false);
    setTimeout(() => setShowChatbot(true), 800);
  };
  const handleModifyPlan = () => {
    showToast('🔄 Plan updated. AI recalculating dependency probabilities…');
    setShowModifyPlan(false);
    setShowNotification(false);
  };
  const handleViewInHeatmap = () => {
    setShowRecommendations(false);
    setScreen('heatmap');
    setHighlightedDep(1);
    setTimeout(() => setHighlightedDep(null), 2500);
  };
  const handleAcceptSuggestion = () => {
    setDeps(prev => prev.map(d => d.id === 1 ? { ...d, risk: 'medium', resolved: true } : d));
    showToast('✅ AI reprioritized tasks. Teams notified.');
    setShowNotification(false);
    setTimeout(() => setShowChatbot(true), 800);
  };

  const renderHeader = () => (
    <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center gap-4 sm:gap-8">
          <h1 className="text-base sm:text-xl font-semibold tracking-tight">
            {screen === 'dashboard' ? 'Agile Program Dashboard' : 'Dependency Heatmap'}
          </h1>
          <nav className="hidden xs:flex gap-4 sm:gap-6 text-sm">
            <button
              onClick={() => setScreen('dashboard')}
              className={`pb-1 font-medium ${screen === 'dashboard' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setScreen('heatmap')}
              className={`pb-1 font-medium ${screen === 'heatmap' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Dependency Heatmap
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          {screen === 'heatmap' && (
            <label className="hidden sm:flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">AI Insights</span>
              <button
                onClick={() => setAiInsightsOn(v => !v)}
                className={`relative h-6 w-12 rounded-full transition-colors ${aiInsightsOn ? 'bg-primary' : 'bg-muted'}`}
              >
                <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-background shadow-md transition-transform ${aiInsightsOn ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </label>
          )}
          <button
            onClick={() => setShowRecommendations(true)}
            className="flex items-center rounded-lg sm:rounded-xl bg-primary px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Brain className="mr-2 h-4 w-4" />
            AI Recommendations
          </button>
          <button
            onClick={() => handleLogout(toast)}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );

  const renderDashboard = () => (
    <div className="mx-auto max-w-7xl p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <h2 className="mb-1 text-xl sm:text-2xl font-bold">Welcome back, Priya 👋</h2>
        <p className="text-muted-foreground text-sm sm:text-base">Managing 4 teams across Release 3.2</p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border bg-card/80 p-4 sm:p-6 shadow-md backdrop-blur supports-[backdrop-filter]:bg-card/60 transition-shadow hover:shadow-lg">
          <h3 className="mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-muted-foreground">Active Sprints</h3>
          <p className="text-2xl sm:text-3xl font-bold">4</p>
          <p className="mt-1 flex items-center text-xs sm:text-sm text-emerald-600">
            <svg className="mr-1 h-4 w-4" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            All on track
          </p>
        </div>

        <div className="rounded-2xl border bg-card/80 p-4 sm:p-6 shadow-md backdrop-blur supports-[backdrop-filter]:bg-card/60 transition-shadow hover:shadow-lg">
          <h3 className="mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-muted-foreground">Dependencies</h3>
          <p className="text-2xl sm:text-3xl font-bold">{deps.length}</p>
          <p className="mt-1 flex items-center text-xs sm:text-sm text-amber-600">
            <AlertCircle className="mr-1 h-4 w-4" /> {deps.filter(d => d.risk === 'high').length} high risk
          </p>
        </div>

        <div className="rounded-2xl border bg-card/80 p-4 sm:p-6 shadow-md backdrop-blur supports-[backdrop-filter]:bg-card/60 transition-shadow hover:shadow-lg">
          <h3 className="mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-muted-foreground">Release Progress</h3>
          <p className="text-2xl sm:text-3xl font-bold">68%</p>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">Release 3.2</p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border bg-card/80 p-4 sm:p-6 shadow-md backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <h2 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold">Active Release: 3.2</h2>
        <div className="space-y-3">
          {teams.map(team => (
            <div
              key={team.id}
              className="flex items-center justify-between rounded-xl bg-muted/50 p-3 sm:p-4 transition-colors hover:bg-muted"
            >
              <div className="mr-3">
                <p className="font-medium text-sm sm:text-base">{team.name}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Sprint 4 • {team.dependencies} dependencies {team.highRisk > 0 && `• ${team.highRisk} high risk`}
                </p>
              </div>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="h-2.5 w-28 sm:w-40 rounded-full bg-border">
                  <div
                    className="h-2.5 rounded-full bg-primary transition-all"
                    style={{ width: `${team.progress}%` }}
                  />
                </div>
                <span className="w-10 sm:w-12 text-xs sm:text-sm font-medium">{team.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-primary/50 bg-gradient-subtle p-4 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <Brain className="mt-0.5 h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          <div className="flex-1">
            <h3 className="mb-2 font-semibold">AI Insights Available</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Dependency Heatmap suggests {deps.filter(d => d.risk === 'high').length} high-risk dependencies this week.
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={() => setScreen('heatmap')}
                className="rounded-lg sm:rounded-xl border border-border bg-background px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-primary transition-colors hover:bg-muted"
              >
                🔍 View in Heatmap
              </button>
              <button
                onClick={() => setShowRecommendations(true)}
                className="rounded-lg sm:rounded-xl bg-primary px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                🧠 See AI Recommendations
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Fixed-size map that scales down on small screens
  const BASE_W = 700;
  const BASE_H = 450;

  const renderHeatmap = () => (
    <div className="flex h-full flex-col md:flex-row">
      {/* Sidebar stacks on top for mobile */}
      <aside className="w-full md:w-72 shrink-0 overflow-y-auto border-b md:border-b-0 md:border-r border-border bg-card/80 p-4 sm:p-6 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">Filters</h3>
          <Filter className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
          {['Risk Level', 'Teams', 'Release', 'Sprint'].map((label) => (
            <div key={label}>
              <label className="mb-2 block text-sm font-medium text-muted-foreground">{label}</label>
              <select className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary">
                <option>All {label.replace(' Level', '')}</option>
                <option>Option 1</option>
                <option>Option 2</option>
              </select>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-lg border border-border bg-muted p-4">
          <p className="mb-3 text-xs font-semibold">Risk Legend</p>
          {['high', 'medium', 'low'].map((risk) => (
            <div key={risk} className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: getRiskColor(risk) }} />
              <span>{getRiskLabel(risk).replace(/(\uD83C|\uD83D|\uD83E)[\uDC00-\uDFFF]/g, '').trim()}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-lg border border-amber-500/50 bg-amber-50 p-4">
          <p className="mb-2 text-xs font-semibold text-amber-600">Active Alerts</p>
          <p className="text-xs">{deps.filter(d => d.risk === 'high').length} high-risk dependencies detected</p>
          <p className="mt-1 text-xs text-muted-foreground">AI confidence: 87%</p>
        </div>
      </aside>

      {/* Scaled canvas container for mobile */}
      <section className="flex-1 overflow-auto p-4 sm:p-8">
        <div className="relative rounded-2xl border bg-card/80 p-4 sm:p-8 shadow-md backdrop-blur supports-[backdrop-filter]:bg-card/60">
          {/* Scaler wrapper */}
          <div className="relative"
               style={{ width: '100%', overflow: 'hidden' }}>
            {/* Determine scale using CSS: shrink map on small screens */}
            <div
              className="origin-top-left"
              style={{
                width: BASE_W,
                height: BASE_H,
                transform: 'scale(var(--heatmap-scale, 1))'
              }}
            >
              {/* Dynamic scale via CSS var (set below using container width) */}
              <HeatmapInner
                deps={deps}
                teams={teams}
                highlightedDep={highlightedDep}
                hoveredTeam={hoveredTeam}
                setHoveredTeam={setHoveredTeam}
                getRiskColor={getRiskColor}
                aiInsightsOn={aiInsightsOn}
              />
            </div>
          </div>

          {/* CSS var setter: compute scale based on container width */}
          <style>{`
            @media (max-width: 400px) {
              :root { --heatmap-scale: 0.55; }
            }
            @media (min-width: 401px) and (max-width: 640px) {
              :root { --heatmap-scale: 0.7; }
            }
            @media (min-width: 641px) and (max-width: 767px) {
              :root { --heatmap-scale: 0.85; }
            }
            @media (min-width: 768px) {
              :root { --heatmap-scale: 1; }
            }
          `}</style>
        </div>
      </section>
    </div>
  );

  const renderModals = () => (
    <>
      {/* Top-right alert (fluid on mobile) */}
      {showNotification && (
        <div className="fixed z-50 inset-x-4 sm:inset-auto sm:right-6 top-4 sm:top-20 w-auto sm:w-96 animate-in fade-in-0 slide-in-from-right-4 rounded-2xl border-l-4 border-rose-600 bg-card/90 p-4 sm:p-6 shadow-2xl backdrop-blur supports-[backdrop-filter]:bg-card/70">
          <div className="mb-3 sm:mb-4 flex items-start justify-between">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 sm:h-6 sm:w-6 text-rose-600" />
              <div>
                <h3 className="mb-1 sm:mb-2 font-semibold">AI Insight Alert 🔥</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Team Gamma's API Integration delay may impact Team Delta's UI delivery by 3 days.
                  Suggest prioritizing API story DELTA-132 earlier in sprint.
                </p>
              </div>
            </div>
            <button onClick={() => setShowNotification(false)}>
              <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            </button>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => { setShowImpactChain(true); setShowNotification(false); }}
              className="w-full rounded-xl border border-border px-4 py-2 text-xs sm:text-sm font-medium transition-colors hover:bg-muted"
            >
              📈 View Impact Chain
            </button>
            <button
              onClick={handleAcceptSuggestion}
              className="w-full rounded-xl bg-primary px-4 py-2 text-xs sm:text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              🧠 Accept Suggestion
            </button>
            <button
              onClick={() => { setShowModifyPlan(true); setShowNotification(false); }}
              className="w-full rounded-xl border border-primary px-4 py-2 text-xs sm:text-sm font-medium text-primary transition-colors hover:bg-primary/10"
            >
              ✏️ Modify Plan
            </button>
          </div>
        </div>
      )}

      {/* Impact Chain (fluid modal) */}
      {showImpactChain && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-[92vw] sm:max-w-4xl max-h-[85vh] overflow-y-auto animate-in fade-in-50 zoom-in-90 rounded-2xl border bg-card/90 p-4 sm:p-6 shadow-2xl backdrop-blur supports-[backdrop-filter]:bg-card/70">
            <div className="mb-4 sm:mb-6 flex items-center justify-between">
              <h2 className="text-lg sm:text-2xl font-bold">Impact Chain Analysis</h2>
              <button onClick={() => setShowImpactChain(false)}>
                <X className="h-6 w-6 text-muted-foreground hover:text-foreground" />
              </button>
            </div>

            <div className="mb-4 sm:mb-6">
              <div className="mb-2 sm:mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                <FlowBox title="Team Gamma" subtitle="Backend Delay" color="#ef4444" />
                <FlowArrow color="#ef4444" />
                <FlowBox title="Team Delta" subtitle="UI Blocked" color="#f59e0b" />
                <FlowArrow color="#f59e0b" />
                <FlowBox title="Release 3.2" subtitle="Potential Slippage" color="#fcd34d" />
              </div>
            </div>

            <div className="mb-4 sm:mb-6 rounded-lg border bg-muted p-3 sm:p-4">
              <p className="text-xs sm:text-sm">
                <span className="font-semibold">AI Analysis:</span> Backend delays cause 2.5-day average impact.
                Projected delay: <span className="font-semibold text-rose-600">3 days</span>. AI probability:{' '}
                <span className="font-semibold text-rose-600">87%</span> risk of slippage.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:gap-3 sm:grid-cols-3">
              <button
                onClick={() => toast({ title: 'Jira Created', description: 'Risk item created in Jira.' })}
                className="rounded-lg bg-muted px-4 py-3 text-xs sm:text-sm font-medium transition-colors hover:bg-muted/70"
              >
                Create Risk Item
              </button>
              <button
                onClick={() => toast({ title: 'Slack Notified', description: 'Alert sent to teams in Slack.' })}
                className="rounded-lg bg-muted px-4 py-3 text-xs sm:text-sm font-medium transition-colors hover:bg-muted/70"
              >
                Notify Teams in Slack
              </button>
              <button
                onClick={() => setShowModifyPlan(true)}
                className="rounded-lg bg-primary px-4 py-3 text-xs sm:text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Generate Mitigation Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Recommendations (fluid modal) */}
      {showRecommendations && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[85vh] w-full max-w-[92vw] sm:max-w-5xl animate-in fade-in-50 zoom-in-90 overflow-y-auto rounded-2xl border bg-card/90 p-4 sm:p-6 shadow-2xl backdrop-blur supports-[backdrop-filter]:bg-card/70">
            <div className="mb-4 sm:mb-6 flex items-center justify-between">
              <h2 className="text-lg sm:text-2xl font-bold">AI Recommendations</h2>
              <button onClick={() => setShowRecommendations(false)}>
                <X className="h-6 w-6 text-muted-foreground hover:text-foreground" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
              <div className="space-y-3 sm:space-y-4">
                <h3 className="mb-2 sm:mb-3 font-semibold text-muted-foreground text-sm sm:text-base">Top Risk Dependencies</h3>
                {deps.filter(d => d.risk !== 'low').map(dep => (
                  <div
                    key={dep.id}
                    className={`group relative rounded-lg border-l-4 p-3 sm:p-4 ${dep.risk === 'high' ? 'border-rose-600 bg-rose-50/50' : 'border-amber-500 bg-amber-50/40'}`}
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-sm sm:text-base">{dep.from} ↔ {dep.to}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Dependency: API Integration</p>
                      </div>
                      <span
                        className={`rounded px-2 py-1 text-[10px] sm:text-xs font-semibold ${dep.risk === 'high' ? 'bg-rose-600/10 text-rose-600' : 'bg-amber-500/10 text-amber-600'}`}
                      >
                        {getRiskLabel(dep.risk)}
                      </span>
                    </div>
                    <p className="mb-1 text-xs sm:text-sm text-muted-foreground"><span className="font-medium">Status:</span> {dep.status}</p>
                    <p className="mb-3 text-xs sm:text-sm text-muted-foreground">
                      <span className="font-medium">AI Suggestion:</span> Reorder tasks; add buffer; notify Scrum Masters
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleApplyFix}
                        className="flex-1 rounded-lg bg-primary px-3 py-2 text-xs sm:text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                      >
                        🪄 Apply Fix
                      </button>
                      <button
                        onClick={handleViewInHeatmap}
                        className="flex-1 rounded-lg border border-border px-3 py-2 text-xs sm:text-sm font-medium transition-colors hover:bg-muted"
                      >
                        View in Heatmap
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="mb-3 font-semibold text-muted-foreground text-sm sm:text-base">Highest Impact Actions</h3>
                <div className="space-y-3">
                  {[
                    { title: 'Reprioritize DELTA-132', detail: 'Move API dependency task to Sprint Priority #2', impact: 'Reduces delay by 2 days' },
                    { title: 'Add 1-day buffer', detail: 'Assign buffer time for Team Delta UI work', impact: '87% success rate historically' },
                    { title: 'Notify Scrum Masters', detail: 'Alert both teams about dependency conflict', impact: 'Immediate action required' },
                  ].map((action, idx) => (
                    <div key={idx} className="rounded-lg border bg-card p-3 sm:p-4 transition-shadow hover:shadow-md">
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <span className="text-sm font-bold text-primary">{idx + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm sm:text-base">{action.title}</p>
                          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{action.detail}</p>
                          <p className="mt-2 text-[11px] sm:text-xs text-primary">Impact: {action.impact}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Modify plan drawer (full-width on mobile, right drawer on md+) */}
      {showModifyPlan && (
        <div className="fixed inset-0 z-50 bg-black/50">
          <div className="animate-in slide-in-from-bottom md:slide-in-from-right absolute bottom-0 md:bottom-auto md:right-0 top-auto md:top-0 h-auto md:h-full w-full md:w-96 overflow-y-auto border-t md:border-t-0 md:border-l bg-card/90 p-4 sm:p-6 shadow-2xl backdrop-blur supports-[backdrop-filter]:bg-card/70">
            <div className="mb-4 sm:mb-6 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold">Modify Mitigation Plan</h2>
              <button onClick={() => setShowModifyPlan(false)}>
                <X className="h-6 w-6 text-muted-foreground hover:text-foreground" />
              </button>
            </div>

            <div className="mb-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground">Suggested Start Date</label>
                <input type="date" defaultValue="2025-10-10" className="w-full rounded-lg border border-border bg-background px-3 py-2 focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground">Affected Teams</label>
                <select className="w-full rounded-lg border border-border bg-background px-3 py-2 focus:ring-2 focus:ring-primary">
                  <option>Both Teams</option>
                  <option>Team Gamma</option>
                  <option>Team Delta</option>
                </select>
              </div>
              <button
                onClick={handleModifyPlan}
                className="mt-2 sm:mt-4 w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Save Changes & Recalculate
              </button>
            </div>

            <div className="border-t border-border pt-4">
              <h3 className="mb-2 font-semibold">Current Dependency</h3>
              <p className="text-sm text-muted-foreground">Team Gamma ↔ Team Delta (High Risk)</p>
            </div>
          </div>
        </div>
      )}

      {/* Chatbot prompt (fluid width on mobile) */}
      {showChatbot && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 z-50 w-auto sm:w-96 animate-in fade-in-0 slide-in-from-bottom-4 rounded-2xl border bg-card/90 p-4 shadow-2xl backdrop-blur supports-[backdrop-filter]:bg-card/70">
          <div className="flex items-start gap-3">
            <MessageSquare className="mt-1 h-6 w-6 text-primary" />
            <div className="flex-1">
              <p className="mb-3 text-sm">
                💬 Would you like me to summarize today's dependency changes in a status report?
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => { setShowReport(true); setShowChatbot(false); }}
                  className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Yes, generate report
                </button>
                <button
                  onClick={() => setShowChatbot(false)}
                  className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                >
                  No, later
                </button>
              </div>
            </div>
            <button onClick={() => setShowChatbot(false)}>
              <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            </button>
          </div>
        </div>
      )}

      {/* Report modal (fluid) */}
      {showReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-[92vw] sm:max-w-3xl max-h-[85vh] overflow-y-auto animate-in fade-in-50 zoom-in-90 rounded-2xl border bg-card/90 p-4 sm:p-8 shadow-2xl backdrop-blur supports-[backdrop-filter]:bg-card/70">
            <div className="mb-4 sm:mb-6 flex items-center justify-between">
              <h2 className="text-lg sm:text-2xl font-bold">Dependency Health Report – Week 41</h2>
              <button onClick={() => setShowReport(false)}>
                <X className="h-6 w-6 text-muted-foreground hover:text-foreground" />
              </button>
            </div>

            <div className="mb-4 sm:mb-6 space-y-4">
              <div className="rounded-lg border-l-4 border-emerald-600 bg-emerald-50 p-4 sm:p-5">
                <p className="mb-2 text-base sm:text-lg font-semibold">✅ 2 Dependencies Resolved</p>
                <p className="text-sm text-muted-foreground">• Team Gamma → Team Delta (API Integration)</p>
                <p className="text-sm text-muted-foreground">• Team Alpha → Team Beta (Database Schema)</p>
              </div>
              <div className="rounded-lg border-l-4 border-primary bg-primary/10 p-4 sm:p-5">
                <p className="mb-2 text-base sm:text-lg font-semibold">🔄 1 Reprioritized</p>
                <p className="text-sm text-muted-foreground">• DELTA-132 moved to Priority #2</p>
                <p className="text-sm text-muted-foreground">• Buffer added: 1 day</p>
              </div>
              <div className="rounded-lg border-l-4 border-primary/50 bg-muted/50 p-4 sm:p-5">
                <p className="mb-2 text-base sm:text-lg font-semibold">📊 Impact Summary</p>
                <p className="text-sm text-muted-foreground">• Estimated release delay reduced by 2.3 days</p>
                <p className="text-sm text-muted-foreground">• Risk level decreased: High → Medium</p>
                <p className="text-sm text-muted-foreground">• Team confidence improved by 15%</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={() => toast({ title: 'PDF Exported', description: 'Report downloaded successfully.' })}
                className="flex flex-1 items-center justify-center rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Download className="mr-2 h-5 w-5" />
                Export PDF
              </button>
              <button
                onClick={() => toast({ title: 'Confluence Saved', description: 'Report shared to Confluence.' })}
                className="flex flex-1 items-center justify-center rounded-lg border border-border px-6 py-3 font-medium transition-colors hover:bg-muted"
              >
                <Send className="mr-2 h-5 w-5" />
                Save to Confluence
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  // Inner heatmap (fixed logical size), scaled by CSS var
  const HeatmapInner = ({
    deps, teams, highlightedDep, hoveredTeam, setHoveredTeam, getRiskColor, aiInsightsOn
  }: any) => (
    <div className="relative h-full w-full">
      <svg width={BASE_W} height={BASE_H} className="absolute inset-0">
        {deps.map((dep: any) => {
          const fromTeam = teams.find((t: any) => t.name === dep.from);
          const toTeam = teams.find((t: any) => t.name === dep.to);
          const isHighlighted = highlightedDep === dep.id;
          if (!fromTeam || !toTeam) return null;
          return (
            <g key={dep.id}>
              <line
                x1={fromTeam.x + 75}
                y1={fromTeam.y + 60}
                x2={toTeam.x + 75}
                y2={toTeam.y + 60}
                stroke={getRiskColor(dep.risk)}
                strokeWidth={isHighlighted ? 5 : 3}
                strokeDasharray={dep.status === 'blocked' ? '8,4' : 'none'}
                className="transition-all"
                opacity={isHighlighted ? 1 : 0.7}
              />
              {isHighlighted && (
                <circle
                  cx={(fromTeam.x + toTeam.x) / 2 + 75}
                  cy={(fromTeam.y + toTeam.y) / 2 + 60}
                  r="8"
                  fill={getRiskColor(dep.risk)}
                  className="animate-pulse"
                />
              )}
            </g>
          );
        })}
      </svg>

      {teams.map((team: any) => (
        <div
          key={team.id}
          className="absolute cursor-pointer rounded-xl border bg-card p-4 sm:p-5 shadow-lg transition-all hover:scale-[1.03] hover:shadow-2xl"
          style={{
            left: team.x,
            top: team.y,
            width: 150,
            borderColor: team.highRisk > 0 ? getRiskColor('high') : 'hsl(var(--border))'
          }}
          onMouseEnter={() => setHoveredTeam(team)}
          onMouseLeave={() => setHoveredTeam(null)}
        >
          <div className="mb-2 flex items-start justify-between">
            <p className="text-xs sm:text-sm font-semibold">{team.name}</p>
            {team.highRisk > 0 && <span className="h-2 w-2 animate-pulse rounded-full bg-rose-600" />}
          </div>
          <p className="mb-2 sm:mb-3 text-[11px] sm:text-xs text-muted-foreground">Sprint 4</p>
          <div className="mb-2 h-2 w-full rounded-full bg-muted">
            <div className="h-2 rounded-full bg-primary transition-all duration-500" style={{ width: `${team.progress}%` }} />
          </div>
          <div className="flex items-center justify-between text-[11px] sm:text-xs text-muted-foreground">
            <span>{team.progress}%</span>
            <span>{team.dependencies} deps</span>
          </div>
        </div>
      ))}

      {hoveredTeam && (
        <div
          className="absolute z-20 rounded-lg border bg-popover p-3 sm:p-4 text-popover-foreground shadow-2xl animate-in fade-in-50"
          style={{ left: Math.min(hoveredTeam.x + 160, BASE_W - 260), top: hoveredTeam.y, width: 220 }}
        >
          <p className="mb-2 text-xs sm:text-sm font-semibold">{hoveredTeam.name} – Sprint 4</p>
          <p className="mb-1 text-xs sm:text-sm text-muted-foreground">Progress: {hoveredTeam.progress}%</p>
          <p className="mb-1 text-xs sm:text-sm text-muted-foreground">Dependencies: {hoveredTeam.dependencies}</p>
          {hoveredTeam.highRisk > 0 && <p className="mb-1 text-rose-600 text-xs sm:text-sm">🚨 {hoveredTeam.highRisk} High Risk Dependencies</p>}
          {hoveredTeam.id === 'delta' && (
            <>
              <p className="mt-2 text-rose-600 text-xs sm:text-sm">Blocked by: Team Gamma</p>
              <p className="text-amber-600 text-xs sm:text-sm">📊 AI Confidence: 87% risk of slippage</p>
            </>
          )}
        </div>
      )}

      {aiInsightsOn && (
        <div className="absolute bottom-4 left-4 max-w-[80%] sm:max-w-md rounded-lg bg-primary p-3 sm:p-4 text-primary-foreground shadow-xl">
          <div className="flex items-start gap-2 sm:gap-3">
            <Brain className="mt-0.5 h-4 w-4 sm:h-5 sm:w-5" />
            <div>
              <p className="mb-1 text-xs sm:text-sm font-semibold">AI Live Analysis</p>
              <p className="text-[10px] sm:text-xs opacity-90">
                Monitoring {deps.length} dependencies across {teams.length} teams. {deps.filter((d: any) => d.risk === 'high').length} high-risk items require attention.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Small helpers
  const FlowBox = ({ title, subtitle, color }: { title: string; subtitle: string; color: string }) => (
    <div className="flex-1 text-center">
      <div
        className="mx-0 sm:mx-2 mb-2 rounded-lg border-2 p-3 sm:p-4"
        style={{ borderColor: color, backgroundColor: `${color}1A` }}
      >
        <p className="text-sm sm:text-base font-semibold">{title}</p>
        <p className="text-xs sm:text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
  const FlowArrow = ({ color }: { color: string }) => (
    <div className="px-1 sm:px-2">
      <div className="h-1 w-10 sm:w-16" style={{ backgroundColor: color }} />
    </div>
  );

  return (
    <div
      className="
        min-h-screen
        bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))]
        from-muted/40 via-background to-muted/30
      "
    >
      {renderHeader()}
      <main className="min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-64px)] pb-8">
        {screen === 'dashboard' ? renderDashboard() : renderHeatmap()}
      </main>
      {renderModals()}
    </div>
  );
};

export default AgileDependencyHeatmap;
