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

    // Get doctor number from ID or use ID as number
    const { id: doctorIdentifier } = await params;
    
    const patients = await query(
      `SELECT p.PAT_ID, p.PAT_FNAME, p.PAT_LNAME, p.PAT_NUMBER, p.PAT_PHONE, 
              p.PAT_EMAIL, p.PAT_AILMENT, p.PAT_TYPE, p.PAT_DISCHARGE_STATUS, 
              p.PAT_ASSIGNED_DOC, p.PAT_DOB, p.PAT_AGE, p.PAT_ADDR, p.PAT_GENDER,
              p.PAT_BLOOD_GROUP, p.PAT_EMERGENCY_CONTACT,
              d.DOC_FNAME, d.DOC_LNAME
       FROM HIS_PATIENTS p
       LEFT JOIN HIS_DOCS d ON p.PAT_ASSIGNED_DOC = d.DOC_NUMBER
       WHERE p.PAT_ASSIGNED_DOC = :1
       ORDER BY p.PAT_ID DESC`,
      [doctorIdentifier]
    );

    return NextResponse.json(patients);
  } catch (error) {
    console.error('Error fetching doctor patients:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
