'use client';

import React, { useState } from 'react';
import CplCrud from './CplCrud';
import MonitoringCpl from './MonitoringCpl';
import { LayoutDashboard, Database } from 'lucide-react';

export default function CplManager() {
  const [activeTab, setActiveTab] = useState<'monitoring' | 'master'>('monitoring');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Manajemen CPL & OBE</h1>
          <p className="text-sm text-gray-500 mt-1">Pantau capaian mahasiswa dan atur parameter kurikulum OBE</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100/50 p-1 rounded-xl w-full sm:w-fit border border-gray-200/60">
        <button
          onClick={() => setActiveTab('monitoring')}
          className={`flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
            activeTab === 'monitoring'
              ? 'bg-white text-blue-600 shadow-sm border border-gray-200/50'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard Monitoring
        </button>
        <button
          onClick={() => setActiveTab('master')}
          className={`flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
            activeTab === 'master'
              ? 'bg-white text-blue-600 shadow-sm border border-gray-200/50'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
          }`}
        >
          <Database className="w-4 h-4" />
          Master Data CPL
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'monitoring' && <MonitoringCpl />}
        {activeTab === 'master' && <CplCrud />}
      </div>
    </div>
  );
}
