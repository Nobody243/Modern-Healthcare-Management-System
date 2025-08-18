import { checkDemoDeletionGuard } from '@/lib/demo-guard';
import { NextResponse } from 'next/server';
import { query, execute } from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET all surgery records
export async function GET() {
  try {
    const sql = `
      SELECT 
        SURG_ID,
        SURG_NUMBER,
        SURG_PAT_NUMBER,
        SURG_PAT_NAME,
        SURG_DOC_NUMBER,
        SURG_DOC_NAME,
        SURG_TYPE,
        SURG_DATE,
        SURG_DURATION,
        SURG_STATUS,
        SURG_NOTES
      FROM V_SURGERY
      ORDER BY SURG_ID DESC
    `;
    
    const surgeries = await query(sql);
    
    // Handle both uppercase and lowercase from Oracle
    const transformed = surgeries.map((s: Record<string, unknown>) => ({
      SURG_ID: s.SURG_ID || s.surg_id,
      SURG_NUMBER: s.SURG_NUMBER || s.surg_number,
      SURG_PAT_NUMBER: s.SURG_PAT_NUMBER || s.surg_pat_number,
      SURG_PAT_NAME: s.SURG_PAT_NAME || s.surg_pat_name,
      SURG_DOC_NUMBER: s.SURG_DOC_NUMBER || s.surg_doc_number,
      SURG_DOC_NAME: s.SURG_DOC_NAME || s.surg_doc_name,
      SURG_TYPE: s.SURG_TYPE || s.surg_type,
      SURG_DATE: s.SURG_DATE || s.surg_date,
      SURG_DURATION: s.SURG_DURATION || s.surg_duration,
      SURG_STATUS: s.SURG_STATUS || s.surg_status,
      SURG_NOTES: s.SURG_NOTES || s.surg_notes,
    }));
    
    return NextResponse.json(transformed);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// POST - Create new surgery record
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Generate unique surgery number
    const numberSql = `SELECT 'SURG' || LPAD(NVL(MAX(TO_NUMBER(SUBSTR(SURG_NUMBER, 5))), 0) + 1, 4, '0') AS next_number FROM HIS_SURGERY WHERE SURG_NUMBER LIKE 'SURG%'`;
    const numberResult = await query(numberSql);
    const surgeryNumber = numberResult[0]?.NEXT_NUMBER || numberResult[0]?.next_number || 'SURG0001';
    
    const sql = `
      INSERT INTO HIS_SURGERY (
        SURG_NUMBER, SURG_PAT_NUMBER, SURG_DOC_NUMBER,
        SURG_TYPE, SURG_DURATION, SURG_STATUS, SURG_NOTES
      ) VALUES (
        :1, :2, :3, :4, :5, :6, :7
      )
    `;
    
    await execute(sql, [
      surgeryNumber,
      body.patientNumber,
      body.doctorNumber || null,
      body.type || null,
      body.duration || null,
      body.status || 'Scheduled',
      body.notes || null,
    ]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// PUT - Update surgery record
export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    const sql = `
      UPDATE HIS_SURGERY SET
        SURG_TYPE = :1,
        SURG_DURATION = :2,
        SURG_STATUS = :3,
        SURG_NOTES = :4
      WHERE SURG_ID = :5
    `;
    
    await execute(sql, [
      body.type,
      body.duration,
      body.status,
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
      return NextResponse.json({ error: 'Surgery ID is required' }, { status: 400 });
    }
    
    await execute('DELETE FROM HIS_SURGERY WHERE SURG_ID = :1', [id]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
