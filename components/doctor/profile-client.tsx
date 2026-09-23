'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone, Lock, Loader2 } from 'lucide-react';

interface Doctor {
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
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [formData, setFormData] = useState({
    fname: initialDoctor.DOC_FNAME || '',
    lname: initialDoctor.DOC_LNAME || '',
    email: initialDoctor.DOC_EMAIL || '',
    phone: initialDoctor.DOC_PHONE || '',
    specialization: initialDoctor.DOC_SPECIALIZATION || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/doctors/${initialDoctor.DOC_ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setMessage(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setPasswordLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      setPasswordLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to change password');
      }

      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to change password' });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <Card className="card overflow-hidden border border-border shadow-lg">
        <div className="card-accent-bar" />
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl kpi-icon-success flex items-center justify-center shadow-lg">
              <User className="w-8 h-8" />
            </div>
            <div>
              <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-heading tracking-tight">Profile Settings</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">Manage personal information and clinical account settings</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {message && (
        <div
          className={`p-4 rounded-xl backdrop-blur-sm border shadow-lg ${
            message.type === 'success'
              ? 'badge-theme-success'
              : 'badge-theme-danger'
          }`}
        >
          {message.text}
        </div>
      )}

      <Card className="card overflow-hidden border border-border shadow-xl">
        <div className="card-accent-bar" />
        <CardHeader className="border-b border-border pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl kpi-icon-primary flex items-center justify-center shadow-lg">
              <User className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-heading">Personal Information</CardTitle>
              <CardDescription className="text-muted mt-1">
                Update your personal details and clinical contact information
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fname" className="text-sm font-medium text-heading">
                  First Name *
                </Label>
                <Input
                  id="fname"
                  value={formData.fname}
                  onChange={(e) => setFormData({ ...formData, fname: e.target.value })}
                  required
                  className="input-hospital h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lname" className="text-sm font-medium text-heading">
                  Last Name *
                </Label>
                <Input
                  id="lname"
                  value={formData.lname}
                  onChange={(e) => setFormData({ ...formData, lname: e.target.value })}
                  required
                  className="input-hospital h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-heading">
                  <Mail className="w-4 h-4 text-primary" />
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="input-hospital h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium text-heading">
                  <Phone className="w-4 h-4 text-primary" />
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-hospital h-11"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="specialization" className="text-sm font-medium text-heading">
                  Specialization *
                </Label>
                <Input
                  id="specialization"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  required
                  className="input-hospital h-11"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-border">
              <Button 
                type="submit" 
                disabled={loading}
                className="btn-primary"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Profile'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="card overflow-hidden border border-border shadow-xl">
        <div className="card-accent-bar" />
        <CardHeader className="border-b border-border pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl kpi-icon-warning flex items-center justify-center shadow-lg">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-heading">Change Password</CardTitle>
              <CardDescription className="text-muted mt-1">
                Update your password to keep your account secure
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-sm font-medium text-heading">
                Current Password *
              </Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, currentPassword: e.target.value })
                }
                required
                className="input-hospital h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-sm font-medium text-heading">
                New Password *
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
                required
                minLength={6}
                className="input-hospital h-11"
              />
              <p className="text-xs text-muted flex items-center gap-1 mt-1.5">
                <span className="w-1 h-1 rounded-full bg-primary/60"></span>
                Must be at least 6 characters long
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-heading">
                Confirm New Password *
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
                required
                minLength={6}
                className="input-hospital h-11"
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-border">
              <Button 
                type="submit" 
                disabled={passwordLoading}
                className="btn-primary"
              >
                {passwordLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Changing...
                  </>
                ) : (
                  'Change Password'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="card overflow-hidden border border-border shadow-xl">
        <div className="card-accent-bar" />
        <CardHeader className="border-b border-border pb-6">
          <CardTitle className="text-xl font-bold text-heading">Account Information</CardTitle>
          <CardDescription className="text-muted">
            Your account credentials and clinical metadata
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg kpi-icon-success flex items-center justify-center shadow-md">
                  <User className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-muted">Doctor Number</span>
              </div>
              <span className="text-lg font-bold table-id-link">{initialDoctor.DOC_NUMBER}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg kpi-icon-primary flex items-center justify-center shadow-md">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-muted">Account Created</span>
              </div>
              <span className="text-sm font-bold text-heading">
                {initialDoctor.CREATED_AT
                  ? new Date(initialDoctor.CREATED_AT).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'N/A'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
