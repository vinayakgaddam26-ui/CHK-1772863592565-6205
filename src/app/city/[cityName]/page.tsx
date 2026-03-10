import React from 'react';
import { ArrowLeft, Activity } from 'lucide-react';
import Link from 'next/link';
import { fetchCityCoordinates, fetchTrafficData, fetchAirQualityData } from '@/lib/api';
import CityEmission3DChart from '@/components/CityEmission3DChart';

// Convert raw API values into standardized 0-100 metrics and display strings
function normalizeTraffic(flowData: any) {
  if (!flowData || !flowData.currentSpeed || !flowData.freeFlowSpeed) {
    return { level: 50, currentSpeed: 'N/A', freeFlowSpeed: 'N/A', contribution: 'Moderate' };
  }
  
  // Lower speed compared to free flow = higher congestion/emissions
  const ratio = flowData.currentSpeed / flowData.freeFlowSpeed;
  // If ratio is 1 (perfect), level is 0. If ratio is 0.1 (standstill), level is 90
  const congestionLevel = Math.max(0, Math.min(100, (1 - ratio) * 100));
  
  return {
    level: congestionLevel,
    currentSpeed: flowData.currentSpeed,
    freeFlowSpeed: flowData.freeFlowSpeed,
    contribution: congestionLevel > 70 ? 'Severe' : (congestionLevel > 40 ? 'High' : 'Moderate')
  };
}

function normalizeAQI(aqiData: any) {
  if (!aqiData || !aqiData.measurements || aqiData.measurements.length === 0) {
    return { score: 40, primaryPollutant: 'Unknown', value: 'N/A', status: 'Moderate' };
  }
  
  // Find a dominant pollutant like PM2.5 or just use the first available
  const pm25 = aqiData.measurements.find((m: any) => m.parameter === 'pm25');
  const targetMeasurement = pm25 || aqiData.measurements[0];
  
  // Very rough normalization for visual purposes (PM2.5: 0-12 good, >55 bad)
  let score = 50;
  let status = 'Moderate';
  
  if (targetMeasurement.parameter === 'pm25') {
    const val = targetMeasurement.value;
    if (val < 12) { score = 20; status = 'Good'; }
    else if (val < 35) { score = 40; status = 'Moderate'; }
    else if (val < 55) { score = 70; status = 'Unhealthy'; }
    else { score = 90; status = 'Hazardous'; }
  } else {
    // Generic fallback mapping
    score = Math.min(100, Math.max(10, targetMeasurement.value * 2));
  }
  
  return {
    score,
    primaryPollutant: targetMeasurement.parameter,
    value: `${targetMeasurement.value} ${targetMeasurement.unit}`,
    status
  };
}

export default async function CityDetailsPage({ params }: { params: Promise<{ cityName: string }> }) {
  const resolvedParams = await params;
  const cityName = decodeURIComponent(resolvedParams.cityName);
  
  // 1. Geocode City
  const coords = await fetchCityCoordinates(cityName);
  
  // 2. Fetch parallel data using coords or city name
  let trafficRaw = null;
  let aqiRaw = null;
  
  if (coords) {
    [trafficRaw, aqiRaw] = await Promise.all([
      fetchTrafficData(coords.lat, coords.lon),
      fetchAirQualityData(cityName)
    ]);
  } else {
    // If geocoding failed, attempt AQI anyway based on name string
    aqiRaw = await fetchAirQualityData(cityName);
  }
  
  const traffic = normalizeTraffic(trafficRaw);
  const aqi = normalizeAQI(aqiRaw);
  
  // Calculate a generic visual "Total Emissions" proxy for the display card
  const totalEmissionsScore = Math.round((traffic.level * 1.5) + (aqi.score * 2.5));

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-8">
        <Link href="/" className="p-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent capitalize">
            {cityName} Data Hub
          </h1>
          <p className="text-white/50 text-sm mt-1 flex items-center">
            <Activity className="w-4 h-4 mr-1 text-carbon-primary" /> Live Telemetry Synced
            {coords && <span className="ml-2 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/40">
              {coords.lat.toFixed(4)}, {coords.lon.toFixed(4)}
            </span>}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden group bg-carbon-800/40">
          <div className="absolute top-0 right-0 w-32 h-32 bg-carbon-primary/10 rounded-full blur-[50px] group-hover:bg-carbon-primary/20 transition-all"></div>
          <h3 className="text-white/60 mb-2 font-medium">Total Emissions Score</h3>
          <p className="text-4xl font-bold text-white">{totalEmissionsScore} <span className="text-xl text-white/50 font-normal">pts</span></p>
          <p className="text-xs text-white/40 mt-2">Combined analytical estimate</p>
        </div>
        
        <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden group bg-carbon-800/40">
          <div className="absolute top-0 right-0 w-32 h-32 bg-carbon-alert/10 rounded-full blur-[50px] group-hover:bg-carbon-alert/20 transition-all"></div>
          <h3 className="text-white/60 mb-2 font-medium">Traffic Impact (TomTom API)</h3>
          <p className="text-4xl font-bold text-carbon-alert">{Math.round(traffic.level)}<span className="text-xl text-carbon-alert/50 font-normal">%</span></p>
          <div className="flex items-center justify-between text-xs text-white/50 mt-2">
            <span>Speed: {traffic.currentSpeed} / {traffic.freeFlowSpeed} km/h</span>
            <span className="bg-carbon-alert/20 text-carbon-alert px-2 py-0.5 rounded uppercase font-bold text-[10px]">{traffic.contribution}</span>
          </div>
        </div>
        
        <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden group bg-carbon-800/40">
          <div className="absolute top-0 right-0 w-32 h-32 bg-carbon-primary/10 rounded-full blur-[50px] group-hover:bg-carbon-primary/20 transition-all"></div>
          <h3 className="text-white/60 mb-2 font-medium">Public Infra (OpenAQ API)</h3>
          <p className="text-4xl font-bold text-carbon-primary">{Math.round(aqi.score)} <span className="text-xl text-carbon-primary/50 font-normal">Score</span></p>
          <div className="flex items-center justify-between text-xs text-white/50 mt-2">
            <span>{aqi.primaryPollutant.toUpperCase()}: {aqi.value}</span>
            <span className="bg-carbon-primary/20 text-carbon-primary px-2 py-0.5 rounded uppercase font-bold text-[10px]">{aqi.status}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 h-[500px]">
        {/* Pass the normalized scores to the 3D Visualization */}
        <CityEmission3DChart data={{
          trafficLevel: traffic.level,
          infrastructureScore: aqi.score
        }} />
      </div>
    </div>
  );
}
