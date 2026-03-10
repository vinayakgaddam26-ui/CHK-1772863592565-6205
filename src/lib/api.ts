const TOMTOM_API_KEY = process.env.TOMTOM_API_KEY;

export async function fetchCityCoordinates(cityName: string) {
  if (!TOMTOM_API_KEY) {
    console.error('TOMTOM_API_KEY is not defined');
    return null;
  }
  
  try {
    const res = await fetch(`https://api.tomtom.com/search/2/geocode/${encodeURIComponent(cityName)}.json?key=${TOMTOM_API_KEY}&limit=1`);
    if (!res.ok) throw new Error('Geocoding failed');
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].position; // { lat, lon }
    }
  } catch (error) {
    console.error('Error fetching city coordinates:', error);
  }
  return null;
}

export async function fetchTrafficData(lat: number, lon: number) {
  if (!TOMTOM_API_KEY) return null;
  
  try {
    // Using TomTom Traffic Flow
    const res = await fetch(`https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key=${TOMTOM_API_KEY}&point=${lat},${lon}`);
    if (!res.ok) throw new Error('Traffic fetch failed');
    const data = await res.json();
    return data.flowSegmentData; // Includes currentSpeed, freeFlowSpeed, etc.
  } catch (error) {
    console.error('Error fetching traffic data:', error);
  }
  return null;
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
