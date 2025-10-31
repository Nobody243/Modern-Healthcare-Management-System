export const dynamic = 'force-dynamic';
import { checkDemoDeletionGuard } from '@/lib/demo-guard';
import { NextResponse } from 'next/server';
import { query, execute } from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET all vitals records
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let sql = `
      SELECT 
        VIT_ID,
        VIT_PAT_NUMBER,
        VIT_PAT_NAME,
        VIT_BODYTEMP,
        VIT_HEARTPULSE,
        VIT_RESPIRATION,
        VIT_WEIGHT,
        VIT_BLOOD_PRESSURE,
        VIT_OXYGEN_SAT,
        VIT_RECORDED_BY,
        VIT_RECORDED_DATE
      FROM V_VITALS
    `;

    let vitals;
    if (session.role === 'patient') {
      sql += ` WHERE VIT_PAT_NUMBER = :1 ORDER BY VIT_ID DESC`;
      vitals = await query(sql, [session.patientNumber || '']);
    } else {
      sql += ` ORDER BY VIT_ID DESC`;
      vitals = await query(sql);
    }
    
    // Handle both uppercase and lowercase from Oracle
    const transformed = vitals.map((v: Record<string, unknown>) => ({
      VIT_ID: v.VIT_ID || v.vit_id,
      VIT_PAT_NUMBER: v.VIT_PAT_NUMBER || v.vit_pat_number,
      VIT_PAT_NAME: v.VIT_PAT_NAME || v.vit_pat_name,
      VIT_BODYTEMP: v.VIT_BODYTEMP || v.vit_bodytemp,
      VIT_HEARTPULSE: v.VIT_HEARTPULSE || v.vit_heartpulse,
      VIT_RESPIRATION: v.VIT_RESPIRATION || v.vit_respiration,
      VIT_WEIGHT: v.VIT_WEIGHT || v.vit_weight,
      VIT_BLOOD_PRESSURE: v.VIT_BLOOD_PRESSURE || v.vit_blood_pressure,
      VIT_OXYGEN_SAT: v.VIT_OXYGEN_SAT || v.vit_oxygen_sat,
      VIT_RECORDED_BY: v.VIT_RECORDED_BY || v.vit_recorded_by,
      VIT_RECORDED_DATE: v.VIT_RECORDED_DATE || v.vit_recorded_date,
    }));
    
    return NextResponse.json(transformed);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// POST - Create new vitals record
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'admin' && session.role !== 'doctor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    const sql = `
      INSERT INTO HIS_VITALS (
        VIT_PAT_NUMBER, VIT_BODYTEMP, VIT_HEARTPULSE,
        VIT_RESPIRATION, VIT_WEIGHT, VIT_BLOOD_PRESSURE, VIT_OXYGEN_SAT, VIT_RECORDED_BY
      ) VALUES (
        :1, :2, :3, :4, :5, :6, :7, :8
      )
    `;
    
    await execute(sql, [
      body.patientNumber,
      body.bodyTemp || null,
      body.heartPulse || null,
      body.respiration || null,
      body.weight || null,
      body.bloodPressure || null,
      body.oxygenSat || null,
      body.recordedBy || null,
    ]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// PUT - Update vitals record
export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'admin' && session.role !== 'doctor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }


    const body = await request.json();
    
    const sql = `
      UPDATE HIS_VITALS SET
        VIT_BODYTEMP = :1,
        VIT_HEARTPULSE = :2,
        VIT_RESPIRATION = :3,
        VIT_WEIGHT = :4,
        VIT_BLOOD_PRESSURE = :5,
        VIT_OXYGEN_SAT = :6
      WHERE VIT_ID = :7
    `;
    
    await execute(sql, [
      body.bodyTemp,
      body.heartPulse,
      body.respiration,
      body.weight,
      body.bloodPressure,
      body.oxygenSat,
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
    if (!session || (session.role !== 'admin' && session.role !== 'doctor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Vitals ID is required' }, { status: 400 });
    }
    
    await execute('DELETE FROM HIS_VITALS WHERE VIT_ID = :1', [id]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
