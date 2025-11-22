"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import citiesData from "@/data/cities.json";
import { findNearestCity } from "@/lib/geo";

interface City {
  name: string;
  region: string;
  country: string;
  lat: number;
  lng: number;
  slug: string;
}

const cities: City[] = citiesData as City[];

interface NearMeButtonProps {
  variant?: "primary" | "inline";
  label?: string;
}

export function NearMeButton({
  variant = "primary",
  label,
}: NearMeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleClick = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const nearestCity = findNearestCity(latitude, longitude, cities);

        if (nearestCity) {
          router.push(`/sunrise-sunset/${nearestCity.slug}`);
        } else {
          setError("Could not find a nearby city.");
          setIsLoading(false);
        }
      },
      (err) => {
        if (err.code === 1) {
          // Permission denied
          router.push("/sunrise-sunset/near-me");
        } else {
          setError("Unable to get your location. Please try again.");
        }
        setIsLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  if (variant === "inline") {
    return (
      <div className="inline-block">
        <button
          onClick={handleClick}
          disabled={isLoading}
          className="text-blue-600 hover:text-blue-800 underline text-sm disabled:opacity-50"
          aria-label="Use my location to find the nearest city"
        >
          {isLoading ? "Finding location..." : label || "Use my location"}
        </button>
        {error && (
          <span className="ml-2 text-sm text-red-600" role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="text-center">
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
        aria-label="Use my location to find sunrise and sunset times near me"
      >
        {isLoading ? "Finding your location..." : label || "Use My Location"}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {!navigator.geolocation && (
        <p className="mt-2 text-sm text-gray-500">
          Geolocation is not supported by your browser.
        </p>
      )}
    </div>
  );
}

