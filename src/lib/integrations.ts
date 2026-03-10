import { mockZones } from '@/app/api/emissions/route';

const TOMTOM_API_KEY = process.env.TOMTOM_API_KEY || '';
const OPENAQ_API_KEY = process.env.OPENAQ_API_KEY || ''; // Optional

export async function fetchLiveEmissions() {
  const promises = mockZones.map(async (zone) => {
    let trafficLevel = 0;
    let infrastructure = 0;
    let energyUsage = Math.floor(Math.random() * 50) + 20; // Simulated energy 

    try {
      // TomTom Traffic Flow API
      if (TOMTOM_API_KEY) {
        const ttRes = await fetch(`https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key=${TOMTOM_API_KEY}&point=${zone.lat},${zone.lng}`);
        if (ttRes.ok) {
          const ttData = await ttRes.json();
          const speed = ttData.flowSegmentData.currentSpeed;
          const freeFlow = ttData.flowSegmentData.freeFlowSpeed;
          // More congestion = higher emissions
          const congestionRatio = Math.max(0, (freeFlow - speed) / freeFlow);
          trafficLevel = 20 + (congestionRatio * 80);
        } else {
          throw new Error('TomTom limit/error');
        }
      } else {
        throw new Error('No TomTom key');
      }
    } catch (e) {
      // Fallback
      trafficLevel = Math.floor(Math.random() * 60) + 20;
    }

    try {
      // OpenAQ API
      const options = OPENAQ_API_KEY ? { headers: { 'X-API-Key': OPENAQ_API_KEY } } : {};
      const aqRes = await fetch(`https://api.openaq.org/v2/latest?coordinates=${zone.lat},${zone.lng}&radius=5000&limit=1`, options);
      if (aqRes.ok) {
        const aqData = await aqRes.json();
        if (aqData.results && aqData.results.length > 0) {
          const pm25 = aqData.results[0].measurements.find((m: any) => m.parameter === 'pm25')?.value || 0;
          infrastructure = Math.min(pm25 * 2, 100); // Normalize PM2.5 to 0-100 scale
        } else {
          throw new Error('No OpenAQ data');
        }
      } else {
        throw new Error('OpenAQ limit/error');
      }
    } catch (e) {
      // Fallback
      infrastructure = Math.floor(Math.random() * 40) + 10;
    }

    return {
      zone: zone.name,
      lat: zone.lat,
      lng: zone.lng,
      trafficLevel: Math.round(trafficLevel),
      energyUsage: Math.round(energyUsage),
      infrastructure: Math.round(infrastructure),
      totalEmissions: Math.round(trafficLevel + energyUsage + infrastructure),
      timestamp: new Date().toISOString()
    };
  });

  return await Promise.all(promises);
}
