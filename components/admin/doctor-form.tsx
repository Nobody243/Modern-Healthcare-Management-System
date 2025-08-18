'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, User, Mail, Phone, Building2, Hash, Lock, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Doctor {
  DOC_ID: number;
  DOC_FNAME: string;
  DOC_LNAME: string;
  DOC_EMAIL: string;
  DOC_NUMBER: string;
  DOC_DEPT: string;
  DOC_DPIC?: string;
  DOC_SPECIALIZATION?: string;
  DOC_PHONE?: string;
  DOC_STATUS?: string;
}

interface DoctorFormProps {
  open: boolean;
  onClose: () => void;
  doctor?: Doctor;
  onSuccess: () => void;
}

export function DoctorForm({ open, onClose, doctor, onSuccess }: DoctorFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEdit = !!doctor;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      id: doctor?.DOC_ID,
      fname: formData.get('fname'),
      lname: formData.get('lname'),
      email: formData.get('email'),
      number: formData.get('number'),
      dept: formData.get('dept'),
      pwd: formData.get('pwd'),
      phone: formData.get('phone') || null,
      specialization: formData.get('specialization') || null,
      status: formData.get('status') || 'Active',
    };

    try {
      const url = '/api/doctors';
      const method = isEdit ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to save doctor');
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent key={doctor?.DOC_ID || 'new'} className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <UserCog className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            {isEdit ? 'Edit Doctor' : 'Add New Doctor'}
          </DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400">
            {isEdit ? 'Update doctor information' : 'Fill in the doctor details below'}
          </DialogDescription>
        </DialogHeader>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit}
          className="space-y-6 mt-4"
        >
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
              <User className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fname" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  First Name *
                </Label>
                <Input
                  id="fname"
                  name="fname"
                  defaultValue={doctor?.DOC_FNAME}
                  required
                  placeholder="John"
                  className="h-11 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-sky-500 dark:focus:ring-sky-400"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lname" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  Last Name *
                </Label>
                <Input
                  id="lname"
                  name="lname"
                  defaultValue={doctor?.DOC_LNAME}
                  required
                  placeholder="Doe"
                  className="h-11 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-sky-500 dark:focus:ring-sky-400"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
              <Mail className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              Contact Information
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={doctor?.DOC_EMAIL}
                  required
                  placeholder="doctor@hospital.com"
                  className="h-11 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-sky-500 dark:focus:ring-sky-400"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={doctor?.DOC_PHONE}
                  placeholder="+1 (555) 123-4567"
                  className="h-11 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-sky-500 dark:focus:ring-sky-400"
                  disabled={loading}
                />
              </div>


            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
              <Building2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              Professional Information
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dept" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  Department *
                </Label>
                <Input
                  id="dept"
                  name="dept"
                  defaultValue={doctor?.DOC_DEPT}
                  required
                  placeholder="Cardiology"
                  className="h-11 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-sky-500 dark:focus:ring-sky-400"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="specialization" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <UserCog className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  Specialization
                </Label>
                <Input
                  id="specialization"
                  name="specialization"
                  defaultValue={doctor?.DOC_SPECIALIZATION}
                  placeholder="e.g., Interventional Cardiologist"
                  className="h-11 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-sky-500 dark:focus:ring-sky-400"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <UserCog className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  Status
                </Label>
                <select
                  id="status"
                  name="status"
                  defaultValue={doctor?.DOC_STATUS || 'Active'}
                  className="h-11 w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-md px-3 focus:ring-sky-500 dark:focus:ring-sky-400"
                  disabled={loading}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
              <Lock className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              Security
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="pwd" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                Password {!isEdit && '*'}
              </Label>
              <Input
                id="pwd"
                name="pwd"
                type="password"
                required={!isEdit}
                placeholder={isEdit ? "Leave blank to keep current password" : "Enter password"}
                className="h-11 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-sky-500 dark:focus:ring-sky-400"
                disabled={loading}
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEdit ? "Admin can change password - leave blank to keep existing" : "Required for new doctor accounts"}
              </p>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400"
            >
              {error}
            </motion.div>
          )}

          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : isEdit ? (
                'Update Doctor'
              ) : (
                'Add Doctor'
              )}
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
}
