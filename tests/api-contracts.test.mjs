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

test('API & Route Contracts Regression Suite', async (t) => {
  const online = await isServerOnline();
  if (!online) {
    t.skip(`Skipping live HTTP contract checks: server not reachable at ${BASE_URL}`);
    return;
  }

  await t.test('Health Endpoint Contract (/api/health)', async () => {
    const res = await fetch(`${BASE_URL}/api/health`);
    assert.ok([200, 503].includes(res.status), `Health endpoint returned status ${res.status}`);
    const data = await res.json();
    assert.ok('status' in data, 'Health endpoint should return status field');
    assert.ok('database' in data, 'Health endpoint should return database connectivity field');
  });

  await t.test('Unauthenticated Access to Protected Web Portals Redirects to /login', async () => {
    const protectedPortals = [
      '/admin/dashboard',
      '/admin/patients',
      '/admin/pharmaceuticals',
      '/doctor/dashboard',
      '/doctor/patients',
      '/doctor/vitals',
      '/patient/dashboard',
      '/patient/records',
    ];

    for (const portal of protectedPortals) {
      // Manual redirect mode to verify the 307/308 redirect status
      const res = await fetch(`${BASE_URL}${portal}`, {
        redirect: 'manual',
      });
      assert.ok([307, 308, 302, 303].includes(res.status), `Accessing ${portal} without auth should redirect (got ${res.status})`);
      const location = res.headers.get('location');
      assert.ok(location?.includes('/login'), `${portal} should redirect to /login (got ${location})`);
    }
  });

  await t.test('Public Web Pages Return 200 OK', async () => {
    const publicPages = [
      '/',
      '/login',
    ];

    for (const page of publicPages) {
      const res = await fetch(`${BASE_URL}${page}`);
      assert.strictEqual(res.status, 200, `Public page ${page} should return 200 OK`);
      const text = await res.text();
      assert.ok(text.includes('CureWell') || text.includes('Healthcare') || text.includes('Hospital') || text.includes('Login'), `Page ${page} should contain hospital branding`);
    }
  });

  await t.test('Protected API Endpoints Return 401 Without Session', async () => {
    const endpoints = [
      '/api/patients',
      '/api/doctors',
      '/api/pharmaceuticals',
      '/api/vitals',
      '/api/surgery',
      '/api/laboratory',
      '/api/accounts',
      '/api/payrolls',
      '/api/vendors',
      '/api/equipments',
      '/api/assets',
      '/api/pharmaceutical-categories',
      '/api/patient-transfers',
    ];

    for (const endpoint of endpoints) {
      const res = await fetch(`${BASE_URL}${endpoint}`);
      assert.strictEqual(res.status, 401, `Endpoint ${endpoint} must reject unauthenticated requests with 401`);
      const data = await res.json();
      assert.strictEqual(data.error, 'Unauthorized');
    }
  });
});
