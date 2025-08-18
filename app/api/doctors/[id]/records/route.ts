import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    
    if (!session || session.role !== 'doctor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: doctorNumber } = await params;

    // Get all medical records (same as admin) - doctors can see all records for context
    const sql = `
      SELECT 
        MDR_ID,
        MDR_NUMBER,
        MDR_PAT_NAME,
        MDR_PAT_ADR,
        MDR_PAT_AGE,
        MDR_PAT_AILMENT,
        MDR_PAT_NUMBER,
        MDR_DOC_NUMBER,
        MDR_DOC_NAME,
        MDR_PAT_PRESCR,
        MDR_DIAGNOSIS,
        MDR_TREATMENT_PLAN,
        MDR_DATE_REC,
        CASE 
          WHEN MDR_DOC_NUMBER = :1 THEN 'Y'
          ELSE 'N'
        END as IS_OWN_RECORD
      FROM V_MEDICAL_RECORDS
      ORDER BY MDR_ID DESC
    `;
    
    const records = await query(sql, [doctorNumber]);
    
    // Handle both uppercase and lowercase from Oracle
    const transformed = records.map((r: Record<string, unknown>) => ({
      MDR_ID: r.MDR_ID || r.mdr_id,
      MDR_NUMBER: r.MDR_NUMBER || r.mdr_number,
      MDR_PAT_NAME: r.MDR_PAT_NAME || r.mdr_pat_name,
      MDR_PAT_ADR: r.MDR_PAT_ADR || r.mdr_pat_adr,
      MDR_PAT_AGE: r.MDR_PAT_AGE || r.mdr_pat_age,
      MDR_PAT_AILMENT: r.MDR_PAT_AILMENT || r.mdr_pat_ailment,
      MDR_PAT_NUMBER: r.MDR_PAT_NUMBER || r.mdr_pat_number,
      MDR_DOC_NUMBER: r.MDR_DOC_NUMBER || r.mdr_doc_number,
      MDR_PAT_PRESCR: r.MDR_PAT_PRESCR || r.mdr_pat_prescr,
      MDR_DIAGNOSIS: r.MDR_DIAGNOSIS || r.mdr_diagnosis,
      MDR_TREATMENT_PLAN: r.MDR_TREATMENT_PLAN || r.mdr_treatment_plan,
      MDR_DATE_REC: r.MDR_DATE_REC || r.mdr_date_rec,
      IS_OWN_RECORD: r.IS_OWN_RECORD || r.is_own_record,
    }));
    
    return NextResponse.json(transformed);
  } catch (error) {
    console.error('Error fetching medical records:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { 
        error: 'Failed to fetch medical records',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
