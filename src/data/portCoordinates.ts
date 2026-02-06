interface PortCoord {
  lat: number;
  lon: number;
}

const PORT_COORDINATES: Record<string, PortCoord> = {
  'nhava sheva': { lat: 18.9500, lon: 72.9500 },
  'jnpt': { lat: 18.9500, lon: 72.9500 },
  'mumbai': { lat: 18.9600, lon: 72.8400 },
  'chennai': { lat: 13.0827, lon: 80.2707 },
  'kolkata': { lat: 22.5726, lon: 88.3639 },
  'kandla': { lat: 23.0333, lon: 70.2167 },
  'mundra': { lat: 22.8394, lon: 69.7250 },
  'kochi': { lat: 9.9312, lon: 76.2673 },
  'visakhapatnam': { lat: 17.6868, lon: 83.2185 },
  'tuticorin': { lat: 8.7642, lon: 78.1348 },
  'marmagao': { lat: 15.4127, lon: 73.8003 },
  'goa': { lat: 15.4127, lon: 73.8003 },
  'delhi': { lat: 28.6139, lon: 77.2090 },
  'bangalore': { lat: 12.9716, lon: 77.5946 },
  'hyderabad': { lat: 17.3850, lon: 78.4867 },
  'pune': { lat: 18.5204, lon: 73.8567 },
  'ahmedabad': { lat: 23.0225, lon: 72.5714 },
  'shanghai': { lat: 31.2304, lon: 121.4737 },
  'shenzhen': { lat: 22.5431, lon: 114.0579 },
  'ningbo': { lat: 29.8683, lon: 121.5440 },
  'yantian': { lat: 22.5700, lon: 114.2800 },
  'hong kong': { lat: 22.3193, lon: 114.1694 },
  'singapore': { lat: 1.2644, lon: 103.8222 },
  'rotterdam': { lat: 51.9225, lon: 4.4792 },
  'hamburg': { lat: 53.5511, lon: 9.9937 },
  'antwerp': { lat: 51.2194, lon: 4.4025 },
  'le havre': { lat: 49.4944, lon: 0.1079 },
  'felixstowe': { lat: 51.9536, lon: 1.3511 },
  'genoa': { lat: 44.4056, lon: 8.9463 },
  'los angeles': { lat: 33.7395, lon: -118.2610 },
  'long beach': { lat: 33.7701, lon: -118.1937 },
  'new york': { lat: 40.6840, lon: -74.0162 },
  'savannah': { lat: 32.0809, lon: -81.0912 },
  'miami': { lat: 25.7617, lon: -80.1918 },
  'seattle': { lat: 47.5810, lon: -122.3417 },
  'jebel ali': { lat: 24.9857, lon: 55.0272 },
  'dubai': { lat: 25.2048, lon: 55.2708 },
  'sharjah': { lat: 25.3463, lon: 55.4209 },
  'doha': { lat: 25.2854, lon: 51.5310 },
  'yokohama': { lat: 35.4437, lon: 139.6380 },
  'tokyo': { lat: 35.6762, lon: 139.6503 },
  'busan': { lat: 35.1796, lon: 129.0756 },
  'seoul': { lat: 37.5665, lon: 126.9780 },
  'sydney': { lat: -33.8688, lon: 151.2093 },
  'melbourne': { lat: -37.8136, lon: 144.9631 },
  'perth': { lat: -31.9523, lon: 115.8613 },
  'fremantle': { lat: -32.0569, lon: 115.7439 },
  'santos': { lat: -23.9608, lon: -46.3336 },
  'rio grande': { lat: -32.0350, lon: -52.0986 },
  'valparaiso': { lat: -33.0472, lon: -71.6127 },
  'durban': { lat: -29.8587, lon: 31.0218 },
  'cape town': { lat: -33.9249, lon: 18.4241 },
  'alexandria': { lat: 31.2001, lon: 29.9187 },
  'ho chi minh': { lat: 10.8231, lon: 106.6297 },
  'vung tau': { lat: 10.3460, lon: 107.0843 },
  'bangkok': { lat: 13.7563, lon: 100.5018 },
  'penang': { lat: 5.4164, lon: 100.3327 },
  'kuala lumpur': { lat: 3.1390, lon: 101.6869 },
  'jakarta': { lat: -6.2088, lon: 106.8456 },
  'chittagong': { lat: 22.3569, lon: 91.7832 },
  'dhaka': { lat: 23.8103, lon: 90.4125 },
  'colombo': { lat: 6.9271, lon: 79.8612 },
  'london': { lat: 51.5074, lon: -0.1278 },
  'paris': { lat: 48.8566, lon: 2.3522 },
  'frankfurt': { lat: 50.1109, lon: 8.6821 },
  'amsterdam': { lat: 52.3676, lon: 4.9041 },
  'brussels': { lat: 50.8503, lon: 4.3517 },
  'rome': { lat: 41.9028, lon: 12.4964 },
  'chicago': { lat: 41.8781, lon: -87.6298 },
};

export function getPortCoordinates(portName: string): PortCoord | null {
  if (!portName) return null;
  const normalized = portName.toLowerCase()
    .replace(/\b(port|terminal|hub|zone|free zone|of)\b/gi, '')
    .replace(/,.*$/, '')
    .trim();

  for (const [key, coords] of Object.entries(PORT_COORDINATES)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return coords;
    }
  }

  const words = normalized.split(/\s+/);
  for (const word of words) {
    if (word.length < 3) continue;
    for (const [key, coords] of Object.entries(PORT_COORDINATES)) {
      if (key.includes(word)) {
        return coords;
      }
    }
  }

  return null;
}
