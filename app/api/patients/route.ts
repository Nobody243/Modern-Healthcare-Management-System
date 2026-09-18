export const dynamic = 'force-dynamic';
import { checkDemoDeletionGuard } from '@/lib/demo-guard';
import { NextResponse } from 'next/server';
import { query, execute } from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET all patients
export async function GET() {
  try {
    const sql = `
      SELECT 
        PAT_ID,
        PAT_FNAME, 
        PAT_LNAME, 
        TO_CHAR(PAT_DOB, 'YYYY-MM-DD') as PAT_DOB,
        PAT_AGE,
        PAT_NUMBER, 
        PAT_ADDR,
        PAT_PHONE,
        PAT_EMAIL,
        PAT_TYPE, 
        PAT_ASSIGNED_DOC,
        PAT_DATE_JOINED,
        PAT_AILMENT,
        PAT_DISCHARGE_STATUS,
        PAT_GENDER,
        PAT_BLOOD_GROUP,
        PAT_EMERGENCY_CONTACT
      FROM HIS_PATIENTS
      ORDER BY PAT_ID DESC
    `;
    
    const patients = await query(sql);
    
    // Transform to uppercase keys - handle both uppercase and lowercase from Oracle
    const transformedPatients = patients.map((p: any) => ({
      PAT_ID: p.PAT_ID || p.pat_id,
      PAT_FNAME: p.PAT_FNAME || p.pat_fname,
      PAT_LNAME: p.PAT_LNAME || p.pat_lname,
      PAT_DOB: p.PAT_DOB || p.pat_dob,
      PAT_AGE: p.PAT_AGE || p.pat_age,
      PAT_NUMBER: p.PAT_NUMBER || p.pat_number,
      PAT_ADDR: p.PAT_ADDR || p.pat_addr,
      PAT_PHONE: p.PAT_PHONE || p.pat_phone,
      PAT_EMAIL: p.PAT_EMAIL || p.pat_email,
      PAT_TYPE: p.PAT_TYPE || p.pat_type,
      PAT_ASSIGNED_DOC: p.PAT_ASSIGNED_DOC || p.pat_assigned_doc,
      PAT_DATE_JOINED: p.PAT_DATE_JOINED || p.pat_date_joined,
      PAT_AILMENT: p.PAT_AILMENT || p.pat_ailment,
      PAT_DISCHARGE_STATUS: p.PAT_DISCHARGE_STATUS || p.pat_discharge_status,
      PAT_GENDER: p.PAT_GENDER || p.pat_gender,
      PAT_BLOOD_GROUP: p.PAT_BLOOD_GROUP || p.pat_blood_group,
      PAT_EMERGENCY_CONTACT: p.PAT_EMERGENCY_CONTACT || p.pat_emergency_contact,
    }));
    
    return NextResponse.json(transformedPatients);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// POST - Create new patient
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'admin' && session.role !== 'doctor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    console.log('Creating patient:', body);
    
    // Validate required fields
    if (!body.email) {
      return NextResponse.json({ error: 'Email is required for patient login' }, { status: 400 });
    }
    
    // Auto-generate patient number if not provided
    let patientNumber = body.number;
    if (!patientNumber) {
      const numberSql = `SELECT 'PAT' || LPAD(NVL(MAX(TO_NUMBER(SUBSTR(PAT_NUMBER, 4))), 0) + 1, 5, '0') AS next_number FROM HIS_PATIENTS WHERE PAT_NUMBER LIKE 'PAT%'`;
      const numberResult = await query(numberSql);
      patientNumber = numberResult[0]?.NEXT_NUMBER || numberResult[0]?.next_number || 'PAT00001';
    }

    // Support both snake_case (assigned_doc) and camelCase (assignedDoc)
    const assignedDoc = body.assignedDoc || body.assigned_doc;
    
    const sql = `
      INSERT INTO HIS_PATIENTS (
        PAT_FNAME, PAT_LNAME, PAT_DOB, PAT_AGE, PAT_NUMBER,
        PAT_ADDR, PAT_PHONE, PAT_EMAIL, PAT_TYPE, PAT_ASSIGNED_DOC,
        PAT_AILMENT, PAT_GENDER, PAT_BLOOD_GROUP, PAT_EMERGENCY_CONTACT, 
        PAT_DISCHARGE_STATUS
      ) VALUES (
        :1, :2, TO_DATE(:3, 'YYYY-MM-DD'), :4, :5,
        :6, :7, :8, :9, :10, :11, :12, :13, :14, :15
      )
    `;

    const result = await execute(sql, [
      body.fname,
      body.lname,
      body.dob || '2000-01-01',
      body.age || 0,
      patientNumber,
      body.addr || '',
      body.phone,
      body.email,
      body.type,
      assignedDoc,
      body.ailment,
      body.gender || null,
      body.blood_group || null,
      body.emergency_contact || null,
      body.dischargeStatus || 'Admitted',
    ]);
    
    console.log('Patient created successfully:', result.rowsAffected);
    
    return NextResponse.json({ success: true, rowsAffected: result.rowsAffected });
  } catch (error) {
    console.error('Error creating patient:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// PUT - Update patient
export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'admin' && session.role !== 'doctor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    console.log('Updating patient:', body.id, body);

    // Support both snake_case and camelCase
    const assignedDoc = body.assignedDoc || body.assigned_doc;
    const dischargeStatus = body.dischargeStatus || body.discharge_status;
    
    console.log('Updating patient - Received DOB:', body.dob, 'Age:', body.age);
    
    const sql = `
      UPDATE HIS_PATIENTS SET
        PAT_FNAME = :1,
        PAT_LNAME = :2,
        PAT_DOB = TO_DATE(:3, 'YYYY-MM-DD'),
        PAT_AGE = :4,
        PAT_ADDR = :5,
        PAT_PHONE = :6,
        PAT_EMAIL = :7,
        PAT_TYPE = :8,
        PAT_ASSIGNED_DOC = :9,
        PAT_AILMENT = :10,
        PAT_DISCHARGE_STATUS = :11,
        PAT_GENDER = :12,
        PAT_BLOOD_GROUP = :13,
        PAT_EMERGENCY_CONTACT = :14
      WHERE PAT_ID = :15
    `;
    
    const result = await execute(sql, [
      body.fname,
      body.lname,
      body.dob,
      body.age,
      body.addr || '',
      body.phone,
      body.email || null,
      body.type,
      assignedDoc,
      body.ailment,
      dischargeStatus,
      body.gender || null,
      body.blood_group || null,
      body.emergency_contact || null,
      body.id,
    ]);
    
    console.log('Patient updated successfully:', result.rowsAffected);
    
    return NextResponse.json({ success: true, rowsAffected: result.rowsAffected });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// DELETE - Delete patient
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
      return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 });
    }
    
    console.log('Deleting patient:', id);
    
    const result = await execute('DELETE FROM HIS_PATIENTS WHERE PAT_ID = :1', [id]);
    
    console.log('Patient deleted successfully:', result.rowsAffected);
    
    return NextResponse.json({ success: true, rowsAffected: result.rowsAffected });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
