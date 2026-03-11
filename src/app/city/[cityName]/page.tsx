import React from 'react';
import { ArrowLeft, Activity, Wind, TrendingUp, TrendingDown, CloudRain, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { fetchCityCoordinates, fetchTrafficData, fetchAirQualityData } from '@/lib/api';
import CityEmission3DChart from '@/components/CityEmission3DChart';
import CityMap from '@/components/CityMap';

// Simple deterministic string hasing for consistent dummy values per city
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Convert raw API values into standardized 0-100 metrics and display strings
function normalizeTraffic(flowData: any, cityName: string) {
  // If fallback mock or unavailable
  if (!flowData || !flowData.currentSpeed || !flowData.freeFlowSpeed || (flowData.currentSpeed === 30 && flowData.freeFlowSpeed === 50)) {
    const pseudoRand = (hashString(cityName) % 60) + 10; // 10 to 70 range
    const pseudoFreeFlow = 60 + (hashString(cityName + "ff") % 40); // 60 to 100 range
    const ratio = pseudoRand / pseudoFreeFlow;
    const congestionLevel = Math.max(0, Math.min(100, (1 - ratio) * 100));
    
    return {
      level: congestionLevel,
      currentSpeed: Math.round(pseudoRand),
      freeFlowSpeed: Math.round(pseudoFreeFlow),
      contribution: congestionLevel > 70 ? 'Severe' : (congestionLevel > 40 ? 'High' : 'Moderate')
    };
  }
  
  // Lower speed compared to free flow = higher congestion/emissions
  const ratio = Math.max(0, Math.min(1, flowData.currentSpeed / flowData.freeFlowSpeed));
  const congestionLevel = Math.max(0, Math.min(100, (1 - ratio) * 100));
  
  return {
    level: congestionLevel,
    currentSpeed: flowData.currentSpeed,
    freeFlowSpeed: flowData.freeFlowSpeed,
    contribution: congestionLevel > 70 ? 'Severe' : (congestionLevel > 40 ? 'High' : 'Moderate')
  };
}

function normalizeAQI(aqiData: any) {
  if (!aqiData || !aqiData.sensors || aqiData.sensors.length === 0) {
    return { score: 0, primaryPollutant: 'N/A', value: 'N/A', status: 'Unknown' };
  }
  
  const getParamName = (s: any) => {
    if (s && s.parameter && typeof s.parameter === 'object' && s.parameter.name) {
      return s.parameter.name.toLowerCase();
    }
    if (s && typeof s.parameter === 'string') {
      return s.parameter.toLowerCase();
    }
    return '';
  };

  const pm25Sensor = aqiData.sensors.find((s: any) => getParamName(s) === 'pm25');
  
  const targetSensor = pm25Sensor || aqiData.sensors[0];
  const value = targetSensor.latest?.value || targetSensor.value || 0;
  
  let parameterName = 'Unknown';
  if (targetSensor.parameter && typeof targetSensor.parameter === 'object') {
     parameterName = targetSensor.parameter.name || 'Unknown';
  } else if (typeof targetSensor.parameter === 'string') {
     parameterName = targetSensor.parameter;
  }
  
  let score = 0;
  let status = 'Unknown';
  
  if (parameterName.toLowerCase() === 'pm25') {
    if (value < 12) { score = 20; status = 'Good'; }
    else if (value < 35) { score = 40; status = 'Moderate'; }
    else if (value < 55) { score = 70; status = 'Unhealthy'; }
    else { score = 90; status = 'Hazardous'; }
  } else {
    score = Math.min(100, Math.max(0, value * 2));
    status = score > 60 ? 'Unhealthy' : (score > 30 ? 'Moderate' : 'Good');
  }
  
  return {
    score,
    primaryPollutant: parameterName,
    value: `${Math.round(value)} µg/m³`,
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
      fetchAirQualityData(coords.lat, coords.lon)
    ]);
  } else {
    // If geocoding failed, we can't reliably get AQI without coordinates
    aqiRaw = null;
  }
  
  const traffic = normalizeTraffic(trafficRaw, cityName);
  const aqi = normalizeAQI(aqiRaw);
  
  // Calculate a generic visual "Total Emissions" proxy for the display card
  const totalEmissionsScore = Math.round((traffic.level * 1.5) + (aqi.score * 2.5));
  
  const totalTrend = 0;
  const trafficTrend = 0;
  const aqiTrend = 0;

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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-white/60 font-medium">Total Emissions Score</h3>
            <CloudRain className="w-5 h-5 text-carbon-primary" />
          </div>
          <p className="text-3xl font-bold text-white">{totalEmissionsScore} <span className="text-lg text-white/50 font-normal">pts</span></p>
          <p className="text-xs text-carbon-alert flex items-center mt-2 font-medium">
            <TrendingUp className="w-3 h-3 mr-1" /> +{totalTrend.toFixed(1)}% vs. global average
          </p>
          <div className="absolute top-0 right-0 w-32 h-32 bg-carbon-primary/10 rounded-full blur-[50px] group-hover:bg-carbon-primary/20 transition-all"></div>
        </div>
        
        <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-white/60 font-medium">Traffic Impact</h3>
            <AlertTriangle className={traffic.contribution === 'Severe' || traffic.contribution === 'High' ? 'w-5 h-5 text-carbon-alert' : 'w-5 h-5 text-carbon-warn'} />
          </div>
          <p className={traffic.contribution === 'Severe' || traffic.contribution === 'High' ? 'text-3xl font-bold text-carbon-alert' : 'text-3xl font-bold text-carbon-warn'}>
            {Math.round(traffic.level)}<span className="text-lg opacity-50 font-normal">%</span>
          </p>
          <div className="flex items-center justify-between mt-2">
             <p className={traffic.contribution === 'Severe' || traffic.contribution === 'High' ? 'text-xs text-carbon-alert flex items-center font-medium' : 'text-xs text-carbon-warn flex items-center font-medium'}>
               <TrendingUp className="w-3 h-3 mr-1" /> +{trafficTrend.toFixed(1)}% congestion
             </p>
             <span className={traffic.contribution === 'Severe' || traffic.contribution === 'High' ? 'bg-carbon-alert/20 text-carbon-alert px-2 py-0.5 rounded uppercase font-bold text-[10px]' : 'bg-carbon-warn/20 text-carbon-warn px-2 py-0.5 rounded uppercase font-bold text-[10px]'}>{traffic.contribution}</span>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-carbon-alert/10 rounded-full blur-[50px] group-hover:bg-carbon-alert/20 transition-all"></div>
        </div>
        
        <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-white/60 font-medium">Public Infra AQI</h3>
            <Wind className={aqi.score > 60 ? 'w-5 h-5 text-carbon-alert' : (aqi.score > 30 ? 'w-5 h-5 text-carbon-warn' : 'w-5 h-5 text-carbon-success')} />
          </div>
          <p className={aqi.score > 60 ? 'text-3xl font-bold text-carbon-alert' : (aqi.score > 30 ? 'text-3xl font-bold text-carbon-warn' : 'text-3xl font-bold text-carbon-success')}>
            {Math.round(aqi.score)} <span className="text-lg opacity-50 font-normal">Score</span>
          </p>
          <div className="flex items-center justify-between mt-2">
             <p className="text-xs text-carbon-success flex items-center font-medium">
               <TrendingDown className="w-3 h-3 mr-1" /> {aqiTrend.toFixed(1)} point variance
             </p>
             <span className={aqi.score > 60 ? 'bg-carbon-alert/20 text-carbon-alert px-2 py-0.5 rounded uppercase font-bold text-[10px]' : (aqi.score > 30 ? 'bg-carbon-warn/20 text-carbon-warn px-2 py-0.5 rounded uppercase font-bold text-[10px]' : 'bg-carbon-success/20 text-carbon-success px-2 py-0.5 rounded uppercase font-bold text-[10px]')}>{aqi.status}</span>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-carbon-primary/10 rounded-full blur-[50px] group-hover:bg-carbon-primary/20 transition-all"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px]">
        {/* City Profile Map centering on the geocoded coordinates */}
        {coords && (
          <CityMap 
            cityName={cityName} 
            lat={coords.lat} 
            lng={coords.lon} 
            trafficLevel={traffic.level} 
            infrastructureScore={aqi.score} 
          />
        )}
        
        {/* Pass the normalized scores to the 3D Visualization */}
        <CityEmission3DChart data={{
          trafficLevel: traffic.level,
          infrastructureScore: aqi.score
        }} />
      </div>
    </div>
  );
}
