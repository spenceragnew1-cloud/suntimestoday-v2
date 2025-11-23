import { notFound } from "next/navigation";
import { Metadata } from "next";
import countriesData from "@/data/countries.json";
import countryHubsContentData from "@/data/country-hubs-content.json";
import { createSlug } from "@/lib/slugify";
import { calculateDaylightStats } from "@/lib/daylight-stats";
import Link from "next/link";

interface City {
  city: string;
  admin1?: string;
  country: string;
  lat: number;
  lng: number;
  slug: string;
}

interface Country {
  country: string;
  countrySlug: string;
  cities: City[];
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

const countries: Country[] = countriesData as Country[];
const countryHubsContent: HubContent[] = countryHubsContentData as HubContent[];

interface PageProps {
  params: Promise<{ country: string }>;
}

export const dynamicParams = false;
export const dynamic = 'force-static';

/**
 * Generate static params for all countries
 */
export async function generateStaticParams() {
  return countries.map((country) => ({
    country: country.countrySlug,
  }));
}

/**
 * Find country by slug
 */
function findCountryBySlug(countrySlug: string): Country | null {
  return countries.find((c) => c.countrySlug === countrySlug) || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country } = await params;
  const countryData = findCountryBySlug(country);

  if (!countryData) {
    return {
      title: "Country Not Found",
    };
  }

  const { country: countryName, cities } = countryData;
  const cityCount = cities.length;
  
  const title = `Sunrise and Sunset Times in ${countryName} | SunTimesToday`;
  const description = `Find accurate sunrise and sunset times for all ${cityCount} cities in ${countryName}. Includes golden hour, twilight times, and day length information for locations across the country.`;
  const url = `https://suntimestoday.com/sunrise-sunset/${country}`;

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

export default async function CountryPage({ params }: PageProps) {
  const { country } = await params;
  const countryData = findCountryBySlug(country);

  if (!countryData) {
    notFound();
  }

  const { country: countryName, cities } = countryData;

  // Get hub content
  const hubContent = countryHubsContent.find((h) => h.slug === country);
  const fallbackContent = `Find accurate sunrise and sunset times for all ${cities.length} cities in ${countryName}. Each city page provides detailed sun time information including golden hour periods, twilight times, and day length calculations. Whether you're planning outdoor activities, photography sessions, or simply want to know when daylight begins and ends, we offer location-specific data updated daily.`;

  // Calculate latitude statistics
  const lats = cities.map((c) => Number(c.lat)).filter((lat) => !isNaN(lat));
  const meanLat = lats.reduce((a, b) => a + b, 0) / lats.length;
  const isNorthern = meanLat > 0;
  const daylightStats = calculateDaylightStats(meanLat, isNorthern);

  // Get top cities (first 12 in dataset order, or all if less than 12)
  const topCities = cities.slice(0, 12);

  // Create FAQ JSON-LD
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What time is sunrise in ${countryName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Sunrise times in ${countryName} vary by city and throughout the year. Each city page provides today's exact sunrise time based on geographic location and timezone.`,
        },
      },
      {
        "@type": "Question",
        name: `What time is sunset in ${countryName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Sunset times in ${countryName} vary by city and throughout the year. Each city page provides today's exact sunset time based on geographic location and timezone.`,
        },
      },
      {
        "@type": "Question",
        name: `How many cities in ${countryName} have sunrise and sunset data?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `We provide sunrise and sunset times for ${cities.length} cities in ${countryName}. Each city page includes detailed sun time information including golden hour and twilight periods.`,
        },
      },
      {
        "@type": "Question",
        name: `When is the best time for photography in ${countryName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The golden hour, ideal for photography, occurs twice daily in ${countryName}: shortly after sunrise and before sunset. Each city page shows the exact golden hour times for today.`,
        },
      },
      {
        "@type": "Question",
        name: `How much does daylight change across the year in ${countryName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Daylight in ${countryName} varies significantly throughout the year. The longest days occur in ${daylightStats.longestDayMonth}, with approximately ${daylightStats.daylightRangeHours.split('-')[1]} hours of daylight, while the shortest days in ${daylightStats.shortestDayMonth} have around ${daylightStats.daylightRangeHours.split('-')[0]} hours.`,
        },
      },
      {
        "@type": "Question",
        name: `When is the best golden hour in ${countryName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Golden hour occurs twice daily in ${countryName}—morning after sunrise and evening before sunset. The timing varies by season, with summer offering earlier morning and later evening golden hours compared to winter. Check individual city pages for today's exact times.`,
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
          {/* Breadcrumb */}
          <nav className="mb-4 text-sm">
            <Link href="/" className="text-blue-600 hover:text-blue-800 underline">
              Home
            </Link>
            <span className="mx-2 text-gray-500">→</span>
            <span className="text-gray-700">{countryName}</span>
          </nav>

          <h1 className="text-4xl font-bold mb-6 text-gray-900">
            Sunrise and Sunset Times in {countryName}
          </h1>

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
              Key Daylight Patterns in {countryName}
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
                Top Cities in {countryName}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {topCities.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/sunrise-sunset/${city.slug}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all duration-200"
                    aria-label={`Sunrise and sunset times in ${city.city}, ${countryName}`}
                  >
                    <div className="font-medium text-gray-900">{city.city}</div>
                    {city.admin1 && (
                      <div className="text-sm text-gray-600">{city.admin1}</div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Full city grid */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Cities in {countryName}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {cities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/sunrise-sunset/${city.slug}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all duration-200"
                  aria-label={`Sunrise and sunset times in ${city.city}, ${countryName}`}
                >
                  <div className="font-medium text-gray-900">{city.city}</div>
                  {city.admin1 && (
                    <div className="text-sm text-gray-600">{city.admin1}</div>
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
