import { calculateDistance } from "./distance";

interface City {
  name: string;
  region: string;
  country: string;
  lat: number;
  lng: number;
  slug: string;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  return calculateDistance(lat1, lon1, lat2, lon2);
}

/**
 * Find the nearest city to the given coordinates
 * Returns the city object with the smallest distance
 */
export function findNearestCity(
  userLat: number,
  userLon: number,
  cities: City[]
): City | null {
  if (cities.length === 0) {
    return null;
  }

  let nearestCity: City = cities[0];
  let minDistance = haversineDistance(
    userLat,
    userLon,
    cities[0].lat,
    cities[0].lng
  );

  for (let i = 1; i < cities.length; i++) {
    const distance = haversineDistance(
      userLat,
      userLon,
      cities[i].lat,
      cities[i].lng
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearestCity = cities[i];
    }
  }

  return nearestCity;
}

