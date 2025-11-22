import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getSunTimes } from "@/lib/sun";
import { SunTimesTable } from "@/components/SunTimesTable";
import { getTimezoneForCity } from "@/lib/timezone";
import { calculateDistance } from "@/lib/distance";
import { createSlug } from "@/lib/slugify";
import { NearMeButton } from "@/components/NearMeButton";
import citiesData from "@/data/cities.json";
import { formatInTimeZone } from "date-fns-tz";
import { differenceInMinutes } from "date-fns";
import Link from "next/link";

interface City {
  name: string;
  region: string;
  country: string;
  lat: number;
  lng: number;
  slug: string;
}

const cities: City[] = citiesData as City[];

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

  const title = `Sunrise and Sunset Times in ${city.name}, ${city.region} | SunTimesToday`;
  const description = `Get accurate sunrise and sunset times for ${city.name}, ${city.region}, ${city.country}. Includes golden hour, twilight times, and day length information.`;
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
  const timezone = getTimezoneForCity(city.region);

  // Calculate daylight remaining
  const now = new Date();
  let daylightRemaining = "";
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

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What time is sunrise in ${city.name}, ${city.region}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Today's sunrise in ${city.name}, ${city.region} is at ${formatInTimeZone(sunTimes.sunrise, timezone, "h:mm a")}.`,
        },
      },
      {
        "@type": "Question",
        name: `What time is sunset in ${city.name}, ${city.region}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Today's sunset in ${city.name}, ${city.region} is at ${formatInTimeZone(sunTimes.sunset, timezone, "h:mm a")}.`,
        },
      },
      {
        "@type": "Question",
        name: `What is the golden hour in ${city.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The golden hour in ${city.name} starts at ${formatInTimeZone(sunTimes.goldenHourStart, timezone, "h:mm a")} and ends at ${formatInTimeZone(sunTimes.goldenHourEnd, timezone, "h:mm a")}. This is the best time for photography with warm, soft lighting.`,
        },
      },
      {
        "@type": "Question",
        name: `How long is the day in ${city.name} today?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Today's day length in ${city.name} is ${Math.floor(sunTimes.daylightDuration / 60)} hours and ${sunTimes.daylightDuration % 60} minutes.`,
        },
      },
      {
        "@type": "Question",
        name: `When does civil twilight begin in ${city.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Civil twilight in ${city.name} begins at ${formatInTimeZone(sunTimes.civilDawn, timezone, "h:mm a")} and ends at ${formatInTimeZone(sunTimes.civilDusk, timezone, "h:mm a")}. During this time, there is enough light for most outdoor activities.`,
        },
      },
      {
        "@type": "Question",
        name: `What is solar noon in ${city.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Solar noon in ${city.name} occurs at ${formatInTimeZone(sunTimes.solarNoon, timezone, "h:mm a")}, when the sun reaches its highest point in the sky.`,
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
          <div className="mb-4">
            <Link
              href={`/sunrise-sunset/${createSlug(city.region)}`}
              className="text-blue-600 hover:text-blue-800 text-sm underline"
            >
              More sunrise and sunset times in {city.region}
            </Link>
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
                {city.lng.toFixed(4)}°. Today, the sun rises at {formatInTimeZone(sunTimes.sunrise, timezone, "h:mm a")}{" "}
                and sets at {formatInTimeZone(sunTimes.sunset, timezone, "h:mm a")}, providing{" "}
                {Math.floor(sunTimes.daylightDuration / 60)} hours and {sunTimes.daylightDuration % 60}{" "}
                minutes of daylight.
              </p>
              <p className="text-base leading-7">
                The golden hour, ideal for photography and outdoor activities, occurs between{" "}
                {formatInTimeZone(sunTimes.goldenHourStart, timezone, "h:mm a")} and {formatInTimeZone(sunTimes.goldenHourEnd, timezone, "h:mm a")}{" "}
                today. During this period, the sun is low in the sky, creating warm, soft lighting
                conditions. Civil twilight begins at {formatInTimeZone(sunTimes.civilDawn, timezone, "h:mm a")} and ends
                at {formatInTimeZone(sunTimes.civilDusk, timezone, "h:mm a")}, offering enough natural light for most
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

