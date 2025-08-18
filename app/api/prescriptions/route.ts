import { checkDemoDeletionGuard } from '@/lib/demo-guard';
import { NextResponse } from 'next/server';
import { query, execute } from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET all prescriptions
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientNumber = searchParams.get('patientNumber');
    
    let sql = `
      SELECT 
        PRES_ID,
        PRES_NUMBER,
        PRES_PAT_NUMBER,
        PRES_PAT_NAME,
        PRES_DOC_NUMBER,
        PRES_DOC_NAME,
        PRES_MEDICATION,
        PRES_DOSAGE,
        PRES_FREQUENCY,
        PRES_DURATION,
        PRES_DATE,
        PRES_STATUS,
        PRES_REFILLS_REMAINING,
        PRES_NOTES
      FROM V_PRESCRIPTIONS
    `;
    
    const params: string[] = [];
    if (patientNumber) {
      sql += ` WHERE PRES_PAT_NUMBER = :1`;
      params.push(patientNumber);
    }
    
    sql += ` ORDER BY PRES_ID DESC`;
    
    const prescriptions = params.length > 0 ? await query(sql, params) : await query(sql);
    
    const transformed = prescriptions.map((p: Record<string, unknown>) => ({
      PRES_ID: p.PRES_ID || p.pres_id,
      PRES_NUMBER: p.PRES_NUMBER || p.pres_number,
      PRES_PAT_NUMBER: p.PRES_PAT_NUMBER || p.pres_pat_number,
      PRES_PAT_NAME: p.PRES_PAT_NAME || p.pres_pat_name,
      PRES_DOC_NUMBER: p.PRES_DOC_NUMBER || p.pres_doc_number,
      PRES_DOC_NAME: p.PRES_DOC_NAME || p.pres_doc_name,
      PRES_MEDICATION: p.PRES_MEDICATION || p.pres_medication,
      PRES_DOSAGE: p.PRES_DOSAGE || p.pres_dosage,
      PRES_FREQUENCY: p.PRES_FREQUENCY || p.pres_frequency,
      PRES_DURATION: p.PRES_DURATION || p.pres_duration,
      PRES_DATE: p.PRES_DATE || p.pres_date,
      PRES_STATUS: p.PRES_STATUS || p.pres_status,
      PRES_REFILLS_REMAINING: p.PRES_REFILLS_REMAINING || p.pres_refills_remaining,
      PRES_NOTES: p.PRES_NOTES || p.pres_notes,
    }));
    
    return NextResponse.json(transformed);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// POST - Create new prescription
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Generate unique prescription number
    const numberSql = `SELECT 'PRES' || LPAD(NVL(MAX(TO_NUMBER(SUBSTR(PRES_NUMBER, 5))), 0) + 1, 4, '0') AS next_number FROM HIS_PRESCRIPTIONS WHERE PRES_NUMBER LIKE 'PRES%'`;
    const numberResult = await query(numberSql);
    const prescriptionNumber = numberResult[0]?.NEXT_NUMBER || numberResult[0]?.next_number || 'PRES0001';
    
    const sql = `
      INSERT INTO HIS_PRESCRIPTIONS (
        PRES_NUMBER, PRES_PAT_NUMBER, PRES_DOC_NUMBER,
        PRES_MEDICATION, PRES_DOSAGE, PRES_FREQUENCY,
        PRES_DURATION, PRES_STATUS, PRES_REFILLS_REMAINING, PRES_NOTES
      ) VALUES (
        :1, :2, :3, :4, :5, :6, :7, :8, :9, :10
      )
    `;
    
    await execute(sql, [
      prescriptionNumber,
      body.patientNumber,
      body.doctorNumber || null,
      body.medication,
      body.dosage || null,
      body.frequency || null,
      body.duration || null,
      body.status || 'Active',
      body.refills || 0,
      body.notes || null,
    ]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// PUT - Update prescription
export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    const sql = `
      UPDATE HIS_PRESCRIPTIONS SET
        PRES_MEDICATION = :1,
        PRES_DOSAGE = :2,
        PRES_FREQUENCY = :3,
        PRES_DURATION = :4,
        PRES_STATUS = :5,
        PRES_REFILLS_REMAINING = :6,
        PRES_NOTES = :7
      WHERE PRES_ID = :8
    `;
    
    await execute(sql, [
      body.medication,
      body.dosage,
      body.frequency,
      body.duration,
      body.status,
      body.refills || 0,
      body.notes,
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
    if (!session || (session.role !== 'admin' && session.role !== 'doctor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Prescription ID is required' }, { status: 400 });
    }
    
    await execute('DELETE FROM HIS_PRESCRIPTIONS WHERE PRES_ID = :1', [id]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
