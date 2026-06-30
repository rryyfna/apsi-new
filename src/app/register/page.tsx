'use client';

import { useState, useActionState } from 'react';
import { register } from '@/app/actions/auth';
import Link from 'next/link';
import { Building2, UserCircle2, GraduationCap, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const [role, setRole] = useState<'MAHASISWA' | 'DOSEN'>('MAHASISWA');
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Wrap the server action to handle success state properly
  const handleRegister = async (prevState: unknown, formData: FormData) => {
    const result = await register(formData);
    if (result && result.success) {
      setIsSuccess(true);
      return { success: true, message: result.message };
    }
    return result;
  };

  const [state, formAction, isPending] = useActionState(handleRegister, null);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Left side - Branding mimicking Login Portal split */}
      <div className="hidden md:flex md:w-1/2 bg-blue-700 flex-col justify-center items-center p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full fill-current">
            <polygon points="0,0 100,0 100,100" />
          </svg>
        </div>
        
        <div className="z-10 text-center max-w-lg">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border border-gray-100">
            <span className="text-blue-700 font-bold text-3xl tracking-tight">UNS</span>
          </div>
          <h1 className="text-4xl font-extrabold mb-4 tracking-tight">Portal Registrasi SSO</h1>
          <p className="text-lg text-blue-100 mb-8 leading-relaxed">
            Sistem Informasi Akademik Universitas Sebelas Maret
          </p>
          <Link href="/" className="inline-flex items-center text-sm font-medium text-blue-200 hover:text-white transition-colors">
            &larr; Kembali ke Beranda
          </Link>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-4 py-8 bg-gray-50 h-screen overflow-y-auto">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100 my-auto">
          {isSuccess ? (
            <div className="text-center py-6">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Registrasi Berhasil!</h2>
              <p className="text-gray-600 mb-6">{state?.message}</p>
              <Link href="/" className="inline-flex items-center justify-center w-full py-3 px-4 border border-transparent rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-medium transition-colors">
                Kembali ke Login
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800">Daftar Akun Baru</h2>
                <p className="text-gray-500 mt-2 text-sm">Lengkapi formulir di bawah ini</p>
              </div>

              <form action={formAction} className="space-y-5" autoComplete="off">
                {state?.error && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200 flex items-start">
                    <ShieldCheck className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                    <p>{state.error}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <button
                    type="button"
                    onClick={() => setRole('MAHASISWA')}
                    className={`py-3 flex flex-col items-center justify-center rounded-xl border-2 transition-all ${role === 'MAHASISWA' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:border-blue-300'}`}
                  >
                    <GraduationCap className="w-6 h-6 mb-1" />
                    <span className="font-semibold text-sm">Mahasiswa</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('DOSEN')}
                    className={`py-3 flex flex-col items-center justify-center rounded-xl border-2 transition-all ${role === 'DOSEN' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:border-blue-300'}`}
                  >
                    <UserCircle2 className="w-6 h-6 mb-1" />
                    <span className="font-semibold text-sm">Dosen</span>
                  </button>
                </div>

                <input type="hidden" name="role" value={role} />

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    autoComplete="off"
                    className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email SSO UNS
                  </label>
                  <input
                    type="email"
                    name="username"
                    required
                    autoComplete="off"
                    className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder={role === 'MAHASISWA' ? 'Contoh: I0321002@student.uns.ac.id' : 'Contoh: nama@staff.uns.ac.id'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    {role === 'MAHASISWA' ? 'NIM' : 'NIDN'}
                  </label>
                  <input
                    type="text"
                    name="identifier"
                    required
                    autoComplete="off"
                    className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder={`Masukkan ${role === 'MAHASISWA' ? 'NIM' : 'NIDN'} Anda`}
                  />
                </div>



                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    autoComplete="new-password"
                    className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Buat password yang kuat"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className={`w-full py-2.5 px-4 mt-6 text-white font-semibold rounded-md transition-all duration-200 flex items-center justify-center ${
                    isPending ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md'
                  }`}
                >
                  {isPending ? 'Memproses...' : 'Daftar Sekarang'}
                  {!isPending && <ArrowRight className="w-5 h-5 ml-2" />}
                </button>

                <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                  <p className="text-sm text-gray-600 mb-3">Sudah punya akun?</p>
                  <Link href="/" className="block w-full py-2.5 px-4 text-blue-600 font-semibold bg-white border border-blue-600 rounded-md hover:bg-blue-50 transition-colors">
                    Login di sini
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
