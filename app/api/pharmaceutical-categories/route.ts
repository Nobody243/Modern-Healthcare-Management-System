export const dynamic = 'force-dynamic';
import { checkDemoDeletionGuard } from '@/lib/demo-guard';
import { NextResponse } from 'next/server';
import { query, execute } from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET all pharmaceutical categories
export async function GET() {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'admin' && session.role !== 'doctor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }


    const sql = `
      SELECT 
        PHARM_CAT_ID,
        PHARM_CAT_NAME,
        PHARM_CAT_VENDOR,
        PHARM_CAT_DESC
      FROM HIS_PHARMACEUTICALS_CATEGORIES
      ORDER BY PHARM_CAT_ID DESC
    `;
    
    const categories = await query(sql);
    
    const transformed = categories.map((c: Record<string, unknown>) => ({
      PHARM_CAT_ID: c.PHARM_CAT_ID || c.pharm_cat_id,
      PHARM_CAT_NAME: c.PHARM_CAT_NAME || c.pharm_cat_name,
      PHARM_CAT_VENDOR: c.PHARM_CAT_VENDOR || c.pharm_cat_vendor,
      PHARM_CAT_DESC: c.PHARM_CAT_DESC || c.pharm_cat_desc,
    }));
    
    return NextResponse.json(transformed);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// POST - Create new pharmaceutical category
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    const sql = `
      INSERT INTO HIS_PHARMACEUTICALS_CATEGORIES (
        PHARM_CAT_NAME, PHARM_CAT_VENDOR, PHARM_CAT_DESC
      ) VALUES (
        :1, :2, :3
      )
    `;
    
    await execute(sql, [
      body.name,
      body.vendor,
      body.description,
    ]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// PUT - Update pharmaceutical category
export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    const sql = `
      UPDATE HIS_PHARMACEUTICALS_CATEGORIES SET
        PHARM_CAT_NAME = :1,
        PHARM_CAT_VENDOR = :2,
        PHARM_CAT_DESC = :3
      WHERE PHARM_CAT_ID = :4
    `;
    
    await execute(sql, [
      body.name,
      body.vendor,
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
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }
    
    await execute('DELETE FROM HIS_PHARMACEUTICALS_CATEGORIES WHERE PHARM_CAT_ID = :1', [id]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
