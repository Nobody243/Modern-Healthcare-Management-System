export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: Request,
  { params }: RouteParams
) {
  try {
    const session = await getSession();
    
    if (!session || (session.role !== 'doctor' && session.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: doctorIdentifier } = await params;

    // Strict doctor scoping: doctor cannot inspect another doctor's queue
    if (session.role === 'doctor' && session.doctorNumber !== doctorIdentifier && session.userId.toString() !== doctorIdentifier) {
      return NextResponse.json({ error: 'Forbidden: Access denied to another doctor queue' }, { status: 403 });
    }
    
    const surgeries = await query(
      `SELECT *
       FROM V_SURGERY
       WHERE SURG_DOC_NUMBER = :1
       ORDER BY SURG_DATE DESC`,
      [doctorIdentifier]
    );

    return NextResponse.json(surgeries);
  } catch (error) {
    console.error('Error fetching doctor surgeries:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
