import { Metadata } from "next";
import { CitySearchAutocomplete } from "@/components/CitySearchAutocomplete";
import { NearMeButton } from "@/components/NearMeButton";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sunrise & Sunset Times by City | SunTimesToday",
  description: "Search for sunrise and sunset times in any city worldwide. Find accurate sun time data, golden hour, and twilight information for your location.",
  alternates: {
    canonical: "https://suntimestoday.com/sunrise-sunset",
  },
  openGraph: {
    title: "Sunrise & Sunset Times by City | SunTimesToday",
    description: "Search for sunrise and sunset times in any city worldwide.",
    url: "https://suntimestoday.com/sunrise-sunset",
    siteName: "SunTimesToday",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Sunrise & Sunset Times by City | SunTimesToday",
    description: "Search for sunrise and sunset times in any city worldwide.",
  },
};

export default function SunriseSunsetSearchPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-gray-900 text-center">
          Sunrise and Sunset Times by City
        </h1>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <p className="text-lg text-gray-700 leading-relaxed mb-6 text-center">
            Search for any city to find accurate sunrise and sunset times, plus golden hour and twilight information.
          </p>

          <div className="mb-8">
            <CitySearchAutocomplete />
          </div>

          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
              Or Use Your Location
            </h2>
            <p className="text-gray-600 mb-4 text-center">
              Find sunrise and sunset times for the city nearest to you using your browser&apos;s location.
            </p>
            <div className="flex justify-center">
              <NearMeButton variant="primary" label="Use My Location" />
            </div>
            <p className="text-sm text-gray-500 mt-4 text-center">
              Or visit <Link href="/sunrise-sunset/near-me" className="text-blue-600 hover:text-blue-800 underline">our near me page</Link> for more options.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

