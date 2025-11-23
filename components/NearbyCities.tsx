import Link from "next/link";
import { NearbyResult } from "@/lib/geo";

interface NearbyCitiesProps {
  title: string;
  subtitle?: string;
  cities: NearbyResult[];
}

export default function NearbyCities({ title, subtitle, cities }: NearbyCitiesProps) {
  if (!cities || cities.length === 0) {
    return null;
  }

  return (
    <section className="bg-white rounded-lg shadow-md p-8 mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">{title}</h2>
      {subtitle && (
        <p className="text-gray-600 mb-6 text-sm">{subtitle}</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cities.map((city) => {
          const cityName = city.name || city.city || "Unknown";
          const displayRegion = city.region || city.admin1 || city.country || "";
          const distanceText = city.distanceKm < 1 
            ? "< 1 km away" 
            : `~${Math.round(city.distanceKm)} km away`;

          return (
            <Link
              key={city.slug}
              href={`/sunrise-sunset/${city.slug}`}
              className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all duration-200"
              aria-label={`Sunrise and sunset times in ${cityName}, ${displayRegion}`}
            >
              <div className="font-medium text-gray-900 mb-1">{cityName}</div>
              {displayRegion && (
                <div className="text-sm text-gray-600 mb-1">{displayRegion}</div>
              )}
              <div className="text-xs text-gray-500">{distanceText}</div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

