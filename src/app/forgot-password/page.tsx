'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { resetPassword } from '@/app/actions/auth';
import { CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await resetPassword(formData);
      
      if (result.error) {
        setError(result.error);
        setIsLoading(false);
      } else if (result.success) {
        setSuccess(true);
        setIsLoading(false);
        // Optional: Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/');
        }, 3000);
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem. Silakan coba lagi nanti.");
      setIsLoading(false);
    }
  }

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
          <h1 className="text-4xl font-extrabold mb-4 tracking-tight">Lupa Password</h1>
          <p className="text-lg text-blue-100 mb-8 leading-relaxed">
            Sistem Informasi Akademik Universitas Sebelas Maret
          </p>
          <Link href="/" className="inline-flex items-center text-sm font-medium text-blue-200 hover:text-white transition-colors">
            &larr; Kembali ke Beranda
          </Link>
        </div>
      </div>

      {/* Right side - Forgot Password Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800">Lupa Password</h2>
            <p className="text-gray-500 mt-2 text-sm">Validasi identitas Anda untuk mereset password</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200 flex items-start">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {success ? (
            <div className="text-center space-y-4 py-4">
              <div className="flex justify-center">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Password Diperbarui!</h3>
              <p className="text-gray-600 text-sm">
                Password Anda telah berhasil diubah. Anda akan dialihkan ke halaman utama dalam beberapa detik...
              </p>
              <Link href="/" className="block w-full py-2.5 px-4 mt-6 text-white font-semibold bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                Kembali ke Login Sekarang
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="username">
                  Email SSO UNS Terdaftar
                </label>
                <input
                  id="username"
                  name="username"
                  type="email"
                  autoComplete="off"
                  className="w-full px-4 py-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="email@student.uns.ac.id"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="identifier">
                  NIM / NIDN
                </label>
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  autoComplete="off"
                  className="w-full px-4 py-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors uppercase"
                  placeholder="Masukkan NIM atau NIDN Anda"
                  required
                />
              </div>
              
              <div className="pt-2 border-t border-gray-100"></div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="newPassword">
                  Password Baru
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  className="w-full px-4 py-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="confirmPassword">
                  Konfirmasi Password Baru
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  className="w-full px-4 py-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 text-white font-semibold rounded-lg transition-all duration-200 mt-2 ${
                  isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
                }`}
              >
                {isLoading ? 'Memproses...' : 'Reset Password'}
              </button>
            </form>
          )}
          
        </div>
      </div>
    </div>
  );
}
