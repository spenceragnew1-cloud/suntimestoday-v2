import suncalc from "suncalc";

export interface SunTimes {
  sunrise: Date;
  sunset: Date;
  solarNoon: Date;
  morningGoldenHourStart: Date;
  morningGoldenHourEnd: Date;
  eveningGoldenHourStart: Date;
  eveningGoldenHourEnd: Date;
  civilDawn: Date;
  civilDusk: Date;
  nauticalDawn: Date;
  nauticalDusk: Date;
  astronomicalDawn: Date;
  astronomicalDusk: Date;
  daylightDuration: number; // in minutes
}

// Helper to validate dates
const isValidDate = (date: Date): boolean => !isNaN(date.getTime());

export function getSunTimes(lat: number, lng: number, date: Date): SunTimes {
  const times = suncalc.getTimes(date, lat, lng);

  const sunrise = times.sunrise;
  const sunset = times.sunset;
  const solarNoon = times.solarNoon;
  
  // Golden hour calculation:
  // suncalc provides goldenHour (evening start, before sunset) and goldenHourEnd (morning end, after sunrise)
  // We'll use a standard 1-hour window for each period to ensure consistency and avoid midnight crossing issues
  
  const goldenHourDuration = 60 * 60 * 1000; // 1 hour in milliseconds
  
  // Morning golden hour: starts at sunrise, ends 1 hour later
  let morningGoldenHourStart = new Date(sunrise.getTime());
  let morningGoldenHourEnd = new Date(sunrise.getTime() + goldenHourDuration);
  
  // Evening golden hour: starts 1 hour before sunset, ends at sunset
  let eveningGoldenHourStart = new Date(sunset.getTime() - goldenHourDuration);
  let eveningGoldenHourEnd = new Date(sunset.getTime());
  
  // Validation: ensure times are valid and properly ordered
  // If suncalc provides valid golden hour times, we can optionally use those for evening start
  if (isValidDate(times.goldenHour) && times.goldenHour < sunset && times.goldenHour > sunrise) {
    eveningGoldenHourStart = times.goldenHour;
    // Recalculate evening end to maintain 1-hour duration
    eveningGoldenHourEnd = new Date(eveningGoldenHourStart.getTime() + goldenHourDuration);
    // Ensure it doesn't go past sunset
    if (eveningGoldenHourEnd > sunset) {
      eveningGoldenHourEnd = sunset;
    }
  }
  
  // If suncalc provides valid morning golden hour end, use it
  if (isValidDate(times.goldenHourEnd) && times.goldenHourEnd > sunrise && times.goldenHourEnd < sunset) {
    morningGoldenHourEnd = times.goldenHourEnd;
    // Recalculate morning start to maintain 1-hour duration
    morningGoldenHourStart = new Date(morningGoldenHourEnd.getTime() - goldenHourDuration);
    // Ensure it doesn't go before sunrise
    if (morningGoldenHourStart < sunrise) {
      morningGoldenHourStart = sunrise;
    }
  }
  
  // Final guard: ensure no invalid ranges
  if (!isValidDate(morningGoldenHourStart) || !isValidDate(morningGoldenHourEnd) ||
      morningGoldenHourStart >= morningGoldenHourEnd || 
      morningGoldenHourStart < sunrise || morningGoldenHourEnd > sunset) {
    // Fallback to simple 1-hour windows
    morningGoldenHourStart = new Date(sunrise.getTime());
    morningGoldenHourEnd = new Date(sunrise.getTime() + goldenHourDuration);
  }
  
  if (!isValidDate(eveningGoldenHourStart) || !isValidDate(eveningGoldenHourEnd) ||
      eveningGoldenHourStart >= eveningGoldenHourEnd ||
      eveningGoldenHourStart < sunrise || eveningGoldenHourEnd > sunset) {
    // Fallback to simple 1-hour windows
    eveningGoldenHourStart = new Date(sunset.getTime() - goldenHourDuration);
    eveningGoldenHourEnd = new Date(sunset.getTime());
  }
  
  const civilDawn = times.dawn;
  const civilDusk = times.dusk;
  const nauticalDawn = times.nauticalDawn;
  const nauticalDusk = times.nauticalDusk;
  const astronomicalDawn = times.nightEnd;
  const astronomicalDusk = times.night;

  // Calculate daylight duration in minutes
  const daylightDuration = Math.round((sunset.getTime() - sunrise.getTime()) / (1000 * 60));

  return {
    sunrise,
    sunset,
    solarNoon,
    morningGoldenHourStart,
    morningGoldenHourEnd,
    eveningGoldenHourStart,
    eveningGoldenHourEnd,
    civilDawn,
    civilDusk,
    nauticalDawn,
    nauticalDusk,
    astronomicalDawn,
    astronomicalDusk,
    daylightDuration,
  };
}

