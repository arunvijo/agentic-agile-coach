import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, AlertTriangle, CheckCircle, XCircle, Bell, Play, Eye, FileText,
  Rocket, Code, Search, TrendingUp, LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { handleLogout } from '../Index';

const AgileDeliveryTracker = () => {
  // Mock User for Demo Header
  const user = { email: 'test.adm@example.com' };
  const { toast } = useToast();

  const [hasActiveSprint, setHasActiveSprint] = useState(true);
  const [taskCompletion, setTaskCompletion] = useState(35);
  const [countdownDays, setCountdownDays] = useState(5);
  const [countdownHours, setCountdownHours] = useState(4);
  const [showPopup, setShowPopup] = useState<
    | 'noSprint'
    | 'behindVelocity'
    | 'velocityReport'
    | 'midSprint'
    | 'readinessCheck'
    | 'readinessResult'
    | 'allComplete'
    | 'releaseChecklist'
    | 'releaseSuccess'
    | 'deadlineMissed'
    | 'escalationReport'
    | null
  >(null);
  const [velocity, setVelocity] = useState(95);
  const [blockers, setBlockers] = useState(1);
  const [checklistItems, setChecklistItems] = useState({
    qaSignoff: false,
    stakeholder: false,
    deployment: false,
  });
  const [readinessCheck, setReadinessCheck] = useState<any>(null);
  const [showFireworks, setShowFireworks] = useState(false);
  const [showAlertIcon, setShowAlertIcon] = useState(false);
  const [releaseInProgress, setReleaseInProgress] = useState(false);

  // Toast helper
  const showAlert = (message: string) => {
    toast({ title: 'Notification', description: message });
  };

  useEffect(() => {
    if (!hasActiveSprint) setShowPopup('noSprint');
  }, [hasActiveSprint]);

  const [popupDismissed, setPopupDismissed] = useState({
    behindVelocity: false,
    midSprint: false,
    readinessCheck: false,
    allComplete: false,
    deadlineMissed: false,
  });

  useEffect(() => {
    if (hasActiveSprint && showPopup === 'noSprint') setShowPopup(null);

    if (hasActiveSprint && showPopup === null) {
      if (countdownDays === 0 && countdownHours === 0 && taskCompletion < 100 && !popupDismissed.deadlineMissed) {
        setShowPopup('deadlineMissed');
      } else if (taskCompletion === 100 && countdownDays > 0 && !popupDismissed.allComplete && !releaseInProgress) {
        setShowPopup('allComplete');
      } else if (taskCompletion >= 80 && countdownDays <= 3 && taskCompletion < 100 && !popupDismissed.readinessCheck) {
        setShowPopup('readinessCheck');
      } else if (taskCompletion >= 50 && taskCompletion < 80 && !popupDismissed.midSprint) {
        setShowPopup('midSprint');
      } else if (taskCompletion < 50 && !popupDismissed.behindVelocity) {
        setShowPopup('behindVelocity');
      }
    }
  }, [
    taskCompletion,
    countdownDays,
    countdownHours,
    hasActiveSprint,
    showPopup,
    popupDismissed,
    releaseInProgress,
  ]);

  const getProgressColor = () => {
    if (countdownDays === 0 && countdownHours === 0 && taskCompletion < 100) return 'bg-rose-600';
    if (taskCompletion < 50) return 'bg-amber-500';
    if (taskCompletion >= 50 && taskCompletion < 80) return 'bg-primary';
    if (taskCompletion >= 80) return 'bg-emerald-600';
    return 'bg-muted-foreground';
    };
  
  const getReadinessStatus = () => {
    if (velocity >= 100 && blockers === 0) {
      return {
        status: 'On Track',
        color: 'text-emerald-700',
        bg: 'bg-emerald-50',
        message: 'Good job! Sprint likely to complete on time.',
      };
    }
    if (velocity < 100 && blockers <= 2) {
      return {
        status: 'At Risk',
        color: 'text-amber-700',
        bg: 'bg-amber-50',
        message: 'Velocity dip detected. Recommend mid-sprint catch-up plan.',
      };
    }
    return {
      status: 'Critical',
      color: 'text-rose-700',
      bg: 'bg-rose-50',
      message: 'Multiple blockers – escalate to Scrum Master.',
    };
  };

  const startNewSprint = () => {
    setHasActiveSprint(true);
    setTaskCompletion(35);
    setCountdownDays(5);
    setCountdownHours(4);
    setShowPopup(null);
    setVelocity(95);
    setBlockers(1);
    setPopupDismissed({
      behindVelocity: false,
      midSprint: false,
      readinessCheck: false,
      allComplete: false,
      deadlineMissed: false,
    });
  };

  const runReadinessCheck = () => {
    setReadinessCheck({ codeMerged: true, qaPassed: true, documentation: false });
    setShowPopup('readinessResult');
  };

  const proceedToRelease = () => {
    setReleaseInProgress(true);
    setShowPopup('releaseChecklist');
  };

  const completeRelease = () => {
    if (checklistItems.qaSignoff && checklistItems.stakeholder && checklistItems.deployment) {
      setShowPopup(null);
      setShowFireworks(true);
      setTimeout(() => setShowPopup('releaseSuccess'), 2000);
    }
  };

  // Reusable popup shell (glassy)
  const Popup = ({ children }: { children: React.ReactNode }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md rounded-2xl border bg-card/90 p-6 shadow-2xl backdrop-blur supports-[backdrop-filter]:bg-card/70">
        {children}
      </Card>
    </div>
  );

  // Slide-in keyframes for future toast-like panels if needed
  const SlideInKeyframes = (
    <style>
      {`
        @keyframes slideIn {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-in { animation: slideIn 0.25s ease-out both; }
      `}
    </style>
  );

  const renderPopup = () => {
    switch (showPopup) {
      case 'noSprint':
        return (
          <Popup>
            <div className="text-center">
              <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-amber-600" />
              <h3 className="mb-2 text-xl font-bold">No Active Sprint</h3>
              <p className="mb-6 text-muted-foreground">Would you like to start a new one?</p>
              <div className="flex justify-center gap-3">
                <Button onClick={startNewSprint} className="gap-2 rounded-xl">
                  <Play className="h-4 w-4" /> Start New Sprint
                </Button>
                <Button
                  onClick={() => {
                    setShowPopup(null);
                    setHasActiveSprint(false);
                  }}
                  variant="outline"
                  className="rounded-xl"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Popup>
        );

      case 'behindVelocity':
        return (
          <Popup>
            <div className="text-center">
              <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-amber-600" />
              <h3 className="mb-2 text-xl font-bold">Project Behind Expected Velocity</h3>
              <p className="mb-6 text-muted-foreground">Trigger Daily Stand-up Review?</p>
              <div className="flex justify-center gap-3">
                <Button onClick={() => setShowPopup('velocityReport')} className="rounded-xl">
                  Yes
                </Button>
                <Button
                  onClick={() => {
                    setShowPopup(null);
                    setPopupDismissed({ ...popupDismissed, behindVelocity: true });
                  }}
                  variant="outline"
                  className="rounded-xl"
                >
                  No
                </Button>
              </div>
            </div>
          </Popup>
        );

      case 'velocityReport':
        return (
          <Popup>
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold">
                <TrendingUp className="h-6 w-6 text-primary" />
                Team Velocity Report
              </h3>
              <div className="mb-6 space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                  <span className="font-semibold">John Doe</span>
                  <span className="text-sm">Completed: 8 | Pending: 3</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                  <span className="font-semibold">Jane Smith</span>
                  <span className="text-sm">Completed: 12 | Pending: 1</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                  <span className="font-semibold">Mike Johnson</span>
                  <span className="text-sm">Completed: 6 | Pending: 5</span>
                </div>
              </div>
              <Button
                onClick={() => {
                  setShowPopup(null);
                  setPopupDismissed({ ...popupDismissed, behindVelocity: true });
                }}
                className="w-full rounded-xl"
              >
                Close
              </Button>
            </div>
          </Popup>
        );

      case 'midSprint':
        return (
          <Popup>
            <div className="text-center">
              <Calendar className="mx-auto mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-2 text-xl font-bold">Mid-Sprint Review Due</h3>
              <p className="text-muted-foreground">Mid-Sprint Review due tomorrow.</p>
              <p className="mb-6 text-muted-foreground">Would you like to schedule it now?</p>
              <div className="flex justify-center gap-3">
                <Button
                  onClick={() => {
                    setShowPopup(null);
                    setPopupDismissed({ ...popupDismissed, midSprint: true });
                    showAlert(
                      'Reminder added to notifications — You will be notified tomorrow morning about the Mid-Sprint Review'
                    );
                  }}
                  className="rounded-xl"
                >
                  Schedule Review
                </Button>
                <Button
                  onClick={() => {
                    setShowPopup(null);
                    setPopupDismissed({ ...popupDismissed, midSprint: true });
                    showAlert(
                      'Reminder added to notifications — You will be notified about the Mid-Sprint Review'
                    );
                  }}
                  variant="outline"
                  className="rounded-xl"
                >
                  Later
                </Button>
              </div>
            </div>
          </Popup>
        );

      case 'readinessCheck':
        return (
          <Popup>
            <div className="text-center">
              <CheckCircle className="mx-auto mb-4 h-12 w-12 text-emerald-600" />
              <h3 className="mb-2 text-xl font-bold">Final QA and Documentation Required</h3>
              <p className="mb-6 text-muted-foreground">Run readiness check for final validation?</p>
              <div className="flex justify-center gap-3">
                <Button onClick={runReadinessCheck} className="rounded-xl">
                  Run Readiness Check
                </Button>
                <Button
                  onClick={() => {
                    setShowPopup(null);
                    setShowAlertIcon(true);
                    setPopupDismissed({ ...popupDismissed, readinessCheck: true });
                  }}
                  variant="outline"
                  className="rounded-xl"
                >
                  Ignore
                </Button>
              </div>
            </div>
          </Popup>
        );

      case 'readinessResult':
        return (
          <Popup>
            <div>
              <h3 className="mb-4 text-xl font-bold">Readiness Check Results</h3>
              <div className="mb-6 space-y-3">
                <div className="flex items-center gap-3 rounded-lg bg-emerald-50 p-2">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span>Code Merged</span>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-emerald-50 p-2">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span>QA Passed</span>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-rose-50 p-2">
                  <XCircle className="h-5 w-5 text-rose-600" />
                  <span>Documentation Pending</span>
                </div>
              </div>
              <p className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-700">All tasks ready except documentation.</p>
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setShowPopup(null);
                    setShowAlertIcon(true);
                    setPopupDismissed({ ...popupDismissed, readinessCheck: true });
                    showAlert('Automated notifications sent to Technical Writer and Documentation team.');
                  }}
                  className="flex-1 rounded-xl"
                >
                  Notify Technical Writer
                </Button>
                <Button
                  onClick={() => {
                    setShowPopup(null);
                    setPopupDismissed({ ...popupDismissed, readinessCheck: true });
                  }}
                  className="flex-1 rounded-xl"
                  variant="outline"
                >
                  Close
                </Button>
              </div>
            </div>
          </Popup>
        );

      case 'allComplete':
        return (
          <Popup>
            <div className="text-center">
              <CheckCircle className="mx-auto mb-4 h-12 w-12 animate-bounce text-emerald-600" />
              <h3 className="mb-4 text-xl font-bold">All Tasks Complete!</h3>
              <div className="mb-4 rounded-lg bg-emerald-50 p-3 font-semibold text-emerald-700">Ready for Release</div>
              <p className="mb-6 text-muted-foreground">Proceed to Release Handoff?</p>
              <div className="flex justify-center gap-3">
                <Button onClick={proceedToRelease} className="rounded-xl">
                  Yes
                </Button>
                <Button
                  onClick={() => {
                    setShowPopup(null);
                    setPopupDismissed({ ...popupDismissed, allComplete: true });
                    showAlert('Reminder set for 12 hours before scheduled delivery');
                  }}
                  variant="outline"
                  className="rounded-xl"
                >
                  No
                </Button>
              </div>
            </div>
          </Popup>
        );

      case 'releaseChecklist':
        return (
          <Popup>
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold">
                <Rocket className="h-6 w-6 text-primary" />
                Release Checklist
              </h3>
              <div className="mb-6 space-y-3">
                <label className="flex cursor-pointer items-center gap-3 rounded-lg bg-muted p-3 hover:bg-muted/70">
                  <input
                    type="checkbox"
                    checked={checklistItems.qaSignoff}
                    onChange={(e) => setChecklistItems({ ...checklistItems, qaSignoff: e.target.checked })}
                    className="h-5 w-5 rounded border-border bg-background text-primary focus:ring-primary"
                  />
                  <span className="flex-1">Confirm QA sign-off</span>
                  {checklistItems.qaSignoff && <CheckCircle className="h-5 w-5 text-emerald-600" />}
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg bg-muted p-3 hover:bg-muted/70">
                  <input
                    type="checkbox"
                    checked={checklistItems.stakeholder}
                    onChange={(e) => setChecklistItems({ ...checklistItems, stakeholder: e.target.checked })}
                    className="h-5 w-5 rounded border-border bg-background text-primary focus:ring-primary"
                  />
                  <span className="flex-1">Confirm Stakeholder approval</span>
                  {checklistItems.stakeholder && <CheckCircle className="h-5 w-5 text-emerald-600" />}
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg bg-muted p-3 hover:bg-muted/70">
                  <input
                    type="checkbox"
                    checked={checklistItems.deployment}
                    onChange={(e) => setChecklistItems({ ...checklistItems, deployment: e.target.checked })}
                    className="h-5 w-5 rounded border-border bg-background text-primary focus:ring-primary"
                  />
                  <span className="flex-1">Confirm Deployment readiness</span>
                  {checklistItems.deployment && <CheckCircle className="h-5 w-5 text-emerald-600" />}
                </label>
              </div>
              <Button
                onClick={completeRelease}
                disabled={!checklistItems.qaSignoff || !checklistItems.stakeholder || !checklistItems.deployment}
                className="w-full rounded-xl"
              >
                {checklistItems.qaSignoff && checklistItems.stakeholder && checklistItems.deployment
                  ? 'Complete Release'
                  : 'Complete All Items'}
              </Button>
            </div>
          </Popup>
        );

      case 'releaseSuccess':
        return (
          <Popup>
            <div className="text-center">
              <div className="mb-4 text-6xl">🎉</div>
              <h3 className="mb-4 text-2xl font-bold text-emerald-700">Sprint Successfully Delivered!</h3>
              <div className="mb-6 rounded-lg bg-emerald-50 p-4 text-left text-emerald-700">
                <p className="mb-2">
                  <strong>Total Tasks:</strong> 124
                </p>
                <p className="mb-2">
                  <strong>Completed:</strong> 124
                </p>
                <p className="mb-2">
                  <strong>QA Defects:</strong> 2 (resolved)
                </p>
                <p className="mb-2">
                  <strong>Delivery On Time:</strong> <span className="font-bold">Yes</span>
                </p>
              </div>
              <p className="mb-6 text-muted-foreground">Would you like to create a retrospective report?</p>
              <div className="flex justify-center gap-3">
                <Button
                  onClick={() => {
                    setShowPopup(null);
                    setShowFireworks(false);
                    showAlert('Opening retrospective summary screen...');
                  }}
                  className="rounded-xl"
                >
                  Yes
                </Button>
                <Button
                  onClick={() => {
                    setShowPopup(null);
                    setShowFireworks(false);
                  }}
                  variant="outline"
                  className="rounded-xl"
                >
                  No
                </Button>
              </div>
            </div>
          </Popup>
        );

      case 'deadlineMissed':
        return (
          <Popup>
            <div className="text-center">
              <XCircle className="mx-auto mb-4 h-12 w-12 text-rose-600" />
              <h3 className="mb-4 text-xl font-bold text-rose-700">Delivery Deadline Breached</h3>
              <p className="mb-6 rounded-lg bg-rose-50 p-3 text-rose-700">Escalation Required</p>
              <div className="flex justify-center gap-3">
                <Button onClick={() => setShowPopup('escalationReport')} variant="destructive" className="rounded-xl">
                  View Escalation Report
                </Button>
                <Button
                  onClick={() => {
                    setShowPopup(null);
                    setPopupDismissed({ ...popupDismissed, deadlineMissed: true });
                    showAlert('Status logged: Deadline Missed — Manager Acknowledged');
                  }}
                  variant="outline"
                  className="rounded-xl"
                >
                  Acknowledge
                </Button>
              </div>
            </div>
          </Popup>
        );

      case 'escalationReport':
        return (
          <Popup>
            <div>
              <h3 className="mb-4 text-xl font-bold text-rose-700">Escalation Report</h3>
              <div className="mb-6 space-y-4">
                <div className="rounded-lg bg-rose-50 p-4">
                  <p className="mb-3 font-semibold text-rose-700">Incomplete Tasks:</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-rose-600">•</span>
                      <span>User Authentication Module — Owner: John Doe</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-600">•</span>
                      <span>API Integration Testing — Owner: Jane Smith</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-600">•</span>
                      <span>Performance Optimization — Owner: Mike Johnson</span>
                    </li>
                  </ul>
                </div>
                <div className="rounded-lg bg-rose-50 p-4">
                  <p className="font-semibold text-rose-700">
                    Time Overrun: <span className="text-2xl">2 days</span>
                  </p>
                </div>
              </div>
              <Button onClick={() => setShowPopup(null)} variant="secondary" className="w-full rounded-xl">
                Close Report
              </Button>
            </div>
          </Popup>
        );

      default:
        return null;
    }
  };

  const readinessStatus = getReadinessStatus();

  if (!hasActiveSprint) {
    return (
      <div
        className="
          flex min-h-screen items-center justify-center p-8
          bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))]
          from-muted/40 via-background to-muted/30
        "
      >
        {renderPopup()}
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen p-4 md:p-8
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
          <h1 className="text-xl font-semibold tracking-tight">Agile Delivery Tracker</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Welcome, {user.email}</span>
            <Button onClick={() => handleLogout(toast)} variant="outline" size="sm" className="gap-2 rounded-xl">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {showFireworks && (
        <div className="pointer-events-none fixed inset-0 z-40">
          <div className="absolute left-20 top-20 animate-bounce text-6xl">🎆</div>
          <div className="absolute right-20 top-32 animate-bounce text-6xl">🎉</div>
          <div className="absolute bottom-32 left-32 animate-bounce text-6xl">✨</div>
          <div className="absolute bottom-20 right-32 animate-bounce text-6xl">🎊</div>
        </div>
      )}

      {renderPopup()}

      <div className="mx-auto max-w-7xl pt-6">
        {/* Progress & Countdown */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Task Completion */}
          <Card className="rounded-2xl bg-card/80 p-6 shadow-md backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Task Completion</h2>
              <span className="text-2xl font-bold text-primary">{taskCompletion}%</span>
            </div>
            <div className="h-8 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={`flex h-full items-center justify-center font-semibold text-white transition-all duration-500 ${getProgressColor()} ${taskCompletion === 100 ? 'animate-pulse' : ''}`}
                style={{ width: `${taskCompletion}%` }}
              >
                {taskCompletion > 10 && `${taskCompletion}%`}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                onClick={() => {
                  const newCompletion = Math.min(100, taskCompletion + 10);
                  setTaskCompletion(newCompletion);
                  if (newCompletion >= 50 && newCompletion < 80) {
                    setPopupDismissed({ ...popupDismissed, midSprint: false });
                  } else if (newCompletion >= 80 && newCompletion < 100) {
                    setPopupDismissed({ ...popupDismissed, readinessCheck: false });
                  } else if (newCompletion === 100) {
                    setPopupDismissed({ ...popupDismissed, allComplete: false });
                  }
                }}
                size="sm"
                className="rounded-xl"
              >
                + 10% Progress
              </Button>
              <Button
                onClick={() => {
                  const newCompletion = Math.max(0, taskCompletion - 10);
                  setTaskCompletion(newCompletion);
                  if (newCompletion < 50) {
                    setPopupDismissed({ ...popupDismissed, behindVelocity: false });
                  } else if (newCompletion >= 50 && newCompletion < 80) {
                    setPopupDismissed({ ...popupDismissed, midSprint: false });
                  } else if (newCompletion >= 80 && newCompletion < 100) {
                    setPopupDismissed({ ...popupDismissed, readinessCheck: false });
                  }
                }}
                variant="destructive"
                size="sm"
                className="rounded-xl"
              >
                - 10% Progress
              </Button>
              <Button
                onClick={() => {
                  setTaskCompletion(100);
                  setPopupDismissed({ ...popupDismissed, allComplete: false });
                }}
                variant="secondary"
                size="sm"
                className="rounded-xl"
              >
                Set to 100%
              </Button>
            </div>
          </Card>

          {/* Delivery Countdown */}
          <Card className="rounded-2xl bg-card/80 p-6 shadow-md backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <div className="mb-4 flex items-center gap-3">
              <Clock className="h-6 w-6 text-amber-600" />
              <h2 className="text-xl font-semibold">Delivery Countdown Timer</h2>
            </div>
            <div className="mb-4 flex items-center justify-center gap-6">
              <div className="text-center">
                <div className={`text-4xl md:text-5xl font-bold ${countdownDays <= 3 ? 'text-rose-600' : 'text-primary'}`}>
                  {countdownDays}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">Days</div>
              </div>
              <div className="text-4xl text-muted-foreground">:</div>
              <div className="text-center">
                <div className={`text-4xl md:text-5xl font-bold ${countdownDays <= 3 ? 'text-rose-600' : 'text-primary'}`}>
                  {countdownHours}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">Hours</div>
              </div>
            </div>
            {taskCompletion === 100 && countdownDays > 0 && (
              <div className="mb-4 rounded-lg bg-emerald-50 p-3 text-center font-semibold text-emerald-700">
                Ready for Release
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => {
                  const newDays = Math.max(0, countdownDays - 1);
                  setCountdownDays(newDays);
                  if (newDays <= 3 && taskCompletion >= 80 && taskCompletion < 100) {
                    setPopupDismissed({ ...popupDismissed, readinessCheck: false });
                  }
                }}
                variant="secondary"
                size="sm"
                className="rounded-xl"
              >
                - 1 Day
              </Button>
              <Button
                onClick={() => {
                  setCountdownDays(2);
                  setCountdownHours(0);
                  if (taskCompletion >= 80 && taskCompletion < 100) {
                    setPopupDismissed({ ...popupDismissed, readinessCheck: false });
                  }
                }}
                variant="outline"
                size="sm"
                className="rounded-xl"
              >
                Set to 2 Days
              </Button>
              <Button
                onClick={() => {
                  setCountdownDays(0);
                  setCountdownHours(0);
                  if (taskCompletion < 100) setPopupDismissed({ ...popupDismissed, deadlineMissed: false });
                }}
                variant="destructive"
                size="sm"
                className="flex items-center gap-2 rounded-xl"
              >
                <AlertTriangle className="h-4 w-4" />
                Reach Deadline (0:0)
              </Button>
            </div>
          </Card>
        </div>

        {/* Sprint Timeline */}
        <Card className="mb-6 rounded-2xl bg-card/80 p-6 shadow-md backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <h2 className="mb-6 text-xl font-semibold">Visual Sprint Timeline</h2>
          <div className="relative overflow-x-auto pb-4">
            <div className="min-w-[600px] items-center justify-between md:min-w-0 lg:flex">
              {/* Sprint Start */}
              <div className="flex-1 px-2 text-center">
                <div
                  className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${taskCompletion >= 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                >
                  <Code className="h-8 w-8" />
                </div>
                <p className="mt-2 whitespace-nowrap text-sm font-semibold">Sprint Start</p>
                <p className="text-xs text-muted-foreground">Coding</p>
              </div>
              {/* Connector 1 */}
              <div className={`min-w-16 h-2 flex-1 ${taskCompletion >= 50 ? 'bg-primary' : 'bg-muted'}`} />
              {/* Mid Review */}
              <div className="flex-1 px-2 text-center">
                <div
                  className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${taskCompletion >= 50 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                >
                  <Eye className="h-8 w-8" />
                </div>
                <p className="mt-2 whitespace-nowrap text-sm font-semibold">Mid Review</p>
                <p className="text-xs text-muted-foreground">50% Progress</p>
              </div>
              {/* Connector 2 */}
              <div className={`min-w-16 h-2 flex-1 ${taskCompletion >= 80 ? 'bg-primary' : 'bg-muted'}`} />
              {/* QA Stage */}
              <div className="flex-1 px-2 text-center">
                <div
                  className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${taskCompletion >= 80 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                >
                  <Search className="h-8 w-8" />
                </div>
                <p className="mt-2 whitespace-nowrap text-sm font-semibold">QA Stage</p>
                <p className="text-xs text-muted-foreground">80% Progress</p>
              </div>
              {/* Connector 3 */}
              <div className={`min-w-16 h-2 flex-1 ${taskCompletion === 100 ? 'bg-primary' : 'bg-muted'}`} />
              {/* Delivery */}
              <div className="flex-1 px-2 text-center">
                <div
                  className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${taskCompletion === 100 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                >
                  <Rocket className="h-8 w-8" />
                </div>
                <p className="mt-2 whitespace-nowrap text-sm font-semibold">Delivery</p>
                <p className="text-xs text-muted-foreground">Release Ready</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Readiness & Forecast */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Code Complete */}
          <Card className="rounded-2xl bg-card/80 p-6 shadow-md backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <div className="mb-3 flex items-center gap-3">
              <Code className={`h-6 w-6 ${taskCompletion >= 25 ? 'text-emerald-600' : 'text-muted-foreground'}`} />
              <h3 className="text-sm font-semibold">Code Complete</h3>
            </div>
            <p className={`text-3xl font-bold ${taskCompletion >= 25 ? 'text-emerald-600' : 'text-muted-foreground'}`}>
              {taskCompletion >= 25 ? '✅' : '⏳'}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {taskCompletion >= 25 ? 'All code merged' : 'In progress'}
            </p>
          </Card>

          {/* QA Status */}
          <Card className="rounded-2xl bg-card/80 p-6 shadow-md backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <div className="mb-3 flex items-center gap-3">
              <Search className={`h-6 w-6 ${taskCompletion >= 50 ? 'text-primary' : 'text-muted-foreground'}`} />
              <h3 className="text-sm font-semibold">QA Status</h3>
            </div>
            <p className={`text-3xl font-bold ${taskCompletion >= 50 ? 'text-primary' : 'text-muted-foreground'}`}>
              {taskCompletion >= 50 ? '🔍' : '⏳'}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {taskCompletion >= 50 ? 'Testing active' : 'Waiting for code'}
            </p>
          </Card>

          {/* Deployment Prep */}
          <Card className="rounded-2xl bg-card/80 p-6 shadow-md backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <div className="mb-3 flex items-center gap-3">
              <Rocket className={`h-6 w-6 ${taskCompletion >= 75 ? 'text-primary' : 'text-muted-foreground'}`} />
              <h3 className="text-sm font-semibold">Deployment Prep</h3>
            </div>
            <p className={`text-3xl font-bold ${taskCompletion >= 75 ? 'text-primary' : 'text-muted-foreground'}`}>
              {taskCompletion >= 75 ? '⚙️' : '⏳'}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {taskCompletion >= 75 ? 'Ready to deploy' : 'Not ready yet'}
            </p>
          </Card>

          {/* Documentation */}
          <Card className="relative rounded-2xl bg-card/80 p-6 shadow-md backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <div className="mb-3 flex items-center gap-3">
              <FileText className={`h-6 w-6 ${taskCompletion >= 90 ? 'text-amber-600' : 'text-muted-foreground'}`} />
              <h3 className="text-sm font-semibold">Documentation</h3>
              {showAlertIcon && <Bell className="absolute right-4 top-4 h-5 w-5 animate-pulse text-rose-600" />}
            </div>
            <p className={`text-3xl font-bold ${taskCompletion >= 90 ? 'text-amber-600' : 'text-muted-foreground'}`}>
              {taskCompletion >= 90 ? '🧾' : '⏳'}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {showAlertIcon ? 'Pending review' : taskCompletion >= 90 ? 'Up to date' : 'In progress'}
            </p>
          </Card>
        </div>

        {/* Forecast Delivery Readiness Tracker */}
        <Card className="rounded-2xl bg-card/80 p-6 shadow-md backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <h2 className="mb-4 text-xl font-semibold">Forecast Delivery Readiness Tracker</h2>
          <div className={`${readinessStatus.bg} ${readinessStatus.color} mb-4 rounded-lg p-4 text-lg font-semibold`}>
            Status: {readinessStatus.status}
          </div>
          <p className="mb-4 rounded-lg bg-muted p-3 text-sm text-muted-foreground">{readinessStatus.message}</p>
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold">Team Velocity (%)</label>
              <input
                type="range"
                min="0"
                max="150"
                value={velocity}
                onChange={(e) => setVelocity(Number(e.target.value))}
                className="range-lg h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted"
              />
              <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span className="text-base font-semibold">{velocity}%</span>
                <span>150%</span>
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold">Active Blockers</label>
              <input
                type="number"
                min="0"
                max="10"
                value={blockers}
                onChange={(e) => setBlockers(Number(e.target.value))}
                className="w-full rounded-lg border border-input bg-background px-3 py-2"
              />
              <p className="mt-1 text-xs text-muted-foreground">Number of blocking issues</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AgileDeliveryTracker;
