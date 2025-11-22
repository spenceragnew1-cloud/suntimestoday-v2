import { getSunTimes } from "@/lib/sun";
import { SunTimesTable } from "@/components/SunTimesTable";
import { CityLinks } from "@/components/CityLinks";
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
          <SunTimesTable sunTimes={sunTimes} />
        </div>

        <CityLinks cities={cities} />
      </main>
    </div>
  );
}
