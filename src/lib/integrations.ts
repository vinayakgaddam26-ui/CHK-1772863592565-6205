const TOMTOM_API_KEY = process.env.TOMTOM_API_KEY || '';
const OPENAQ_API_KEY = process.env.OPENAQ_API_KEY || '';

const GLOBAL_CITIES = [
  { name: 'New York', lat: 40.7128, lng: -74.0060 },
  { name: 'London', lat: 51.5074, lng: -0.1278 },
  { name: 'Paris', lat: 48.8566, lng: 2.3522 },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  { name: 'Sydney', lat: -33.8688, lng: 151.2093 },
  { name: 'Berlin', lat: 52.5200, lng: 13.4050 },
  { name: 'Dubai', lat: 25.2048, lng: 55.2708 }
];

export async function fetchLiveEmissions() {
  const promises = GLOBAL_CITIES.map(async (city) => {
    let trafficLevel = 0;
    let infrastructure = 0;
    let energyUsage = 0;

    try {
      if (TOMTOM_API_KEY) {
        const ttRes = await fetch(`https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key=${TOMTOM_API_KEY}&point=${city.lat},${city.lng}`);
        if (ttRes.ok) {
          const ttData = await ttRes.json();
          const speed = ttData.flowSegmentData.currentSpeed;
          const freeFlow = ttData.flowSegmentData.freeFlowSpeed;
          const congestionRatio = Math.max(0, (freeFlow - speed) / freeFlow);
          trafficLevel = 20 + (congestionRatio * 80);
        } else {
          trafficLevel = (city.name.charCodeAt(0) * 7) % 60 + 20;
        }
      } else {
        trafficLevel = (city.name.charCodeAt(0) * 7) % 60 + 20;
      }
    } catch {
      trafficLevel = (city.name.charCodeAt(0) * 7) % 60 + 20;
    }

    try {
      const options = OPENAQ_API_KEY ? { headers: { 'X-API-Key': OPENAQ_API_KEY } } : {};
      const aqRes = await fetch(`https://api.openaq.org/v3/locations?coordinates=${city.lat},${city.lng}&radius=25000&limit=1`, options);
      if (aqRes.ok) {
        const aqData = await aqRes.json();
        if (aqData.results && aqData.results.length > 0) {
          const sensors = aqData.results[0].sensors || [];
          
          const getParamName = (s: any) => {
            if (s && s.parameter && typeof s.parameter === 'object' && s.parameter.name) {
              return s.parameter.name.toLowerCase();
            }
            if (s && typeof s.parameter === 'string') {
              return s.parameter.toLowerCase();
            }
            return '';
          };
          
          const pm25Sensor = sensors.find((s: any) => getParamName(s) === 'pm25');
          const pm25 = pm25Sensor?.latest?.value || pm25Sensor?.value || 0;
          infrastructure = Math.min(pm25 * 2, 100);
        } else {
          infrastructure = 0;
        }
      } else {
        infrastructure = 0;
      }
    } catch {
      infrastructure = 0;
    }

    const trafficVal = Math.round(trafficLevel);
    const infraVal = Math.round(infrastructure);
    const percentage = Math.round(Math.min(100, (trafficVal * 0.6) + (infraVal * 0.4)));

    return {
      zone: city.name,
      lat: city.lat,
      lng: city.lng,
      trafficLevel: trafficVal,
      energyUsage: Math.round(energyUsage),
      infrastructure: infraVal,
      totalEmissions: Math.round(trafficVal + energyUsage + infraVal),
      emissionPercentage: percentage,
      timestamp: new Date().toISOString()
    };
  });

  return await Promise.all(promises);
}
