'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, Calendar, Lock, Save, Eye, EyeOff, 
  CheckCircle, AlertCircle, Edit, X, Shield, ShieldCheck, Copy, 
  Check, Fingerprint, Sparkles, Stethoscope, Award, Building2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export interface Doctor {
  DOC_ID: number;
  DOC_NUMBER: string;
  DOC_FNAME: string;
  DOC_LNAME: string;
  DOC_EMAIL: string;
  DOC_PHONE: string;
  DOC_SPECIALIZATION: string;
  CREATED_AT: string;
}

interface DoctorProfileClientProps {
  initialDoctor: Doctor;
}

export default function DoctorProfileClient({ initialDoctor }: DoctorProfileClientProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Form states
  const [fname, setFname] = useState(initialDoctor.DOC_FNAME || '');
  const [lname, setLname] = useState(initialDoctor.DOC_LNAME || '');
  const [email, setEmail] = useState(initialDoctor.DOC_EMAIL || '');
  const [phone, setPhone] = useState(initialDoctor.DOC_PHONE || '');
  const [specialization, setSpecialization] = useState(initialDoctor.DOC_SPECIALIZATION || '');

  // Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Loading & feedback states
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleCopyId = () => {
    navigator.clipboard.writeText(initialDoctor.DOC_NUMBER);
    setCopiedId(true);
    toast.success('Doctor ID copied to clipboard');
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/doctors/${initialDoctor.DOC_ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fname,
          lname,
          email,
          phone,
          specialization,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update profile');
      }

      toast.success('Doctor profile updated successfully!');
      setMessage({ type: 'success', text: 'Doctor profile updated successfully!' });
      setIsEditing(false);
      setTimeout(() => setMessage(null), 4000);
    } catch (error) {
      console.error('Error updating doctor profile:', error);
      const errText = error instanceof Error ? error.message : 'Failed to update profile';
      toast.error(errText);
      setMessage({ type: 'error', text: errText });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMessage(null);

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
      setPasswordLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      setPasswordLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to change password');
      }

      toast.success('Password changed successfully!');
      setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordMessage(null), 5000);
    } catch (error) {
      console.error('Error changing password:', error);
      const errText = error instanceof Error ? error.message : 'Failed to change password';
      toast.error(errText);
      setPasswordMessage({ type: 'error', text: errText });
    } finally {
      setPasswordLoading(false);
    }
  };

  const formattedJoinDate = initialDoctor.CREATED_AT
    ? new Date(initialDoctor.CREATED_AT).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Medical Staff';

  const userInitials = `DR ${(fname || initialDoctor.DOC_FNAME || 'D')[0]}${(lname || initialDoctor.DOC_LNAME || '')[0] || ''}`.toUpperCase();

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
        
        <CardHeader className="p-6 sm:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Avatar Box with Doctor Theme Tokens */}
              <div className="relative">
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl kpi-icon-doctor flex items-center justify-center font-extrabold text-xl sm:text-2xl shadow-lg ring-4 ring-primary/20 tracking-wider">
                  {userInitials}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-card flex items-center justify-center text-white" title="Active Clinical Staff">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              {/* Name and Meta Badges */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-heading tracking-tight">
                    Dr. {fname} {lname}
                  </h1>
                  <span className="badge badge-doctor px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                    Physician Portal
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted">
                  <button
                    onClick={handleCopyId}
                    type="button"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/60 hover:bg-muted text-heading font-mono font-semibold transition-colors cursor-pointer border border-border"
                    title="Click to copy Doctor ID"
                  >
                    <Fingerprint className="w-3.5 h-3.5 text-primary" />
                    <span>{initialDoctor.DOC_NUMBER}</span>
                    {copiedId ? (
                      <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 opacity-60 hover:opacity-100" />
                    )}
                  </button>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg badge-theme-info font-medium border">
                    <Sparkles className="w-3.5 h-3.5" />
                    {specialization || initialDoctor.DOC_SPECIALIZATION || 'General Practitioner'}
                  </span>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/60 text-muted font-medium border border-border">
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
                  setFname(initialDoctor.DOC_FNAME || '');
                  setLname(initialDoctor.DOC_LNAME || '');
                  setEmail(initialDoctor.DOC_EMAIL || '');
                  setPhone(initialDoctor.DOC_PHONE || '');
                  setSpecialization(initialDoctor.DOC_SPECIALIZATION || '');
                }
              }}
              variant="outline"
              className="w-full sm:w-auto h-11 px-5 rounded-xl border border-border bg-card hover:bg-muted text-heading font-semibold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isEditing ? (
                <>
                  <X className="w-4 h-4 text-destructive" />
                  Cancel Editing
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 text-primary" />
                  Edit Clinical Details
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
            className={`p-4 rounded-xl border flex items-center gap-3 shadow-md ${
              message.type === 'success' ? 'badge-theme-success' : 'badge-theme-danger'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            <span className="font-semibold text-sm">{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main 2-Column Responsive Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 cols): Personal Info & Professional Profile */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card 1: Personal & Contact Information */}
          <Card className="card overflow-hidden border border-border shadow-xl rounded-2xl relative">
            <div className="card-accent-bar" />
            <CardHeader className="border-b border-border pb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl kpi-icon-doctor flex items-center justify-center shadow-md">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-heading">
                    Personal Information
                  </CardTitle>
                  <CardDescription className="text-muted text-xs sm:text-sm">
                    {isEditing ? 'Modify your practitioner contact and clinical identity' : 'Your registered physician contact details'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              {isEditing ? (
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="fname" className="label-hospital">
                        First Name *
                      </Label>
                      <Input
                        id="fname"
                        type="text"
                        value={fname}
                        onChange={(e) => setFname(e.target.value)}
                        placeholder="Enter first name"
                        className="input-hospital h-11"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="lname" className="label-hospital">
                        Last Name *
                      </Label>
                      <Input
                        id="lname"
                        type="text"
                        value={lname}
                        onChange={(e) => setLname(e.target.value)}
                        placeholder="Enter last name"
                        className="input-hospital h-11"
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
                        placeholder="doctor@hospital.com"
                        className="input-hospital h-11"
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
                        className="input-hospital h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="specialization" className="label-hospital">
                      Medical Specialization *
                    </Label>
                    <Input
                      id="specialization"
                      type="text"
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      placeholder="e.g. Cardiology, Pediatrics, Neurology"
                      className="input-hospital h-11"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="btn-secondary h-11 px-5 rounded-xl"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="btn-primary h-11 px-6 rounded-xl flex items-center gap-2 shadow-lg"
                    >
                      <Save className="w-4 h-4" />
                      {loading ? 'Saving Changes...' : 'Save Profile Changes'}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-muted/40 dark:bg-muted/20 border border-border hover:border-primary/40 transition-colors">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5 mb-1">
                      <User className="w-3.5 h-3.5 text-primary" />
                      Physician Name
                    </span>
                    <p className="text-base font-bold text-heading">
                      Dr. {fname} {lname}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-muted/40 dark:bg-muted/20 border border-border hover:border-primary/40 transition-colors">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5 mb-1">
                      <Mail className="w-3.5 h-3.5 text-primary" />
                      Email Address
                    </span>
                    <p className="text-base font-bold text-heading truncate">
                      {email || 'Not provided'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-muted/40 dark:bg-muted/20 border border-border hover:border-primary/40 transition-colors">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5 mb-1">
                      <Phone className="w-3.5 h-3.5 text-primary" />
                      Phone Number
                    </span>
                    <p className="text-base font-bold text-heading">
                      {phone || 'Not provided'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-muted/40 dark:bg-muted/20 border border-border hover:border-primary/40 transition-colors">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5 mb-1">
                      <Stethoscope className="w-3.5 h-3.5 text-primary" />
                      Specialization
                    </span>
                    <p className="text-base font-bold text-heading">
                      {specialization || 'General Practitioner'}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 2: Professional Details & Clinical Overview */}
          <Card className="card overflow-hidden border border-border shadow-xl rounded-2xl relative">
            <div className="card-accent-bar" />
            <CardHeader className="border-b border-border pb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl kpi-icon-primary flex items-center justify-center shadow-md">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-heading">
                    Professional & Clinical Details
                  </CardTitle>
                  <CardDescription className="text-muted text-xs sm:text-sm">
                    Hospital practice credentials and medical role
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-muted/40 dark:bg-muted/20 border border-border">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5 mb-1">
                    <Stethoscope className="w-3.5 h-3.5 text-primary" />
                    Specialty
                  </span>
                  <p className="text-base font-extrabold text-heading truncate">
                    {specialization || 'General'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-muted/40 dark:bg-muted/20 border border-border">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5 mb-1">
                    <Fingerprint className="w-3.5 h-3.5 text-primary" />
                    License #
                  </span>
                  <p className="text-base font-extrabold font-mono text-heading">
                    {initialDoctor.DOC_NUMBER}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-muted/40 dark:bg-muted/20 border border-border">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5 mb-1">
                    <Building2 className="w-3.5 h-3.5 text-primary" />
                    Department
                  </span>
                  <p className="text-base font-extrabold text-heading">
                    Clinical
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-muted/40 dark:bg-muted/20 border border-border">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5 mb-1">
                    <Shield className="w-3.5 h-3.5 text-primary" />
                    Status
                  </span>
                  <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                    Active
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (5 cols): Password Security & Account Details */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card 3: Password & Security */}
          <Card className="card overflow-hidden border border-border shadow-xl rounded-2xl relative">
            <div className="card-accent-bar" />
            <CardHeader className="border-b border-border pb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl kpi-icon-warning flex items-center justify-center shadow-md">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-heading">
                    Password & Security
                  </CardTitle>
                  <CardDescription className="text-muted text-xs sm:text-sm">
                    Update your practitioner login password
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="currentPassword" className="label-hospital">
                    Current Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter existing password"
                      className="input-hospital h-11 pr-11"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-heading p-1"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="newPassword" className="label-hospital">
                    New Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="input-hospital h-11 pr-11"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-heading p-1"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="label-hospital">
                    Confirm New Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="input-hospital h-11 pr-11"
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
                  className="w-full btn-primary h-11 rounded-xl shadow-lg font-semibold flex items-center justify-center gap-2 mt-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {passwordLoading ? 'Updating Password...' : 'Change Password'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Card 4: Account Summary & Status */}
          <Card className="card overflow-hidden border border-border shadow-xl rounded-2xl relative">
            <div className="card-accent-bar" />
            <CardHeader className="border-b border-border pb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl kpi-icon-success flex items-center justify-center shadow-md">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-heading">
                    Account Overview
                  </CardTitle>
                  <CardDescription className="text-muted text-xs sm:text-sm">
                    Physician credentials and clinical permissions
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-3.5">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/40 dark:bg-muted/20 border border-border">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">
                  Doctor ID Code
                </span>
                <span className="font-mono font-bold table-id-link text-sm">
                  {initialDoctor.DOC_NUMBER}
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/40 dark:bg-muted/20 border border-border">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">
                  Staff Status
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Active Practitioner
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/40 dark:bg-muted/20 border border-border">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">
                  Account Created
                </span>
                <span className="text-xs font-bold text-heading">
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
