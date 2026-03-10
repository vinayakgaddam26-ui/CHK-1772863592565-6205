import React from 'react';
import Header from '@/components/Header';
import MapOverlay from '@/components/MapOverlay';

export default function CityMapPage() {
  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Global City Map</h1>
          <p className="text-white/50 mt-1">Live overview of tracked emission zones worldwide</p>
        </div>
      </div>
      
      <div className="flex-1 w-full relative min-h-[600px]">
        <MapOverlay />
      </div>
    </div>
  );
}
