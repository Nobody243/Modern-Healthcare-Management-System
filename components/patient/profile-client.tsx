'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Calendar, Droplets, Activity, 
  Heart, Lock, Save, Eye, EyeOff, CheckCircle, AlertCircle, 
  Edit, X, Shield, ShieldCheck, Copy, Check, Fingerprint, Sparkles
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export interface PatientProfile {
  PAT_ID: number;
  PAT_FNAME: string;
  PAT_LNAME: string;
  PAT_EMAIL: string;
  PAT_NUMBER: string;
  PAT_PHONE?: string;
  PAT_ADDR?: string;
  PAT_DOB?: string;
  PAT_AGE?: number | string;
  PAT_GENDER?: string;
  PAT_BLOOD_GROUP?: string;
  PAT_TYPE?: string;
  PAT_ASSIGNED_DOC?: string;
  PAT_EMERGENCY_CONTACT?: string;
  PAT_DATE_JOINED?: string;
  hasPassword?: boolean;
}

interface ProfileClientProps {
  profile: PatientProfile;
}

export default function ProfileClient({ profile }: ProfileClientProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Form states
  const [firstName, setFirstName] = useState(profile.PAT_FNAME || '');
  const [lastName, setLastName] = useState(profile.PAT_LNAME || '');
  const [email, setEmail] = useState(profile.PAT_EMAIL || '');
  const [phone, setPhone] = useState(profile.PAT_PHONE || '');
  const [address, setAddress] = useState(profile.PAT_ADDR || '');

  // Password states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Loading & feedback states
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleCopyId = () => {
    navigator.clipboard.writeText(profile.PAT_NUMBER);
    setCopiedId(true);
    toast.success('Patient ID copied to clipboard');
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const response = await fetch('/api/patient/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          firstName,
          lastName,
          email,
          phone, 
          address, 
          patientNumber: profile.PAT_NUMBER 
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Profile updated successfully!');
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setIsEditing(false);
        setTimeout(() => setMessage(null), 4000);
      } else {
        const errText = data.error || data.details || 'Failed to update profile';
        toast.error(errText);
        setMessage({ type: 'error', text: errText });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('An error occurred. Please try again.');
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      setPasswordMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setPasswordLoading(true);

    try {
      const response = await fetch('/api/patient/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, patientNumber: profile.PAT_NUMBER }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Password updated successfully!');
        setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => setPasswordMessage(null), 5000);
      } else {
        const errText = data.error || 'Failed to update password';
        toast.error(errText);
        setPasswordMessage({ type: 'error', text: errText });
      }
    } catch {
      toast.error('An error occurred. Please try again.');
      setPasswordMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const formattedJoinDate = profile.PAT_DATE_JOINED
    ? new Date(profile.PAT_DATE_JOINED).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Registered Patient';

  const userInitials = `${(firstName || profile.PAT_FNAME || 'P')[0]}${(lastName || profile.PAT_LNAME || '')[0] || ''}`.toUpperCase();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-6xl mx-auto space-y-6 pb-12"
    >
      {/* Hero Profile Header Card */}
      <Card className="card overflow-hidden border border-border shadow-xl rounded-2xl relative">
        <div className="card-accent-bar" />
        
        <CardHeader className="p-5 sm:p-7 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
              {/* Avatar Box with Portal Theme Tokens */}
              <div className="relative shrink-0">
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl kpi-icon-patient flex items-center justify-center font-bold text-lg sm:text-xl md:text-2xl shadow-lg ring-4 ring-primary/20 tracking-wider">
                  {userInitials}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-500 border-2 border-card flex items-center justify-center text-white" title="Active Account">
                  <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                </div>
              </div>

              {/* Name and Meta Badges */}
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-heading tracking-tight">
                    {firstName} {lastName}
                  </h1>
                  <span className="badge badge-info px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                    Patient Portal
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted">
                  <button
                    onClick={handleCopyId}
                    type="button"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/60 hover:bg-muted text-heading font-mono font-semibold transition-colors cursor-pointer border border-border text-xs sm:text-sm"
                    title="Click to copy Patient ID"
                  >
                    <Fingerprint className="w-3.5 h-3.5 text-primary" />
                    <span>{profile.PAT_NUMBER}</span>
                    {copiedId ? (
                      <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 opacity-60 hover:opacity-100" />
                    )}
                  </button>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg badge-theme-success font-medium border text-xs sm:text-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                    {profile.PAT_TYPE || 'OutPatient'}
                  </span>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/60 text-muted font-medium border border-border text-xs sm:text-sm">
                    <Calendar className="w-3.5 h-3.5 opacity-70" />
                    {formattedJoinDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Edit Toggle Button */}
            <Button
              type="button"
              onClick={() => {
                setIsEditing(!isEditing);
                if (isEditing) {
                  setFirstName(profile.PAT_FNAME || '');
                  setLastName(profile.PAT_LNAME || '');
                  setEmail(profile.PAT_EMAIL || '');
                  setPhone(profile.PAT_PHONE || '');
                  setAddress(profile.PAT_ADDR || '');
                }
              }}
              variant="outline"
              className="w-full sm:w-auto h-10 sm:h-11 px-4 sm:px-5 rounded-xl border border-border bg-card hover:bg-muted text-heading font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isEditing ? (
                <>
                  <X className="w-4 h-4 text-destructive" />
                  Cancel Editing
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 text-primary" />
                  Edit Personal Details
                </>
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Inline Feedback Banner */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-3.5 sm:p-4 rounded-xl border flex items-center gap-3 shadow-md ${
              message.type === 'success' ? 'badge-theme-success' : 'badge-theme-danger'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            <span className="font-semibold text-xs sm:text-sm">{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main 2-Column Responsive Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        
        {/* Left Column (7 cols): Personal Info & Medical Details */}
        <div className="lg:col-span-7 space-y-5 sm:space-y-6">
          
          {/* Card 1: Personal & Contact Details */}
          <Card className="card overflow-hidden border border-border shadow-xl rounded-2xl relative">
            <div className="card-accent-bar" />
            <CardHeader className="border-b border-border pb-4 sm:pb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl kpi-icon-primary flex items-center justify-center shadow-md shrink-0">
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <CardTitle className="text-base sm:text-lg font-bold text-heading">
                    Personal Information
                  </CardTitle>
                  <CardDescription className="text-muted text-xs sm:text-sm">
                    {isEditing ? 'Modify your contact and personal information' : 'Your registered contact and identity details'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-5 sm:pt-6">
              {isEditing ? (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="firstName" className="label-hospital">
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Enter first name"
                        className="input-hospital h-10 sm:h-11 text-sm"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="lastName" className="label-hospital">
                        Last Name *
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Enter last name"
                        className="input-hospital h-10 sm:h-11 text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="label-hospital">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="patient@example.com"
                        className="input-hospital h-10 sm:h-11 text-sm"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="label-hospital">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="input-hospital h-10 sm:h-11 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="address" className="label-hospital">
                      Residential Address
                    </Label>
                    <Input
                      id="address"
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street address, City, State, ZIP"
                      className="input-hospital h-10 sm:h-11 text-sm"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="btn-secondary h-10 sm:h-11 px-4 sm:px-5 rounded-xl text-xs sm:text-sm font-semibold"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="btn-primary h-10 sm:h-11 px-5 sm:px-6 rounded-xl flex items-center gap-2 shadow-lg text-xs sm:text-sm font-semibold"
                    >
                      <Save className="w-4 h-4" />
                      {loading ? 'Saving Changes...' : 'Save Profile Changes'}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-3.5 sm:p-4 rounded-xl bg-muted/40 dark:bg-muted/20 border border-border hover:border-primary/40 transition-colors">
                    <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5 mb-1">
                      <User className="w-3.5 h-3.5 text-primary" />
                      Full Name
                    </span>
                    <p className="text-sm sm:text-base font-semibold text-heading">
                      {firstName} {lastName}
                    </p>
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-xl bg-muted/40 dark:bg-muted/20 border border-border hover:border-primary/40 transition-colors">
                    <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5 mb-1">
                      <Mail className="w-3.5 h-3.5 text-primary" />
                      Email Address
                    </span>
                    <p className="text-sm sm:text-base font-semibold text-heading truncate">
                      {email || 'Not provided'}
                    </p>
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-xl bg-muted/40 dark:bg-muted/20 border border-border hover:border-primary/40 transition-colors">
                    <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5 mb-1">
                      <Phone className="w-3.5 h-3.5 text-primary" />
                      Phone Number
                    </span>
                    <p className="text-sm sm:text-base font-semibold text-heading">
                      {phone || 'Not provided'}
                    </p>
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-xl bg-muted/40 dark:bg-muted/20 border border-border hover:border-primary/40 transition-colors">
                    <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      Address
                    </span>
                    <p className="text-sm sm:text-base font-semibold text-heading">
                      {address || 'Not provided'}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 2: Medical Information & Clinical Profile */}
          <Card className="card overflow-hidden border border-border shadow-xl rounded-2xl relative">
            <div className="card-accent-bar" />
            <CardHeader className="border-b border-border pb-4 sm:pb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl kpi-icon-danger flex items-center justify-center shadow-md shrink-0">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <CardTitle className="text-base sm:text-lg font-bold text-heading">
                    Medical & Clinical Overview
                  </CardTitle>
                  <CardDescription className="text-muted text-xs sm:text-sm">
                    Clinical metadata and recorded health vitals
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-5 sm:pt-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 rounded-xl bg-muted/40 dark:bg-muted/20 border border-border">
                  <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    Age
                  </span>
                  <p className="text-sm sm:text-base font-bold text-heading truncate">
                    {profile.PAT_AGE ? `${profile.PAT_AGE} yrs` : 'N/A'}
                  </p>
                </div>

                <div className="p-3 sm:p-4 rounded-xl bg-muted/40 dark:bg-muted/20 border border-border">
                  <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5 mb-1">
                    <Activity className="w-3.5 h-3.5 text-primary" />
                    Gender
                  </span>
                  <p className="text-sm sm:text-base font-bold text-heading truncate">
                    {profile.PAT_GENDER || 'N/A'}
                  </p>
                </div>

                <div className="p-3 sm:p-4 rounded-xl bg-muted/40 dark:bg-muted/20 border border-border">
                  <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5 mb-1">
                    <Droplets className="w-3.5 h-3.5 text-destructive" />
                    Blood Group
                  </span>
                  <p className="text-sm sm:text-base font-bold text-destructive truncate">
                    {profile.PAT_BLOOD_GROUP || 'N/A'}
                  </p>
                </div>

                <div className="p-3 sm:p-4 rounded-xl bg-muted/40 dark:bg-muted/20 border border-border">
                  <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5 mb-1">
                    <Shield className="w-3.5 h-3.5 text-primary" />
                    Patient Type
                  </span>
                  <p className="text-sm sm:text-base font-bold text-heading truncate">
                    {profile.PAT_TYPE || 'OutPatient'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (5 cols): Password Security & Account Details */}
        <div className="lg:col-span-5 space-y-5 sm:space-y-6">
          
          {/* Card 3: Password & Security */}
          <Card className="card overflow-hidden border border-border shadow-xl rounded-2xl relative">
            <div className="card-accent-bar" />
            <CardHeader className="border-b border-border pb-4 sm:pb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl kpi-icon-warning flex items-center justify-center shadow-md shrink-0">
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <CardTitle className="text-base sm:text-lg font-bold text-heading">
                    Password & Security
                  </CardTitle>
                  <CardDescription className="text-muted text-xs sm:text-sm">
                    Update your account credentials and passcode
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-5 sm:pt-6">
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="newPassword" className="label-hospital">
                    New Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="input-hospital h-10 sm:h-11 pr-11 text-sm"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-heading p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="label-hospital">
                    Confirm Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="input-hospital h-10 sm:h-11 pr-11 text-sm"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-heading p-1"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {passwordMessage && (
                  <div className={`p-3.5 rounded-xl text-xs font-semibold border ${
                    passwordMessage.type === 'success' ? 'badge-theme-success' : 'badge-theme-danger'
                  }`}>
                    {passwordMessage.text}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={passwordLoading}
                  className="w-full btn-primary h-10 sm:h-11 rounded-xl shadow-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 mt-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {passwordLoading ? 'Updating Password...' : 'Update Password'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Card 4: Account Summary & Status */}
          <Card className="card overflow-hidden border border-border shadow-xl rounded-2xl relative">
            <div className="card-accent-bar" />
            <CardHeader className="border-b border-border pb-4 sm:pb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl kpi-icon-success flex items-center justify-center shadow-md shrink-0">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <CardTitle className="text-base sm:text-lg font-bold text-heading">
                    Account Overview
                  </CardTitle>
                  <CardDescription className="text-muted text-xs sm:text-sm">
                    Hospital registration and portal privileges
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-5 sm:pt-6 space-y-3">
              <div className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-muted/40 dark:bg-muted/20 border border-border">
                <span className="text-xs sm:text-sm font-medium text-muted">
                  Patient Code
                </span>
                <span className="font-mono font-bold table-id-link text-xs sm:text-sm">
                  {profile.PAT_NUMBER}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-muted/40 dark:bg-muted/20 border border-border">
                <span className="text-xs sm:text-sm font-medium text-muted">
                  Portal Status
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Active & Verified
                </span>
              </div>

              <div className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-muted/40 dark:bg-muted/20 border border-border">
                <span className="text-xs sm:text-sm font-medium text-muted">
                  Registration Date
                </span>
                <span className="text-xs sm:text-sm font-semibold text-heading">
                  {formattedJoinDate}
                </span>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </motion.div>
  );
}
