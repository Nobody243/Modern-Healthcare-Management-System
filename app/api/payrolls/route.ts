import { checkDemoDeletionGuard } from '@/lib/demo-guard';
import { NextResponse } from 'next/server';
import { query, execute } from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET all payroll records
export async function GET() {
  try {
    const sql = `
      SELECT 
        PAY_ID,
        PAY_NUMBER,
        PAY_DOC_NUMBER,
        PAY_DOC_NAME,
        PAY_DOC_EMAIL,
        PAY_AMOUNT,
        PAY_PERIOD,
        PAY_STATUS,
        PAY_DATE,
        PAY_METHOD
      FROM V_PAYROLLS
      ORDER BY PAY_ID DESC
    `;
    
    const payrolls = await query(sql);
    
    // Handle both uppercase and lowercase from Oracle
    const transformed = payrolls.map((p: Record<string, unknown>) => ({
      PAY_ID: p.PAY_ID || p.pay_id,
      PAY_NUMBER: p.PAY_NUMBER || p.pay_number,
      PAY_DOC_NUMBER: p.PAY_DOC_NUMBER || p.pay_doc_number,
      PAY_DOC_NAME: p.PAY_DOC_NAME || p.pay_doc_name,
      PAY_DOC_EMAIL: p.PAY_DOC_EMAIL || p.pay_doc_email,
      PAY_AMOUNT: p.PAY_AMOUNT || p.pay_amount,
      PAY_PERIOD: p.PAY_PERIOD || p.pay_period,
      PAY_STATUS: p.PAY_STATUS || p.pay_status,
      PAY_DATE: p.PAY_DATE || p.pay_date,
      PAY_METHOD: p.PAY_METHOD || p.pay_method,
    }));
    
    return NextResponse.json(transformed);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// POST - Create new payroll record
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Generate unique payroll number
    const numberSql = `SELECT 'PAY' || LPAD(NVL(MAX(TO_NUMBER(SUBSTR(PAY_NUMBER, 4))), 0) + 1, 4, '0') AS next_number FROM HIS_PAYROLLS WHERE PAY_NUMBER LIKE 'PAY%'`;
    const numberResult = await query(numberSql);
    const payrollNumber = numberResult[0]?.NEXT_NUMBER || numberResult[0]?.next_number || 'PAY0001';
    
    const sql = `
      INSERT INTO HIS_PAYROLLS (
        PAY_NUMBER, PAY_DOC_NUMBER,
        PAY_AMOUNT, PAY_PERIOD, PAY_STATUS, PAY_DATE, PAY_METHOD
      ) VALUES (
        :1, :2, :3, :4, :5, TO_DATE(:6, 'YYYY-MM-DD'), :7
      )
    `;
    
    await execute(sql, [
      payrollNumber,
      body.doc_number,
      body.amount,
      body.period || null,
      body.status || 'Pending',
      body.date || null,
      body.method || 'Bank Transfer',
    ]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// PUT - Update payroll record
export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    const sql = `
      UPDATE HIS_PAYROLLS SET
        PAY_AMOUNT = :1,
        PAY_PERIOD = :2,
        PAY_STATUS = :3,
        PAY_DATE = TO_DATE(:4, 'YYYY-MM-DD'),
        PAY_METHOD = :5,
        UPDATED_AT = SYSTIMESTAMP
      WHERE PAY_ID = :6
    `;
    
    await execute(sql, [
      body.amount,
      body.period || null,
      body.status,
      body.date || null,
      body.method || 'Bank Transfer',
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
      return NextResponse.json({ error: 'Payroll ID is required' }, { status: 400 });
    }
    
    await execute('DELETE FROM HIS_PAYROLLS WHERE PAY_ID = :1', [id]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
