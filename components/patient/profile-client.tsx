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
        
        // Update the profile data in the parent component without full reload
        // by using router.refresh() or just keep the updated state
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
    } catch (error) {
      setPasswordMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 border-2 border-emerald-200 dark:border-emerald-800 shadow-lg">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                <User className="w-7 h-7 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  My Profile
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Manage your personal information and security
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Personal Information */}
      <Card className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <User className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
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
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">First Name</p>
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
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {firstName}
                  </p>
                )}
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <p className="text-sm font-semibold text-purple-900 dark:text-purple-300">Last Name</p>
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
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {lastName}
                  </p>
                )}
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-300">Email</p>
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
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {email || 'Not provided'}
                  </p>
                )}
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-300">Phone</p>
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
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {phone || 'Not provided'}
                  </p>
                )}
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 border border-rose-200 dark:border-rose-800">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <p className="text-sm font-semibold text-rose-900 dark:text-rose-300">Address</p>
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
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
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
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold px-6"
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
      <Card className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-pink-500" />
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            Medical Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">Age</p>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {profile.PAT_AGE || 'N/A'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <p className="text-sm font-semibold text-purple-900 dark:text-purple-300">Gender</p>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {profile.PAT_GENDER || 'N/A'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 border border-rose-200 dark:border-rose-800">
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <p className="text-sm font-semibold text-rose-900 dark:text-rose-300">Blood Group</p>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {profile.PAT_BLOOD_GROUP || 'N/A'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-300">Patient Type</p>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {profile.PAT_TYPE || 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Password Management */}
      <Card className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Lock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Password & Security
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {profile.hasPassword 
              ? 'Update your password to keep your account secure' 
              : 'Set a password to secure your account. Currently, you can log in with just your email.'}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {profile.hasPassword ? 'New Password' : 'Create Password'}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
                    ? 'bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                    : 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
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
              className="w-full h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg"
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
            className={`p-4 rounded-xl border-2 flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                : 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-300'
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
