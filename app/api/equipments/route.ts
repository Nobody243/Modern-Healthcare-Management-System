export const dynamic = 'force-dynamic';
import { checkDemoDeletionGuard } from '@/lib/demo-guard';
import { NextResponse } from 'next/server';
import { query, execute } from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET all equipments
export async function GET() {
  try {
    const sql = `
      SELECT 
        EQP_ID,
        EQP_CODE,
        EQP_NAME,
        EQP_VENDOR,
        EQP_DESC,
        EQP_DEPT,
        EQP_STATUS,
        EQP_QTY,
        EQP_LOCATION
      FROM HIS_EQUIPMENTS
      ORDER BY EQP_ID DESC
    `;
    
    const equipments = await query(sql);
    
    const transformed = equipments.map((e: Record<string, unknown>) => ({
      EQP_ID: e.EQP_ID || e.eqp_id,
      EQP_CODE: e.EQP_CODE || e.eqp_code,
      EQP_NAME: e.EQP_NAME || e.eqp_name,
      EQP_VENDOR: e.EQP_VENDOR || e.eqp_vendor,
      EQP_DESC: e.EQP_DESC || e.eqp_desc,
      EQP_DEPT: e.EQP_DEPT || e.eqp_dept,
      EQP_STATUS: e.EQP_STATUS || e.eqp_status,
      EQP_QTY: e.EQP_QTY || e.eqp_qty,
      EQP_LOCATION: e.EQP_LOCATION || e.eqp_location,
    }));
    
    return NextResponse.json(transformed);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// POST - Create new equipment
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    const sql = `
      INSERT INTO HIS_EQUIPMENTS (
        EQP_CODE, EQP_NAME, EQP_VENDOR, EQP_DESC, EQP_DEPT, EQP_STATUS, EQP_QTY
      ) VALUES (
        :1, :2, :3, :4, :5, :6, :7
      )
    `;
    
    await execute(sql, [
      body.code,
      body.name,
      body.vendor,
      body.desc,
      body.dept,
      body.status || 'Functioning',
      body.qty,
    ]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// PUT - Update equipment
export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    const sql = `
      UPDATE HIS_EQUIPMENTS SET
        EQP_CODE = :1,
        EQP_NAME = :2,
        EQP_VENDOR = :3,
        EQP_DESC = :4,
        EQP_DEPT = :5,
        EQP_STATUS = :6,
        EQP_QTY = :7
      WHERE EQP_ID = :8
    `;
    
    await execute(sql, [
      body.code,
      body.name,
      body.vendor,
      body.desc,
      body.dept,
      body.status,
      body.qty,
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
      return NextResponse.json({ error: 'Equipment ID is required' }, { status: 400 });
    }
    
    await execute('DELETE FROM HIS_EQUIPMENTS WHERE EQP_ID = :1', [id]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
