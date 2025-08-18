import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  
  // Delete the session cookie in the store
  cookieStore.delete('session');
  
  const acceptHeader = request.headers.get('accept') || '';
  const isJsonRequest = acceptHeader.includes('application/json') || request.headers.get('x-requested-with') === 'XMLHttpRequest';

  const loginUrl = new URL('/login', request.url || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');

  const response = isJsonRequest
    ? NextResponse.json({ success: true, message: 'Logged out successfully' })
    : NextResponse.redirect(loginUrl);
  
  // Invalidate cookie in response headers
  response.cookies.set('session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  });
  
  return response;
}

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  cookieStore.delete('session');

  const loginUrl = new URL('/login', request.url || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
  const response = NextResponse.redirect(loginUrl);

  response.cookies.set('session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  });

  return response;
}
