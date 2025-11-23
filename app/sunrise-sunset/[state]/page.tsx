import { notFound } from "next/navigation";
import { Metadata } from "next";
import citiesData from "@/data/cities.json";
import stateHubsContentData from "@/data/state-hubs-content.json";
import { createSlug } from "@/lib/slugify";
import { calculateDaylightStats } from "@/lib/daylight-stats";
import { NearMeButton } from "@/components/NearMeButton";
import Link from "next/link";

interface City {
  name: string;
  region: string;
  country: string;
  lat: number;
  lng: number;
  slug: string;
}

interface HubContent {
  hubName: string;
  slug: string;
  content: string;
  wordCount: number;
  latitudeStats: {
    minLat: string;
    maxLat: string;
    meanLat: string;
    isNorthern: boolean;
    daylightVariation: string;
  };
}

const cities: City[] = citiesData as City[];
const stateHubsContent: HubContent[] = stateHubsContentData as HubContent[];

interface PageProps {
  params: Promise<{ state: string }>;
}

export const dynamicParams = false;
export const dynamic = 'force-static';

/**
 * Get unique states from cities data and generate state slugs
 */
export async function generateStaticParams() {
  const stateMap = new Map<string, string>(); // state name -> state slug
  
  cities.forEach((city) => {
    if (!stateMap.has(city.region)) {
      stateMap.set(city.region, createSlug(city.region));
    }
  });

  return Array.from(stateMap.values()).map((stateSlug) => ({
    state: stateSlug,
  }));
}

/**
 * Find state name from state slug
 */
function findStateBySlug(stateSlug: string): { stateName: string; stateCities: City[] } | null {
  // Find the state name that matches this slug
  const stateMap = new Map<string, string>(); // state slug -> state name
  
  cities.forEach((city) => {
    const slug = createSlug(city.region);
    if (!stateMap.has(slug)) {
      stateMap.set(slug, city.region);
    }
  });

  const stateName = stateMap.get(stateSlug);
  if (!stateName) {
    return null;
  }

  // Get all cities in this state, sorted alphabetically
  const stateCities = cities
    .filter((city) => city.region === stateName)
    .sort((a, b) => a.name.localeCompare(b.name));

  return { stateName, stateCities };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state } = await params;
  const stateData = findStateBySlug(state);

  if (!stateData) {
    return {
      title: "State Not Found",
    };
  }

  const { stateName, stateCities } = stateData;
  const cityCount = stateCities.length;
  
  const title = `Sunrise and Sunset Times in ${stateName} | SunTimesToday`;
  const description = `Find accurate sunrise and sunset times for all ${cityCount} cities in ${stateName}. Includes golden hour, twilight times, and day length information for locations across the state.`;
  const url = `https://suntimestoday.com/sunrise-sunset/${state}`;

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

export default async function StatePage({ params }: PageProps) {
  const { state } = await params;
  const stateData = findStateBySlug(state);

  if (!stateData) {
    notFound();
  }

  const { stateName, stateCities } = stateData;

  // Get hub content
  const hubContent = stateHubsContent.find((h) => h.slug === state);
  const fallbackContent = `Find accurate sunrise and sunset times for all ${stateCities.length} cities in ${stateName}. Each city page provides detailed sun time information including golden hour periods, twilight times, and day length calculations. Whether you're planning outdoor activities, photography sessions, or simply want to know when daylight begins and ends, we offer location-specific data updated daily.`;

  // Calculate latitude statistics
  const lats = stateCities.map((c) => c.lat).filter((lat) => !isNaN(lat));
  const meanLat = lats.reduce((a, b) => a + b, 0) / lats.length;
  const isNorthern = meanLat > 0;
  const daylightStats = calculateDaylightStats(meanLat, isNorthern);

  // Get top cities (first 12 in dataset order, or all if less than 12)
  const topCities = stateCities.slice(0, 12);

  // Get state abbreviation from first city's slug
  const getStateAbbr = (slug: string): string => {
    const parts = slug.split("-");
    return parts[parts.length - 1]?.toUpperCase() || "";
  };
  const stateAbbr = stateCities.length > 0 ? getStateAbbr(stateCities[0].slug) : "";

  // Create FAQ JSON-LD
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What time is sunrise in ${stateName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Sunrise times in ${stateName} vary by city and throughout the year. Each city page provides today's exact sunrise time based on geographic location and timezone.`,
        },
      },
      {
        "@type": "Question",
        name: `What time is sunset in ${stateName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Sunset times in ${stateName} vary by city and throughout the year. Each city page provides today's exact sunset time based on geographic location and timezone.`,
        },
      },
      {
        "@type": "Question",
        name: `How many cities in ${stateName} have sunrise and sunset data?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `We provide sunrise and sunset times for ${stateCities.length} cities in ${stateName}. Each city page includes detailed sun time information including golden hour and twilight periods.`,
        },
      },
      {
        "@type": "Question",
        name: `When is the best time for photography in ${stateName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The golden hour, ideal for photography, occurs twice daily in ${stateName}: shortly after sunrise and before sunset. Each city page shows the exact golden hour times for today.`,
        },
      },
      {
        "@type": "Question",
        name: `How much does daylight change across the year in ${stateName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Daylight in ${stateName} varies significantly throughout the year. The longest days occur in ${daylightStats.longestDayMonth}, with approximately ${daylightStats.daylightRangeHours.split('-')[1]} hours of daylight, while the shortest days in ${daylightStats.shortestDayMonth} have around ${daylightStats.daylightRangeHours.split('-')[0]} hours.`,
        },
      },
      {
        "@type": "Question",
        name: `When is the best golden hour in ${stateName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Golden hour occurs twice daily in ${stateName}—morning after sunrise and evening before sunset. The timing varies by season, with summer offering earlier morning and later evening golden hours compared to winter. Check individual city pages for today's exact times.`,
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
        <main className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-gray-900">
            Sunrise and Sunset Times in {stateName}
          </h1>

          <div className="mb-4 text-center text-sm text-gray-600">
            Or <NearMeButton variant="inline" label="use my location to find the closest city" />
          </div>

          {/* Long-form intro block */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="prose max-w-none text-gray-700 leading-relaxed space-y-4">
              {hubContent ? (
                <div className="whitespace-pre-line">{hubContent.content}</div>
              ) : (
                <p>{fallbackContent}</p>
              )}
            </div>
          </div>

          {/* Key daylight bullets */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Key Daylight Patterns in {stateName}
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Earliest sunrise happens in <strong>{daylightStats.earliestSunriseMonth}</strong></span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Latest sunset happens in <strong>{daylightStats.latestSunsetMonth}</strong></span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Longest day is around <strong>{daylightStats.longestDayMonth}</strong> with approximately {daylightStats.daylightRangeHours.split('-')[1]} hours of daylight</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Shortest day is around <strong>{daylightStats.shortestDayMonth}</strong> with approximately {daylightStats.daylightRangeHours.split('-')[0]} hours of daylight</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Daylight ranges from <strong>{daylightStats.daylightRangeHours}</strong> hours throughout the year</span>
              </li>
            </ul>
          </div>

          {/* Top Cities section */}
          {topCities.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                Top Cities in {stateName}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {topCities.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/sunrise-sunset/${city.slug}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all duration-200"
                    aria-label={`Sunrise and sunset times in ${city.name}, ${stateName}`}
                  >
                    <div className="font-medium text-gray-900">{city.name}</div>
                    {stateAbbr && (
                      <div className="text-sm text-gray-600">{stateAbbr}</div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Full city grid */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              All Cities in {stateName}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {stateCities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/sunrise-sunset/${city.slug}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all duration-200"
                  aria-label={`Sunrise and sunset times in ${city.name}, ${stateName}`}
                >
                  <div className="font-medium text-gray-900">{city.name}</div>
                  {stateAbbr && (
                    <div className="text-sm text-gray-600">{stateAbbr}</div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
