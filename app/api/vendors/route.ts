import { checkDemoDeletionGuard } from '@/lib/demo-guard';
import { NextResponse } from 'next/server';
import { query, execute } from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET all vendors
export async function GET() {
  try {
    const sql = `
      SELECT 
        V_ID,
        V_NUMBER,
        V_NAME,
        V_ADR,
        V_MOBILE,
        V_EMAIL,
        V_PHONE,
        V_DESC
      FROM HIS_VENDOR
      ORDER BY V_ID DESC
    `;
    
    const vendors = await query(sql);
    
    const transformed = vendors.map((v: Record<string, unknown>) => ({
      V_ID: v.V_ID || v.v_id,
      V_NUMBER: v.V_NUMBER || v.v_number,
      V_NAME: v.V_NAME || v.v_name,
      V_ADR: v.V_ADR || v.v_adr,
      V_MOBILE: v.V_MOBILE || v.v_mobile,
      V_EMAIL: v.V_EMAIL || v.v_email,
      V_PHONE: v.V_PHONE || v.v_phone,
      V_DESC: v.V_DESC || v.v_desc,
    }));
    
    return NextResponse.json(transformed);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// POST - Create new vendor
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    const sql = `
      INSERT INTO HIS_VENDOR (
        V_NUMBER, V_NAME, V_ADR, V_MOBILE, V_EMAIL, V_PHONE, V_DESC
      ) VALUES (
        :1, :2, :3, :4, :5, :6, :7
      )
    `;
    
    await execute(sql, [
      body.number,
      body.name,
      body.address,
      body.mobile,
      body.email,
      body.phone,
      body.description,
    ]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// PUT - Update vendor
export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    const sql = `
      UPDATE HIS_VENDOR SET
        V_NAME = :1,
        V_ADR = :2,
        V_MOBILE = :3,
        V_EMAIL = :4,
        V_PHONE = :5,
        V_DESC = :6
      WHERE V_ID = :7
    `;
    
    await execute(sql, [
      body.name,
      body.address,
      body.mobile,
      body.email,
      body.phone,
      body.description,
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
      return NextResponse.json({ error: 'Vendor ID is required' }, { status: 400 });
    }
    
    await execute('DELETE FROM HIS_VENDOR WHERE V_ID = :1', [id]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
