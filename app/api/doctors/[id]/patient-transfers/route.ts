import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: doctorNumber } = await params;

    // Get all transfers for patients assigned to this doctor
    const transfers = await query(
      `SELECT pt.*
      FROM V_PATIENT_TRANSFER pt
      INNER JOIN HIS_PATIENTS p ON pt.PT_PAT_NUMBER = p.PAT_NUMBER
      WHERE p.PAT_ASSIGNED_DOC = :1
      ORDER BY pt.PT_TRANSFER_DATE DESC`,
      [doctorNumber]
    );

    return NextResponse.json(transfers || []);
  } catch (error: unknown) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patient transfers', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
