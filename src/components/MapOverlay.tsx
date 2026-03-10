'use client';

import React, { useEffect, useState } from 'react';
import Map from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { DeckGL } from '@deck.gl/react';
import { ScatterplotLayer } from '@deck.gl/layers';

export default function MapOverlay() {
  const [data, setData] = useState<any[]>([]);

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

  const layer = new ScatterplotLayer({
    id: 'emissions-scatterplot',
    data,
    pickable: true,
    opacity: 0.9,
    stroked: true,
    filled: true,
    radiusScale: 1000,
    radiusMinPixels: 10,
    radiusMaxPixels: 50,
    lineWidthMinPixels: 2,
    getPosition: (d: any) => [d.lng, d.lat],
    getFillColor: (d: any) => {
        if (d.emissionPercentage > 60) return [255, 0, 0]; // Red
        if (d.emissionPercentage > 30) return [255, 215, 0]; // Yellow
        return [0, 200, 0]; // Green
    },
    getLineColor: [255, 255, 255, 100],
    getRadius: (d: any) => Math.max(10, d.emissionPercentage),
    transitions: {
        getRadius: { duration: 500 },
        getFillColor: { duration: 500 }
    }
  });

  return (
    <div className="w-full h-full min-h-[500px] relative rounded-2xl overflow-hidden glass-panel border border-[#ffffff10]">
      <DeckGL
        initialViewState={{
          longitude: 20,
          latitude: 30,
          zoom: 2,
          pitch: 30,
          bearing: 0
        }}
        controller={true}
        layers={[layer]}
        getTooltip={({object}: any) => object && {
            html: `
              <div style="padding: 4px;">
                <h3 style="font-weight: bold; font-size: 16px; margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 4px; color: #7B3FE4;">${object.zone}</h3>
                <div style="font-size: 13px; color: #fff; margin-bottom: 4px;">Total Emissions: <strong>${object.emissionPercentage}%</strong></div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; color: rgba(255,255,255,0.7); margin-bottom: 2px;">
                  <span>Traffic Index:</span> <span>${Math.round(object.trafficLevel)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; color: rgba(255,255,255,0.7);">
                  <span>AQI (PM2.5):</span> <span>${Math.round(object.infrastructure)}</span>
                </div>
              </div>
            `,
            style: {
                backgroundColor: 'rgba(10, 10, 10, 0.95)',
                color: '#fff',
                borderRadius: '8px',
                border: '1px solid rgba(123, 63, 228, 0.4)',
                boxShadow: '0 8px 32px rgba(123, 63, 228, 0.15)',
                fontFamily: 'system-ui, sans-serif'
            }
        }}
      >
        <Map
          mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
          reuseMaps
        />
      </DeckGL>
    </div>
  );
}
