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
    
    if (!session || session.role !== 'doctor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: doctorIdentifier } = await params;
    
    // Get vitals for all patients assigned to this doctor (vitals can be recorded by staff)
    const vitals = await query(
      `SELECT v.*
       FROM V_VITALS v
       INNER JOIN HIS_PATIENTS p ON v.VIT_PAT_NUMBER = p.PAT_NUMBER
       WHERE p.PAT_ASSIGNED_DOC = :1
       ORDER BY v.VIT_RECORDED_DATE DESC`,
      [doctorIdentifier]
    );

    return NextResponse.json(vitals);
  } catch (error) {
    console.error('Error fetching doctor vitals:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
