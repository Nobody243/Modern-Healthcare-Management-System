import { NextResponse } from 'next/server';
import { execute, queryOne } from '@/lib/db';
import { getSession } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PUT - Update doctor profile (for doctors updating their own profile)
export async function PUT(
  request: Request,
  { params }: RouteParams
) {
  try {
    const session = await getSession();
    
    if (!session || session.role !== 'doctor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    
    // Verify the doctor is updating their own profile
    const doctor = await queryOne(
      'SELECT DOC_ID, DOC_EMAIL FROM HIS_DOCS WHERE DOC_ID = :1',
      [id]
    );

    if (!doctor || doctor.DOC_EMAIL !== session.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const sql = `
      UPDATE HIS_DOCS SET
        DOC_FNAME = :1,
        DOC_LNAME = :2,
        DOC_EMAIL = :3,
        DOC_PHONE = :4,
        DOC_SPECIALIZATION = :5,
        UPDATED_AT = SYSTIMESTAMP
      WHERE DOC_ID = :6
    `;
    
    const updateParams = [
      body.fname,
      body.lname,
      body.email,
      body.phone || null,
      body.specialization || null,
      id,
    ];
    
    const result = await execute(sql, updateParams);
    
    return NextResponse.json({ 
      success: true, 
      rowsAffected: result.rowsAffected 
    });
  } catch (error) {
    console.error('Error updating doctor profile:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
