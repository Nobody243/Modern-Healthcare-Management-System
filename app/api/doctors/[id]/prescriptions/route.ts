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
    
    const prescriptions = await query(
      `SELECT *
       FROM V_PRESCRIPTIONS
       WHERE PRES_DOC_NUMBER = :1
       ORDER BY PRES_DATE DESC`,
      [doctorIdentifier]
    );

    return NextResponse.json(prescriptions);
  } catch (error) {
    console.error('Error fetching doctor prescriptions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
