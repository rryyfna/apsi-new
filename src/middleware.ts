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
    
    // -- BYPASS AUTHENTICATION FOR TESTING --
    const requestHeaders = new Headers(request.headers);
    
    let mockRoleId = 'cmqc7fsoc0004ijio5az651ql'; // Default to admin ID
    let mockRole = 'ADMIN';

    if (path.startsWith('/mahasiswa')) {
      mockRoleId = 'cmr0k4qv00000ijlssy6ppb77';
      mockRole = 'MAHASISWA';
    } else if (path.startsWith('/dosen')) {
      mockRoleId = 'cmqc7fssw000cijioc4zqrthk'; // JUM001
      mockRole = 'DOSEN';
    } else if (path.startsWith('/kaprodi')) {
      mockRoleId = 'cmqc7fsoy0008ijio3adettx6'; // using mutu id as kaprodi fallback if needed
      mockRole = 'KAPRODI';
    } else if (path.startsWith('/mutu')) {
      mockRoleId = 'cmqc7fsoy0008ijio3adettx6';
      mockRole = 'MUTU';
    } else if (path.startsWith('/penjaminan-mutu')) {
      mockRoleId = 'cmqc7fsoy0008ijio3adettx6';
      mockRole = 'PENJAMINAN_MUTU';
    }

    requestHeaders.set('x-user-id', mockRoleId);
    requestHeaders.set('x-user-role', mockRole);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      }
    });
    // -- END BYPASS --

    /*
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      
      // Validasi Role
      if (path.startsWith('/mahasiswa') && payload.role !== 'MAHASISWA') return NextResponse.redirect(new URL('/', request.url));
      if (path.startsWith('/dosen') && payload.role !== 'DOSEN') return NextResponse.redirect(new URL('/', request.url));
      if (path.startsWith('/admin') && payload.role !== 'ADMIN') return NextResponse.redirect(new URL('/', request.url));
      if (path.startsWith('/kaprodi') && payload.role !== 'KAPRODI') return NextResponse.redirect(new URL('/', request.url));
      if (path.startsWith('/mutu') && payload.role !== 'MUTU') return NextResponse.redirect(new URL('/', request.url));
      if (path.startsWith('/penjaminan-mutu') && payload.role !== 'PENJAMINAN_MUTU') return NextResponse.redirect(new URL('/', request.url));

      // Lanjutkan request, dan pass user id ke header agar bisa dibaca di layout/page
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', payload.id as string);
      requestHeaders.set('x-user-role', payload.role as string);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        }
      });
    } catch (error) {
      // Token expired atau tidak valid
      const response = NextResponse.redirect(new URL('/', request.url));
      response.cookies.delete('siakad_session');
      return response;
    }
    */
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/mahasiswa/:path*', '/dosen/:path*', '/admin/:path*', '/kaprodi/:path*', '/mutu/:path*', '/penjaminan-mutu/:path*'],
};
