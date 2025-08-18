'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, User, Mail, Phone, Building2, Hash, Lock, UserCog, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

interface Doctor {
  DOC_ID: number;
  DOC_FNAME: string;
  DOC_LNAME: string;
  DOC_EMAIL: string;
  DOC_NUMBER: string;
  DOC_DEPT: string;
  DOC_DPIC?: string;
  DOC_PHONE: string;
  DOC_SPECIALIZATION: string;
  DOC_STATUS: string;
}

interface DoctorFormPageProps {
  doctor?: Doctor;
}

export default function DoctorFormPage({ doctor }: DoctorFormPageProps) {
  const router = useRouter();
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
      password: formData.get('password'),
      phone: formData.get('phone'),
      specialization: formData.get('specialization'),
      status: formData.get('status'),
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

      router.push('/admin/doctors');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-hospital-gradient-blue p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link href="/admin/doctors">
            <Button variant="outline" className="mb-4 border-slate-300 dark:border-slate-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Doctors
            </Button>
          </Link>
          
          <div className="flex items-center gap-3 mb-2">
            <UserCog className="w-8 h-8 text-sky-600 dark:text-sky-400" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              {isEdit ? 'Edit Doctor' : 'Add New Doctor'}
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            {isEdit ? 'Update doctor information below' : 'Fill in the doctor details to add them to the system'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-glass rounded-xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
                <User className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fname" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    First Name *
                  </Label>
                  <Input
                    id="fname"
                    name="fname"
                    defaultValue={doctor?.DOC_FNAME}
                    required
                    placeholder="John"
                    className="input-hospital"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lname" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    Last Name *
                  </Label>
                  <Input
                    id="lname"
                    name="lname"
                    defaultValue={doctor?.DOC_LNAME}
                    required
                    placeholder="Doe"
                    className="input-hospital"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
                <Mail className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                Contact Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={doctor?.DOC_EMAIL}
                    required
                    placeholder="doctor@hospital.com"
                    className="input-hospital"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    defaultValue={doctor?.DOC_PHONE}
                    placeholder="+1 (555) 123-4567"
                    className="input-hospital"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
                <Building2 className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                Professional Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="number" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Hash className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    Doctor Number *
                  </Label>
                  <Input
                    id="number"
                    name="number"
                    defaultValue={doctor?.DOC_NUMBER}
                    required
                    placeholder="D-2024-001"
                    className="input-hospital"
                    disabled={loading || isEdit}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dept" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    Department *
                  </Label>
                  <Input
                    id="dept"
                    name="dept"
                    defaultValue={doctor?.DOC_DEPT}
                    required
                    placeholder="Cardiology"
                    className="input-hospital"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialization" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <UserCog className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    Specialization
                  </Label>
                  <Input
                    id="specialization"
                    name="specialization"
                    defaultValue={doctor?.DOC_SPECIALIZATION}
                    placeholder="Heart Surgery, Interventional Cardiology"
                    className="input-hospital"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <UserCog className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    Status
                  </Label>
                  <Input
                    id="status"
                    name="status"
                    defaultValue={doctor?.DOC_STATUS}
                    placeholder="Active / On Leave / Retired"
                    className="input-hospital"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
                <Lock className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                Security
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  Password {!isEdit && '*'}
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required={!isEdit}
                  placeholder={isEdit ? "Leave blank to keep current password" : "Enter password"}
                  className="input-hospital"
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

            <div className="flex gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
              <Link href="/admin/doctors" className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  disabled={loading}
                  className="w-full h-12 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 h-12"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : isEdit ? (
                  'Update Doctor'
                ) : (
                  'Add Doctor'
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
