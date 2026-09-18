export const dynamic = 'force-dynamic';
import { checkDemoDeletionGuard } from '@/lib/demo-guard';
import { NextResponse } from 'next/server';
import { query, execute } from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET all patient transfers
export async function GET() {
  try {
    const sql = `
      SELECT 
        PT_ID,
        PT_PAT_NUMBER,
        PT_PAT_NAME,
        PT_FROM_WARD,
        PT_TO_WARD,
        PT_REASON,
        PT_TRANSFER_DATE,
        PT_AUTHORIZED_BY,
        PT_STATUS
      FROM V_PATIENT_TRANSFER
      ORDER BY PT_ID DESC
    `;
    
    const transfers = await query(sql);
    
    const transformed = transfers.map((t: Record<string, unknown>) => ({
      PT_ID: t.PT_ID || t.pt_id,
      PT_PAT_NUMBER: t.PT_PAT_NUMBER || t.pt_pat_number,
      PT_PAT_NAME: t.PT_PAT_NAME || t.pt_pat_name,
      PT_FROM_WARD: t.PT_FROM_WARD || t.pt_from_ward,
      PT_TO_WARD: t.PT_TO_WARD || t.pt_to_ward,
      PT_REASON: t.PT_REASON || t.pt_reason,
      PT_TRANSFER_DATE: t.PT_TRANSFER_DATE || t.pt_transfer_date,
      PT_AUTHORIZED_BY: t.PT_AUTHORIZED_BY || t.pt_authorized_by,
      PT_STATUS: t.PT_STATUS || t.pt_status,
    }));
    
    return NextResponse.json(transformed);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// POST - Create new patient transfer
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'admin' && session.role !== 'doctor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    const sql = `
      INSERT INTO HIS_PATIENT_TRANSFER (
        PT_PAT_NUMBER, PT_FROM_WARD, PT_TO_WARD, 
        PT_REASON, PT_AUTHORIZED_BY, PT_STATUS
      ) VALUES (
        :1, :2, :3, :4, :5, :6
      )
    `;
    
    await execute(sql, [
      body.patientNumber,
      body.from_ward,
      body.to_ward,
      body.reason || null,
      body.authorized_by || null,
      body.status || 'Pending',
    ]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// PUT - Update patient transfer
export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'admin' && session.role !== 'doctor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    const sql = `
      UPDATE HIS_PATIENT_TRANSFER SET
        PT_FROM_WARD = :1,
        PT_TO_WARD = :2,
        PT_REASON = :3,
        PT_AUTHORIZED_BY = :4,
        PT_STATUS = :5,
        UPDATED_AT = SYSTIMESTAMP
      WHERE PT_ID = :6
    `;
    
    await execute(sql, [
      body.from_ward,
      body.to_ward,
      body.reason || null,
      body.authorized_by || null,
      body.status,
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
      return NextResponse.json({ error: 'Transfer ID is required' }, { status: 400 });
    }
    
    await execute('DELETE FROM HIS_PATIENT_TRANSFER WHERE PT_ID = :1', [id]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
