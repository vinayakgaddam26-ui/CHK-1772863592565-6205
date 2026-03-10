const TOMTOM_API_KEY = process.env.TOMTOM_API_KEY;

const FALLBACK_CITIES: Record<string, { lat: number, lon: number }> = {
  'london': { lat: 51.5074, lon: -0.1278 },
  'new york': { lat: 40.7128, lon: -74.0060 },
  'paris': { lat: 48.8566, lon: 2.3522 },
  'mumbai': { lat: 19.0760, lon: 72.8777 },
  'delhi': { lat: 28.6139, lon: 77.2090 },
  'pune': { lat: 18.5204, lon: 73.8567 },
  'tokyo': { lat: 35.6762, lon: 139.6503 }
};

export async function fetchCityCoordinates(cityName: string) {
  if (!TOMTOM_API_KEY) {
    console.error('TOMTOM_API_KEY is not defined');
    return FALLBACK_CITIES[cityName.toLowerCase()] || FALLBACK_CITIES['london'];
  }
  
  try {
    const res = await fetch(`https://api.tomtom.com/search/2/geocode/${encodeURIComponent(cityName)}.json?key=${TOMTOM_API_KEY}&limit=1`);
    if (!res.ok) {
      console.warn(`TomTom Geocoding failed with status: ${res.status}. Falling back to Nominatim.`);
      
      // Fallback 1: OpenStreetMap Nominatim
      try {
        const nomRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1`, {
          headers: {
            'User-Agent': 'CarbonEye Dashboard'
          }
        });
        if (nomRes.ok) {
          const nomData = await nomRes.json();
          if (nomData && nomData.length > 0) {
            return {
              lat: parseFloat(nomData[0].lat),
              lon: parseFloat(nomData[0].lon)
            };
          }
        }
      } catch (nomErr) {
        console.warn('Nominatim fallback also failed.', nomErr);
      }
      
      // Fallback 2: Hardcoded Common Cities (London Default)
      return FALLBACK_CITIES[cityName.toLowerCase()] || FALLBACK_CITIES['london'];
    }
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].position; // { lat, lon }
    }
  } catch (error) {
    console.error('Error fetching city coordinates processing fallback:', error);
  }
  
  // Fallback if API fails or is restricted
  return FALLBACK_CITIES[cityName.toLowerCase()] || FALLBACK_CITIES['london'];
}

export async function fetchTrafficData(lat: number, lon: number) {
  const fallbackTraffic = { currentSpeed: 30, freeFlowSpeed: 50 };

  if (!TOMTOM_API_KEY) return fallbackTraffic;
  
  try {
    // Using TomTom Traffic Flow
    const res = await fetch(`https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key=${TOMTOM_API_KEY}&point=${lat},${lon}`);
    if (!res.ok) {
       console.warn(`TomTom Traffic fetch failed with status: ${res.status}`);
       return fallbackTraffic;
    }
    const data = await res.json();
    return data.flowSegmentData; // Includes currentSpeed, freeFlowSpeed, etc.
  } catch (error) {
    console.error('Error fetching traffic data:', error);
  }
  return fallbackTraffic;
}

export async function fetchAirQualityData(cityName: string) {
  try {
    // OpenAQ API v2
    const res = await fetch(`https://api.openaq.org/v2/latest?city=${encodeURIComponent(cityName)}&limit=1`, {
      headers: {
        'Accept': 'application/json'
      }
    });
    if (!res.ok) {
       // Graceful fallback if OpenAQ city search fails
       return null;
    }
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      return data.results[0]; // Object containing an array of measurements
    }
  } catch (error) {
    console.error('Error fetching air quality data:', error);
  }
  return null;
}
