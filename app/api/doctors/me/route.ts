import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { queryOne } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session || session.role !== 'doctor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const doctor = await queryOne(
      `SELECT DOC_ID, DOC_FNAME, DOC_LNAME, DOC_EMAIL, DOC_NUMBER, DOC_DEPT, DOC_DPIC
       FROM HIS_DOCS 
       WHERE DOC_ID = :1`,
      [session.userId]
    );

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    // Handle both uppercase and lowercase from Oracle
    return NextResponse.json({
      DOC_ID: doctor.DOC_ID || doctor.doc_id,
      DOC_NUMBER: doctor.DOC_NUMBER || doctor.doc_number,
      DOC_FNAME: doctor.DOC_FNAME || doctor.doc_fname,
      DOC_LNAME: doctor.DOC_LNAME || doctor.doc_lname,
      DOC_EMAIL: doctor.DOC_EMAIL || doctor.doc_email,
      DOC_DEPT: doctor.DOC_DEPT || doctor.doc_dept,
      DOC_DPIC: doctor.DOC_DPIC || doctor.doc_dpic
    });
  } catch (error) {
    console.error('Error fetching doctor data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
