import Link from "next/link";

interface City {
  name: string;
  region: string;
  country: string;
  slug: string;
}

interface CityLinksProps {
  cities: City[];
  currentSlug?: string;
}

export function CityLinks({ cities, currentSlug }: CityLinksProps) {
  const displayCities = cities.filter((city) => city.slug !== currentSlug).slice(0, currentSlug ? 5 : 6);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">
        {currentSlug ? "Related Cities" : "Popular Cities"}
      </h2>
      <ul className="list-disc list-inside space-y-2">
        {displayCities.map((city) => (
          <li key={city.slug}>
            <Link
              href={`/sunrise-sunset/${city.slug}`}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              {city.name}, {city.region}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

