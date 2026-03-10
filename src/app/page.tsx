'use client';

import React, { useState } from 'react';
import SummaryCards from '@/components/SummaryCards';
import MapOverlay from '@/components/MapOverlay';
import Charts from '@/components/Charts';

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
          <p className="text-gray-400">Real-time monitoring of urban carbon footprint and grid status.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 rounded-lg bg-white/5 border border-[#ffffff10] text-sm hover:bg-white/10 transition text-gray-300">Export Report</button>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Mapbox & ThreeJS Overlay */}
        <div className="lg:col-span-2">
          <MapOverlay />
        </div>

        <div className="space-y-6 flex flex-col">
          {/* Recommendations Area */}
          <div className="glass-panel rounded-2xl p-6 border border-[#ffffff10]">
            <h3 className="text-lg font-bold text-white mb-4">Mitigation Protocol</h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-carbon-alert mt-2"></div>
                <div>
                  <h4 className="text-sm font-medium text-white">Reroute Heavy Traffic</h4>
                  <p className="text-xs text-gray-400">Downtown district showing 24% spike in emissions.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-carbon-warn mt-2"></div>
                <div>
                  <h4 className="text-sm font-medium text-white">Grid Balancing</h4>
                  <p className="text-xs text-gray-400">Shift industrial load to off-peak hours.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Charts Area */}
          <div className="glass-panel rounded-2xl p-6 border border-[#ffffff10] flex-1 flex flex-col items-start justify-center">
             <h3 className="text-lg font-bold text-white mb-2">Trend Analyzer</h3>
             <Charts />
          </div>
        </div>

      </div>
    </main>
  );
}
