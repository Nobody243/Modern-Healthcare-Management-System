import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Static files, icons, next internals, and asset extensions do not require auth checks
  if (
    pathname.includes('.') || 
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') ||
    pathname.startsWith('/icon') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }
  
  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/'];
  const isPublicRoute = publicRoutes.some(route => pathname === route);
  
  // Get the session token from cookies
  const token = request.cookies.get('session')?.value;
  
  // If no token and trying to access protected route, redirect to login
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // If has token, verify it
  if (token) {
    const session = await verifyToken(token);
    
    // Invalid or expired token, clear it and redirect to login
    if (!session && pathname !== '/login') {
      const response = NextResponse.redirect(new URL('/login?reason=expired', request.url));
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
    
    // If session is valid, enforce role-based access control
    if (session) {
      if (pathname.startsWith('/admin') && session.role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
      
      if (pathname.startsWith('/doctor') && session.role !== 'doctor') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
      
      if (pathname.startsWith('/patient') && session.role !== 'patient') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
      
      // If logged in and trying to access login page, redirect to dashboard
      if (pathname === '/login') {
        const dashboardUrl = session.role === 'admin' 
          ? '/admin/dashboard' 
          : session.role === 'doctor'
          ? '/doctor/dashboard'
          : '/patient/dashboard';
        return NextResponse.redirect(new URL(dashboardUrl, request.url));
      }
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|_next/data|.*\\..*).*)',
  ],
};
