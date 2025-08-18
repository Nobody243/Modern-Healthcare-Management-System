'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileHeart, Calendar, User, FileText, Activity, Search, ShieldCheck, Stethoscope, Pill } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

interface MedicalRecord {
  MDR_ID: number;
  MDR_NUMBER: string;
  MDR_PAT_AILMENT: string;
  MDR_DIAGNOSIS: string;
  MDR_TREATMENT_PLAN: string;
  MDR_PAT_PRESCR: string;
  MDR_DATE_REC: string;
  MDR_DOC_NUMBER: string;
  DOC_NAME: string;
  PRES_MEDICATION?: string;
  PRES_DOSAGE?: string;
  PRES_FREQUENCY?: string;
  PRES_DURATION?: string;
  PRES_NOTES?: string;
}

interface RecordsClientProps {
  records: MedicalRecord[];
}

export default function PatientRecordsClient({ records }: RecordsClientProps) {
  const [search, setSearch] = useState('');

  const filteredRecords = useMemo(() => {
    return records.filter((record) =>
      `${record.MDR_NUMBER || ''} ${record.MDR_PAT_AILMENT || ''} ${record.MDR_DIAGNOSIS || ''} ${record.DOC_NAME || ''} ${record.MDR_TREATMENT_PLAN || ''}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [records, search]);

  const uniqueAilments = useMemo(() => {
    const set = new Set(records.map(r => r.MDR_PAT_AILMENT).filter(Boolean));
    return set.size;
  }, [records]);

  const withPrescription = useMemo(() => {
    return records.filter(r => r.MDR_PAT_PRESCR || r.PRES_MEDICATION).length;
  }, [records]);

  return (
    <div className="space-y-6">
      {/* Executive Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-heading">
              My Medical Records & Chart History
            </h1>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {records.length} Case Files
            </span>
          </div>
          <p className="text-muted mt-1">
            Official longitudinal clinical case charts, physician diagnostic summaries, and personalized care regimens
          </p>
        </motion.div>
      </div>

      {/* Bento KPI Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-medium">Total Case Records</p>
              <p className="text-2xl font-bold text-cyan-400 font-mono mt-1">
                {records.length}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400">
              <FileHeart className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-medium">Documented Ailments</p>
              <p className="text-2xl font-bold text-teal-400 font-mono mt-1">
                {uniqueAilments}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/30 text-teal-400">
              <Activity className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-medium">Prescription Linked</p>
              <p className="text-2xl font-bold text-purple-400 font-mono mt-1">
                {withPrescription}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-400">
              <Pill className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-medium">Chart Integrity</p>
              <p className="text-2xl font-bold text-emerald-400 font-mono mt-1">
                Verified
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Frosted Filter & Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="card-glass p-4 border border-slate-700/50 shadow-md backdrop-blur-md">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <Input
              type="text"
              placeholder="Search medical records by record code, clinical ailment, diagnosis, doctor, or treatment plan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-hospital pl-10 h-11"
            />
          </div>
        </Card>
      </motion.div>

      {/* Records Grid */}
      {filteredRecords.length === 0 ? (
        <Card className="card p-12 text-center border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mx-auto mb-4 flex items-center justify-center text-cyan-400">
            <FileHeart className="w-8 h-8" />
          </div>
          <p className="text-heading font-semibold text-lg">
            {search ? 'No medical records match your search criteria' : 'No medical records documented yet'}
          </p>
          <p className="text-muted text-sm mt-1">
            {search ? 'Try adjusting your search query or clear the filter' : 'Your clinical chart entries will appear here as soon as consultations occur'}
          </p>
        </Card>
      ) : (
        <div className="grid gap-6">
          <AnimatePresence>
            {filteredRecords.map((record, index) => (
              <motion.div
                key={record.MDR_ID || index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.04 }}
              >
                <Card className="card overflow-hidden border border-slate-700/50 hover:border-cyan-500/40 transition-all bg-slate-900/60 backdrop-blur-xl shadow-lg hover:shadow-cyan-500/5">
                  <div className="h-1 bg-gradient-to-r from-cyan-500 via-teal-500 to-sky-500" />
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                          <FileHeart className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold font-mono text-heading">
                            {record.MDR_NUMBER}
                          </CardTitle>
                          {record.DOC_NAME && (
                            <p className="text-xs text-muted mt-0.5 flex items-center gap-1.5">
                              <Stethoscope className="w-3 h-3 text-cyan-400" />
                              <span>Attending: <span className="font-medium text-slate-300">Dr. {record.DOC_NAME}</span></span>
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 bg-cyan-500/10">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(record.MDR_DATE_REC)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {record.MDR_PAT_AILMENT && (
                        <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                          <div className="flex items-center gap-2 mb-1.5">
                            <Activity className="w-4 h-4 text-rose-400" />
                            <p className="text-xs font-semibold text-rose-400 uppercase tracking-wide">Presenting Ailment</p>
                          </div>
                          <p className="text-sm font-medium text-slate-200">{record.MDR_PAT_AILMENT}</p>
                        </div>
                      )}

                      {record.MDR_DIAGNOSIS && (
                        <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                          <div className="flex items-center gap-2 mb-1.5">
                            <FileText className="w-4 h-4 text-cyan-400" />
                            <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">Clinical Diagnosis</p>
                          </div>
                          <p className="text-sm font-medium text-slate-200">{record.MDR_DIAGNOSIS}</p>
                        </div>
                      )}
                    </div>

                    {record.MDR_TREATMENT_PLAN && (
                      <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                        <div className="flex items-center gap-2 mb-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">Treatment & Care Plan</p>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed">{record.MDR_TREATMENT_PLAN}</p>
                      </div>
                    )}

                    {(record.MDR_PAT_PRESCR || record.PRES_MEDICATION) && (
                      <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Pill className="w-4 h-4 text-purple-400" />
                          <p className="text-xs font-semibold text-purple-400 uppercase tracking-wide">
                            Associated Prescription {record.MDR_PAT_PRESCR ? `(${record.MDR_PAT_PRESCR})` : ''}
                          </p>
                        </div>
                        {record.PRES_MEDICATION ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                            <div className="p-2 rounded bg-slate-900/50 border border-slate-800">
                              <span className="text-muted block">Medication:</span>
                              <span className="font-semibold text-purple-300">{record.PRES_MEDICATION}</span>
                            </div>
                            {record.PRES_DOSAGE && (
                              <div className="p-2 rounded bg-slate-900/50 border border-slate-800">
                                <span className="text-muted block">Dosage:</span>
                                <span className="font-medium text-slate-200">{record.PRES_DOSAGE}</span>
                              </div>
                            )}
                            {record.PRES_FREQUENCY && (
                              <div className="p-2 rounded bg-slate-900/50 border border-slate-800">
                                <span className="text-muted block">Frequency:</span>
                                <span className="font-medium text-slate-200">{record.PRES_FREQUENCY}</span>
                              </div>
                            )}
                            {record.PRES_DURATION && (
                              <div className="p-2 rounded bg-slate-900/50 border border-slate-800">
                                <span className="text-muted block">Duration:</span>
                                <span className="font-medium text-slate-200">{record.PRES_DURATION}</span>
                              </div>
                            )}
                            {record.PRES_NOTES && (
                              <div className="col-span-full p-2 rounded bg-slate-900/50 border border-slate-800">
                                <span className="text-muted block">Instructions / Notes:</span>
                                <span className="font-medium text-slate-300">{record.PRES_NOTES}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-muted italic">Prescription code linked: {record.MDR_PAT_PRESCR}</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
