export const dynamic = 'force-dynamic';
import { checkDemoDeletionGuard } from '@/lib/demo-guard';
import { NextResponse } from 'next/server';
import { query, execute } from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET all accounts
export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sql = `
      SELECT 
        ACC_ID,
        ACC_NAME,
        ACC_DESC,
        ACC_TYPE,
        ACC_NUMBER,
        ACC_AMOUNT,
        ACC_CURRENCY
      FROM HIS_ACCOUNTS
      ORDER BY ACC_ID DESC
    `;
    
    const accounts = await query(sql);
    
    const transformed = accounts.map((a: Record<string, unknown>) => ({
      ACC_ID: a.ACC_ID || a.acc_id,
      ACC_NAME: a.ACC_NAME || a.acc_name,
      ACC_DESC: a.ACC_DESC || a.acc_desc,
      ACC_TYPE: a.ACC_TYPE || a.acc_type,
      ACC_NUMBER: a.ACC_NUMBER || a.acc_number,
      ACC_AMOUNT: a.ACC_AMOUNT || a.acc_amount,
      ACC_CURRENCY: a.ACC_CURRENCY || a.acc_currency,
    }));
    
    return NextResponse.json(transformed);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// POST - Create new account
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    const sql = `
      INSERT INTO HIS_ACCOUNTS (
        ACC_NAME, ACC_DESC, ACC_TYPE, ACC_NUMBER, ACC_AMOUNT
      ) VALUES (
        :1, :2, :3, :4, :5
      )
    `;
    
    await execute(sql, [
      body.name,
      body.description,
      body.type,
      body.number,
      body.amount,
    ]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// PUT - Update account
export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    const sql = `
      UPDATE HIS_ACCOUNTS SET
        ACC_NAME = :1,
        ACC_DESC = :2,
        ACC_TYPE = :3,
        ACC_AMOUNT = :4
      WHERE ACC_ID = :5
    `;
    
    await execute(sql, [
      body.name,
      body.description,
      body.type,
      body.amount,
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
      return NextResponse.json({ error: 'Account ID is required' }, { status: 400 });
    }
    
    await execute('DELETE FROM HIS_ACCOUNTS WHERE ACC_ID = :1', [id]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
