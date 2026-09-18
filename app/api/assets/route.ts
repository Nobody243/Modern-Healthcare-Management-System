export const dynamic = 'force-dynamic';
import { checkDemoDeletionGuard } from '@/lib/demo-guard';
import { NextResponse } from 'next/server';
import { query, execute } from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET all assets
export async function GET() {
  try {
    const sql = `
      SELECT 
        ASST_ID,
        ASST_NAME,
        ASST_DESC,
        ASST_VENDOR,
        ASST_STATUS,
        ASST_DEPT,
        ASST_PURCHASE_DATE,
        ASST_PURCHASE_COST,
        ASST_SERIAL_NUMBER
      FROM HIS_ASSETS
      ORDER BY ASST_ID DESC
    `;
    
    const assets = await query(sql);
    
    // Handle both uppercase and lowercase from Oracle
    const transformed = assets.map((a: Record<string, unknown>) => ({
      ASST_ID: a.ASST_ID || a.asst_id,
      ASST_NAME: a.ASST_NAME || a.asst_name,
      ASST_DESC: a.ASST_DESC || a.asst_desc,
      ASST_VENDOR: a.ASST_VENDOR || a.asst_vendor,
      ASST_STATUS: a.ASST_STATUS || a.asst_status,
      ASST_DEPT: a.ASST_DEPT || a.asst_dept,
      ASST_PURCHASE_DATE: a.ASST_PURCHASE_DATE || a.asst_purchase_date,
      ASST_PURCHASE_COST: a.ASST_PURCHASE_COST || a.asst_purchase_cost,
      ASST_SERIAL_NUMBER: a.ASST_SERIAL_NUMBER || a.asst_serial_number,
    }));
    
    return NextResponse.json(transformed);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// POST - Create new asset
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    const sql = `
      INSERT INTO HIS_ASSETS (
        ASST_NAME, ASST_DESC, ASST_VENDOR, ASST_STATUS, ASST_DEPT
      ) VALUES (
        :1, :2, :3, :4, :5
      )
    `;
    
    await execute(sql, [
      body.name,
      body.desc,
      body.vendor,
      body.status || 'Active',
      body.dept,
    ]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// PUT - Update asset
export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    const sql = `
      UPDATE HIS_ASSETS SET
        ASST_NAME = :1,
        ASST_DESC = :2,
        ASST_VENDOR = :3,
        ASST_STATUS = :4,
        ASST_DEPT = :5
      WHERE ASST_ID = :6
    `;
    
    await execute(sql, [
      body.name,
      body.desc,
      body.vendor,
      body.status,
      body.dept,
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
      return NextResponse.json({ error: 'Asset ID is required' }, { status: 400 });
    }
    
    await execute('DELETE FROM HIS_ASSETS WHERE ASST_ID = :1', [id]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
