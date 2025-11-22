declare module "suncalc" {
  interface SunTimes {
    sunrise: Date;
    sunset: Date;
    solarNoon: Date;
    goldenHour: Date;
    goldenHourEnd: Date;
    dawn: Date;
    dusk: Date;
    nauticalDawn: Date;
    nauticalDusk: Date;
    nightEnd: Date;
    night: Date;
  }

  function getTimes(date: Date, lat: number, lng: number): SunTimes;

  const suncalc: {
    getTimes: typeof getTimes;
  };

  export = suncalc;
}

