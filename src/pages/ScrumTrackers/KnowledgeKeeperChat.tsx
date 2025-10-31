import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle, X, Send, TrendingDown, AlertTriangle, CheckCircle,
  FileText, Brain, BarChart3, LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { handleLogout } from '../Index';

const KnowledgeKeeperChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const mockUser = { email: 'test.sm@example.com' };

  const sprintData = {
    sprintNumber: 23,
    blockers: ['Delayed QA sign-off', 'API instability'],
    learnings: 3,
    unresolvedActions: 1
  };

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { scrollToBottom(); }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0 && !showWelcomeModal) {
      addMessage(`Hello! I'm ready to assist with your sprint data. How can I help?`, 'bot');
    }
  }, [isOpen]); // eslint-disable-line

  const addMessage = (text: string, sender = 'bot', type = 'text', data: any = null) => {
    setMessages(prev => [...prev, { text, sender, type, data, timestamp: new Date() }]);
  };

  const handleWelcomeResponse = (response: string) => {
    setShowWelcomeModal(false);
    setIsOpen(true);

    if (response === 'yes') {
      addMessage(
        `Here's what I recall from Sprint ${sprintData.sprintNumber} (Sept 15–29):\n\n• ${sprintData.blockers.length} recurring blockers: ${sprintData.blockers.join(', ')}\n• ${sprintData.learnings} team learnings logged\n• ${sprintData.unresolvedActions} unresolved retrospective action ('Define DoR for stories').\n\nWould you like a summarized retrospective slide?`,
        'bot'
      );
      addMessage('', 'bot', 'buttons', [
        { label: 'Yes, generate summary', action: 'generate-summary' },
        { label: 'Edit first', action: 'edit-summary' },
        { label: 'Skip for now', action: 'skip' }
      ]);
    } else {
      addMessage('Okay, feel free to ask me anything about the sprint!', 'bot');
    }
  };

  const handleButtonAction = (action: string) => {
    addMessage(action.replace('-', ' '), 'user');
    setTimeout(() => {
      switch (action) {
        case 'generate-summary':
          addMessage(`Great! I've generated your retrospective summary.`, 'bot');
          addMessage('', 'bot', 'summary-card');
          break;
        case 'show-blockers':
          addMessage('Here are the top recurring blockers from the past 3 sprints:', 'bot');
          addMessage('', 'bot', 'blockers-chart');
          break;
        case 'start-retro':
          addMessage(
            `Welcome to Sprint 24 Retrospective! I've preloaded insights from past 3 sprints. Would you like to see themes or specific incidents?`,
            'bot'
          );
          addMessage('', 'bot', 'buttons', [
            { label: 'Show themes', action: 'show-themes' },
            { label: 'Show incidents', action: 'show-incidents' }
          ]);
          break;
        case 'show-themes':
          addMessage('Analyzing morale and action follow-up themes...', 'bot');
          addMessage('', 'bot', 'themes-view');
          break;
        case 'show-velocity':
          addMessage('Analysis complete: The 12% dip correlates primarily with time spent resolving API instability.', 'bot');
          addMessage('Shall I create a Jira ticket to investigate API stability?', 'bot');
          addMessage('', 'bot', 'buttons', [
            { label: 'Create ticket', action: 'create-tasks' },
            { label: 'No, mitigate manually', action: 'skip' }
          ]);
          break;
        case 'notify-team':
          addMessage('✅ Alert posted to team channel. The team has been notified about the 3 blocked stories.', 'bot');
          break;
        case 'create-tasks':
          addMessage(
            '✅ Created 2 Jira tasks under "Retrospective Actions":\n• Define DoR for stories (TEAM-401)\n• Improve API testing checklist (TEAM-402)',
            'bot'
          );
          break;
        case 'skip':
        case 'edit-summary':
        case 'show-incidents':
        default:
          addMessage('Got it. Let me know if you need anything else!', 'bot');
      }
    }, 600);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    const userText = inputValue;
    addMessage(userText, 'user');
    setInputValue('');
    const userInput = userText.toLowerCase();

    setTimeout(() => {
      if (userInput.includes('blocker') || userInput.includes('block')) {
        handleButtonAction('show-blockers');
      } else if (userInput.includes('retro')) {
        handleButtonAction('start-retro');
      } else if (userInput.includes('velocity') || userInput.includes('performance')) {
        addMessage(`I've noticed the team's velocity dipped 12% this sprint. Shall I highlight possible causes?`, 'bot');
        addMessage('', 'bot', 'buttons', [
          { label: 'Yes, show analysis', action: 'show-velocity' },
          { label: 'Maybe later', action: 'skip' }
        ]);
      } else {
        addMessage(
          'I can help you with:\n• Sprint summaries and retrospectives\n• Recurring blockers analysis\n• Team learnings and insights\n• Creating action items\n\nWhat would you like to explore?',
          'bot'
        );
      }
    }, 600);
  };

  /* --- Uniform UI cards (rounded-2xl, subtle blur, consistent palette) --- */

  const BlockersChart = () => (
    <Card className="p-4 shadow-md rounded-2xl border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        Top Recurring Blockers
      </h3>
      <div className="space-y-3">
        {[
          { name: 'API instability', count: 8, color: 'bg-rose-500' },
          { name: 'Delayed QA sign-off', count: 6, color: 'bg-amber-500' },
          { name: 'Dependency waiting', count: 4, color: 'bg-primary' }
        ].map((b, i) => (
          <div key={i}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-foreground">{b.name}</span>
              <span className="text-muted-foreground">{b.count} occurrences</span>
            </div>
            <div className="h-2 w-full rounded-full bg-border">
              <div
                className={`${b.color} h-2 rounded-full`}
                style={{ width: `${(b.count / 8) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <Button variant="outline" size="sm" className="text-xs">
          Drill Down
        </Button>
        <Button variant="secondary" size="sm" className="text-xs">
          Create Action Item
        </Button>
      </div>
    </Card>
  );

  const SummaryCard = () => (
    <Card className="p-4 shadow-md rounded-2xl border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="mb-3 flex items-start justify-between">
        <h3 className="flex items-center gap-2 font-semibold text-foreground">
          <FileText className="h-4 w-4 text-primary" />
          Sprint {sprintData.sprintNumber} Retrospective Summary
        </h3>
        <span className="rounded px-2 py-1 text-xs bg-secondary text-secondary-foreground">
          Auto-generated
        </span>
      </div>

      <div className="space-y-3 text-sm">
        <div>
          <p className="mb-1 flex items-center gap-1 font-medium text-foreground">
            <CheckCircle className="h-4 w-4 text-emerald-600" /> What went well:
          </p>
          <ul className="ml-4 space-y-1 text-muted-foreground">
            <li>• Improved code review turnaround time</li>
            <li>• Better sprint planning accuracy</li>
          </ul>
        </div>

        <div>
          <p className="mb-1 flex items-center gap-1 font-medium text-foreground">
            <AlertTriangle className="h-4 w-4 text-amber-600" /> What needs improvement:
          </p>
          <ul className="ml-4 space-y-1 text-muted-foreground">
            <li>• API stability issues</li>
            <li>• QA bottlenecks</li>
          </ul>
        </div>

        <div>
          <p className="mb-1 flex items-center gap-1 font-medium text-foreground">
            <TrendingDown className="h-4 w-4 text-rose-600" /> Action items:
          </p>
          <ul className="ml-4 space-y-1 text-muted-foreground">
            <li>• Define DoR for user stories</li>
            <li>• Create API testing checklist</li>
          </ul>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Button variant="outline" size="sm" className="text-xs">
          Review & Edit
        </Button>
        <Button variant="default" size="sm" className="text-xs">
          Save as Final
        </Button>
        <Button onClick={() => handleButtonAction('create-tasks')} variant="secondary" size="sm" className="text-xs">
          Create Jira Tasks
        </Button>
      </div>
    </Card>
  );

  const ThemesView = () => (
    <div className="space-y-3">
      <Card className="p-4 shadow-md rounded-2xl border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <h3 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
          <BarChart3 className="h-4 w-4 text-primary" />
          Team Morale Trend
        </h3>
        <div className="h-20 flex items-end gap-2">
          {[65, 72, 68, 75, 80].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-gradient-to-t from-primary to-primary/50"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">📈 Trending up: +15% over 5 sprints</p>
      </Card>

      <Card className="p-4 shadow-md rounded-2xl border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <h3 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          Decision Follow-ups
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-emerald-600">✓</span>
            <span className="text-foreground">Implement CI/CD pipeline</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-amber-600">⏳</span>
            <span className="text-foreground">Define DoR for stories</span>
          </div>
        </div>
      </Card>

      <Card className="p-4 shadow-md rounded-2xl border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <h3 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
          <TrendingDown className="h-4 w-4 text-amber-600" />
          Improvement Actions Carried Forward
        </h3>
        <p className="text-sm text-muted-foreground">2 actions from previous sprints still pending review.</p>
        <Button variant="secondary" size="sm" className="mt-2 text-xs">
          Review Actions
        </Button>
      </Card>
    </div>
  );

  const renderMessage = (msg: any, idx: number) => {
    if (msg.type === 'buttons') {
      return (
        <div key={idx} className="mb-4 flex flex-wrap gap-2">
          {msg.data.map((btn: any, i: number) => (
            <Button
              key={i}
              onClick={() => handleButtonAction(btn.action)}
              size="sm"
              className="text-sm bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {btn.label}
            </Button>
          ))}
        </div>
      );
    }
    if (msg.type === 'blockers-chart') return <div key={idx} className="mb-4"><BlockersChart /></div>;
    if (msg.type === 'summary-card') return <div key={idx} className="mb-4"><SummaryCard /></div>;
    if (msg.type === 'themes-view') return <div key={idx} className="mb-4"><ThemesView /></div>;

    return (
      <div key={idx} className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
        <div
          className={`max-w-[80%] rounded-xl p-3 shadow-md ${
            msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
          }`}
        >
          <p className="whitespace-pre-line text-sm">{msg.text}</p>
        </div>
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
          <h1 className="text-2xl font-semibold tracking-tight">Knowledge Keeper - Chat</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Welcome, {mockUser.email}</span>
            <Button onClick={() => handleLogout(toast)} variant="outline" size="sm" className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Summary tiles */}
      <main className="mx-auto max-w-7xl p-6">
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="rounded-2xl border bg-card/80 p-6 shadow-md backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Sprint Health</h3>
            <p className="text-3xl font-bold text-emerald-600">82%</p>
            <p className="mt-1 text-sm text-muted-foreground">On track</p>
          </Card>

          <Card className="rounded-2xl border bg-card/80 p-6 shadow-md backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Active Blockers</h3>
            <p className="text-3xl font-bold text-amber-600">3</p>
            <p className="mt-1 text-sm text-muted-foreground">Needs attention</p>
          </Card>

          <Card
            className="rounded-2xl border bg-primary p-6 text-primary-foreground shadow-md hover:bg-primary/90 transition-colors cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            <div className="mb-2 flex items-center gap-3">
              <Brain className="h-6 w-6" />
              <h3 className="text-sm font-semibold">Knowledge Keeper</h3>
            </div>
            <p className="text-2xl font-bold">AI Assistant</p>
            <p className="mt-1 text-sm opacity-90">Chat is currently {isOpen ? 'open' : 'closed'} →</p>
          </Card>
        </div>
      </main>

      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-secondary p-3">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Knowledge Keeper</h2>
            </div>
            <p className="mb-6 text-muted-foreground">💡 Would you like me to summarize key learnings from the last sprint?</p>
            <div className="flex gap-3">
              <Button onClick={() => handleWelcomeResponse('yes')} className="flex-1">
                Yes, please
              </Button>
              <Button onClick={() => handleWelcomeResponse('later')} variant="outline" className="flex-1">
                Later
              </Button>
            </div>
            <button
              onClick={() => setShowWelcomeModal(false)}
              className="mt-3 w-full text-sm text-muted-foreground hover:text-foreground"
            >
              Skip this sprint
            </button>
          </Card>
        </div>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex h-[600px] w-[450px] flex-col rounded-2xl border border-border bg-card shadow-2xl">
          {/* Chat header */}
          <div className="flex items-center justify-between rounded-t-2xl bg-primary p-4 text-primary-foreground">
            <div className="flex items-center gap-3">
              <Brain className="h-6 w-6" />
              <div>
                <h3 className="font-semibold">Knowledge Keeper</h3>
                <p className="text-xs opacity-90">Your AI Scrum Assistant</p>
              </div>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-primary/50"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Quick actions */}
          <div className="flex gap-2 overflow-x-auto border-b border-border bg-muted p-3">
            <Button onClick={() => handleButtonAction('show-blockers')} size="sm" variant="secondary" className="text-xs">
              📊 Blockers
            </Button>
            <Button onClick={() => handleButtonAction('start-retro')} size="sm" variant="secondary" className="text-xs">
              🔄 Start Retro
            </Button>
            <Button size="sm" variant="secondary" className="text-xs">
              📚 Learnings
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-2 overflow-y-auto p-4">
            {messages.length === 0 && (
              <div className="mt-8 text-center text-muted-foreground">
                <Brain className="mx-auto mb-3 h-12 w-12 text-border" />
                <p className="text-sm">Hi! I'm your Knowledge Keeper.</p>
                <p className="mt-2 text-xs">Ask me about sprints, blockers, or retrospectives.</p>
              </div>
            )}
            {messages.map((m, i) => renderMessage(m, i))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything..."
                className="flex-1 rounded-lg border border-input bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button onClick={handleSendMessage} className="rounded-lg bg-primary p-2 text-primary-foreground hover:bg-primary/90">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating launcher */}
      {!isOpen && !showWelcomeModal && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 rounded-full bg-primary p-4 text-primary-foreground shadow-lg transition-all hover:scale-110 hover:shadow-xl"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};

export default KnowledgeKeeperChatbot;
