import { Metadata } from "next";
import { CitySearch } from "@/components/CitySearch";
import { NearMeButton } from "@/components/NearMeButton";

export const metadata: Metadata = {
  title: "Sunrise & Sunset Near Me | SunTimesToday",
  description: "Find sunrise and sunset times for the city nearest to you using your browser's location. We'll find the closest city and show you accurate sun time data.",
  alternates: {
    canonical: "https://suntimestoday.com/sunrise-sunset/near-me",
  },
  openGraph: {
    title: "Sunrise & Sunset Near Me | SunTimesToday",
    description: "Find sunrise and sunset times for the city nearest to you using your browser's location.",
    url: "https://suntimestoday.com/sunrise-sunset/near-me",
    siteName: "SunTimesToday",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Sunrise & Sunset Near Me | SunTimesToday",
    description: "Find sunrise and sunset times for the city nearest to you using your browser's location.",
  },
};

export default function NearMePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-gray-900 text-center">
          Sunrise and Sunset Times Near You
        </h1>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <p className="text-lg text-gray-700 leading-relaxed mb-6 text-center">
            We&apos;ll use your browser&apos;s location to find the closest city and show you 
            accurate sunrise and sunset times. Your location is never stored or shared.
          </p>

          <div className="mb-8">
            <NearMeButton variant="primary" label="Use My Location" />
          </div>

          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
              Or Search for a City
            </h2>
            <CitySearch />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            How It Works
          </h2>
          <p className="text-gray-700 leading-relaxed">
            When you click &quot;Use My Location,&quot; your browser will ask for permission to access 
            your location. We use this to find the nearest city in our database and redirect you to 
            that city&apos;s sunrise and sunset times page. Your exact location is never stored, 
            transmitted to our servers, or shared with third parties. All processing happens in your browser.
          </p>
        </div>
      </main>
    </div>
  );
}

