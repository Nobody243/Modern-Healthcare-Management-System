export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const doctors = await query(`
      SELECT DOC_ID, DOC_FNAME, DOC_LNAME, DOC_EMAIL, DOC_NUMBER 
      FROM HIS_DOCS 
      ORDER BY DOC_ID
    `);
    
    const admins = await query(`
      SELECT AD_ID, AD_FNAME, AD_LNAME, AD_EMAIL 
      FROM HIS_ADMIN 
      ORDER BY AD_ID
    `);
    
    const doctorsInfo = doctors.map((d: Record<string, unknown>) => ({
      id: d.DOC_ID || d.doc_id,
      name: `${d.DOC_FNAME || d.doc_fname} ${d.DOC_LNAME || d.doc_lname}`,
      email: d.DOC_EMAIL || d.doc_email,
      number: d.DOC_NUMBER || d.doc_number,
    }));
    
    const adminsInfo = admins.map((a: Record<string, unknown>) => ({
      id: a.AD_ID || a.ad_id,
      name: `${a.AD_FNAME || a.ad_fname} ${a.AD_LNAME || a.ad_lname}`,
      email: a.AD_EMAIL || a.ad_email,
    }));
    
    return NextResponse.json({
      doctors: doctorsInfo,
      admins: adminsInfo,
      totalDoctors: doctors.length,
      totalAdmins: admins.length
    });
  } catch (error) {
    console.error('Test auth error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
