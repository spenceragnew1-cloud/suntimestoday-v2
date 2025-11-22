import suncalc from "suncalc";

export interface SunTimes {
  sunrise: Date;
  sunset: Date;
  solarNoon: Date;
  goldenHourStart: Date;
  goldenHourEnd: Date;
  civilDawn: Date;
  civilDusk: Date;
  nauticalDawn: Date;
  nauticalDusk: Date;
  astronomicalDawn: Date;
  astronomicalDusk: Date;
  daylightDuration: number; // in minutes
}

export function getSunTimes(lat: number, lng: number, date: Date): SunTimes {
  const times = suncalc.getTimes(date, lat, lng);

  const sunrise = times.sunrise;
  const sunset = times.sunset;
  const solarNoon = times.solarNoon;
  const goldenHourStart = times.goldenHour;
  const goldenHourEnd = times.goldenHourEnd;
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
    goldenHourStart,
    goldenHourEnd,
    civilDawn,
    civilDusk,
    nauticalDawn,
    nauticalDusk,
    astronomicalDawn,
    astronomicalDusk,
    daylightDuration,
  };
}

