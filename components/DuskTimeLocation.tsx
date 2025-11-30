"use client";

import { useState, useEffect } from "react";
import { getSunTimes } from "@/lib/sun";
import { findNearestCity } from "@/lib/geo";
import { getTimezoneForCity } from "@/lib/timezone";
import { format } from "date-fns-tz";
import citiesData from "@/data/cities.json";
import globalCitiesData from "@/data/global-cities.json";

interface City {
  name: string;
  region: string;
  country: string;
  lat: number;
  lng: number;
  slug: string;
}

const allCities: City[] = [
  ...(citiesData as City[]),
  ...(globalCitiesData as any[]).map((gc: any) => ({
    name: gc.city,
    region: gc.admin1 || gc.country,
    country: gc.country,
    lat: gc.lat,
    lng: gc.lng,
    slug: gc.slug,
  })),
];

export function DuskTimeLocation() {
  const [cityName, setCityName] = useState<string | null>(null);
  const [duskTime, setDuskTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const nearestCity = findNearestCity(latitude, longitude, allCities);

        if (nearestCity) {
          const today = new Date();
          const sunTimes = getSunTimes(nearestCity.lat, nearestCity.lng, today);
          const timezone = getTimezoneForCity(nearestCity.region || '', nearestCity.country);
          
          // Use civil dusk as the standard "dusk" time
          const dusk = sunTimes.civilDusk;
          
          if (dusk && !isNaN(dusk.getTime())) {
            const formattedDusk = format(dusk, "h:mm a", { timeZone: timezone });
            setCityName(`${nearestCity.name}, ${nearestCity.region}`);
            setDuskTime(formattedDusk);
          } else {
            setError("Could not calculate dusk time.");
          }
        } else {
          setError("Could not find a nearby city.");
        }
        setIsLoading(false);
      },
      (err) => {
        if (err.code === 1) {
          // Permission denied - don't show error, just don't display location
          setError(null);
        } else {
          setError("Unable to get your location.");
        }
        setIsLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 300000, // 5 minutes
      }
    );
  }, []);

  if (isLoading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
        <p className="text-blue-800">Finding your location...</p>
      </div>
    );
  }

  if (error && error !== null) {
    return null; // Don't show error, just don't display the location section
  }

  if (cityName && duskTime) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
        <p className="text-lg text-gray-800">
          Based on your location, dusk in <strong>{cityName}</strong> is at <strong>{duskTime}</strong> today.
        </p>
      </div>
    );
  }

  return null;
}

