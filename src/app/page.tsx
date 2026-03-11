'use client';

import React, { useState } from 'react';
import SummaryCards from '@/components/SummaryCards';
import MapOverlay from '@/components/MapOverlay';


export default function Dashboard() {
  const [seeding, setSeeding] = useState(false);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await fetch('/api/seed');
      alert('Mock data seeded successfully! Re-fetch to view.');
    } catch(e) {
      console.error(e);
    }
    setSeeding(false);
  };

  return (
    <main className="max-w-7xl mx-auto space-y-6">
      
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">City Overview</h1>
          <p className="text-white/60">Real-time monitoring of urban carbon footprint and grid status.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 rounded-lg bg-white/5 border border-[#ffffff10] text-sm hover:bg-white/10 transition text-white/80">Export Report</button>
          <button 
            onClick={handleSeed}
            disabled={seeding}
            className="px-4 py-2 rounded-lg bg-carbon-primary/20 border border-carbon-primary/50 text-carbon-primary text-sm font-medium hover:bg-carbon-primary/30 disabled:opacity-50 transition shadow-[0_0_15px_rgba(0,229,255,0.2)]">
            {seeding ? 'Seeding...' : 'Seed Mock Data'}
          </button>
        </div>
      </div>

      <SummaryCards />

      {/* Grid for Maps and Charts placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
        
        {/* Mapbox & ThreeJS Overlay */}
        <div>
          <MapOverlay />
        </div>

          <div className="space-y-6 flex flex-col min-h-full">
            {/* 3D Spline Element */}
            <div className="glass-panel rounded-2xl border border-[#ffffff10] relative flex-1 min-h-[500px]">
              <iframe src='https://my.spline.design/earthdayandnight-CkKRizZhdHjocGEHGg6D45Ud/' frameBorder='0' width='100%' height='100%' className="absolute inset-0 rounded-2xl"></iframe>
            </div>
          </div>

      </div>
    </main>
  );
}
