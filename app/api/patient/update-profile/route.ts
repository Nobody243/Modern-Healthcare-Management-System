import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { execute } from '@/lib/db';

export async function POST(request: NextRequest) {
  console.log('=== Profile Update API Called ===');
  
  try {
    const session = await getSession();
    console.log('Session:', session);
    
    if (!session || session.role !== 'patient') {
      console.log('Unauthorized: No session or not patient role');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Request body:', body);
    
    const { firstName, lastName, email, phone, address, patientNumber } = body;

    // Verify the patient number matches the session
    if (patientNumber !== session.patientNumber) {
      console.log('Patient number mismatch:', { requested: patientNumber, session: session.patientNumber });
      return NextResponse.json({ error: 'Unauthorized - Patient number mismatch' }, { status: 401 });
    }

    // Validate required fields
    if (!firstName || !lastName) {
      console.log('Validation failed: Missing required fields');
      return NextResponse.json({ error: 'First name and last name are required' }, { status: 400 });
    }

    console.log('Executing database update...');
    
    // Update patient profile
    const result = await execute(
      `UPDATE HIS_PATIENTS 
       SET PAT_FNAME = :1,
           PAT_LNAME = :2,
           PAT_EMAIL = :3,
           PAT_PHONE = :4, 
           PAT_ADDR = :5
       WHERE PAT_NUMBER = :6`,
      [firstName, lastName, email || null, phone || null, address || null, patientNumber]
    );

    console.log('Update successful! Result:', result);

    return NextResponse.json({ 
      success: true, 
      message: 'Profile updated successfully',
      rowsAffected: result.rowsAffected 
    });
  } catch (error) {
    console.error('=== Profile update error ===');
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
