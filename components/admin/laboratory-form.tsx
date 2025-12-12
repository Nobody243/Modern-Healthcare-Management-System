'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, User, FlaskConical, Hash, FileText, TestTube, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export interface Laboratory {
  LAB_ID: number;
  LAB_PAT_NAME: string;
  LAB_PAT_AILMENT?: string;
  LAB_PAT_NUMBER: string;
  LAB_DOC_NUMBER?: string;
  LAB_PAT_TESTS: string;
  LAB_PAT_RESULTS?: string;
  LAB_NUMBER: string;
  LAB_STATUS?: string;
  LAB_DATE_REC?: string;
  LAB_COMPLETED_DATE?: string;
}

interface LaboratoryFormProps {
  open: boolean;
  lab?: Laboratory;
  onClose: () => void;
  onSuccess: () => void;
}

export function LaboratoryForm({ open, lab, onClose, onSuccess }: LaboratoryFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    patientName: lab?.LAB_PAT_NAME || '',
    patientAilment: lab?.LAB_PAT_AILMENT || '',
    patientNumber: lab?.LAB_PAT_NUMBER || '',
    doctorNumber: lab?.LAB_DOC_NUMBER || '',
    tests: lab?.LAB_PAT_TESTS || '',
    results: lab?.LAB_PAT_RESULTS || '',
    labNumber: lab?.LAB_NUMBER || '',
    status: lab?.LAB_STATUS || 'Pending',
    completedDate: lab?.LAB_COMPLETED_DATE || '',
  });

  useEffect(() => {
    if (lab) {
      setFormData({
        patientName: lab.LAB_PAT_NAME || '',
        patientAilment: lab.LAB_PAT_AILMENT || '',
        patientNumber: lab.LAB_PAT_NUMBER || '',
        doctorNumber: lab.LAB_DOC_NUMBER || '',
        tests: lab.LAB_PAT_TESTS || '',
        results: lab.LAB_PAT_RESULTS || '',
        labNumber: lab.LAB_NUMBER || '',
        status: lab.LAB_STATUS || 'Pending',
        completedDate: lab.LAB_COMPLETED_DATE || '',
      });
    } else {
      setFormData({
        patientName: '',
        patientAilment: '',
        patientNumber: '',
        doctorNumber: '',
        tests: '',
        results: '',
        labNumber: '',
        status: 'Pending',
        completedDate: '',
      });
    }
  }, [lab]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const url = '/api/laboratory';
      const method = lab ? 'PUT' : 'POST';
      const body = lab ? { ...formData, id: lab.LAB_ID } : formData;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save laboratory record');
      }

      toast.success(`Laboratory record ${lab ? 'updated' : 'created'} successfully`);
      onSuccess();
    } catch (error) {
      const errorMessage = (error as Error).message;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent key={lab?.LAB_ID || 'new'} className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card text-card-foreground border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-heading flex items-center gap-2">
            <FlaskConical className="w-7 h-7 text-primary" />
            {lab ? 'Update Laboratory Record' : 'New Laboratory Record'}
          </DialogTitle>
          <DialogDescription className="text-muted">
            {lab ? 'Update laboratory test information' : 'Fill in the laboratory test details below'}
          </DialogDescription>
        </DialogHeader>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit}
          className="space-y-6 mt-4"
        >
          {/* Patient Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-heading flex items-center gap-2 border-b border-border pb-2">
              <User className="w-4 h-4 text-primary" />
              Patient Information
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientName" className="text-sm font-medium text-muted flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-muted" />
                  Patient Name *
                </Label>
                <Input
                  id="patientName"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  required
                  disabled={loading || !!lab}
                  placeholder="John Doe"
                  className="input-hospital"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="patientNumber" className="text-sm font-medium text-muted flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-muted" />
                  Patient Number *
                </Label>
                <Input
                  id="patientNumber"
                  value={formData.patientNumber}
                  onChange={(e) => setFormData({ ...formData, patientNumber: e.target.value })}
                  required
                  disabled={loading || !!lab}
                  placeholder="PAT123"
                  className="input-hospital"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientAilment" className="text-sm font-medium text-muted flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-muted" />
                  Patient Ailment *
                </Label>
                <Input
                  id="patientAilment"
                  value={formData.patientAilment}
                  onChange={(e) => setFormData({ ...formData, patientAilment: e.target.value })}
                  required
                  disabled={loading || !!lab}
                  placeholder="Diagnosis"
                  className="input-hospital"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="doctorNumber" className="text-sm font-medium text-muted flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-muted" />
                  Doctor Number
                </Label>
                <Input
                  id="doctorNumber"
                  value={formData.doctorNumber}
                  onChange={(e) => setFormData({ ...formData, doctorNumber: e.target.value })}
                  disabled={loading}
                  placeholder="DOC123"
                  className="input-hospital"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium text-muted flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-muted" />
                  Status *
                </Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  required
                  disabled={loading}
                  className="select-hospital"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Test Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-heading flex items-center gap-2 border-b border-border pb-2">
              <TestTube className="w-4 h-4 text-primary" />
              Test Details
            </h3>

            <div className="space-y-2">
              <Label htmlFor="tests" className="text-sm font-medium text-muted flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-muted" />
                Tests Ordered *
              </Label>
              <Textarea
                id="tests"
                value={formData.tests}
                onChange={(e) => setFormData({ ...formData, tests: e.target.value })}
                required
                disabled={loading}
                placeholder="e.g., Complete Blood Count, Liver Function Test, Urinalysis"
                className="textarea-hospital min-h-24"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="results" className="text-sm font-medium text-muted flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-muted" />
                Test Results
              </Label>
              <Textarea
                id="results"
                value={formData.results}
                onChange={(e) => setFormData({ ...formData, results: e.target.value })}
                disabled={loading}
                placeholder="Enter test results (leave blank if pending)"
                className="textarea-hospital min-h-24"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1 btn-secondary"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{lab ? 'Update Record' : 'Create Record'}</span>
              )}
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
}
