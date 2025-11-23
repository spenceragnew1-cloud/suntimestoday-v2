import { notFound } from "next/navigation";
import { Metadata } from "next";
import countriesData from "@/data/countries.json";
import { createSlug } from "@/lib/slugify";
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

const countries: Country[] = countriesData as Country[];

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

          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Find accurate sunrise and sunset times for all {cities.length} cities in {countryName}. 
              Each city page provides detailed sun time information including golden hour periods, 
              twilight times, and day length calculations. Whether you&apos;re planning outdoor activities, 
              photography sessions, or simply want to know when daylight begins and ends, we offer 
              location-specific data updated daily.
            </p>

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

          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              About Sun Times in {countryName}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Sunrise and sunset times in {countryName} vary throughout the year based on each city&apos;s 
              geographic location and the Earth&apos;s position relative to the sun. Times are calculated 
              using precise coordinates and adjusted for local timezones. All data is updated daily to 
              ensure accuracy for planning outdoor activities, photography, and understanding daylight patterns.
            </p>
          </div>
        </main>
      </div>
    </>
  );
}

