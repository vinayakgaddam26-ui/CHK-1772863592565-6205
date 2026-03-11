import { NextResponse } from 'next/server';

export const mockZones = [
  { name: 'Downtown District', lat: 28.6139, lng: 77.2090 },
  { name: 'Industrial Park', lat: 28.6300, lng: 77.2500 },
  { name: 'Residential West', lat: 28.6500, lng: 77.1500 },
  { name: 'Commercial Hub', lat: 28.5800, lng: 77.2200 },
  { name: 'Tech Park', lat: 28.5500, lng: 77.2500 },
  { name: 'Suburban North', lat: 28.7000, lng: 77.2000 },
  { name: 'Green Zone', lat: 28.6000, lng: 77.1800 },
];

let cachedData: any[] = [];

function generateMockData() {
  return mockZones.map((zone) => {
    const multiplier = (zone.name.includes('Industrial') || zone.name.includes('Downtown')) ? 1.5 : 1;
    const trafficLevel = 30 * multiplier;
    const energyUsage = 40 * multiplier;
    const infrastructure = 20 * multiplier;
    return {
      zone: zone.name,
      lat: zone.lat,
      lng: zone.lng,
      trafficLevel,
      energyUsage,
      infrastructure,
      totalEmissions: trafficLevel + energyUsage + infrastructure,
      timestamp: new Date(),
    };
  });
}

export async function GET() {
  if (cachedData.length === 0) {
    cachedData = generateMockData();
  }
  
  cachedData = cachedData.map(d => {
     return {
       ...d,
       timestamp: new Date()
     };
  });

  return NextResponse.json({ success: true, data: cachedData }, { status: 200 });
}
