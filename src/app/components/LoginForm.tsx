'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login } from '@/app/actions/auth';

interface LoginFormProps {
  targetRole: string;
  roleTitle: string;
}

export default function LoginForm({ targetRole, roleTitle }: LoginFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    formData.append('targetRole', targetRole);
    
    try {
      const result = await login(formData);

      if (result.error) {
        setError(result.error);
        setIsLoading(false);
      } else if (result.success && result.redirectUrl) {
        router.push(result.redirectUrl);
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem. Silakan periksa koneksi atau hubungi admin.");
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Login {roleTitle}</h2>
        <p className="text-gray-500 mt-2 text-sm">Masukkan Username dan Password Anda</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="username">
            Email SSO UNS
          </label>
          <input
            id="username"
            name="username"
            type="email"
            className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder={targetRole === 'MAHASISWA' ? 'contoh@student.uns.ac.id' : 'contoh@staff.uns.ac.id'}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="••••••••"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <span className="ml-2 text-sm text-gray-600">Ingat Saya</span>
          </label>
          <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">Lupa Password?</Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2.5 px-4 text-white font-semibold rounded-md transition-all duration-200 ${
            isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md'
          }`}
        >
          {isLoading ? 'Memproses...' : 'Masuk'}
        </button>
      </form>
      
      <div className="mt-6 pt-4 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-600 mb-3">Belum memiliki akun atau ingin klaim akun?</p>
        <Link 
          href="/register" 
          className="block w-full py-2.5 px-4 text-blue-600 font-semibold bg-white border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
        >
          Daftar / Klaim Akun
        </Link>
      </div>
    </div>
  );
}
