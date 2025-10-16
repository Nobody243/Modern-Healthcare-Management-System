import { getSession } from './auth';
import { NextResponse } from 'next/server';

/**
 * Checks if the current authenticated user is using a public Demo Account.
 * Returns a 403 Forbidden Response if a demo account attempts a DELETE operation,
 * while allowing Main/Primary accounts full deletion authorization.
 */
export async function checkDemoDeletionGuard(): Promise<NextResponse | null> {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Session required' }, { status: 401 });
  }

  // If the user is logged into a Demo Account, prevent destructive deletion of sample data
  const isDemoUser = session.isDemo === true || session.email?.toLowerCase().includes('demo');
  
  if (isDemoUser) {
    return NextResponse.json(
      { 
        error: '🔒 Demo Account: Deletion is restricted for public demo accounts to preserve sample clinical records for all evaluators.',
        isDemoRestriction: true,
      },
      { status: 403 }
    );
  }

  // Main accounts proceed without restriction
  return null;
}
