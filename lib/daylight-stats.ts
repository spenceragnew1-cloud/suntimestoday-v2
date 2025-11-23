/**
 * Calculate daylight statistics for a hub based on city latitudes
 */

export interface DaylightStats {
  earliestSunriseMonth: string;
  latestSunsetMonth: string;
  longestDayMonth: string;
  shortestDayMonth: string;
  daylightRangeHours: string;
}

/**
 * Estimate daylight statistics based on mean latitude
 */
export function calculateDaylightStats(meanLat: number, isNorthern: boolean): DaylightStats {
  const absLat = Math.abs(meanLat);
  
  // For northern hemisphere
  if (isNorthern) {
    if (absLat > 50) {
      // High latitude: extreme variation
      return {
        earliestSunriseMonth: "June",
        latestSunsetMonth: "June",
        longestDayMonth: "June",
        shortestDayMonth: "December",
        daylightRangeHours: "8-16",
      };
    } else if (absLat > 35) {
      // Mid-latitude: significant variation
      return {
        earliestSunriseMonth: "June",
        latestSunsetMonth: "June",
        longestDayMonth: "June",
        shortestDayMonth: "December",
        daylightRangeHours: "9-15",
      };
    } else {
      // Lower latitude: moderate variation
      return {
        earliestSunriseMonth: "June",
        latestSunsetMonth: "June",
        longestDayMonth: "June",
        shortestDayMonth: "December",
        daylightRangeHours: "10-14",
      };
    }
  } else {
    // Southern hemisphere (reversed)
    if (absLat > 50) {
      return {
        earliestSunriseMonth: "December",
        latestSunsetMonth: "December",
        longestDayMonth: "December",
        shortestDayMonth: "June",
        daylightRangeHours: "8-16",
      };
    } else if (absLat > 35) {
      return {
        earliestSunriseMonth: "December",
        latestSunsetMonth: "December",
        longestDayMonth: "December",
        shortestDayMonth: "June",
        daylightRangeHours: "9-15",
      };
    } else {
      return {
        earliestSunriseMonth: "December",
        latestSunsetMonth: "December",
        longestDayMonth: "December",
        shortestDayMonth: "June",
        daylightRangeHours: "10-14",
      };
    }
  }
}

