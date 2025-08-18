'use server';

import { queryOne } from '@/lib/db';
import { setSession } from '@/lib/auth';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const role = formData.get('role') as string;

  if (!email || !role) {
    return { error: 'Email and role are required' };
  }

  // Password is only required for admin and doctor
  if ((role === 'admin' || role === 'doctor') && !password) {
    return { error: 'Password is required' };
  }

  try {
    console.log('Login attempt for:', email, 'as', role);

    const isDemoAccount = email.toLowerCase().includes('demo');

    // Check based on selected role
    if (role === 'admin') {
      const user = await queryOne(
        `SELECT AD_ID, AD_FNAME, AD_LNAME, AD_EMAIL, AD_PWD 
         FROM HIS_ADMIN WHERE LOWER(AD_EMAIL) = LOWER(:1)`,
        [email]
      );

      if (user && (password === user.AD_PWD || (isDemoAccount && (password === 'demo123' || password === 'admin')))) {
        console.log('Admin login successful');
        await setSession({
          userId: Number(user.AD_ID),
          email: user.AD_EMAIL,
          role: 'admin',
          name: `${user.AD_FNAME} ${user.AD_LNAME}`,
          isDemo: isDemoAccount,
        });
        return { success: true, redirectUrl: '/admin/dashboard' };
      }
    } else if (role === 'doctor') {
      const user = await queryOne(
        `SELECT DOC_ID, DOC_FNAME, DOC_LNAME, DOC_EMAIL, DOC_PWD, DOC_NUMBER
         FROM HIS_DOCS WHERE LOWER(DOC_EMAIL) = LOWER(:1)`,
        [email]
      );

      if (user && (password === user.DOC_PWD || (isDemoAccount && (password === 'demo123' || password === 'doctor123')))) {
        console.log('Doctor login successful');
        await setSession({
          userId: Number(user.DOC_ID),
          email: user.DOC_EMAIL,
          role: 'doctor',
          name: `${user.DOC_FNAME} ${user.DOC_LNAME}`,
          firstName: user.DOC_FNAME,
          lastName: user.DOC_LNAME,
          doctorNumber: user.DOC_NUMBER,
          isDemo: isDemoAccount,
        });
        return { success: true, redirectUrl: '/doctor/dashboard' };
      }
    } else if (role === 'patient') {
      const user = await queryOne(
        `SELECT PAT_ID, PAT_FNAME, PAT_LNAME, PAT_EMAIL, PAT_NUMBER
         FROM HIS_PATIENTS WHERE LOWER(PAT_EMAIL) = LOWER(:1)`,
        [email]
      );

      if (!user) {
        console.log('Patient not found with email:', email);
        return { error: 'Patient account not found. Please check your email or use a demo account.' };
      }

      console.log('Patient login successful');
      await setSession({
        userId: Number(user.PAT_ID),
        email: user.PAT_EMAIL,
        role: 'patient',
        name: `${user.PAT_FNAME} ${user.PAT_LNAME}`,
        patientNumber: user.PAT_NUMBER,
        firstName: user.PAT_FNAME,
        lastName: user.PAT_LNAME,
        isDemo: isDemoAccount,
      });
      return { success: true, redirectUrl: '/patient/dashboard' };
    }

    console.log('Login failed - invalid credentials or wrong role');
    return { error: 'Invalid email, password, or wrong role selected' };
  } catch (error) {
    console.error('Login error:', error);
    return { error: `Login failed: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}
