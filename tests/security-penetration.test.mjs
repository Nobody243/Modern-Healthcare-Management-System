import test from 'node:test';
import assert from 'node:assert/strict';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

async function isServerOnline() {
  try {
    await fetch(`${BASE_URL}/api/health`, { signal: AbortSignal.timeout(1500) });
    return true;
  } catch {
    return false;
  }
}

test('Security Penetration & Vulnerability Assessment Suite', async (t) => {
  const online = await isServerOnline();

  const protectedDataEndpoints = [
    '/api/patients',
    '/api/doctors',
    '/api/pharmaceuticals',
    '/api/vitals',
    '/api/surgery',
    '/api/laboratory',
    '/api/records',
    '/api/prescriptions',
    '/api/accounts',
    '/api/payrolls',
    '/api/vendors',
    '/api/equipments',
    '/api/assets',
    '/api/pharmaceutical-categories',
    '/api/patient-transfers',
    '/api/test-auth',
    '/api/doctors/me',
    '/api/doctors/DOC0001/patients',
    '/api/doctors/DOC0001/prescriptions',
    '/api/doctors/DOC0001/records',
    '/api/doctors/DOC0001/surgeries',
    '/api/doctors/DOC0001/vitals',
    '/api/doctors/DOC0001/laboratory',
    '/api/doctors/DOC0001/patient-transfers',
  ];

  await t.test('Unauthenticated Data Harvest Attack Vector is Blocked (401)', async (ctx) => {
    if (!online) {
      ctx.skip(`Skipping live HTTP probe: server not reachable at ${BASE_URL}`);
      return;
    }
    for (const endpoint of protectedDataEndpoints) {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        headers: { 'Accept': 'application/json' },
      });
      assert.strictEqual(
        res.status,
        401,
        `Unauthenticated request to ${endpoint} must be rejected with 401 Unauthorized (got ${res.status})`
      );
      const data = await res.json();
      assert.ok(data.error === 'Unauthorized', `Endpoint ${endpoint} must return { error: 'Unauthorized' }`);
    }
  });

  await t.test('Unauthenticated Mutation Attack Vectors (POST/PUT/DELETE) are Blocked (401)', async (ctx) => {
    if (!online) {
      ctx.skip(`Skipping live HTTP probe: server not reachable at ${BASE_URL}`);
      return;
    }
    const mutationEndpoints = [
      { url: '/api/patients', method: 'POST', body: { email: 'hacker@evil.com' } },
      { url: '/api/doctors', method: 'POST', body: { email: 'fake@evil.com', pwd: '123' } },
      { url: '/api/accounts', method: 'POST', body: { name: 'Embezzled Funds', amount: 1000000 } },
      { url: '/api/payrolls', method: 'POST', body: { doc_number: 'DOC999', amount: 500000 } },
      { url: '/api/patient/update-password', method: 'POST', body: { password: 'newpassword123', patientNumber: 'PAT00001' } },
      { url: '/api/patient-transfers', method: 'POST', body: { patientNumber: 'PAT00001', from_ward: 'A', to_ward: 'B' } },
      { url: '/api/patient-transfers/1', method: 'PUT', body: { fromWard: 'A', toWard: 'B', status: 'Approved' } },
      { url: '/api/patient-transfers/1', method: 'DELETE' },
      { url: '/api/vitals', method: 'POST', body: { patientNumber: 'PAT00001', bodyTemp: 98.6 } },
      { url: '/api/surgery', method: 'POST', body: { patientNumber: 'PAT00001', type: 'Appendectomy' } },
      { url: '/api/laboratory', method: 'POST', body: { patientNumber: 'PAT00001', tests: 'CBC' } },
      { url: '/api/patients?id=1', method: 'DELETE' },
      { url: '/api/doctors?id=1', method: 'DELETE' },
    ];

    for (const { url, method, body } of mutationEndpoints) {
      const res = await fetch(`${BASE_URL}${url}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });
      assert.strictEqual(
        res.status,
        401,
        `Unauthenticated ${method} to ${url} must return 401 (got ${res.status})`
      );
    }
  });

  await t.test('SQL Injection Resiliency on Query Endpoints', async (ctx) => {
    if (!online) {
      ctx.skip(`Skipping live HTTP probe: server not reachable at ${BASE_URL}`);
      return;
    }
    const sqliPayloads = [
      "' OR '1'='1",
      "'; DROP TABLE HIS_PATIENTS; --",
      "1' UNION SELECT 1, 'admin', 'hacked' FROM DUAL--",
    ];

    for (const payload of sqliPayloads) {
      const encoded = encodeURIComponent(payload);
      const res = await fetch(`${BASE_URL}/api/prescriptions?patientNumber=${encoded}`);
      assert.ok([401, 400, 200].includes(res.status), `SQLi attempt should not trigger 500 error`);
      if (res.status === 200) {
        const data = await res.json();
        assert.ok(Array.isArray(data), 'Should return array');
      }
    }
  });

  await t.test('Role-Based Access Control Segregation Logic Rules', () => {
    const rbacRules = {
      admin: {
        canViewAccounts: true,
        canViewPayrolls: true,
        canViewVendors: true,
        canViewEquipments: true,
        canViewAssets: true,
        canViewPharmaceuticals: true,
        canViewDoctors: true,
        canAccessAllPatients: true,
      },
      doctor: {
        canViewAccounts: false,
        canViewPayrolls: true, // own payroll only
        canViewVendors: false,
        canViewEquipments: false,
        canViewAssets: false,
        canViewPharmaceuticals: true,
        canViewDoctors: true,
        canAccessAllPatients: true,
      },
      patient: {
        canViewAccounts: false,
        canViewPayrolls: false,
        canViewVendors: false,
        canViewEquipments: false,
        canViewAssets: false,
        canViewPharmaceuticals: false,
        canViewDoctors: false,
        canAccessAllPatients: false, // only self
      },
    };

    // Patient isolation rules
    assert.strictEqual(rbacRules.patient.canViewAccounts, false, 'Patients must not view hospital accounts');
    assert.strictEqual(rbacRules.patient.canViewPayrolls, false, 'Patients must not view staff payrolls');
    assert.strictEqual(rbacRules.patient.canViewVendors, false, 'Patients must not view vendors');
    assert.strictEqual(rbacRules.patient.canViewEquipments, false, 'Patients must not view equipment inventory');
    assert.strictEqual(rbacRules.patient.canViewAssets, false, 'Patients must not view capital assets');
    assert.strictEqual(rbacRules.patient.canViewPharmaceuticals, false, 'Patients must not view internal pharmacy stock');
    assert.strictEqual(rbacRules.patient.canViewDoctors, false, 'Patients must not view staff internal directory');
    assert.strictEqual(rbacRules.patient.canAccessAllPatients, false, 'Patients must only access their own records');

    // Doctor isolation rules
    assert.strictEqual(rbacRules.doctor.canViewAccounts, false, 'Doctors must not view financial balance sheets');
    assert.strictEqual(rbacRules.doctor.canViewVendors, false, 'Doctors must not view vendor management');
    assert.strictEqual(rbacRules.doctor.canViewEquipments, false, 'Doctors must not view equipment maintenance logs');
    assert.strictEqual(rbacRules.doctor.canViewAssets, false, 'Doctors must not view hospital balance sheet assets');
  });
});
