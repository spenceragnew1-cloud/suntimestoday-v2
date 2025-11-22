import { getSunTimes } from "@/lib/sun";
import { SunTimesTable } from "@/components/SunTimesTable";
import { CityLinks } from "@/components/CityLinks";
import { getTimezoneForCity } from "@/lib/timezone";
import Link from "next/link";
import citiesData from "@/data/cities.json";

interface City {
  name: string;
  region: string;
  country: string;
  lat: number;
  lng: number;
  slug: string;
}

const cities: City[] = citiesData as City[];

export default function Home() {
  const defaultCity = cities[0];
  const today = new Date();
  const sunTimes = getSunTimes(defaultCity.lat, defaultCity.lng, today);
  const timezone = getTimezoneForCity(defaultCity.region);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">
          Sun Times Today
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Today&apos;s Sun Times in {defaultCity.name}, {defaultCity.region}
          </h2>
          <SunTimesTable sunTimes={sunTimes} timezone={timezone} />
        </div>

        <CityLinks cities={cities} />

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Browse All Cities
          </h2>
          <details open className="mt-4">
            <summary className="cursor-pointer text-lg font-medium text-gray-700 mb-4">
              View all {cities.length} cities (A-Z)
            </summary>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-4">
              {cities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/sunrise-sunset/${city.slug}`}
                  className="text-blue-600 hover:text-blue-800 underline"
                  aria-label={`Sunrise and sunset times in ${city.name}, ${city.region}`}
                >
                  {city.name}, {city.region}
                </Link>
              ))}
            </div>
          </details>
        </div>

      </main>
    </div>
  );
}
