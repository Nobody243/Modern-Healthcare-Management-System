export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    // Get user based on role
    let tableName;
    let passwordField;
    let emailField;

    if (session.role === 'admin') {
      tableName = 'HIS_ADMIN';
      passwordField = 'AD_PWD';
      emailField = 'AD_EMAIL';
    } else if (session.role === 'doctor') {
      tableName = 'HIS_DOCS';
      passwordField = 'DOC_PWD';
      emailField = 'DOC_EMAIL';
    } else if (session.role === 'patient') {
      return NextResponse.json({ 
        error: 'Patient accounts authenticate directly via verified Patient Email and Number.' 
      }, { status: 400 });
    } else {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const user = await queryOne(
      `SELECT ${passwordField} FROM ${tableName} WHERE ${emailField} = :1`,
      [session.email]
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user[passwordField]
    );

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await query(
      `UPDATE ${tableName} SET ${passwordField} = :1 WHERE ${emailField} = :2`,
      [hashedPassword, session.email]
    );

    return NextResponse.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
