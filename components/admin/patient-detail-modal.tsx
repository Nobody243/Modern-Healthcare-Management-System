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
  <div className="flex items-start gap-3 p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors border border-border">
    <div className="p-2 bg-primary/10 rounded-lg">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <div className="flex-1">
      <p className="text-sm font-medium text-muted">{label}</p>
      <p className="text-base font-semibold text-heading mt-1">{value || 'N/A'}</p>
    </div>
  </div>
);

export function PatientDetailModal({ open, onClose, patient }: PatientDetailModalProps) {
  if (!patient) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card text-card-foreground border-border">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-full">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-heading">
                  {patient.PAT_FNAME} {patient.PAT_LNAME}
                </DialogTitle>
                <p className="text-sm text-muted mt-1 font-mono">Patient ID: {patient.PAT_NUMBER}</p>
              </div>
            </div>
            <Badge
              className={`badge ${
                patient.PAT_TYPE === 'InPatient'
                  ? 'badge-info'
                  : 'badge-success'
              } px-4 py-2 text-sm`}
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
            <h3 className="text-lg font-semibold text-heading mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
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
            <h3 className="text-lg font-semibold text-heading mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Address
            </h3>
            <div className="p-4 bg-secondary/30 rounded-lg border border-border">
              <p className="text-heading">{patient.PAT_ADDR || 'N/A'}</p>
            </div>
          </div>

          {/* Medical Information */}
          <div>
            <h3 className="text-lg font-semibold text-heading mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Medical Information
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-kpi-danger-subtle rounded-lg border border-kpi-danger-subtle">
                <p className="text-sm font-medium text-kpi-danger mb-2">Current Ailment</p>
                <p className="text-base font-semibold text-heading">{patient.PAT_AILMENT || 'N/A'}</p>
              </div>
              {patient.PAT_DISCHARGE_STATUS && (
                <div className="p-4 bg-kpi-primary-subtle rounded-lg border border-kpi-primary-subtle">
                  <p className="text-sm font-medium text-kpi-primary mb-2">Discharge Status</p>
                  <p className="text-heading">{patient.PAT_DISCHARGE_STATUS}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
