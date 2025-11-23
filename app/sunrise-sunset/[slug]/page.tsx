import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getSunTimes } from "@/lib/sun";
import { SunTimesTable } from "@/components/SunTimesTable";
import { getTimezoneForCity } from "@/lib/timezone";
import { calculateDistance } from "@/lib/distance";
import { createSlug } from "@/lib/slugify";
import { NearMeButton } from "@/components/NearMeButton";
import citiesData from "@/data/cities.json";
import globalCitiesData from "@/data/global-cities.json";
import countriesData from "@/data/countries.json";
import { formatInTimeZone } from "date-fns-tz";
import { differenceInMinutes } from "date-fns";
import Link from "next/link";

interface USCity {
  name: string;
  region: string;
  country: string;
  lat: number;
  lng: number;
  slug: string;
}

interface GlobalCity {
  city: string;
  country: string;
  admin1?: string;
  lat: number;
  lng: number;
  slug: string;
}

interface City {
  name: string;
  region: string;
  country: string;
  lat: number;
  lng: number;
  slug: string;
}

const usCities: USCity[] = citiesData as USCity[];
const globalCities: GlobalCity[] = globalCitiesData as GlobalCity[];
const countries = countriesData as any[];

// Normalize global cities to match US city structure
const normalizedGlobalCities: City[] = globalCities.map((gc) => ({
  name: gc.city,
  region: gc.admin1 || gc.country,
  country: gc.country,
  lat: Number(gc.lat),
  lng: Number(gc.lng),
  slug: gc.slug,
}));

// Combine all cities
const cities: City[] = [...usCities, ...normalizedGlobalCities];

// Helper to get country slug for a country name
function getCountrySlug(countryName: string): string | null {
  const country = countries.find((c) => c.country === countryName);
  return country ? country.countrySlug : null;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;
export const dynamic = 'force-static';

export async function generateStaticParams() {
  return cities.map((city) => ({
    slug: city.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const city = cities.find((c) => c.slug === slug);

  if (!city) {
    return {
      title: "City Not Found",
    };
  }

  const today = new Date();
  const sunTimes = getSunTimes(city.lat, city.lng, today);
  const timezone = getTimezoneForCity(city.region, city.country);
  const isValidDate = (date: Date): boolean => !isNaN(date.getTime());
  const hasValidSunTimes = isValidDate(sunTimes.sunrise) && isValidDate(sunTimes.sunset);

  const title = `Sunrise and Sunset Times in ${city.name}, ${city.region} | SunTimesToday`;
  const description = hasValidSunTimes
    ? `Get accurate sunrise and sunset times for ${city.name}, ${city.region}, ${city.country}. Includes golden hour, twilight times, and day length information.`
    : `Sunrise and sunset times for ${city.name}, ${city.region}, ${city.country}.`;
  const url = `https://suntimestoday.com/sunrise-sunset/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "SunTimesToday",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function CityPage({ params }: PageProps) {
  const { slug } = await params;
  const city = cities.find((c) => c.slug === slug);

  if (!city) {
    notFound();
  }

  const today = new Date();
  const sunTimes = getSunTimes(city.lat, city.lng, today);
  const timezone = getTimezoneForCity(city.region, city.country);

  // Validate sun times (handle polar regions where sun may not rise/set)
  const isValidDate = (date: Date): boolean => !isNaN(date.getTime());
  
  // Check if we have valid sun times
  const hasValidSunTimes = isValidDate(sunTimes.sunrise) && isValidDate(sunTimes.sunset);
  
  if (!hasValidSunTimes) {
    // For polar regions, show a message instead of times
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <main className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-gray-900">
            Sunrise and Sunset Times in {city.name}, {city.region}
          </h1>
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <p className="text-lg text-gray-700">
              Due to this location&apos;s extreme latitude, the sun may not rise or set on certain dates. 
              Please check back during different times of the year for accurate sun times.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Calculate daylight remaining (only if we have valid sun times)
  const now = new Date();
  let daylightRemaining = "";
  if (hasValidSunTimes) {
    if (now < sunTimes.sunrise) {
      const minutesUntil = differenceInMinutes(sunTimes.sunrise, now);
      daylightRemaining = `Sunrise in ${Math.floor(minutesUntil / 60)}h ${minutesUntil % 60}m`;
    } else if (now < sunTimes.sunset) {
      const minutesRemaining = differenceInMinutes(sunTimes.sunset, now);
      daylightRemaining = `${Math.floor(minutesRemaining / 60)}h ${minutesRemaining % 60}m of daylight remaining today`;
    } else {
      const minutesUntil = differenceInMinutes(
        new Date(today.getTime() + 24 * 60 * 60 * 1000),
        now
      );
      daylightRemaining = `Sunset has passed. Next sunrise in ${Math.floor(minutesUntil / 60)}h ${minutesUntil % 60}m`;
    }
  }

  // Get related cities - prioritize same state first, then nearest by distance
  const sameStateCities = cities.filter(
    (c) => c.slug !== slug && c.region === city.region
  );
  
  let relatedCities: City[] = [];
  
  // First, get same-state cities (up to 8)
  if (sameStateCities.length >= 8) {
    relatedCities = sameStateCities.slice(0, 8);
  } else {
    relatedCities = [...sameStateCities];
    
    // Then add nearest cities by distance
    const otherCities = cities
      .filter(
        (c) =>
          c.slug !== slug &&
          c.region !== city.region &&
          !relatedCities.some((rc) => rc.slug === c.slug)
      )
      .map((c) => ({
        ...c,
        distance: calculateDistance(city.lat, city.lng, c.lat, c.lng),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 12 - relatedCities.length)
      .map(({ distance, ...c }) => c);
    
    relatedCities.push(...otherCities);
  }

  // Helper to safely format dates
  const safeFormatTime = (date: Date, tz: string, format: string): string => {
    if (!isValidDate(date)) return "N/A";
    try {
      return formatInTimeZone(date, tz, format);
    } catch {
      return "N/A";
    }
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What time is sunrise in ${city.name}, ${city.region}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: hasValidSunTimes
            ? `Today's sunrise in ${city.name}, ${city.region} is at ${safeFormatTime(sunTimes.sunrise, timezone, "h:mm a")}.`
            : `Sunrise times for ${city.name}, ${city.region} vary throughout the year.`,
        },
      },
      {
        "@type": "Question",
        name: `What time is sunset in ${city.name}, ${city.region}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: hasValidSunTimes
            ? `Today's sunset in ${city.name}, ${city.region} is at ${safeFormatTime(sunTimes.sunset, timezone, "h:mm a")}.`
            : `Sunset times for ${city.name}, ${city.region} vary throughout the year.`,
        },
      },
      {
        "@type": "Question",
        name: `What is the golden hour in ${city.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: hasValidSunTimes
            ? `The golden hour in ${city.name} occurs in two periods: morning from ${safeFormatTime(sunTimes.morningGoldenHourStart, timezone, "h:mm a")} to ${safeFormatTime(sunTimes.morningGoldenHourEnd, timezone, "h:mm a")}, and evening from ${safeFormatTime(sunTimes.eveningGoldenHourStart, timezone, "h:mm a")} to ${safeFormatTime(sunTimes.eveningGoldenHourEnd, timezone, "h:mm a")}. This is the best time for photography with warm, soft lighting.`
            : `Golden hour times for ${city.name} vary throughout the year based on sunrise and sunset.`,
        },
      },
      {
        "@type": "Question",
        name: `How long is the day in ${city.name} today?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: hasValidSunTimes
            ? `Today's day length in ${city.name} is ${Math.floor(sunTimes.daylightDuration / 60)} hours and ${sunTimes.daylightDuration % 60} minutes.`
            : `Day length in ${city.name} varies throughout the year.`,
        },
      },
      {
        "@type": "Question",
        name: `When does civil twilight begin in ${city.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: hasValidSunTimes
            ? `Civil twilight in ${city.name} begins at ${safeFormatTime(sunTimes.civilDawn, timezone, "h:mm a")} and ends at ${safeFormatTime(sunTimes.civilDusk, timezone, "h:mm a")}. During this time, there is enough light for most outdoor activities.`
            : `Civil twilight times for ${city.name} vary throughout the year.`,
        },
      },
      {
        "@type": "Question",
        name: `What is solar noon in ${city.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: isValidDate(sunTimes.solarNoon)
            ? `Solar noon in ${city.name} occurs at ${safeFormatTime(sunTimes.solarNoon, timezone, "h:mm a")}, when the sun reaches its highest point in the sky.`
            : `Solar noon times for ${city.name} vary throughout the year.`,
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <main className="max-w-4xl mx-auto">
          <div className="mb-4 space-y-2">
            {/* State link for US cities */}
            {city.country === "United States" && (
              <div>
                <Link
                  href={`/sunrise-sunset/${createSlug(city.region)}`}
                  className="text-blue-600 hover:text-blue-800 text-sm underline"
                >
                  More sunrise and sunset times in {city.region}
                </Link>
              </div>
            )}
            {/* Country link for global cities */}
            {city.country !== "United States" && (() => {
              const countrySlug = getCountrySlug(city.country);
              return countrySlug ? (
                <div>
                  <Link
                    href={`/sunrise-sunset/${countrySlug}`}
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    More sunrise & sunset times in {city.country}
                  </Link>
                </div>
              ) : null;
            })()}
          </div>
          <h1 className="text-4xl font-bold mb-8 text-gray-900">
            Sunrise and Sunset Times in {city.name}, {city.region}
          </h1>

          <div className="bg-white rounded-lg shadow-md p-8 mb-8" style={{ minHeight: '400px' }}>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Today&apos;s Sun Data
            </h2>
            <div style={{ minHeight: '350px' }}>
              <SunTimesTable sunTimes={sunTimes} timezone={timezone} />
            </div>
            <p className="mt-4 text-sm text-gray-600 text-center">
              Data updated daily.
            </p>
            <p className="mt-4 text-lg font-medium text-gray-700">
              {daylightRemaining}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              About Sun Times in {city.name}
            </h2>
            <div className="prose max-w-none text-gray-700 space-y-5 leading-relaxed">
              <p className="text-base leading-7">
                {city.name}, {city.region} experiences varying sunrise and sunset times throughout
                the year due to its location at latitude {city.lat.toFixed(4)}° and longitude{" "}
                {city.lng.toFixed(4)}°. Today, the sun rises at {isValidDate(sunTimes.sunrise) ? formatInTimeZone(sunTimes.sunrise, timezone, "h:mm a") : "N/A"}{" "}
                and sets at {isValidDate(sunTimes.sunset) ? formatInTimeZone(sunTimes.sunset, timezone, "h:mm a") : "N/A"}, providing{" "}
                {Math.floor(sunTimes.daylightDuration / 60)} hours and {sunTimes.daylightDuration % 60}{" "}
                minutes of daylight.
              </p>
              <p className="text-base leading-7">
                The golden hour, ideal for photography and outdoor activities, occurs in two periods today: 
                morning from {isValidDate(sunTimes.morningGoldenHourStart) ? formatInTimeZone(sunTimes.morningGoldenHourStart, timezone, "h:mm a") : "N/A"} to {isValidDate(sunTimes.morningGoldenHourEnd) ? formatInTimeZone(sunTimes.morningGoldenHourEnd, timezone, "h:mm a") : "N/A"}, 
                and evening from {isValidDate(sunTimes.eveningGoldenHourStart) ? formatInTimeZone(sunTimes.eveningGoldenHourStart, timezone, "h:mm a") : "N/A"} to {isValidDate(sunTimes.eveningGoldenHourEnd) ? formatInTimeZone(sunTimes.eveningGoldenHourEnd, timezone, "h:mm a") : "N/A"}. 
                During these periods, the sun is low in the sky, creating warm, soft lighting conditions. 
                Civil twilight begins at {isValidDate(sunTimes.civilDawn) ? formatInTimeZone(sunTimes.civilDawn, timezone, "h:mm a") : "N/A"} and ends
                at {isValidDate(sunTimes.civilDusk) ? formatInTimeZone(sunTimes.civilDusk, timezone, "h:mm a") : "N/A"}, offering enough natural light for most
                activities without artificial lighting.
              </p>
              <p className="text-base leading-7">
                Understanding these sun times helps residents and visitors plan their day, whether
                for outdoor recreation, photography, or simply knowing when to expect daylight.
                The times change daily as the Earth orbits the sun, with longer days in summer and
                shorter days in winter.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Related Cities</h2>
              <div className="text-sm text-gray-600">
                Not your city? <NearMeButton variant="inline" label="Use my location" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {relatedCities.map((relatedCity) => (
                <Link
                  key={relatedCity.slug}
                  href={`/sunrise-sunset/${relatedCity.slug}`}
                  className="block p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-sm transition-all duration-200"
                  aria-label={`Sunrise and sunset times in ${relatedCity.name}, ${relatedCity.region}`}
                >
                  <div className="font-medium text-blue-600 hover:text-blue-800">
                    {relatedCity.name}, {relatedCity.region}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

