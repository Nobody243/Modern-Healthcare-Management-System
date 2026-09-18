export const dynamic = 'force-dynamic';
import { checkDemoDeletionGuard } from '@/lib/demo-guard';
import { NextResponse } from 'next/server';
import { query, execute } from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET all pharmaceuticals
export async function GET() {
  try {
    const sql = `
      SELECT 
        PHAR_ID,
        PHAR_NAME,
        PHAR_BCODE,
        PHAR_DESC,
        PHAR_QTY,
        PHAR_UNIT_PRICE,
        PHAR_CAT,
        PHAR_VENDOR,
        PHAR_EXPIRY_DATE,
        PHAR_MANUFACTURING_DATE
      FROM HIS_PHARMACEUTICALS
      ORDER BY PHAR_ID DESC
    `;
    
    const pharma = await query(sql);
    
    // Handle both uppercase and lowercase from Oracle
    const transformed = pharma.map((p: Record<string, unknown>) => ({
      PHAR_ID: p.PHAR_ID || p.phar_id,
      PHAR_NAME: p.PHAR_NAME || p.phar_name,
      PHAR_BCODE: p.PHAR_BCODE || p.phar_bcode,
      PHAR_DESC: p.PHAR_DESC || p.phar_desc,
      PHAR_QTY: p.PHAR_QTY || p.phar_qty,
      PHAR_UNIT_PRICE: p.PHAR_UNIT_PRICE || p.phar_unit_price,
      PHAR_CAT: p.PHAR_CAT || p.phar_cat,
      PHAR_VENDOR: p.PHAR_VENDOR || p.phar_vendor,
      PHAR_EXPIRY_DATE: p.PHAR_EXPIRY_DATE || p.phar_expiry_date,
      PHAR_MANUFACTURING_DATE: p.PHAR_MANUFACTURING_DATE || p.phar_manufacturing_date,
    }));
    
    return NextResponse.json(transformed);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// POST - Create new pharmaceutical
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    console.log('Creating pharmaceutical:', body);
    
    const sql = `
      INSERT INTO HIS_PHARMACEUTICALS (
        PHAR_NAME, PHAR_BCODE, PHAR_DESC, PHAR_QTY, PHAR_UNIT_PRICE,
        PHAR_CAT, PHAR_VENDOR, PHAR_EXPIRY_DATE, PHAR_MANUFACTURING_DATE
      ) VALUES (
        :1, :2, :3, :4, :5, :6, :7, 
        TO_DATE(:8, 'YYYY-MM-DD'), TO_DATE(:9, 'YYYY-MM-DD')
      )
    `;
    
    const result = await execute(sql, [
      body.name,
      body.bcode,
      body.desc,
      body.qty,
      body.unit_price || null,
      body.cat,
      body.vendor,
      body.expiry_date || null,
      body.manufacturing_date || null,
    ]);
    
    console.log('Pharmaceutical created successfully:', result.rowsAffected);
    
    return NextResponse.json({ success: true, rowsAffected: result.rowsAffected });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// PUT - Update pharmaceutical
export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    console.log('Updating pharmaceutical:', body.id, body);
    
    const sql = `
      UPDATE HIS_PHARMACEUTICALS SET
        PHAR_NAME = :1,
        PHAR_QTY = :2,
        PHAR_UNIT_PRICE = :3,
        PHAR_VENDOR = :4,
        PHAR_EXPIRY_DATE = TO_DATE(:5, 'YYYY-MM-DD'),
        PHAR_MANUFACTURING_DATE = TO_DATE(:6, 'YYYY-MM-DD')
      WHERE PHAR_ID = :7
    `;
    
    const result = await execute(sql, [
      body.name,
      body.qty,
      body.unit_price || null,
      body.vendor,
      body.expiry_date || null,
      body.manufacturing_date || null,
      body.id,
    ]);
    
    console.log('Pharmaceutical updated successfully:', result.rowsAffected);
    
    return NextResponse.json({ success: true, rowsAffected: result.rowsAffected });
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
      return NextResponse.json({ error: 'Pharmaceutical ID is required' }, { status: 400 });
    }
    
    console.log('Deleting pharmaceutical:', id);
    
    const result = await execute('DELETE FROM HIS_PHARMACEUTICALS WHERE PHAR_ID = :1', [id]);
    
    console.log('Pharmaceutical deleted successfully:', result.rowsAffected);
    
    return NextResponse.json({ success: true, rowsAffected: result.rowsAffected });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
