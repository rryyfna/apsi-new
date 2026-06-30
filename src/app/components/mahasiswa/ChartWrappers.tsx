'use client';

import dynamic from 'next/dynamic';

export const GradeDistributionChartDynamic = dynamic(
  () => import('./GradeDistributionChart'),
  { ssr: false, loading: () => <div className="h-64 w-full flex items-center justify-center text-gray-400">Loading chart...</div> }
);

export const CplPieChartDynamic = dynamic(
  () => import('./CplPieChart'),
  { ssr: false, loading: () => <div className="h-64 w-full flex items-center justify-center text-gray-400">Loading chart...</div> }
);
