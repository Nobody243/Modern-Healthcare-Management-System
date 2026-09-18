export const dynamic = 'force-dynamic';
import { checkDemoDeletionGuard } from '@/lib/demo-guard';
import { NextRequest, NextResponse } from 'next/server';
import { execute } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { fromWard, toWard, reason, status } = body;
    const { id: transferId } = await params;

    await execute(
      `UPDATE HIS_PATIENT_TRANSFER 
       SET PT_FROM_WARD = :1,
           PT_TO_WARD = :2,
           PT_REASON = :3,
           PT_STATUS = :4
       WHERE PT_ID = :5`,
      [fromWard, toWard, reason, status, transferId]
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Transfer updated successfully' 
    });
  } catch (error: unknown) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to update transfer', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const demoBlock = await checkDemoDeletionGuard();
    if (demoBlock) return demoBlock;

    const { id: transferId } = await params;

    await execute(
      `DELETE FROM HIS_PATIENT_TRANSFER WHERE PT_ID = :1`,
      [transferId]
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Transfer deleted successfully' 
    });
  } catch (error: unknown) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to delete transfer', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
