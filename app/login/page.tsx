'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, Mail, Lock, Loader2, Eye, EyeOff, Shield, Users, User, Sparkles, ShieldAlert } from 'lucide-react';
import { loginAction } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function SessionSecurityNotice() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason');

  if (!reason) return null;

  let title = 'Session Secured';
  let message = 'You have been signed out to protect sensitive patient records.';

  if (reason === 'inactivity') {
    title = 'Inactivity Auto-Logout';
    message = 'You were automatically logged out to safeguard healthcare records after 15 minutes of inactivity.';
  } else if (reason === 'suspended') {
    title = 'Session Secured on System Sleep';
    message = 'Your computer entered sleep or hibernation mode. The active medical session was terminated for data security.';
  } else if (reason === 'expired') {
    title = 'Authentication Expired';
    message = 'Your secure authentication session has expired. Please sign in again to continue.';
  } else if (reason === 'timeout') {
    title = 'Session Timed Out';
    message = 'Your security session has ended. Please sign in to resume your workflow.';
  } else if (reason === 'user_choice') {
    title = 'Logged Out Successfully';
    message = 'Your medical management session has been terminated securely.';
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="p-3 rounded-xl border bg-kpi-warning-subtle text-kpi-warning space-y-1 shadow-lg"
    >
      <div className="flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-kpi-warning shrink-0 animate-pulse" />
        <span className="text-xs font-bold">{title}</span>
      </div>
      <p className="text-[11px] text-muted-foreground leading-relaxed pl-6">{message}</p>
    </motion.div>
  );
}

const roleConfig = {
  patient: {
    icon: User,
    colorStyle: {
      background: 'linear-gradient(135deg, rgb(var(--portal-patient-from)), rgb(var(--portal-patient-to)))',
    },
    textColor: 'text-[rgb(var(--portal-patient-text))]',
    label: 'Patient Portal',
    badgeClass: 'pill-patient-active'
  },
  doctor: {
    icon: Stethoscope,
    colorStyle: {
      background: 'linear-gradient(135deg, rgb(var(--portal-doctor-from)), rgb(var(--portal-doctor-to)))',
    },
    textColor: 'text-[rgb(var(--portal-doctor-text))]',
    label: 'Doctor Portal',
    badgeClass: 'pill-doctor-active'
  },
  admin: {
    icon: Shield,
    colorStyle: {
      background: 'linear-gradient(135deg, rgb(var(--portal-admin-from)), rgb(var(--portal-admin-to)))',
    },
    textColor: 'text-[rgb(var(--portal-admin-text))]',
    label: 'Admin Portal',
    badgeClass: 'pill-admin-active'
  }
};

const demoAccounts = [
  {
    role: 'admin' as const,
    label: 'Admin Demo',
    badge: 'Operations',
    email: 'demo.admin@curewell.com',
    password: 'demo123',
    color: 'kpi-icon-primary',
  },
  {
    role: 'doctor' as const,
    label: 'Doctor Demo',
    badge: 'Clinical',
    email: 'demo.doctor@curewell.com',
    password: 'demo123',
    color: 'kpi-icon-success',
  },
  {
    role: 'patient' as const,
    label: 'Patient Demo',
    badge: 'Portal',
    email: 'demo.patient@curewell.com',
    password: 'demo123',
    color: 'kpi-icon-info',
  },
];

// Static particles configuration to prevent hydration mismatch
const particlesConfig = [
  { id: 0, left: 37.582, top: 12.128, xOffset: 5.2, duration: 5.1, delay: 0.8 },
  { id: 1, left: 72.316, top: 67.610, xOffset: -7.3, duration: 6.2, delay: 1.3 },
  { id: 2, left: 11.542, top: 6.480, xOffset: 8.1, duration: 4.8, delay: 0.2 },
  { id: 3, left: 30.645, top: 31.152, xOffset: -3.4, duration: 5.5, delay: 1.7 },
  { id: 4, left: 66.668, top: 70.057, xOffset: 6.8, duration: 4.3, delay: 0.5 },
  { id: 5, left: 2.515, top: 23.345, xOffset: -8.9, duration: 6.8, delay: 1.1 },
  { id: 6, left: 92.301, top: 61.857, xOffset: 4.6, duration: 5.9, delay: 0.4 },
  { id: 7, left: 20.967, top: 36.194, xOffset: -5.7, duration: 4.5, delay: 1.9 },
  { id: 8, left: 63.101, top: 60.479, xOffset: 7.2, duration: 6.4, delay: 0.7 },
  { id: 9, left: 85.158, top: 7.293, xOffset: -4.1, duration: 5.2, delay: 1.4 },
  { id: 10, left: 1.212, top: 62.943, xOffset: 8.5, duration: 4.9, delay: 0.3 },
  { id: 11, left: 4.262, top: 35.017, xOffset: -6.3, duration: 6.1, delay: 1.6 },
  { id: 12, left: 92.704, top: 36.252, xOffset: 5.9, duration: 5.7, delay: 0.9 },
  { id: 13, left: 45.982, top: 4.469, xOffset: -7.8, duration: 4.7, delay: 1.2 },
  { id: 14, left: 7.022, top: 89.337, xOffset: 6.1, duration: 6.5, delay: 0.6 },
  { id: 15, left: 74.999, top: 59.234, xOffset: -5.4, duration: 5.3, delay: 1.8 },
  { id: 16, left: 15.549, top: 8.147, xOffset: 7.6, duration: 4.6, delay: 0.1 },
  { id: 17, left: 18.857, top: 57.546, xOffset: -8.2, duration: 6.7, delay: 1.5 },
  { id: 18, left: 31.271, top: 2.490, xOffset: 4.9, duration: 5.4, delay: 1.0 },
  { id: 19, left: 67.664, top: 96.033, xOffset: -6.7, duration: 6.0, delay: 0.5 },
];

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'doctor' | 'patient'>('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Clear any old cross-tab logout signals on login page load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('hms_logout_broadcast');
      } catch {}
    }
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else if (result?.success && result?.redirectUrl) {
      // Prime fresh session timestamp and clear old signals
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem('hms_logout_broadcast');
          localStorage.setItem('hms_last_activity_time', Date.now().toString());
        } catch {}
      }
      router.push(result.redirectUrl);
      router.refresh();
    }
  }

  function handleDemoSelect(demo: typeof demoAccounts[0]) {
    setSelectedRole(demo.role);
    setEmail(demo.email);
    setPassword(demo.password);
    setError('');
  }

  const RoleIcon = roleConfig[selectedRole].icon;

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-background">
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 150, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
        <motion.div
          className="absolute top-1/4 right-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, -80, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
        
        {/* Floating particles */}
        {particlesConfig.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, particle.xOffset, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(var(--primary), 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--primary), 0.3) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Floating Medical Icons */}
      <motion.div
        className="absolute top-20 left-10 opacity-10 dark:opacity-5"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
        }}
      >
        <Stethoscope className="w-24 h-24 text-primary" />
      </motion.div>
      <motion.div
        className="absolute bottom-20 right-10 opacity-10 dark:opacity-5"
        animate={{
          y: [0, 20, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
      >
        <Users className="w-32 h-32 text-primary" />
      </motion.div>
      
      {/* Additional floating icons */}
      <motion.div
        className="absolute top-1/2 left-5 opacity-8 dark:opacity-4"
        animate={{
          y: [0, 15, 0],
          rotate: [0, -8, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
        }}
      >
        <Shield className="w-16 h-16 text-primary" />
      </motion.div>
      <motion.div
        className="absolute bottom-1/4 right-20 opacity-8 dark:opacity-4"
        animate={{
          y: [0, -18, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
        }}
      >
        <User className="w-20 h-20 text-primary" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="backdrop-blur-xl bg-card/95 shadow-2xl border border-border/70 overflow-hidden relative">
          <div className="card-accent-bar" />

          <CardHeader className="space-y-4 text-center pb-4 pt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedRole}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                style={roleConfig[selectedRole].colorStyle}
                className="mx-auto w-18 h-18 rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-primary/20"
              >
                <RoleIcon className="w-9 h-9 text-white" />
              </motion.div>
            </AnimatePresence>
            <div className="space-y-1">
              <CardTitle className="text-2xl md:text-3xl font-bold text-foreground">
                Hospital Management
              </CardTitle>
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedRole}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <CardDescription className={`text-sm font-semibold ${roleConfig[selectedRole].textColor}`}>
                    {roleConfig[selectedRole].label}
                  </CardDescription>
                </motion.div>
              </AnimatePresence>
            </div>
          </CardHeader>

          <CardContent className="pb-6 space-y-5">
            {/* Session Inactivity / Security Alert Notice */}
            <Suspense fallback={null}>
              <SessionSecurityNotice />
            </Suspense>

            {/* Quick Demo Accounts Banner */}
            <div className="p-3 bg-muted/60 rounded-xl border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  Quick Demo Access (One-Click Fill)
                </span>
                <span className="badge-counter text-[10px]">
                  Protected Demo
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {demoAccounts.map((demo) => (
                  <button
                    key={demo.role}
                    type="button"
                    onClick={() => handleDemoSelect(demo)}
                    className={`px-2 py-1.5 rounded-lg border border-border/80 text-xs font-medium transition-all text-center flex flex-col items-center justify-center cursor-pointer hover:bg-muted ${demo.color}`}
                  >
                    <span className="font-semibold block">{demo.label.split(' ')[0]}</span>
                    <span className="text-[10px] opacity-75">{demo.badge}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selector - Button Style */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">
                  Select Portal Role
                </Label>
                <input type="hidden" name="role" value={selectedRole} />
                <div className="grid grid-cols-3 gap-2 p-1.5 bg-muted/50 rounded-xl">
                  {(['patient', 'doctor', 'admin'] as const).map((role) => {
                    const Icon = roleConfig[role].icon;
                    const isCurrent = selectedRole === role;
                    return (
                      <motion.button
                        key={role}
                        type="button"
                        onClick={() => setSelectedRole(role)}
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={isCurrent ? roleConfig[role].colorStyle : undefined}
                        className={`relative py-2.5 px-2 rounded-lg font-medium text-xs transition-all cursor-pointer ${
                          isCurrent
                            ? 'text-white shadow-lg'
                            : 'bg-transparent text-muted-foreground hover:bg-card'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 mx-auto mb-1" />
                        <span className="block capitalize">{role}</span>
                        {isCurrent && (
                          <motion.div
                            layoutId="activeRole"
                            className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-lg"
                            initial={false}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  Email Address
                </Label>
                <motion.div
                  whileFocus={{ scale: 1.01 }}
                  className="relative group"
                >
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@hospital.com"
                    required
                    className="relative h-11 pl-3.5 bg-background border-border text-foreground transition-all rounded-lg text-sm input-hospital"
                    disabled={loading}
                  />
                </motion.div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  Password
                </Label>
                <motion.div
                  whileFocus={{ scale: 1.01 }}
                  className="relative group"
                >
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="relative h-11 pl-3.5 pr-11 bg-background border-border text-foreground transition-all rounded-lg text-sm input-hospital"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground rounded-md transition-colors cursor-pointer"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </motion.div>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="p-3 bg-destructive/10 border border-destructive/30 rounded-xl text-xs text-destructive flex items-center gap-2.5"
                  >
                    <div className="w-2 h-2 rounded-full bg-destructive animate-pulse shrink-0" />
                    <span className="font-medium">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button
                  type="submit"
                  disabled={loading}
                  style={roleConfig[selectedRole].colorStyle}
                  className="w-full h-11 hover:shadow-xl text-white font-semibold text-sm transition-all rounded-xl relative overflow-hidden group cursor-pointer"
                >
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <RoleIcon className="w-4 h-4" />
                        Sign In to {roleConfig[selectedRole].label}
                      </>
                    )}
                  </span>
                </Button>
              </motion.div>

              {/* Back to Homepage Link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center pt-2"
              >
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors group"
                >
                  <motion.span
                    whileHover={{ x: -3 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    ←
                  </motion.span>
                  <span>Back to Homepage</span>
                </Link>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
