'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, Droplets, Activity, Heart, Lock, Save, Eye, EyeOff, CheckCircle, AlertCircle, Edit, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface PatientProfile {
  PAT_ID: number;
  PAT_FNAME: string;
  PAT_LNAME: string;
  PAT_EMAIL: string;
  PAT_NUMBER: string;
  PAT_PHONE?: string;
  PAT_ADDR?: string;
  PAT_DOB?: string;
  PAT_AGE?: number;
  PAT_GENDER?: string;
  PAT_BLOOD_GROUP?: string;
  PAT_TYPE?: string;
  PAT_ASSIGNED_DOC?: string;
  PAT_EMERGENCY_CONTACT?: string;
  PAT_DATE_JOINED?: string;
  hasPassword: boolean;
}

interface ProfileClientProps {
  profile: PatientProfile;
}

export default function ProfileClient({ profile }: ProfileClientProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(profile.PAT_FNAME || '');
  const [lastName, setLastName] = useState(profile.PAT_LNAME || '');
  const [email, setEmail] = useState(profile.PAT_EMAIL || '');
  const [phone, setPhone] = useState(profile.PAT_PHONE || '');
  const [address, setAddress] = useState(profile.PAT_ADDR || '');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      console.log('Sending update request:', { firstName, lastName, email, phone, address, patientNumber: profile.PAT_NUMBER });
      
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
      console.log('Update response:', data);

      if (response.ok && data.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setIsEditing(false);
        
        setTimeout(() => {
          setMessage(null);
        }, 3000);
      } else {
        setMessage({ type: 'error', text: data.error || data.details || 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (password.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      return;
    }

    if (password !== confirmPassword) {
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
        setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => setPasswordMessage(null), 5000);
      } else {
        setPasswordMessage({ type: 'error', text: data.error || 'Failed to update password' });
      }
    } catch {
      setPasswordMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="relative overflow-hidden bg-card border-border/70 shadow-lg">
        <div className="card-accent-bar" />
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl kpi-icon-patient flex items-center justify-center shadow-lg">
                <User className="w-7 h-7" />
              </div>
              <div>
                <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-heading tracking-tight">
                  My Profile
                </CardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Manage your personal information and security
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Personal Information */}
      <Card className="relative overflow-hidden bg-card border-border/70 shadow-lg">
        <div className="card-accent-bar" />
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg sm:text-xl font-bold flex items-center gap-2 text-heading">
              <User className="w-6 h-6 text-primary" />
              Personal Information
            </CardTitle>
            <Button
              onClick={() => {
                setIsEditing(!isEditing);
                if (isEditing) {
                  // Reset form on cancel
                  setFirstName(profile.PAT_FNAME || '');
                  setLastName(profile.PAT_LNAME || '');
                  setEmail(profile.PAT_EMAIL || '');
                  setPhone(profile.PAT_PHONE || '');
                  setAddress(profile.PAT_ADDR || '');
                }
              }}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isEditing ? (
                <>
                  <X className="w-4 h-4" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4" />
                  Edit
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl bg-card border border-border/70">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-primary" />
                  <p className="text-sm font-semibold text-muted-foreground">First Name</p>
                </div>
                {isEditing ? (
                  <Input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter first name"
                    className="mt-1"
                    required
                  />
                ) : (
                  <p className="text-lg font-bold text-foreground">
                    {firstName}
                  </p>
                )}
              </div>

              <div className="p-4 rounded-xl bg-card border border-border/70">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-primary" />
                  <p className="text-sm font-semibold text-muted-foreground">Last Name</p>
                </div>
                {isEditing ? (
                  <Input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter last name"
                    className="mt-1"
                    required
                  />
                ) : (
                  <p className="text-lg font-bold text-foreground">
                    {lastName}
                  </p>
                )}
              </div>

              <div className="p-4 rounded-xl bg-card border border-border/70">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-primary" />
                  <p className="text-sm font-semibold text-muted-foreground">Email</p>
                </div>
                {isEditing ? (
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                    className="mt-1"
                  />
                ) : (
                  <p className="text-lg font-bold text-foreground">
                    {email || 'Not provided'}
                  </p>
                )}
              </div>

              <div className="p-4 rounded-xl bg-card border border-border/70">
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <p className="text-sm font-semibold text-muted-foreground">Phone</p>
                </div>
                {isEditing ? (
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="mt-1"
                  />
                ) : (
                  <p className="text-lg font-bold text-foreground">
                    {phone || 'Not provided'}
                  </p>
                )}
              </div>

              <div className="p-4 rounded-xl bg-card border border-border/70">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <p className="text-sm font-semibold text-muted-foreground">Address</p>
                </div>
                {isEditing ? (
                  <Input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter address"
                    className="mt-1"
                  />
                ) : (
                  <p className="text-lg font-bold text-foreground">
                    {address || 'Not provided'}
                  </p>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="mt-6 flex justify-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className="font-semibold px-6 btn-primary"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Medical Information */}
      <Card className="relative overflow-hidden bg-card border-border/70 shadow-lg">
        <div className="card-accent-bar" />
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary" />
            Medical Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-card border border-border/70">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-primary" />
                <p className="text-sm font-semibold text-muted-foreground">Age</p>
              </div>
              <p className="text-xl font-bold text-foreground">
                {profile.PAT_AGE || 'N/A'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-card border border-border/70">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-primary" />
                <p className="text-sm font-semibold text-muted-foreground">Gender</p>
              </div>
              <p className="text-xl font-bold text-foreground">
                {profile.PAT_GENDER || 'N/A'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-card border border-border/70">
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="w-4 h-4 text-primary" />
                <p className="text-sm font-semibold text-muted-foreground">Blood Group</p>
              </div>
              <p className="text-xl font-bold text-foreground">
                {profile.PAT_BLOOD_GROUP || 'N/A'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-card border border-border/70">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-primary" />
                <p className="text-sm font-semibold text-muted-foreground">Patient Type</p>
              </div>
              <p className="text-xl font-bold text-foreground">
                {profile.PAT_TYPE || 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Password Management */}
      <Card className="relative overflow-hidden bg-card border-border/70 shadow-lg">
        <div className="card-accent-bar" />
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Lock className="w-6 h-6 text-primary" />
            Password & Security
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            {profile.hasPassword 
              ? 'Update your password to keep your account secure' 
              : 'Set a password to secure your account. Currently, you can log in with just your email.'}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-muted-foreground">
                {profile.hasPassword ? 'New Password' : 'Create Password'}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password (min 6 characters)"
                  className="pl-10 pr-10 h-11"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-semibold text-muted-foreground">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="pl-10 pr-10 h-11"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {passwordMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl flex items-center gap-3 ${
                  passwordMessage.type === 'success'
                    ? 'badge-theme-success'
                    : 'badge-theme-danger'
                }`}
              >
                {passwordMessage.type === 'success' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <p className="font-medium">{passwordMessage.text}</p>
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={passwordLoading}
              className="w-full h-11 font-semibold shadow-lg btn-primary"
            >
              {passwordLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  {profile.hasPassword ? 'Update Password' : 'Set Password'}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Success/Error Message */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-xl border flex items-center gap-3 ${
              message.type === 'success'
                ? 'badge-theme-success'
                : 'badge-theme-danger'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
