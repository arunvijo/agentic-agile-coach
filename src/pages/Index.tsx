import { useState, useEffect } from 'react';
import { 
  AlertCircle, TrendingUp, TrendingDown, CheckCircle, Coffee, 
  AlertTriangle, Users, Calendar, LogOut, Activity, Target, 
  MessageSquare, Clock, Package, MapPin, Zap, Mail, Lock, User as UserIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@supabase/supabase-js';

type UserRole = 'scrum_master' | 'adm' | null;
type PageType = 'register' | 'login' | 'dashboard';

// Team Sentiment Dashboard Component
const TeamSentimentDashboard = () => {
  const [selectedWeek, setSelectedWeek] = useState(4);
  
  const weeklyData = {
    1: { sentiment: 4.2, attendance: 95, productivity: 98, absences: 0, trend: 'stable' },
    2: { sentiment: 3.8, attendance: 92, productivity: 95, absences: 1, trend: 'slight_decrease' },
    3: { sentiment: 3.3, attendance: 85, productivity: 88, absences: 2, trend: 'decreasing' },
    4: { sentiment: 2.7, attendance: 78, productivity: 72, absences: 3, trend: 'critical' }
  };
  
  const currentData = weeklyData[selectedWeek as keyof typeof weeklyData];
  
  const getStatus = (score: number) => {
    if (score >= 4.0) return { label: 'Healthy', color: 'bg-success', textColor: 'text-success' };
    if (score >= 3.0) return { label: 'Moderate', color: 'bg-warning', textColor: 'text-warning' };
    return { label: 'At Risk', color: 'bg-destructive', textColor: 'text-destructive' };
  };
  
  const status = getStatus(currentData.sentiment);
  
  const generateNudges = () => {
    const nudges = [];
    
    if (currentData.sentiment >= 4.0) {
      if (currentData.productivity >= 95 && currentData.attendance > 90) {
        nudges.push({
          type: 'positive',
          icon: <CheckCircle className="w-5 h-5" />,
          message: "Team morale and productivity are in a good state 🎉",
          priority: 'low'
        });
      } else if (currentData.productivity < 95 || currentData.attendance <= 90) {
        nudges.push({
          type: 'attention',
          icon: <AlertTriangle className="w-5 h-5" />,
          message: "Team is happy but might be getting distracted or overworked.",
          action: "Consider a check-in with members showing lower engagement",
          priority: 'medium'
        });
      }
    } else if (currentData.sentiment >= 3.0 && currentData.sentiment < 4.0) {
      nudges.push({
        type: 'attention',
        icon: <AlertTriangle className="w-5 h-5" />,
        message: "Moderate morale detected. Schedule a quick pulse check.",
        action: "Stress signals may be present. Consider discussing during retro.",
        priority: 'medium'
      });
      
      if (currentData.attendance < 85) {
        nudges.push({
          type: 'attention',
          icon: <Users className="w-5 h-5" />,
          message: "Passive negativity spotted. Recommend 1:1s or informal coffee chats.",
          priority: 'medium'
        });
      }
    } else {
      nudges.push({
        type: 'urgent',
        icon: <AlertCircle className="w-5 h-5" />,
        message: "Team morale is low. Consider shortening sprints or team bonding activity.",
        priority: 'high'
      });
      
      if (currentData.absences >= 2) {
        nudges.push({
          type: 'urgent',
          icon: <AlertCircle className="w-5 h-5" />,
          message: "Burnout risk! Multiple low mood check-ins + high absenteeism this sprint.",
          action: "Urgently check in with the team. Consider workload redistribution.",
          priority: 'high'
        });
      }
    }
    
    if (selectedWeek > 1) {
      const prevSentiment = weeklyData[(selectedWeek - 1) as keyof typeof weeklyData].sentiment;
      const drop = prevSentiment - currentData.sentiment;
      if (drop >= 1.5) {
        nudges.push({
          type: 'urgent',
          icon: <TrendingDown className="w-5 h-5" />,
          message: "Sudden morale drop detected 🚨",
          action: "Recommend immediate check-in with team.",
          priority: 'high'
        });
      }
    }
    
    return nudges;
  };
  
  const nudges = generateNudges();
  
  const getMetricStatus = (metric: string, value: number) => {
    const thresholds: Record<string, { green: number; yellow: number }> = {
      sentiment: { green: 4.0, yellow: 3.0 },
      attendance: { green: 90, yellow: 80 },
      productivity: { green: 95, yellow: 85 }
    };
    
    const t = thresholds[metric];
    if (value >= t.green) return 'text-success bg-success-light';
    if (value >= t.yellow) return 'text-warning bg-warning-light';
    return 'text-destructive bg-destructive-light';
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-3xl">Team Sentiment Meter</CardTitle>
              <CardDescription className="text-base mt-2">Real-time morale tracking & intelligent nudges</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <select 
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(Number(e.target.value))}
                className="px-4 py-2 border border-input rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
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
          <div className={`${status.color} rounded-xl p-6 text-white shadow-md`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Status: {status.label}</h2>
                <p className="text-lg">Team Sentiment Score: {currentData.sentiment.toFixed(1)} / 5.0</p>
              </div>
              <div className="text-6xl font-bold opacity-80">
                {currentData.sentiment >= 4.0 ? '😊' : currentData.sentiment >= 3.0 ? '😐' : '😟'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`${getMetricStatus('sentiment', currentData.sentiment)} rounded-xl p-4 transition-smooth`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium mb-1">Team Sentiment</p>
                  <p className="text-2xl font-bold">{currentData.sentiment.toFixed(1)}</p>
                </div>
                <TrendingUp className="w-8 h-8 opacity-50" />
              </div>
              <div className="mt-2 text-xs opacity-75">Target: ≥4.0</div>
            </div>

            <div className={`${getMetricStatus('attendance', currentData.attendance)} rounded-xl p-4 transition-smooth`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium mb-1">Attendance</p>
                  <p className="text-2xl font-bold">{currentData.attendance}%</p>
                </div>
                <Users className="w-8 h-8 opacity-50" />
              </div>
              <div className="mt-2 text-xs opacity-75">Target: &gt;90%</div>
            </div>

            <div className={`${getMetricStatus('productivity', currentData.productivity)} rounded-xl p-4 transition-smooth`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium mb-1">Productivity</p>
                  <p className="text-2xl font-bold">{currentData.productivity}%</p>
                </div>
                <TrendingUp className="w-8 h-8 opacity-50" />
              </div>
              <div className="mt-2 text-xs opacity-75">Target: &gt;95%</div>
            </div>
          </div>

          <div className="bg-muted rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">4-Week Sentiment Trend</h3>
            <div className="flex items-end justify-around h-40 px-4">
              {Object.entries(weeklyData).map(([week, data]) => {
                const heightPercentage = (data.sentiment / 5) * 100;
                return (
                  <div key={week} className="flex flex-col items-center flex-1 max-w-[100px]">
                    <div className="relative w-full h-32 flex items-end justify-center">
                      <div 
                        className={`w-16 rounded-t-lg transition-all ${
                          selectedWeek === Number(week) ? 'ring-4 ring-primary shadow-glow' : ''
                        } ${
                          data.sentiment >= 4.0 ? 'bg-success' :
                          data.sentiment >= 3.0 ? 'bg-warning' : 'bg-destructive'
                        }`}
                        style={{ 
                          height: `${Math.max(heightPercentage, 5)}%`,
                          minHeight: '20px'
                        }}
                      >
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold">
                          {data.sentiment.toFixed(1)}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs mt-2 font-medium">Week {week}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">🔔 Nudge Feed & Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {nudges.map((nudge, index) => (
            <div 
              key={index}
              className={`border-l-4 rounded-lg p-4 transition-smooth ${
                nudge.type === 'positive' ? 'border-success bg-success-light' :
                nudge.type === 'attention' ? 'border-warning bg-warning-light' :
                'border-destructive bg-destructive-light'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`${
                  nudge.type === 'positive' ? 'text-success' :
                  nudge.type === 'attention' ? 'text-warning' :
                  'text-destructive'
                }`}>
                  {nudge.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{nudge.message}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      nudge.priority === 'high' ? 'bg-destructive text-destructive-foreground' :
                      nudge.priority === 'medium' ? 'bg-warning text-warning-foreground' :
                      'bg-success text-success-foreground'
                    }`}>
                      {nudge.priority.toUpperCase()}
                    </span>
                  </div>
                  {nudge.action && (
                    <p className="text-sm text-muted-foreground mt-2">
                      <strong>Suggested Action:</strong> {nudge.action}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="text-lg font-semibold mb-3">💡 Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button variant="outline" className="justify-start gap-2 h-auto py-3">
                <Coffee className="w-5 h-5" />
                <span>Schedule Team Coffee Chat</span>
              </Button>
              <Button variant="outline" className="justify-start gap-2 h-auto py-3">
                <Users className="w-5 h-5" />
                <span>Arrange 1:1 Check-ins</span>
              </Button>
              <Button variant="outline" className="justify-start gap-2 h-auto py-3">
                <Calendar className="w-5 h-5" />
                <span>Schedule Emergency Retro</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>📊 Threshold Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Metric</th>
                  <th className="px-4 py-2 text-center font-semibold">🟢 Green</th>
                  <th className="px-4 py-2 text-center font-semibold">🟡 Yellow</th>
                  <th className="px-4 py-2 text-center font-semibold">🔴 Red</th>
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
    </div>
  );
};

// Main Application Component
const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [page, setPage] = useState<PageType>('login');
  const { toast } = useToast();

  // Initialize authentication
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer database call
          setTimeout(() => {
            supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', session.user.id)
              .single()
              .then(({ data: roleData }) => {
                setRole(roleData?.role as UserRole ?? null);
                setPage('dashboard');
              });
          }, 0);
        } else {
          setRole(null);
          setPage('login');
        }
        
        setIsAuthReady(true);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single()
          .then(({ data: roleData }) => {
            setRole(roleData?.role as UserRole ?? null);
            setPage('dashboard');
          });
      }
      
      setIsAuthReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    setPage('login');
    toast({
      title: "Logged out successfully",
      description: "See you next time!",
    });
  };

  // Registration Page Component
  const RegistrationPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [selectedRole, setSelectedRole] = useState<'scrum_master' | 'adm'>('scrum_master');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo: `${window.location.origin}/`,
          },
        });

        if (signUpError) throw signUpError;
        if (!authData.user) throw new Error('No user returned from signup');

        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role: selectedRole,
          });

        if (roleError) throw roleError;

        toast({
          title: "Registration successful!",
          description: "Welcome to Agentic AI Coach",
        });

        setPage('dashboard');
      } catch (error: any) {
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-glow">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mb-4 shadow-md">
              <Activity className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
            <CardDescription className="text-base">Join Agentic AI Coach</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-card focus:ring-2 focus:ring-ring transition-smooth"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-card focus:ring-2 focus:ring-ring transition-smooth"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-card focus:ring-2 focus:ring-ring transition-smooth"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Select Your Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as 'scrum_master' | 'adm')}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-card focus:ring-2 focus:ring-ring transition-smooth"
                >
                  <option value="scrum_master">Scrum Master</option>
                  <option value="adm">Agile Delivery Manager (ADM)</option>
                </select>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 shadow-md hover:shadow-lg transition-smooth"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setPage('login')}
                className="text-primary hover:text-primary/80 font-medium transition-smooth"
              >
                Already have an account? Log in
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Login Page Component
  const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
        const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;
        if (!authData.user) throw new Error('No user returned from login');

        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', authData.user.id)
          .single();

        if (roleError) throw roleError;

        setRole(roleData.role as UserRole);
        setPage('dashboard');

        toast({
          title: "Login successful!",
          description: `Welcome back, ${roleData.role === 'scrum_master' ? 'Scrum Master' : 'ADM'}`,
        });
      } catch (error: any) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-glow">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mb-4 shadow-md">
              <Activity className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl font-bold">Agentic AI Coach</CardTitle>
            <CardDescription className="text-base">Sign in to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-card focus:ring-2 focus:ring-ring transition-smooth"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-card focus:ring-2 focus:ring-ring transition-smooth"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 shadow-md hover:shadow-lg transition-smooth"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setPage('register')}
                className="text-primary hover:text-primary/80 font-medium transition-smooth"
              >
                Don't have an account? Sign up
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Scrum Master Dashboard Component
  const ScrumMasterDashboard = () => (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Scrum Master Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Welcome, {user?.email}</span>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <TeamSentimentDashboard />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Agile Ritual Adherence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success mb-2">7/10</div>
              <p className="text-sm text-muted-foreground">Rituals Complete</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-warning" />
                Overall Sprint Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning mb-2">78%</div>
              <p className="text-sm text-muted-foreground">Complete, 4 Blockers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Knowledge Keeper (Chatbot)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full gap-2">
                <MessageSquare className="w-4 h-4" />
                Ask AI Assistant
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );

  // ADM Dashboard Component
  const ADMDashboard = () => (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">ADM Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Welcome, {user?.email}</span>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="w-5 h-5" />
                Delivery Risk Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-2xl font-bold text-destructive">HIGH Risk (2 Active)</div>
              <Button className="w-full gap-2">
                <Zap className="w-4 h-4" />
                Generate Mitigation Plan
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Delivery Countdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-2xl font-bold text-primary">12 Days Remaining</div>
              <Button className="w-full gap-2">
                <Zap className="w-4 h-4" />
                Generate Stakeholder Report
              </Button>
            </CardContent>
          </Card>

          <Card className="border-warning">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-warning" />
                Team Bandwidth & Availability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-2xl font-bold text-warning">80% Capacity</div>
              <p className="text-sm text-muted-foreground">3 PTO next week</p>
              <Button className="w-full gap-2">
                <Zap className="w-4 h-4" />
                Lock Capacity Next Sprint
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Dependency Heatmap
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-2xl font-bold text-primary">Medium Complexity</div>
              <Button className="w-full gap-2">
                <Zap className="w-4 h-4" />
                AI Suggests Path Split
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );

  // Main render
  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <div className="text-muted-foreground text-lg">Loading...</div>
      </div>
    );
  }

  if (page === 'register') {
    return <RegistrationPage />;
  }

  if (page === 'login') {
    return <LoginPage />;
  }

  if (user && role === 'scrum_master') {
    return <ScrumMasterDashboard />;
  }

  if (user && role === 'adm') {
    return <ADMDashboard />;
  }

  return <LoginPage />;
};

export default Index;
