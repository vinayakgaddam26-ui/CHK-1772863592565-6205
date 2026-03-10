'use client';

import React, { useEffect, useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Canvas } from '@react-three/fiber';
import { Box, MeshDistortMaterial } from '@react-three/drei';

function EmissionBar({ total, traffic, infra }: { total: number, traffic: number, infra: number }) {
  // Height based on total emissions
  const height = Math.max(0.5, total / 30);
  // Color based on majority contributor
  const color = traffic > infra ? '#FF2A5F' : '#00E5FF';

  return (
    <Canvas camera={{ position: [0, 2, 5], fov: 50 }} style={{ width: 60, height: 120, pointerEvents: 'none' }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <group position={[0, (height / 2) - 1, 0]}>
        <Box args={[0.5, height, 0.5]}>
          <MeshDistortMaterial color={color} emissive={color} emissiveIntensity={0.8} distort={0.2} speed={2} />
        </Box>
      </group>
    </Canvas>
  );
}

export default function MapOverlay() {
  const [data, setData] = useState<any[]>([]);
  const [selectedZone, setSelectedZone] = useState<any | null>(null);

  useEffect(() => {
    // Connect to Server-Sent Events (SSE) for real-time API integrations
    const evtSource = new EventSource('/api/emissions/stream');
    evtSource.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      if (parsed.success) {
        setData(parsed.data);
      }
    };
    return () => evtSource.close();
  }, []);

  return (
    <div className="w-full h-full min-h-[500px] relative rounded-2xl overflow-hidden glass-panel border border-[#ffffff10]">
      <Map
        initialViewState={{
          longitude: 77.2090,
          latitude: 28.6139,
          zoom: 11,
          pitch: 60,
          bearing: 0
        }}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        interactive
      >
        {data.map((zone, i) => (
          <Marker 
            key={i} 
            longitude={zone.lng} 
            latitude={zone.lat}
            onClick={(e: any) => {
              e.originalEvent.stopPropagation();
              setSelectedZone(zone);
            }}
          >
            {/* Real-time 3D Bar Marker */}
            <div className="relative group cursor-pointer -mt-32 -ml-8 hover:scale-110 transition-transform">
              <EmissionBar 
                total={zone.totalEmissions} 
                traffic={zone.trafficLevel} 
                infra={zone.infrastructure} 
              />
              {/* Glowing base point */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-carbon-primary/50 blur-sm shadow-[0_0_15px_rgba(0,229,255,0.8)]" />
            </div>
          </Marker>
        ))}

        {selectedZone && (
          <Popup
            longitude={selectedZone.lng}
            latitude={selectedZone.lat}
            anchor="bottom"
            onClose={() => setSelectedZone(null)}
            closeButton={false}
            offset={30}
          >
            <div className="p-3 space-y-3 min-w-[200px]">
              <h4 className="font-bold text-carbon-primary text-lg border-b border-[#ffffff20] pb-2">{selectedZone.zone}</h4>
              <div className="space-y-1">
                <div className="text-xs text-gray-300 flex justify-between items-center">
                  <span>🚗 Traffic (TomTom):</span> 
                  <span className="text-carbon-alert font-bold bg-carbon-alert/10 px-2 py-0.5 rounded">{selectedZone.trafficLevel}</span>
                </div>
                <div className="text-xs text-gray-300 flex justify-between items-center">
                  <span>🏢 Infra (OpenAQ):</span> 
                  <span className="text-carbon-primary font-bold bg-carbon-primary/10 px-2 py-0.5 rounded">{selectedZone.infrastructure}</span>
                </div>
                <div className="text-xs text-gray-300 flex justify-between items-center">
                  <span>⚡ Energy:</span> 
                  <span className="text-carbon-warn font-bold bg-carbon-warn/10 px-2 py-0.5 rounded">{selectedZone.energyUsage}</span>
                </div>
              </div>
              <div className="pt-2 mt-2 border-t border-[#ffffff20] text-sm font-bold flex justify-between items-center">
                <span>Total Emissions:</span> 
                <span className={selectedZone.totalEmissions > 150 ? 'text-carbon-alert text-lg' : 'text-carbon-primary text-lg'}>
                  {selectedZone.totalEmissions}
                </span>
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
