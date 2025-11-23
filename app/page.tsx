import { getSunTimes } from "@/lib/sun";
import { SunTimesTable } from "@/components/SunTimesTable";
import { CityLinks } from "@/components/CityLinks";
import { CitySearchAutocomplete } from "@/components/CitySearchAutocomplete";
import { NearMeButton } from "@/components/NearMeButton";
import { getTimezoneForCity } from "@/lib/timezone";
import Link from "next/link";
import citiesData from "@/data/cities.json";
import globalCitiesData from "@/data/global-cities.json";
import countriesData from "@/data/countries.json";

interface City {
  name: string;
  region: string;
  country: string;
  lat: number;
  lng: number;
  slug: string;
}

const usCities: City[] = citiesData as City[];
const globalCities = globalCitiesData as any[];
const countries = countriesData as any[];
const totalCities = usCities.length + globalCities.length;

export default function Home() {
  const defaultCity = usCities[0];
  const today = new Date();
  const sunTimes = getSunTimes(defaultCity.lat, defaultCity.lng, today);
  const timezone = getTimezoneForCity(defaultCity.region);

  // Select 12 major cities for Popular Cities section (mix of US and global)
  const popularCities = [
    ...usCities.slice(0, 8),
    ...globalCities.slice(0, 4).map((gc: any) => ({
      name: gc.city,
      region: gc.admin1 || gc.country,
      country: gc.country,
      slug: gc.slug,
    })),
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <main className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 text-gray-900">
            Sunrise and Sunset Times Worldwide
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
            SunTimesToday provides daily sunrise, sunset, golden hour, and twilight data for cities across the world. 
            Whether you&apos;re planning outdoor activities, photography sessions, or simply want to know when daylight begins and ends, 
            we offer accurate, location-specific sun time information updated daily. Search for any city worldwide using the search bar below.
          </p>
          
          {/* City Search */}
          <CitySearchAutocomplete />
          
          {/* Near Me Button */}
          <div className="mt-6">
            <NearMeButton variant="primary" label="Sunrise/Sunset Near Me" />
          </div>
          
          <div className="mt-8 space-y-4 text-base text-gray-700 max-w-3xl mx-auto leading-relaxed">
            <p>
              Sunrise and sunset times mark when the sun appears and disappears on the horizon each day. 
              These times change throughout the year based on your location&apos;s latitude and the Earth&apos;s tilt, 
              with longer days in summer and shorter days in winter. People rely on this information for photography planning, 
              scheduling outdoor runs and hikes, coordinating events, and understanding daylight patterns in their area.
            </p>
            <p>
              Golden hour refers to the period shortly after sunrise or before sunset when the sun is low in the sky, 
              creating warm, soft lighting ideal for photography. Civil twilight occurs when there&apos;s enough natural light 
              for most activities, while nautical twilight provides dimmer light for navigation. Astronomical twilight marks 
              the transition between night and day, important for stargazing and astronomical observations.
            </p>
          </div>
        </div>

        {/* Popular Cities Section */}
        <section className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">
            Popular Cities
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {popularCities.map((city) => (
              <Link
                key={city.slug}
                href={`/sunrise-sunset/${city.slug}`}
                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all duration-200"
                aria-label={`Sunrise and sunset times in ${city.name}, ${city.region}`}
              >
                <div className="font-semibold text-gray-900 mb-1">{city.name}</div>
                <div className="text-sm text-gray-600">{city.region}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Browse All Cities Section */}
        <section className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">
            Browse All Cities
          </h2>
          <details className="mt-4">
            <summary className="cursor-pointer text-lg font-medium text-gray-700 mb-4 hover:text-blue-600 transition-colors">
              View all {totalCities} cities (A-Z)
            </summary>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-6 pt-6 border-t border-gray-200">
              {usCities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/sunrise-sunset/${city.slug}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline transition-colors py-1"
                  aria-label={`Sunrise and sunset times in ${city.name}, ${city.region}`}
                >
                  {city.name}, {city.region}
                </Link>
              ))}
              {globalCities.map((city: any) => (
                <Link
                  key={city.slug}
                  href={`/sunrise-sunset/${city.slug}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline transition-colors py-1"
                  aria-label={`Sunrise and sunset times in ${city.city}, ${city.country}`}
                >
                  {city.city}, {city.admin1 || city.country}
                </Link>
              ))}
            </div>
          </details>
        </section>

        {/* Browse by Country Section */}
        <section className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">
            Browse by Country
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {countries.map((country: any) => (
              <Link
                key={country.countrySlug}
                href={`/sunrise-sunset/${country.countrySlug}`}
                className="block p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-sm transition-all duration-200 text-center"
                aria-label={`Sunrise and sunset times in ${country.country}`}
              >
                <div className="font-medium text-gray-900">{country.country}</div>
                <div className="text-sm text-gray-600 mt-1">{country.cities.length} cities</div>
              </Link>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">
            How It Works
          </h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Our sun time data is updated daily to ensure accuracy throughout the year. 
              Each city page provides precise sunrise and sunset times, along with golden hour periods 
              (the optimal time for photography with warm, soft lighting) and civil twilight times 
              (when there&apos;s enough natural light for most outdoor activities).
            </p>
            <p>
              This tool is especially valuable for photographers seeking the perfect lighting conditions, 
              outdoor enthusiasts planning activities around daylight hours, and anyone who wants to make 
              the most of their day. All times are calculated based on your city&apos;s exact geographic coordinates 
              and adjusted for your local timezone.
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}
