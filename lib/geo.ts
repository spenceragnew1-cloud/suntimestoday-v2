import { calculateDistance } from "./distance";

export type CityLike = {
  city?: string;
  name?: string;
  slug: string;
  lat: number;
  lng: number;
  region?: string;   // US state abbrev
  country?: string;  // global
  admin1?: string;
};

export type NearbyResult = CityLike & { distanceKm: number };

/**
 * Convert degrees to radians
 */
function toRadians(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  return calculateDistance(lat1, lng1, lat2, lng2);
}

/**
 * Find nearby cities from a pool, sorted by distance
 */
export function getNearbyCities({
  target,
  pool,
  limit = 8,
  maxDistanceKm = 500,
  excludeSlug,
}: {
  target: CityLike;
  pool: CityLike[];
  limit?: number;
  maxDistanceKm?: number;
  excludeSlug?: string;
}): NearbyResult[] {
  // Validate target has coordinates
  if (typeof target.lat !== 'number' || typeof target.lng !== 'number' ||
      isNaN(target.lat) || isNaN(target.lng)) {
    return [];
  }

  const results: NearbyResult[] = [];

  for (const city of pool) {
    // Skip if missing coordinates
    if (typeof city.lat !== 'number' || typeof city.lng !== 'number' ||
        isNaN(city.lat) || isNaN(city.lng)) {
      continue;
    }

    // Skip if it's the target city or excluded slug
    if (city.slug === target.slug || city.slug === excludeSlug) {
      continue;
    }

    // Calculate distance
    const distanceKm = haversineKm(target.lat, target.lng, city.lat, city.lng);

    // Filter by max distance
    if (distanceKm <= maxDistanceKm) {
      results.push({
        ...city,
        distanceKm,
      });
    }
  }

  // Sort by distance (ascending)
  results.sort((a, b) => a.distanceKm - b.distanceKm);

  // Return top limit
  return results.slice(0, limit);
}

/**
 * Find the nearest city to the given coordinates
 * Returns the city object with the smallest distance
 * (Legacy function for NearMeButton compatibility)
 */
export function findNearestCity(
  userLat: number,
  userLon: number,
  cities: CityLike[]
): CityLike | null {
  if (cities.length === 0) {
    return null;
  }

  const results = getNearbyCities({
    target: { lat: userLat, lng: userLon, slug: '' },
    pool: cities,
    limit: 1,
    maxDistanceKm: Infinity,
  });

  return results.length > 0 ? results[0] : null;
}
