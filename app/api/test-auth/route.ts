import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const doctors = await query(`
      SELECT DOC_ID, DOC_FNAME, DOC_LNAME, DOC_EMAIL, DOC_PWD, DOC_NUMBER 
      FROM HIS_DOCS 
      ORDER BY DOC_ID
    `);
    
    const admins = await query(`
      SELECT AD_ID, AD_FNAME, AD_LNAME, AD_EMAIL, AD_PWD 
      FROM HIS_ADMIN 
      ORDER BY AD_ID
    `);
    
    // Mask passwords for security but show length
    const doctorsInfo = doctors.map((d: any) => ({
      id: d.DOC_ID || d.doc_id,
      name: `${d.DOC_FNAME || d.doc_fname} ${d.DOC_LNAME || d.doc_lname}`,
      email: d.DOC_EMAIL || d.doc_email,
      number: d.DOC_NUMBER || d.doc_number,
      passwordLength: (d.DOC_PWD || d.doc_pwd)?.length || 0,
      passwordPreview: (d.DOC_PWD || d.doc_pwd)?.substring(0, 3) + '***'
    }));
    
    const adminsInfo = admins.map((a: any) => ({
      id: a.AD_ID || a.ad_id,
      name: `${a.AD_FNAME || a.ad_fname} ${a.AD_LNAME || a.ad_lname}`,
      email: a.AD_EMAIL || a.ad_email,
      passwordLength: (a.AD_PWD || a.ad_pwd)?.length || 0,
      passwordPreview: (a.AD_PWD || a.ad_pwd)?.substring(0, 3) + '***'
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
