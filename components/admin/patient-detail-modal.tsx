'use client';
import { motion } from 'framer-motion';
import { User, Phone, MapPin, Calendar, Activity, FileText, LucideIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

interface Patient {
  PAT_ID: number;
  PAT_FNAME: string;
  PAT_LNAME: string;
  PAT_NUMBER: string;
  PAT_DOB?: string;
  PAT_AGE?: string;
  PAT_ADDR?: string;
  PAT_PHONE?: string;
  PAT_TYPE?: string;
  PAT_AILMENT?: string;
  PAT_DISCHARGE_STATUS?: string;
  PAT_DATE_JOINED?: string;
}

interface PatientDetailModalProps {
  open: boolean;
  onClose: () => void;
  patient: Patient | null;
}

const InfoRow = ({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string | undefined }) => (
  <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700">
    <div className="p-2 bg-sky-100 dark:bg-sky-900/50 rounded-lg">
      <Icon className="w-5 h-5 text-sky-600 dark:text-sky-400" />
    </div>
    <div className="flex-1">
      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{label}</p>
      <p className="text-base font-semibold text-slate-900 dark:text-white mt-1">{value || 'N/A'}</p>
    </div>
  </div>
);

export function PatientDetailModal({ open, onClose, patient }: PatientDetailModalProps) {
  if (!patient) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-sky-100 dark:bg-sky-900/50 rounded-full">
                <User className="w-6 h-6 text-sky-600 dark:text-sky-400" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                  {patient.PAT_FNAME} {patient.PAT_LNAME}
                </DialogTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Patient ID: {patient.PAT_NUMBER}</p>
              </div>
            </div>
            <Badge
              className={
                patient.PAT_TYPE === 'InPatient'
                  ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-800 px-4 py-2 text-sm'
                  : 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800 px-4 py-2 text-sm'
              }
            >
              {patient.PAT_TYPE || 'N/A'}
            </Badge>
          </div>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 space-y-6"
        >
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow icon={Calendar} label="Date of Birth" value={formatDate(patient.PAT_DOB)} />
              <InfoRow icon={Activity} label="Age" value={patient.PAT_AGE ? `${patient.PAT_AGE} years` : undefined} />
              <InfoRow icon={Phone} label="Phone Number" value={patient.PAT_PHONE} />
              <InfoRow icon={Calendar} label="Date Joined" value={formatDate(patient.PAT_DATE_JOINED)} />
            </div>
          </div>

          {/* Address */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              Address
            </h3>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
              <p className="text-slate-900 dark:text-white">{patient.PAT_ADDR || 'N/A'}</p>
            </div>
          </div>

          {/* Medical Information */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              Medical Information
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-900">
                <p className="text-sm font-medium text-red-800 dark:text-red-300 mb-2">Current Ailment</p>
                <p className="text-base font-semibold text-red-900 dark:text-red-100">{patient.PAT_AILMENT || 'N/A'}</p>
              </div>
              {patient.PAT_DISCHARGE_STATUS && (
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Discharge Status</p>
                  <p className="text-slate-900 dark:text-white">{patient.PAT_DISCHARGE_STATUS}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
