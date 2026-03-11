'use client';

import React, { useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

function EmissionDot({ traffic }: { traffic: number }) {
  let bgColor = 'bg-carbon-success';
  let pulseColor = 'shadow-[0_0_15px_rgba(0,230,118,0.6)]';
  
  if (traffic > 60) {
    bgColor = 'bg-carbon-alert';
    pulseColor = 'shadow-[0_0_15px_rgba(255,42,95,0.6)]';
  } else if (traffic > 30) {
    bgColor = 'bg-carbon-warn';
    pulseColor = 'shadow-[0_0_15px_rgba(255,214,0,0.6)]';
  }

  return (
    <div className={`w-14 h-14 rounded-full ${bgColor} ${pulseColor} flex items-center justify-center text-carbon-900 font-bold text-lg border-2 border-white/20 relative cursor-pointer hover:scale-110 transition-transform`}>
      {Math.round(traffic)}%
      <div className={`absolute top-0 left-0 w-full h-full rounded-full border border-white/40 animate-ping opacity-50`}></div>
    </div>
  );
}

interface CityMapProps {
  cityName: string;
  lat: number;
  lng: number;
  trafficLevel: number;
  infrastructureScore: number;
}

export default function CityMap({ cityName, lat, lng, trafficLevel, infrastructureScore }: CityMapProps) {
  const [activePopupInfo, setActivePopupInfo] = useState<any>(null);
  
  // Base percentage calculation matches MapOverlay
  const basePercentage = Math.round(Math.min(100, (trafficLevel * 0.6) + (infrastructureScore * 0.4)));

  // Generate 8 scattered sub-zones for realism
  const [hotspots] = useState(() => {
    const spots = [];
    spots.push({
        id: 'central',
        lat,
        lng,
        name: 'City Center',
        percentage: basePercentage,
        traffic: trafficLevel,
        infra: infrastructureScore
    });

    for (let i = 1; i < 8; i++) {
        const OFFSETS = [
          { lat: 0.02, lng: 0.03, traffic: 10, infra: 5 },
          { lat: -0.03, lng: -0.01, traffic: -10, infra: -5 },
          { lat: 0.01, lng: -0.04, traffic: 5, infra: 10 },
          { lat: -0.02, lng: 0.02, traffic: -5, infra: -2 },
          { lat: 0.03, lng: -0.02, traffic: 15, infra: 8 },
          { lat: -0.01, lng: 0.04, traffic: -8, infra: -10 },
          { lat: 0.04, lng: 0.01, traffic: 12, infra: -4 }
        ];
        
        const offset = OFFSETS[(i - 1) % OFFSETS.length];
        const latOffset = offset.lat;
        const lngOffset = offset.lng;
        const trafficVariance = offset.traffic;
        const infraVariance = offset.infra;

        const subTraffic = Math.max(0, Math.min(100, trafficLevel + trafficVariance));
        const subInfra = Math.max(0, Math.min(100, infrastructureScore + infraVariance));
        const subPercentage = Math.round(Math.min(100, (subTraffic * 0.6) + (subInfra * 0.4)));

        spots.push({
            id: `zone-${i}`,
            lat: lat + latOffset,
            lng: lng + lngOffset,
            name: `Zone ${i + 1}`,
            percentage: subPercentage,
            traffic: subTraffic,
            infra: subInfra
        });
    }
    return spots;
  });

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden glass-panel border border-[#ffffff10]">
      <Map
        initialViewState={{
          longitude: lng,
          latitude: lat,
          zoom: 11,
          pitch: 45,
          bearing: 0
        }}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        interactive
      >
        {hotspots.map((spot) => (
            <Marker 
              key={spot.id}
              longitude={spot.lng} 
              latitude={spot.lat}
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setActivePopupInfo(spot);
              }}
            >
              <div className="-translate-x-1/2 -translate-y-1/2">
                <EmissionDot traffic={spot.percentage} />
              </div>
            </Marker>
        ))}

        {activePopupInfo && (
          <Popup
            longitude={activePopupInfo.lng}
            latitude={activePopupInfo.lat}
            anchor="bottom"
            onClose={() => setActivePopupInfo(null)}
            closeButton={false}
            offset={35}
          >
            <div className="p-3 space-y-3 min-w-[200px]">
              <h4 className="font-bold text-carbon-primary text-lg border-b border-white/20 pb-2 capitalize">{cityName} - {activePopupInfo.name}</h4>
              <div className="space-y-1">
                <div className="text-xs text-white/80 flex justify-between items-center mb-2">
                  <span>Total Emissions:</span> 
                  <span className={`font-bold px-2 py-0.5 rounded ${activePopupInfo.percentage > 60 ? 'bg-carbon-alert/10 text-carbon-alert' : activePopupInfo.percentage > 30 ? 'bg-carbon-warn/10 text-carbon-warn' : 'bg-carbon-success/10 text-carbon-success'}`}>
                    {activePopupInfo.percentage}%
                  </span>
                </div>
                <div className="text-xs text-white/50 flex justify-between items-center opacity-80">
                  <span>🚗 Local Traffic:</span> 
                  <span>{Math.round(activePopupInfo.traffic)}%</span>
                </div>
                <div className="text-xs text-white/50 flex justify-between items-center mt-1 opacity-80">
                  <span>🏢 Local Infra AQI:</span> 
                  <span>{Math.round(activePopupInfo.infra)}</span>
                </div>
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
