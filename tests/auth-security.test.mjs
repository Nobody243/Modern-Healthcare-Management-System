import test from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';

test('Security & Cryptographic Hashing Suite', async (t) => {
  await t.test('Bcrypt password hashing and validation', async () => {
    const rawPassword = 'SecureDoctorPass@2026!';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(rawPassword, salt);

    assert.ok(hash.startsWith('$2'), 'Must be a valid bcrypt hash format');
    
    const isValid = await bcrypt.compare(rawPassword, hash);
    assert.strictEqual(isValid, true, 'Valid password must match hash');

    const isWrong = await bcrypt.compare('WrongPassword123', hash);
    assert.strictEqual(isWrong, false, 'Wrong password must fail hash check');
  });

  await t.test('Role validation logic', () => {
    const validRoles = ['admin', 'doctor', 'patient'];

    function validateRoleAccess(userRole, requiredRole) {
      if (!userRole || !validRoles.includes(userRole)) return false;
      if (userRole === 'admin') return true; // admin has universal access
      return userRole === requiredRole;
    }

    assert.strictEqual(validateRoleAccess('admin', 'doctor'), true);
    assert.strictEqual(validateRoleAccess('admin', 'patient'), true);
    assert.strictEqual(validateRoleAccess('doctor', 'doctor'), true);
    assert.strictEqual(validateRoleAccess('doctor', 'admin'), false);
    assert.strictEqual(validateRoleAccess('patient', 'doctor'), false);
    assert.strictEqual(validateRoleAccess('guest', 'patient'), false);
    assert.strictEqual(validateRoleAccess(null, 'admin'), false);
  });
});
