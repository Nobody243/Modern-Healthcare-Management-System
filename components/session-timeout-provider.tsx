'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, LogOut, Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SessionTimeoutContextType {
  lastActivity: number;
  resetInactivityTimer: () => void;
  performLogout: (reason?: string) => Promise<void>;
}

const SessionTimeoutContext = createContext<SessionTimeoutContextType>({
  lastActivity: Date.now(),
  resetInactivityTimer: () => {},
  performLogout: async () => {},
});

export const useSessionTimeout = () => useContext(SessionTimeoutContext);

// 15 Minutes Inactivity Limit (HIPAA & Healthcare standard)
const DEFAULT_TIMEOUT_MINUTES = 15;
const INACTIVITY_TIMEOUT_MS =
  (Number(process.env.NEXT_PUBLIC_SESSION_TIMEOUT_MINUTES) || DEFAULT_TIMEOUT_MINUTES) * 60 * 1000;

// 60-Second Interactive Warning Window (at 14 minutes of inactivity)
const WARNING_WINDOW_MS = 60 * 1000;
const THROTTLE_ACTIVITY_MS = 3000; // Throttle storage writes to every 3s
const STORAGE_KEY_LAST_ACTIVITY = 'hms_last_activity_time';
const STORAGE_KEY_LOGOUT_SIGNAL = 'hms_logout_broadcast';

export function SessionTimeoutProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [showWarning, setShowWarning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(60);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const lastActivityRef = useRef<number>(Date.now());
  const lastTickTimeRef = useRef<number>(Date.now());
  const lastStorageWriteRef = useRef<number>(0);
  const warningOpenRef = useRef<boolean>(false);

  // Sync ref with state
  useEffect(() => {
    warningOpenRef.current = showWarning;
  }, [showWarning]);

  // Is this route a public unauthenticated route?
  const isPublicRoute =
    !pathname ||
    pathname === '/login' ||
    pathname === '/' ||
    pathname === '/unauthorized' ||
    pathname.startsWith('/api');

  // Trigger logout across all tabs and redirect
  const performLogout = useCallback(
    async (reason: string = 'inactivity') => {
      if (isLoggingOut) return;
      setIsLoggingOut(true);

      try {
        // Broadcast logout event to other tabs
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(STORAGE_KEY_LOGOUT_SIGNAL, JSON.stringify({ time: Date.now(), reason }));
            localStorage.removeItem(STORAGE_KEY_LAST_ACTIVITY);
            sessionStorage.clear();
          } catch {}
        }

        // Invalidate server cookie
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Accept: 'application/json' },
        }).catch(() => {});
      } finally {
        setShowWarning(false);
        setIsLoggingOut(false);
        if (typeof window !== 'undefined') {
          window.location.href = `/login?reason=${encodeURIComponent(reason)}`;
        }
      }
    },
    [isLoggingOut]
  );

  // Reset inactivity timer when user interacts
  const resetInactivityTimer = useCallback(() => {
    const now = Date.now();
    lastActivityRef.current = now;
    setShowWarning(false);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_LAST_ACTIVITY, now.toString());
      } catch {}
    }
  }, []);

  // Check elapsed time and manage warning / logout states
  const checkSessionStatus = useCallback(() => {
    if (isPublicRoute || isLoggingOut) return;

    const now = Date.now();
    let recordedActivity = lastActivityRef.current;

    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_LAST_ACTIVITY);
        if (stored) {
          const parsed = parseInt(stored, 10);
          if (!isNaN(parsed) && parsed > recordedActivity && parsed <= now) {
            recordedActivity = parsed;
            lastActivityRef.current = parsed;
          }
        }
      } catch {}
    }

    const elapsed = now - recordedActivity;

    // Timeout exceeded -> Logout immediately
    if (elapsed >= INACTIVITY_TIMEOUT_MS) {
      performLogout('inactivity');
      return;
    }

    // Inside 60s warning window -> Show countdown modal
    const timeUntilTimeout = INACTIVITY_TIMEOUT_MS - elapsed;
    if (timeUntilTimeout <= WARNING_WINDOW_MS) {
      const remainingSecs = Math.max(1, Math.ceil(timeUntilTimeout / 1000));
      setSecondsRemaining(remainingSecs);
      setShowWarning(true);
    } else {
      // Inactive window cleared or refreshed
      if (warningOpenRef.current) {
        setShowWarning(false);
      }
    }
  }, [isPublicRoute, isLoggingOut, performLogout]);

  // Main lifecycle & event tracking setup
  useEffect(() => {
    if (isPublicRoute) {
      setShowWarning(false);
      return;
    }

    // Initialize or validate last activity for this protected session
    const now = Date.now();
    lastActivityRef.current = now;
    lastTickTimeRef.current = now;

    if (typeof window !== 'undefined') {
      try {
        // Clear any stale broadcast signals from past sessions
        localStorage.removeItem(STORAGE_KEY_LOGOUT_SIGNAL);

        const stored = localStorage.getItem(STORAGE_KEY_LAST_ACTIVITY);
        if (stored) {
          const parsed = parseInt(stored, 10);
          // If stored activity timestamp is within active window, sync to it
          if (!isNaN(parsed) && parsed <= now && now - parsed < INACTIVITY_TIMEOUT_MS) {
            lastActivityRef.current = parsed;
          } else {
            // Fresh visit / new login -> reset timestamp to now
            localStorage.setItem(STORAGE_KEY_LAST_ACTIVITY, now.toString());
            lastActivityRef.current = now;
          }
        } else {
          localStorage.setItem(STORAGE_KEY_LAST_ACTIVITY, now.toString());
          lastActivityRef.current = now;
        }
      } catch {
        lastActivityRef.current = now;
      }
    }

    // User interaction handler (throttled)
    const handleUserActivity = () => {
      // Don't auto-dismiss the warning modal just on accidental mouse move;
      // require explicit click on "Stay Logged In" if warning is open.
      if (warningOpenRef.current) return;

      const currentTime = Date.now();
      lastActivityRef.current = currentTime;

      // Throttle localStorage updates to prevent performance overhead
      if (currentTime - lastStorageWriteRef.current > THROTTLE_ACTIVITY_MS) {
        lastStorageWriteRef.current = currentTime;
        try {
          localStorage.setItem(STORAGE_KEY_LAST_ACTIVITY, currentTime.toString());
        } catch {}
      }
    };

    // System sleep / hibernation / wake-up detector
    // When PC sleeps or tab freezes, timer ticks pause.
    // When PC wakes up, tick delta or visibility change detects large time jump.
    const handleWakeOrFocus = () => {
      if (isPublicRoute || isLoggingOut) return;
      const currentTime = Date.now();
      let recordedActivity = lastActivityRef.current;

      try {
        const stored = localStorage.getItem(STORAGE_KEY_LAST_ACTIVITY);
        if (stored) {
          const parsed = parseInt(stored, 10);
          if (!isNaN(parsed) && parsed <= currentTime) {
            recordedActivity = Math.max(recordedActivity, parsed);
          }
        }
      } catch {}

      const elapsed = currentTime - recordedActivity;

      if (elapsed >= INACTIVITY_TIMEOUT_MS) {
        // System was asleep or idle for longer than allowed session limit
        performLogout('suspended');
      } else {
        checkSessionStatus();
      }
    };

    // Cross-tab synchronization via storage events
    const handleStorageEvent = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY_LOGOUT_SIGNAL && event.newValue) {
        // Another tab triggered logout
        try {
          const payload = JSON.parse(event.newValue);
          if (payload?.time && Date.now() - payload.time < 15000) {
            window.location.href = `/login?reason=${encodeURIComponent(payload.reason || 'inactivity')}`;
          }
        } catch {
          window.location.href = '/login?reason=inactivity';
        }
      } else if (event.key === STORAGE_KEY_LAST_ACTIVITY && event.newValue) {
        // Another tab recorded activity -> update this tab's state
        const parsed = parseInt(event.newValue, 10);
        if (!isNaN(parsed) && parsed <= Date.now()) {
          lastActivityRef.current = Math.max(lastActivityRef.current, parsed);
          if (Date.now() - parsed < INACTIVITY_TIMEOUT_MS - WARNING_WINDOW_MS) {
            setShowWarning(false);
          }
        }
      }
    };

    // Activity event listeners
    const activityEvents = [
      'mousemove',
      'mousedown',
      'keydown',
      'touchstart',
      'scroll',
      'wheel',
      'pointerdown',
    ];

    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, handleUserActivity, { passive: true });
    });

    // Sleep / Wakeup / Focus / Visibility listeners
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        handleWakeOrFocus();
      }
    });
    window.addEventListener('focus', handleWakeOrFocus);
    window.addEventListener('storage', handleStorageEvent);

    // Heartbeat ticker (checks every 1s)
    const intervalId = setInterval(() => {
      const currentTime = Date.now();
      const tickDelta = currentTime - lastTickTimeRef.current;
      lastTickTimeRef.current = currentTime;

      // If tick gap > 4s, OS went to sleep or thread suspended
      if (tickDelta > 4000) {
        handleWakeOrFocus();
      } else {
        checkSessionStatus();
      }
    }, 1000);

    return () => {
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, handleUserActivity);
      });
      document.removeEventListener('visibilitychange', handleWakeOrFocus);
      window.removeEventListener('focus', handleWakeOrFocus);
      window.removeEventListener('storage', handleStorageEvent);
      clearInterval(intervalId);
    };
  }, [isPublicRoute, performLogout, checkSessionStatus]);

  const progressPercentage = Math.max(0, Math.min(100, (secondsRemaining / 60) * 100));

  return (
    <SessionTimeoutContext.Provider
      value={{
        lastActivity: lastActivityRef.current,
        resetInactivityTimer,
        performLogout,
      }}
    >
      {children}

      {/* Inactivity Warning Countdown Modal */}
      <AnimatePresence>
        {showWarning && !isPublicRoute && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.35, bounce: 0 }}
              className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-10 text-card-foreground"
            >
              {/* Top Warning Accent Line */}
              <div className="card-accent-bar" />

              <div className="p-6 space-y-5">
                {/* Header with animated warning icon */}
                <div className="flex items-start gap-4">
                  <div className="p-3.5 rounded-2xl kpi-icon-warning shrink-0 shadow-lg">
                    <ShieldAlert className="w-7 h-7 animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="badge badge-theme-warning uppercase tracking-wider text-[11px]">
                        Security Notice
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-heading mt-1.5">
                      Session Inactivity Warning
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      You have been inactive. For healthcare record privacy and compliance, your secure session will automatically close.
                    </p>
                  </div>
                </div>

                {/* Countdown Progress Card */}
                <div className="p-4 rounded-xl bg-background/60 border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                      <Clock className="w-4 h-4 text-kpi-warning" />
                      Auto-logout in:
                    </span>
                    <span className="text-base font-extrabold text-kpi-warning font-mono tracking-tight">
                      {secondsRemaining}s
                    </span>
                  </div>

                  {/* Dynamic Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full card-accent-bar rounded-full"
                      style={{ width: `${progressPercentage}%` }}
                      transition={{ ease: 'linear', duration: 0.2 }}
                    />
                  </div>
                </div>

                {/* Modal Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => performLogout('user_choice')}
                    disabled={isLoggingOut}
                    className="btn-secondary text-xs h-10 px-4 cursor-pointer flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Log Out Now
                  </Button>
                  <Button
                    type="button"
                    onClick={resetInactivityTimer}
                    disabled={isLoggingOut}
                    className="btn-primary text-xs h-10 px-5 cursor-pointer flex items-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Stay Logged In
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </SessionTimeoutContext.Provider>
  );
}
