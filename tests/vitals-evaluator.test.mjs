import test from 'node:test';
import assert from 'node:assert/strict';

// Helper mimicking vitals-evaluator functions for standalone Node testing
function calculateMAP(bp) {
  if (!bp || typeof bp !== 'string') return null;
  const parts = bp.split('/');
  if (parts.length !== 2) return null;
  const sbp = parseFloat(parts[0].trim());
  const dbp = parseFloat(parts[1].trim());
  if (isNaN(sbp) || isNaN(dbp) || sbp <= 0 || dbp <= 0) return null;
  const map = Math.round((2 * dbp + sbp) / 3);
  return map;
}

function evaluateBloodPressure(bp) {
  if (!bp || typeof bp !== 'string') return { label: 'Invalid / N/A', status: 'normal', isAlert: false };
  const parts = bp.split('/');
  if (parts.length !== 2) return { label: 'Invalid Format', status: 'warning', isAlert: true };
  const sbp = parseFloat(parts[0].trim());
  const dbp = parseFloat(parts[1].trim());
  if (isNaN(sbp) || isNaN(dbp)) return { label: 'Invalid Values', status: 'warning', isAlert: true };

  if (sbp < 90 || dbp < 60) {
    return { label: 'Hypotension (Low BP)', status: 'warning', isAlert: true };
  }
  if (sbp > 180 || dbp > 120) {
    return { label: 'Hypertensive Crisis', status: 'critical', isAlert: true };
  }
  if (sbp >= 140 || dbp >= 90) {
    return { label: 'Stage 2 Hypertension', status: 'danger', isAlert: true };
  }
  if ((sbp >= 130 && sbp <= 139) || (dbp >= 80 && dbp <= 89)) {
    return { label: 'Stage 1 Hypertension', status: 'warning', isAlert: true };
  }
  if (sbp >= 120 && sbp <= 129 && dbp < 80) {
    return { label: 'Elevated BP', status: 'warning', isAlert: false };
  }
  return { label: 'Optimal / Normal', status: 'normal', isAlert: false };
}

function evaluateHeartRate(hr) {
  if (!hr) return null;
  const val = typeof hr === 'number' ? hr : parseFloat(String(hr));
  if (isNaN(val) || val <= 0) return null;
  if (val < 60) return { label: 'Bradycardia (<60 bpm)', status: 'warning', isAlert: true };
  if (val > 100) return { label: 'Tachycardia (>100 bpm)', status: 'warning', isAlert: true };
  return { label: 'Normal (60–100 bpm)', status: 'normal', isAlert: false };
}

function evaluateBodyTemp(temp) {
  if (!temp) return null;
  const val = typeof temp === 'number' ? temp : parseFloat(String(temp));
  if (isNaN(val) || val <= 0) return null;
  if (val < 95) return { label: 'Hypothermia (<95°F)', status: 'critical', isAlert: true };
  if (val >= 100.4) return { label: 'Pyrexia / Fever (≥100.4°F)', status: 'danger', isAlert: true };
  if (val > 99.5) return { label: 'Low Grade Fever', status: 'warning', isAlert: false };
  return { label: 'Normothermic (97–99°F)', status: 'normal', isAlert: false };
}

function evaluateSpO2(spo2) {
  if (!spo2) return null;
  const val = typeof spo2 === 'number' ? spo2 : parseFloat(String(spo2));
  if (isNaN(val) || val <= 0) return null;
  if (val < 90) return { label: 'Critical Hypoxemia (<90%)', status: 'critical', isAlert: true };
  if (val < 95) return { label: 'Hypoxemia Risk (90–94%)', status: 'warning', isAlert: true };
  return { label: 'Normal Oxygenation (≥95%)', status: 'normal', isAlert: false };
}

test('Clinical MAP Calculation Suite', async (t) => {
  await t.test('Normal baseline 120/80 -> MAP 93', () => {
    // (2*80 + 120)/3 = (160 + 120)/3 = 280/3 = 93.33 -> 93
    assert.strictEqual(calculateMAP('120/80'), 93);
  });

  await t.test('Lower baseline 110/70 -> MAP 83', () => {
    // (140 + 110)/3 = 250/3 = 83.33 -> 83
    assert.strictEqual(calculateMAP('110/70'), 83);
  });

  await t.test('Severe hypertension 190/110 -> MAP 137', () => {
    // (220 + 190)/3 = 410/3 = 136.67 -> 137
    assert.strictEqual(calculateMAP('190/110'), 137);
  });

  await t.test('Invalid or empty formats gracefully return null', () => {
    assert.strictEqual(calculateMAP(''), null);
    assert.strictEqual(calculateMAP('invalid'), null);
    assert.strictEqual(calculateMAP('120-80'), null);
    assert.strictEqual(calculateMAP('0/0'), null);
    assert.strictEqual(calculateMAP('-120/80'), null);
    assert.strictEqual(calculateMAP(null), null);
    assert.strictEqual(calculateMAP(undefined), null);
  });
});

test('Blood Pressure Classification Suite', async (t) => {
  await t.test('Optimal BP (118/78)', () => {
    const res = evaluateBloodPressure('118/78');
    assert.strictEqual(res.status, 'normal');
    assert.strictEqual(res.isAlert, false);
    assert.match(res.label, /Normal/);
  });

  await t.test('Elevated BP (125/75)', () => {
    const res = evaluateBloodPressure('125/75');
    assert.strictEqual(res.status, 'warning');
    assert.strictEqual(res.isAlert, false);
    assert.strictEqual(res.label, 'Elevated BP');
  });

  await t.test('Stage 1 Hypertension (135/85)', () => {
    const res = evaluateBloodPressure('135/85');
    assert.strictEqual(res.status, 'warning');
    assert.strictEqual(res.isAlert, true);
    assert.strictEqual(res.label, 'Stage 1 Hypertension');
  });

  await t.test('Stage 2 Hypertension (145/95)', () => {
    const res = evaluateBloodPressure('145/95');
    assert.strictEqual(res.status, 'danger');
    assert.strictEqual(res.isAlert, true);
    assert.strictEqual(res.label, 'Stage 2 Hypertension');
  });

  await t.test('Hypertensive Crisis (190/125)', () => {
    const res = evaluateBloodPressure('190/125');
    assert.strictEqual(res.status, 'critical');
    assert.strictEqual(res.isAlert, true);
    assert.strictEqual(res.label, 'Hypertensive Crisis');
  });

  await t.test('Hypotension (85/55)', () => {
    const res = evaluateBloodPressure('85/55');
    assert.strictEqual(res.status, 'warning');
    assert.strictEqual(res.isAlert, true);
    assert.match(res.label, /Hypotension/);
  });
});

test('Heart Rate, Temp & SpO2 Evaluation Suite', async (t) => {
  await t.test('Heart Rate classifications', () => {
    assert.strictEqual(evaluateHeartRate(50)?.status, 'warning');
    assert.strictEqual(evaluateHeartRate(75)?.status, 'normal');
    assert.strictEqual(evaluateHeartRate(120)?.status, 'warning');
    assert.strictEqual(evaluateHeartRate(0), null);
    assert.strictEqual(evaluateHeartRate(''), null);
  });

  await t.test('Body Temperature classifications', () => {
    assert.strictEqual(evaluateBodyTemp(94)?.status, 'critical');
    assert.strictEqual(evaluateBodyTemp(98.6)?.status, 'normal');
    assert.strictEqual(evaluateBodyTemp(99.8)?.status, 'warning');
    assert.strictEqual(evaluateBodyTemp(102.5)?.status, 'danger');
  });

  await t.test('SpO2 Oxygenation classifications', () => {
    assert.strictEqual(evaluateSpO2(98)?.status, 'normal');
    assert.strictEqual(evaluateSpO2(93)?.status, 'warning');
    assert.strictEqual(evaluateSpO2(88)?.status, 'critical');
    assert.strictEqual(evaluateSpO2(null), null);
  });
});
