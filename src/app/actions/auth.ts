'use server';

import { db } from '@/lib/db';
import { SignJWT } from 'jose';
import { cookies, headers } from 'next/headers';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'supersecret_siakad_key');

export async function getSessionUser() {
  const headersList = await headers();
  const userId = headersList.get('x-user-id');
  if (!userId) return null;
  return await db.user.findUnique({ 
    where: { id: userId },
    include: {
      mahasiswa: true,
      dosen: true,
      kaprodi: true,
      mutu: true
    }
  });
}

export async function login(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const targetRole = formData.get('targetRole') as string;

  if (!username || !password) {
    return { error: 'Username dan Password wajib diisi!' };
  }

  // Cari user berdasarkan username (NIM/NIDN/NIP)
  const user = await db.user.findUnique({
    where: { username },
  });

  if (!user) {
    return { error: 'Username atau Password salah!' };
  }

  // Fallback check for plaintext passwords from old seeder data
  const isPlaintext = !user.password.startsWith('$2a$') && !user.password.startsWith('$2b$');
  const isValidPassword = isPlaintext 
    ? user.password === password 
    : await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return { error: 'Username atau Password salah!' };
  }

  // Optional: Update plaintext password to bcrypt hash on successful login
  if (isPlaintext) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });
  }

  if (targetRole && user.role !== targetRole) {
    // Allow KAPRODI to log in as DOSEN
    if (!(targetRole === 'DOSEN' && user.role === 'KAPRODI')) {
      return { error: `Akses ditolak! Kredensial valid tetapi Anda bukan ${targetRole}. Silakan login di portal yang sesuai.` };
    }
  }

  // Buat JWT Token
  const token = await new SignJWT({ id: user.id, username: user.username, role: user.role, name: user.name })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(JWT_SECRET);

  // Simpan ke Cookies
  (await cookies()).set('siakad_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8 hours
    path: '/',
  });

  // Tentukan rute redirect berdasarkan Role
  let redirectUrl = '/';
  if (user.role === 'MAHASISWA') {
    redirectUrl = '/mahasiswa';
  } else if (user.role === 'DOSEN') {
    redirectUrl = '/dosen';
  } else if (user.role === 'ADMIN') {
    redirectUrl = '/admin';
  } else if (user.role === 'KAPRODI') {
    redirectUrl = '/kaprodi';
  } else if (user.role === 'MUTU') {
    redirectUrl = '/mutu';
  }

  return { success: true, redirectUrl };
}

export async function register(formData: FormData) {
  const username = formData.get('username') as string;
  const identifier = formData.get('identifier') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;
  const role = formData.get('role') as 'DOSEN' | 'MAHASISWA';

  if (!username || !identifier || !password || !name || !role) {
    return { error: 'Semua field wajib diisi!' };
  }

  if (role !== 'DOSEN' && role !== 'MAHASISWA') {
    return { error: 'Role pendaftaran tidak valid. Hanya untuk Dosen atau Mahasiswa.' };
  }

  if (role === 'MAHASISWA' && !username.endsWith('@student.uns.ac.id')) {
    return { error: 'Email SSO Mahasiswa wajib menggunakan akhiran @student.uns.ac.id' };
  }
  
  if (role === 'DOSEN' && !username.endsWith('@staff.uns.ac.id')) {
    return { error: 'Email SSO Dosen wajib menggunakan akhiran @staff.uns.ac.id' };
  }

  try {
    const existingUser = await db.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return { error: 'Email SSO sudah terdaftar!' };
    }

    let existingUserWithIdentifier = null;
    if (role === 'MAHASISWA') {
       const mhs = await db.mahasiswa.findUnique({ where: { nim: identifier }});
       if (mhs) existingUserWithIdentifier = await db.user.findUnique({ where: { id: mhs.userId }});
    } else {
       const dsn = await db.dosen.findUnique({ where: { nidn: identifier }});
       if (dsn) existingUserWithIdentifier = await db.user.findUnique({ where: { id: dsn.userId }});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Extract angkatan for mahasiswa if nim length is typical (e.g. I0321002)
    let angkatanStr = null;
    if (role === 'MAHASISWA' && identifier.length >= 5) {
      const match = identifier.match(/^[A-Za-z0-9]{3}(\d{2})\d+$/);
      if (match && match[1]) {
        angkatanStr = "20" + match[1];
      }
    }

    if (existingUserWithIdentifier) {
      // PROSES KLAIM AKUN (Update user dari seeder)
      if (existingUserWithIdentifier.username.endsWith('.uns.ac.id')) {
         return { error: 'Akun dengan NIM/NIDN ini sudah diklaim sebelumnya!' };
      }
      
      await db.user.update({
        where: { id: existingUserWithIdentifier.id },
        data: {
          username,
          password: hashedPassword,
          name, 
          isApproved: true // Auto approve
        }
      });
      return { success: true, message: 'Klaim akun berhasil! Anda sekarang dapat masuk menggunakan akun SSO Anda.' };
    }

    // JIKA AKUN BELUM ADA DI DATABASE SAMA SEKALI
    const newUser = await db.user.create({
      data: {
        username,
        password: hashedPassword,
        name,
        role,
        isApproved: true // Auto approve
      }
    });

    if (role === 'MAHASISWA') {
      await db.mahasiswa.create({
        data: {
          userId: newUser.id,
          nim: identifier,
          name,
          fakultas: "Teknik",
          programStudi: "Teknik Industri",
          angkatan: angkatanStr
        }
      });
    } else if (role === 'DOSEN') {
      await db.dosen.create({
        data: {
          userId: newUser.id,
          nidn: identifier,
          name
        }
      });
    }

    return { success: true, message: 'Registrasi berhasil! Anda sekarang dapat masuk menggunakan akun SSO Anda.' };
  } catch (error: any) {
    console.error("Register Error: ", error);
    return { error: 'Terjadi kesalahan pada server saat registrasi.' };
  }
}

export async function logout() {
  (await cookies()).delete('siakad_session');
  redirect('/');
}

export async function resetPassword(formData: FormData) {
  const username = formData.get('username') as string;
  const identifier = formData.get('identifier') as string;
  const newPassword = formData.get('newPassword') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!username || !identifier || !newPassword || !confirmPassword) {
    return { error: 'Semua field wajib diisi!' };
  }

  if (newPassword !== confirmPassword) {
    return { error: 'Konfirmasi password tidak cocok!' };
  }

  try {
    // Cari user berdasarkan username
    const user = await db.user.findUnique({
      where: { username },
      include: {
        mahasiswa: true,
        dosen: true
      }
    });

    if (!user) {
      return { error: 'Akun dengan email SSO tersebut tidak ditemukan.' };
    }

    // Validasi identitas (NIM/NIDN)
    let isValidIdentity = false;
    if (user.role === 'MAHASISWA' && user.mahasiswa?.nim === identifier) {
      isValidIdentity = true;
    } else if (user.role === 'DOSEN' && user.dosen?.nidn === identifier) {
      isValidIdentity = true;
    } else if (user.username === identifier) {
      // Fallback for Admin, Kaprodi, Mutu where username is their identifier
      isValidIdentity = true;
    }

    if (!isValidIdentity) {
      return { error: 'NIM/NIDN tidak cocok dengan email SSO yang terdaftar.' };
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    return { success: true, message: 'Password berhasil di-reset. Silakan login dengan password baru.' };
  } catch (error: any) {
    console.error("Reset Password Error: ", error);
    return { error: 'Terjadi kesalahan pada server saat mereset password.' };
  }
}
