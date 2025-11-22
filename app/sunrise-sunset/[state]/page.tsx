import { notFound } from "next/navigation";
import { Metadata } from "next";
import citiesData from "@/data/cities.json";
import { createSlug } from "@/lib/slugify";
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

const cities: City[] = citiesData as City[];

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

  // Get state abbreviation from first city's slug
  const getStateAbbr = (slug: string): string => {
    const parts = slug.split("-");
    return parts[parts.length - 1]?.toUpperCase() || "";
  };
  const stateAbbr = stateCities.length > 0 ? getStateAbbr(stateCities[0].slug) : "";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <main className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">
          Sunrise and Sunset Times in {stateName}
        </h1>

        <div className="mb-4 text-center text-sm text-gray-600">
          Or <NearMeButton variant="inline" label="use my location to find the closest city" />
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Find accurate sunrise and sunset times for all {stateCities.length} cities in {stateName}. 
            Each city page provides detailed sun time information including golden hour periods, 
            twilight times, and day length calculations. Whether you&apos;re planning outdoor activities, 
            photography sessions, or simply want to know when daylight begins and ends, we offer 
            location-specific data updated daily.
          </p>

          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Cities in {stateName}
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

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            About Sun Times in {stateName}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Sunrise and sunset times in {stateName} vary throughout the year based on each city&apos;s 
            geographic location and the Earth&apos;s position relative to the sun. Times are calculated 
            using precise coordinates and adjusted for local timezones. All data is updated daily to 
            ensure accuracy for planning outdoor activities, photography, and understanding daylight patterns.
          </p>
        </div>
      </main>
    </div>
  );
}

