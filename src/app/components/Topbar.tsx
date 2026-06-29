'use client';

import { Bell, Menu, Search, User, LogOut } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { getSessionUser, logout } from '@/app/actions/auth';
import Image from 'next/image';

export default function Topbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getSessionUser().then(data => {
      if (data) setUser(data);
    });

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIdentifier = () => {
    if (!user) return '';
    if (user.role === 'MAHASISWA') return user.mahasiswa?.nim || user.username;
    if (user.role === 'DOSEN') return user.dosen?.nidn || user.username;
    return user.username; // fallback for Admin, Kaprodi, Mutu
  };

  const getRoleDisplay = () => {
    if (!user) return '';
    return user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase();
  };

  return (
    <header className="h-16 bg-white border-b border-gray-100 shadow-sm flex items-center justify-between px-6 sticky top-0 z-10 w-full">
      <div className="flex items-center">
        <button className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none">
          <Menu className="w-6 h-6" />
        </button>
        
        {/* Optional Search Bar */}
        <div className="hidden md:flex items-center ml-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari..." 
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all w-64"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="text-gray-400 hover:text-blue-600 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>
        
        <div className="relative" ref={dropdownRef}>
          <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 cursor-pointer hover:bg-blue-200 transition-colors"
          >
            <User className="w-4 h-4 text-blue-700" />
          </div>

          {isDropdownOpen && user && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 transform transition-all">
              <div className="p-4 border-b border-gray-100 flex items-center space-x-3 bg-gray-50/50">
                <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 border border-gray-300 flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-400" />
                  {/* <Image src="/dummy-profile.png" width={48} height={48} alt="Profile" /> */}
                </div>
                <div className="overflow-hidden">
                  <p className="font-semibold text-gray-800 text-sm truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 font-medium truncate">{getIdentifier()}</p>
                  <p className="text-[11px] text-blue-600 font-bold tracking-wider uppercase mt-1">{getRoleDisplay()}</p>
                </div>
              </div>
              <div className="p-2">
                <form action={logout}>
                  <button type="submit" className="w-full flex items-center px-3 py-2 text-sm text-red-600 font-medium hover:bg-red-50 rounded-md transition-colors">
                    <LogOut className="w-4 h-4 mr-2" />
                    Keluar (Logout)
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
