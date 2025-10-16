export interface VitalEvaluation {
  status: 'optimal' | 'normal' | 'elevated' | 'warning' | 'critical';
  label: string;
  badgeClass: string;
  dotColor: string;
}

export function evaluateBloodPressure(bp: string): VitalEvaluation {
  if (!bp || typeof bp !== 'string') {
    return { status: 'normal', label: 'Normal', badgeClass: 'badge-subaction-success', dotColor: '#10B981' };
  }
  const parts = bp.split('/').map((s) => parseInt(s.trim(), 10));
  if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) {
    return { status: 'normal', label: 'Recorded', badgeClass: 'badge-subaction-info', dotColor: '#06B6D4' };
  }
  const [systolic, diastolic] = parts;

  if (systolic < 90 || diastolic < 60) {
    return { status: 'warning', label: 'Hypotension', badgeClass: 'badge-subaction-warning', dotColor: '#F59E0B' };
  }
  if (systolic < 120 && diastolic < 80) {
    return { status: 'optimal', label: 'Optimal', badgeClass: 'badge-subaction-success', dotColor: '#10B981' };
  }
  if (systolic <= 129 && diastolic < 80) {
    return { status: 'elevated', label: 'Elevated', badgeClass: 'badge-subaction-info', dotColor: '#06B6D4' };
  }
  if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
    return { status: 'warning', label: 'Stage 1 HTN', badgeClass: 'badge-subaction-warning', dotColor: '#F59E0B' };
  }
  if (systolic >= 140 || diastolic >= 90) {
    return { status: 'critical', label: 'Stage 2 HTN', badgeClass: 'badge-subaction-danger', dotColor: '#EF4444' };
  }
  return { status: 'normal', label: 'Normal', badgeClass: 'badge-subaction-success', dotColor: '#10B981' };
}

export function calculateMAP(bp: string): number | null {
  if (!bp || typeof bp !== 'string') return null;
  const parts = bp.split('/').map((s) => parseInt(s.trim(), 10));
  if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) return null;
  const [systolic, diastolic] = parts;
  return Math.round((2 * diastolic + systolic) / 3);
}

export function evaluateHeartRate(pulse: number): VitalEvaluation {
  const p = Number(pulse) || 72;
  if (p < 60) {
    return { status: 'warning', label: 'Bradycardia', badgeClass: 'badge-subaction-warning', dotColor: '#F59E0B' };
  }
  if (p <= 100) {
    return { status: 'normal', label: 'Normal Pulse', badgeClass: 'badge-subaction-success', dotColor: '#10B981' };
  }
  return { status: 'critical', label: 'Tachycardia', badgeClass: 'badge-subaction-danger', dotColor: '#EF4444' };
}

export function evaluateBodyTemp(temp: number): VitalEvaluation {
  const t = Number(temp) || 98.6;
  if (t < 95.0) {
    return { status: 'critical', label: 'Hypothermia', badgeClass: 'badge-subaction-danger', dotColor: '#EF4444' };
  }
  if (t <= 99.1) {
    return { status: 'normal', label: 'Normothermic', badgeClass: 'badge-subaction-success', dotColor: '#10B981' };
  }
  if (t <= 100.4) {
    return { status: 'warning', label: 'Low Grade', badgeClass: 'badge-subaction-warning', dotColor: '#F59E0B' };
  }
  return { status: 'critical', label: 'Fever', badgeClass: 'badge-subaction-danger', dotColor: '#EF4444' };
}

export function evaluateSpO2(spo2: number): VitalEvaluation {
  const s = Number(spo2) || 98;
  if (s >= 95) {
    return { status: 'normal', label: 'Optimal', badgeClass: 'badge-subaction-success', dotColor: '#10B981' };
  }
  if (s >= 90) {
    return { status: 'warning', label: 'Mild Hypoxia', badgeClass: 'badge-subaction-warning', dotColor: '#F59E0B' };
  }
  return { status: 'critical', label: 'Critical Hypoxia', badgeClass: 'badge-subaction-danger', dotColor: '#EF4444' };
}
