import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = performance.now();
  try {
    const result = await query('SELECT 1 AS STATUS, SYSTIMESTAMP AS DB_TIME FROM DUAL');
    const latencyMs = Math.round((performance.now() - startTime) * 100) / 100;

    return NextResponse.json({
      status: 'connected',
      database: 'Oracle Autonomous Database',
      mode: 'Thin Mode (Ephemeral Wallet)',
      latencyMs,
      timestamp: new Date().toISOString(),
      result: result[0] || null,
    });
  } catch (error) {
    const latencyMs = Math.round((performance.now() - startTime) * 100) / 100;
    console.error('[Health Check Error]:', error);

    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Database connection failed',
        latencyMs,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
