export const dynamic = 'force-dynamic';
import { checkDemoDeletionGuard } from '@/lib/demo-guard';
import { NextResponse } from 'next/server';
import { query, execute } from '@/lib/db';
import { getSession, hashPassword } from '@/lib/auth';

// GET all doctors
export async function GET() {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'admin' && session.role !== 'doctor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }


    const sql = `
      SELECT 
        DOC_ID,
        DOC_FNAME, 
        DOC_LNAME, 
        DOC_EMAIL,
        DOC_DEPT,
        DOC_NUMBER,
        DOC_DPIC,
        DOC_SPECIALIZATION,
        DOC_PHONE,
        DOC_STATUS
      FROM HIS_DOCS
      ORDER BY DOC_ID DESC
    `;
    
    const doctors = await query(sql);
    
    // Handle both uppercase and lowercase from Oracle
    const transformed = doctors.map((d: Record<string, unknown>) => ({
      DOC_ID: d.DOC_ID || d.doc_id,
      DOC_FNAME: d.DOC_FNAME || d.doc_fname,
      DOC_LNAME: d.DOC_LNAME || d.doc_lname,
      DOC_EMAIL: d.DOC_EMAIL || d.doc_email,
      DOC_DEPT: d.DOC_DEPT || d.doc_dept,
      DOC_NUMBER: d.DOC_NUMBER || d.doc_number,
      DOC_DPIC: d.DOC_DPIC || d.doc_dpic,
      DOC_SPECIALIZATION: d.DOC_SPECIALIZATION || d.doc_specialization,
      DOC_PHONE: d.DOC_PHONE || d.doc_phone,
      DOC_STATUS: d.DOC_STATUS || d.doc_status,
    }));
    
    return NextResponse.json(transformed);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// POST - Create new doctor
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Password is required for creating a new doctor
    if (!body.pwd || body.pwd.trim() === '') {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }
    
    // Generate unique doctor number
    const numberSql = `SELECT 'DOC' || LPAD(NVL(MAX(TO_NUMBER(SUBSTR(DOC_NUMBER, 4))), 0) + 1, 4, '0') AS next_number FROM HIS_DOCS WHERE DOC_NUMBER LIKE 'DOC%'`;
    const numberResult = await query(numberSql);
    const doctorNumber = numberResult[0]?.NEXT_NUMBER || numberResult[0]?.next_number || 'DOC0001';
    
    const hashedPassword = await hashPassword(body.pwd);

    const sql = `
      INSERT INTO HIS_DOCS (
        DOC_FNAME, DOC_LNAME, DOC_EMAIL, DOC_PWD, DOC_DEPT, DOC_NUMBER,
        DOC_SPECIALIZATION, DOC_PHONE, DOC_STATUS
      ) VALUES (
        :1, :2, :3, :4, :5, :6, :7, :8, :9
      )
    `;
    
    const params = [
      body.fname,
      body.lname,
      body.email,
      hashedPassword,
      body.dept,
      doctorNumber,
      body.specialization || null,
      body.phone || null,
      body.status || 'Active',
    ];
    
    const result = await execute(sql, params);
    return NextResponse.json({ success: true, rowsAffected: result.rowsAffected });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// PUT - Update doctor
export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // If password is provided, update it; otherwise, keep current
    let sql: string;
    let params: unknown[];
    
    if (body.pwd && body.pwd.trim() !== '') {
      const hashedPassword = await hashPassword(body.pwd);
      sql = `
        UPDATE HIS_DOCS SET
          DOC_FNAME = :1,
          DOC_LNAME = :2,
          DOC_EMAIL = :3,
          DOC_DEPT = :4,
          DOC_PWD = :5,
          DOC_SPECIALIZATION = :6,
          DOC_PHONE = :7,
          DOC_STATUS = :8
        WHERE DOC_ID = :9
      `;
      
      params = [
        body.fname,
        body.lname,
        body.email,
        body.dept,
        hashedPassword,
        body.specialization || null,
        body.phone || null,
        body.status || 'Active',
        body.id,
      ];
    } else {
      sql = `
        UPDATE HIS_DOCS SET
          DOC_FNAME = :1,
          DOC_LNAME = :2,
          DOC_EMAIL = :3,
          DOC_DEPT = :4,
          DOC_SPECIALIZATION = :5,
          DOC_PHONE = :6,
          DOC_STATUS = :7
        WHERE DOC_ID = :8
      `;
      
      params = [
        body.fname,
        body.lname,
        body.email,
        body.dept,
        body.specialization || null,
        body.phone || null,
        body.status || 'Active',
        body.id,
      ];
    }
    
    const result = await execute(sql, params);
    return NextResponse.json({ success: true, rowsAffected: result.rowsAffected });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// DELETE - Delete doctor
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
      return NextResponse.json({ error: 'Doctor ID is required' }, { status: 400 });
    }
    
    const result = await execute('DELETE FROM HIS_DOCS WHERE DOC_ID = :1', [id]);
    return NextResponse.json({ success: true, rowsAffected: result.rowsAffected });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
