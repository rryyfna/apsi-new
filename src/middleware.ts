import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'supersecret_siakad_key');

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('siakad_session')?.value;
  const path = request.nextUrl.pathname;

  // Halaman publik (Login)
  if (path === '/') {
    if (token) {
      try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        // Redirect jika sudah login
        if (payload.role === 'MAHASISWA') return NextResponse.redirect(new URL('/mahasiswa', request.url));
        if (payload.role === 'DOSEN') return NextResponse.redirect(new URL('/dosen', request.url));
        if (payload.role === 'ADMIN') return NextResponse.redirect(new URL('/admin', request.url));
        if (payload.role === 'KAPRODI') return NextResponse.redirect(new URL('/kaprodi', request.url));
        if (payload.role === 'MUTU') return NextResponse.redirect(new URL('/mutu', request.url));
        if (payload.role === 'PENJAMINAN_MUTU') return NextResponse.redirect(new URL('/penjaminan-mutu', request.url));
      } catch {
        // Token tidak valid, biarkan di halaman login
      }
    }
    return NextResponse.next();
  }

  // Lindungi rute /mahasiswa, /dosen, /admin, /kaprodi, /mutu, /penjaminan-mutu
  if (path.startsWith('/mahasiswa') || path.startsWith('/dosen') || path.startsWith('/admin') || path.startsWith('/kaprodi') || path.startsWith('/mutu') || path.startsWith('/penjaminan-mutu')) {
    
    // --- BYPASS AUTH FOR TESTING ---
    const requestHeaders = new Headers(request.headers);
    if (path.startsWith('/mahasiswa')) {
      requestHeaders.set('x-user-id', 'cmr0k4qv00000ijlssy6ppb77');
      requestHeaders.set('x-user-role', 'MAHASISWA');
    } else if (path.startsWith('/dosen')) {
      requestHeaders.set('x-user-id', 'cmqc7fstg000iijiopabo4lrh');
      requestHeaders.set('x-user-role', 'DOSEN');
    } else if (path.startsWith('/admin')) {
      requestHeaders.set('x-user-id', 'cmqc7fsoc0004ijio5az651ql');
      requestHeaders.set('x-user-role', 'ADMIN');
    } else if (path.startsWith('/kaprodi')) {
      requestHeaders.set('x-user-id', 'cmqc7fsoj0005ijio2u5wqzc3');
      requestHeaders.set('x-user-role', 'KAPRODI');
    } else if (path.startsWith('/mutu')) {
      requestHeaders.set('x-user-id', 'cmqc7fsoy0008ijio3adettx6');
      requestHeaders.set('x-user-role', 'MUTU');
    } else if (path.startsWith('/penjaminan-mutu')) {
      requestHeaders.set('x-user-id', 'cmr0mi7610000ijvvu37qq3c4');
      requestHeaders.set('x-user-role', 'PENJAMINAN_MUTU');
    }
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      }
    });

    /* --- OLD LOGIC COMMENTED OUT FOR TESTING
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      
      // Validasi Role
      if (path.startsWith('/mahasiswa') && payload.role !== 'MAHASISWA') {
        return NextResponse.redirect(new URL('/', request.url));
      }
      if (path.startsWith('/dosen') && payload.role !== 'DOSEN' && payload.role !== 'KAPRODI') {
        return NextResponse.redirect(new URL('/', request.url));
      }
      if (path.startsWith('/admin') && payload.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url));
      }
      if (path.startsWith('/kaprodi') && payload.role !== 'KAPRODI') {
        return NextResponse.redirect(new URL('/', request.url));
      }
      if (path.startsWith('/mutu') && payload.role !== 'MUTU') {
        return NextResponse.redirect(new URL('/', request.url));
      }
      if (path.startsWith('/penjaminan-mutu') && payload.role !== 'PENJAMINAN_MUTU') {
        return NextResponse.redirect(new URL('/', request.url));
      }

      // Instant Revocation Check
      const validateResponse = await fetch(new URL('/api/auth/validate', request.url), {
        headers: { 'x-user-id': payload.id as string }
      });

      if (!validateResponse.ok) {
        // Hapus cookie sesi agar pengguna benar-benar logout
        const response = NextResponse.redirect(new URL('/', request.url));
        response.cookies.delete('siakad_session');
        return response;
      }

      // Clone request headers to append user info
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', payload.id as string);
      requestHeaders.set('x-user-role', payload.role as string);
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        }
      });
    } catch {
      return NextResponse.redirect(new URL('/', request.url));
    }
    */
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/mahasiswa/:path*', '/dosen/:path*', '/admin/:path*', '/kaprodi/:path*', '/mutu/:path*', '/penjaminan-mutu/:path*'],
};
