import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getSunTimes } from "@/lib/sun";
import { SunTimesTable } from "@/components/SunTimesTable";
import { CityLinks } from "@/components/CityLinks";
import citiesData from "@/data/cities.json";
import { format, differenceInMinutes } from "date-fns";

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

  // Get related cities - prioritize same state first
  const sameStateCities = cities.filter(
    (c) => c.slug !== slug && c.region === city.region
  );
  
  let relatedCities: City[] = [];
  
  // First, try to get 5 cities from the same state
  if (sameStateCities.length >= 5) {
    relatedCities = sameStateCities.slice(0, 5);
  } else {
    // Use all same-state cities, then fill with other cities
    relatedCities = [...sameStateCities];
    const additional = cities
      .filter(
        (c) =>
          c.slug !== slug &&
          c.region !== city.region &&
          !relatedCities.some((rc) => rc.slug === c.slug)
      )
      .slice(0, 5 - relatedCities.length);
    relatedCities.push(...additional);
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
          text: `Today's sunrise in ${city.name}, ${city.region} is at ${format(sunTimes.sunrise, "h:mm a")}.`,
        },
      },
      {
        "@type": "Question",
        name: `What time is sunset in ${city.name}, ${city.region}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Today's sunset in ${city.name}, ${city.region} is at ${format(sunTimes.sunset, "h:mm a")}.`,
        },
      },
      {
        "@type": "Question",
        name: `What is the golden hour in ${city.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The golden hour in ${city.name} starts at ${format(sunTimes.goldenHourStart, "h:mm a")} and ends at ${format(sunTimes.goldenHourEnd, "h:mm a")}. This is the best time for photography with warm, soft lighting.`,
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
          text: `Civil twilight in ${city.name} begins at ${format(sunTimes.civilDawn, "h:mm a")} and ends at ${format(sunTimes.civilDusk, "h:mm a")}. During this time, there is enough light for most outdoor activities.`,
        },
      },
      {
        "@type": "Question",
        name: `What is solar noon in ${city.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Solar noon in ${city.name} occurs at ${format(sunTimes.solarNoon, "h:mm a")}, when the sun reaches its highest point in the sky.`,
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
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <main className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-gray-900">
            Sunrise and Sunset Times in {city.name}, {city.region}
          </h1>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <SunTimesTable sunTimes={sunTimes} />
            <p className="mt-4 text-lg font-medium text-gray-700">
              {daylightRemaining}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              About Sun Times in {city.name}
            </h2>
            <div className="prose max-w-none text-gray-700 space-y-4">
              <p>
                {city.name}, {city.region} experiences varying sunrise and sunset times throughout
                the year due to its location at latitude {city.lat.toFixed(4)}° and longitude{" "}
                {city.lng.toFixed(4)}°. Today, the sun rises at {format(sunTimes.sunrise, "h:mm a")}{" "}
                and sets at {format(sunTimes.sunset, "h:mm a")}, providing{" "}
                {Math.floor(sunTimes.daylightDuration / 60)} hours and {sunTimes.daylightDuration % 60}{" "}
                minutes of daylight.
              </p>
              <p>
                The golden hour, ideal for photography and outdoor activities, occurs between{" "}
                {format(sunTimes.goldenHourStart, "h:mm a")} and {format(sunTimes.goldenHourEnd, "h:mm a")}{" "}
                today. During this period, the sun is low in the sky, creating warm, soft lighting
                conditions. Civil twilight begins at {format(sunTimes.civilDawn, "h:mm a")} and ends
                at {format(sunTimes.civilDusk, "h:mm a")}, offering enough natural light for most
                activities without artificial lighting.
              </p>
              <p>
                Understanding these sun times helps residents and visitors plan their day, whether
                for outdoor recreation, photography, or simply knowing when to expect daylight.
                The times change daily as the Earth orbits the sun, with longer days in summer and
                shorter days in winter.
              </p>
            </div>
          </div>

          <CityLinks cities={relatedCities} currentSlug={slug} />
        </main>
      </div>
    </>
  );
}

