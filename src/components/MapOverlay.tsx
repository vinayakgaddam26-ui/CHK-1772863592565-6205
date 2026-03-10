'use client';

import React, { useEffect, useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Canvas } from '@react-three/fiber';
import { Box, MeshDistortMaterial } from '@react-three/drei';

function EmissionBar({ total, traffic, infra }: { total: number, traffic: number, infra: number }) {
  // Normalize sizes (min 0.5, max roughly 3-4 based on 0-100 scale)
  const trafficHeight = Math.max(0.5, (traffic / 100) * 4);
  const infraHeight = Math.max(0.5, (infra / 100) * 4);
  
  // Colors based on severity
  const trafficColor = traffic > 70 ? '#FF2A5F' : (traffic > 40 ? '#FFD600' : '#FF8A65');
  const infraColor = infra > 70 ? '#00E5FF' : (infra > 40 ? '#4dd0e1' : '#00E676');

  return (
    <Canvas camera={{ position: [0, 3, 6], fov: 45 }} style={{ width: 80, height: 120, pointerEvents: 'none' }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} />
      
      {/* Traffic Bar */}
      <group position={[-0.4, (trafficHeight / 2) - 1, 0]}>
        <Box args={[0.4, trafficHeight, 0.4]}>
          <MeshDistortMaterial color={trafficColor} emissive={trafficColor} emissiveIntensity={0.8} distort={traffic > 50 ? 0.3 : 0.1} speed={traffic > 50 ? 4 : 2} />
        </Box>
      </group>

      {/* Infrastructure Bar */}
      <group position={[0.4, (infraHeight / 2) - 1, 0]}>
        <Box args={[0.4, infraHeight, 0.4]}>
          <MeshDistortMaterial color={infraColor} emissive={infraColor} emissiveIntensity={0.8} distort={0.2} speed={2} />
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
              <h4 className="font-bold text-carbon-primary text-lg border-b border-white/20 pb-2">{selectedZone.zone}</h4>
              <div className="space-y-1">
                <div className="text-xs text-white/80 flex justify-between items-center">
                  <span>🚗 Traffic (TomTom):</span> 
                  <span className="text-carbon-alert font-bold bg-carbon-alert/10 px-2 py-0.5 rounded">{selectedZone.trafficLevel}</span>
                </div>
                <div className="text-xs text-white/80 flex justify-between items-center">
                  <span>🏢 Infra (OpenAQ):</span> 
                  <span className="text-carbon-primary font-bold bg-carbon-primary/10 px-2 py-0.5 rounded">{selectedZone.infrastructure}</span>
                </div>
                <div className="text-xs text-white/80 flex justify-between items-center">
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
