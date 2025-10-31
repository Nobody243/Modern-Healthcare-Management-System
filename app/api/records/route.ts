export const dynamic = 'force-dynamic';
import { checkDemoDeletionGuard } from '@/lib/demo-guard';
import { NextResponse } from 'next/server';
import { query, execute } from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET all medical records
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let sql = `
      SELECT 
        m.MDR_ID,
        m.MDR_NUMBER,
        m.MDR_PAT_NAME,
        m.MDR_PAT_ADR,
        m.MDR_PAT_AGE,
        m.MDR_PAT_AILMENT,
        m.MDR_PAT_NUMBER,
        m.MDR_DOC_NUMBER,
        m.MDR_DOC_NAME,
        m.MDR_PAT_PRESCR,
        m.MDR_DIAGNOSIS,
        m.MDR_TREATMENT_PLAN,
        m.MDR_DATE_REC,
        p.PRES_MEDICATION,
        p.PRES_DOSAGE,
        p.PRES_FREQUENCY
      FROM V_MEDICAL_RECORDS m
      LEFT JOIN HIS_PRESCRIPTIONS p ON m.MDR_PAT_PRESCR = p.PRES_NUMBER
    `;

    let records;
    if (session.role === 'patient') {
      sql += ` WHERE m.MDR_PAT_NUMBER = :1 ORDER BY m.MDR_ID DESC`;
      records = await query(sql, [session.patientNumber || '']);
    } else {
      sql += ` ORDER BY m.MDR_ID DESC`;
      records = await query(sql);
    }
    
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
      MDR_DOC_NAME: r.MDR_DOC_NAME || r.mdr_doc_name,
      MDR_PAT_PRESCR: r.MDR_PAT_PRESCR || r.mdr_pat_prescr,
      MDR_DIAGNOSIS: r.MDR_DIAGNOSIS || r.mdr_diagnosis,
      MDR_TREATMENT_PLAN: r.MDR_TREATMENT_PLAN || r.mdr_treatment_plan,
      MDR_DATE_REC: r.MDR_DATE_REC || r.mdr_date_rec,
      PRES_MEDICATION: r.PRES_MEDICATION || r.pres_medication,
      PRES_DOSAGE: r.PRES_DOSAGE || r.pres_dosage,
      PRES_FREQUENCY: r.PRES_FREQUENCY || r.pres_frequency,
    }));
    
    return NextResponse.json(transformed);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// POST - Create new medical record
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'admin' && session.role !== 'doctor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Generate unique medical record number
    const numberSql = `SELECT 'MDR' || LPAD(NVL(MAX(TO_NUMBER(SUBSTR(MDR_NUMBER, 4))), 0) + 1, 4, '0') AS next_number FROM HIS_MEDICAL_RECORDS WHERE MDR_NUMBER LIKE 'MDR%'`;
    const numberResult = await query(numberSql);
    const recordNumber = numberResult[0]?.NEXT_NUMBER || numberResult[0]?.next_number || 'MDR0001';
    
    const sql = `
      INSERT INTO HIS_MEDICAL_RECORDS (
        MDR_NUMBER, MDR_PAT_NUMBER, MDR_DOC_NUMBER, 
        MDR_PAT_PRESCR, MDR_DIAGNOSIS, MDR_TREATMENT_PLAN
      ) VALUES (
        :1, :2, :3, :4, :5, :6
      )
    `;
    
    await execute(sql, [
      recordNumber,
      body.patientNumber,
      body.doctorNumber || null,
      body.prescription || null,
      body.diagnosis || null,
      body.treatmentPlan || null,
    ]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// PUT - Update medical record
export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'admin' && session.role !== 'doctor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    const sql = `
      UPDATE HIS_MEDICAL_RECORDS SET
        MDR_PAT_AILMENT = :1,
        MDR_PAT_PRESCR = :2,
        MDR_DIAGNOSIS = :3,
        MDR_TREATMENT_PLAN = :4
      WHERE MDR_ID = :5
    `;
    
    await execute(sql, [
      body.ailment,
      body.prescription,
      body.diagnosis,
      body.treatmentPlan,
      body.id,
    ]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// DELETE
export async function DELETE(request: Request) {
  try {
    const demoBlock = await checkDemoDeletionGuard();
    if (demoBlock) return demoBlock;

    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Record ID is required' }, { status: 400 });
    }
    
    await execute('DELETE FROM HIS_MEDICAL_RECORDS WHERE MDR_ID = :1', [id]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
