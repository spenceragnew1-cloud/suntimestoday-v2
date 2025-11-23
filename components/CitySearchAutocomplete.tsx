"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import citiesData from "@/data/cities.json";
import globalCitiesData from "@/data/global-cities.json";

interface USCity {
  name: string;
  region: string;
  country: string;
  lat: number;
  lng: number;
  slug: string;
}

interface GlobalCity {
  city: string;
  country: string;
  admin1?: string;
  lat: number;
  lng: number;
  slug: string;
}

interface SearchResult {
  label: string;
  slug: string;
  lat: number;
  lng: number;
  type: "us" | "global";
  cityName: string;
  region?: string;
  country: string;
}

const usCities: USCity[] = citiesData as USCity[];
const globalCities: GlobalCity[] = globalCitiesData as GlobalCity[];

/**
 * Create unified search index from US and global cities
 */
function createSearchIndex(): SearchResult[] {
  const results: SearchResult[] = [];

  // Add US cities
  usCities.forEach((city) => {
    results.push({
      label: `${city.name}, ${city.region}`,
      slug: city.slug,
      lat: city.lat,
      lng: city.lng,
      type: "us",
      cityName: city.name,
      region: city.region,
      country: city.country,
    });
  });

  // Add global cities
  globalCities.forEach((city) => {
    const label = city.admin1
      ? `${city.city}, ${city.admin1}, ${city.country}`
      : `${city.city}, ${city.country}`;
    
    results.push({
      label,
      slug: city.slug,
      lat: city.lat,
      lng: city.lng,
      type: "global",
      cityName: city.city,
      region: city.admin1,
      country: city.country,
    });
  });

  return results;
}

interface CitySearchAutocompleteProps {
  placeholder?: string;
  className?: string;
}

export function CitySearchAutocomplete({
  placeholder = "Search a city (e.g., London, Paris, Madison, Sydney)",
  className = "",
}: CitySearchAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Create search index once
  const searchIndex = useMemo(() => createSearchIndex(), []);

  // Filter and rank cities based on query
  const filteredCities = useMemo(() => {
    if (!query.trim()) return [];

    const normalizedQuery = query.trim().toLowerCase();
    const results: (SearchResult & { score: number })[] = [];

    searchIndex.forEach((city) => {
      const cityNameLower = city.cityName.toLowerCase();
      const labelLower = city.label.toLowerCase();
      const countryLower = city.country.toLowerCase();
      const regionLower = city.region?.toLowerCase() || "";

      // Check if matches
      const matchesCity = cityNameLower.includes(normalizedQuery);
      const matchesCountry = countryLower.includes(normalizedQuery);
      const matchesRegion = regionLower.includes(normalizedQuery);
      const matchesLabel = labelLower.includes(normalizedQuery);

      if (matchesCity || matchesCountry || matchesRegion || matchesLabel) {
        let score = 0;

        // Prioritize exact prefix matches
        if (cityNameLower.startsWith(normalizedQuery)) {
          score += 100;
        } else if (cityNameLower.includes(normalizedQuery)) {
          score += 50;
        }

        // Boost US cities slightly (they're more common)
        if (city.type === "us") {
          score += 10;
        }

        // Boost if country matches
        if (matchesCountry) {
          score += 5;
        }

        results.push({ ...city, score });
      }
    });

    // Sort by score (highest first), then alphabetically
    return results
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return a.cityName.localeCompare(b.cityName);
      })
      .slice(0, 10)
      .map(({ score, ...city }) => city);
  }, [query, searchIndex]);

  // Reset highlighted index when results change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [filteredCities.length]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && filteredCities.length > 0 && (e.key === "ArrowDown" || e.key === "Enter")) {
      setIsOpen(true);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIsOpen(true);
      setHighlightedIndex((prev) =>
        prev < filteredCities.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      const city = filteredCities[highlightedIndex];
      if (city) {
        router.push(`/sunrise-sunset/${city.slug}`);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setHighlightedIndex(-1);
      inputRef.current?.blur();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
  };

  const handleCityClick = (slug: string) => {
    router.push(`/sunrise-sunset/${slug}`);
    setQuery("");
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    if (filteredCities.length > 0) {
      setIsOpen(true);
    }
  };

  const handleInputBlur = (e: React.FocusEvent) => {
    // Delay closing to allow click events on dropdown items
    setTimeout(() => {
      if (!dropdownRef.current?.contains(document.activeElement)) {
        setIsOpen(false);
      }
    }, 200);
  };

  return (
    <div className={`relative w-full max-w-2xl mx-auto ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          aria-label="Search for a city"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          role="combobox"
        />
      </div>

      {isOpen && query.trim() && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto"
          role="listbox"
        >
          {filteredCities.length > 0 ? (
            <ul className="py-1">
              {filteredCities.map((city, index) => (
                <li
                  key={`${city.type}-${city.slug}`}
                  className={`px-4 py-3 cursor-pointer transition-colors ${
                    index === highlightedIndex
                      ? "bg-blue-100 text-blue-900"
                      : "hover:bg-gray-100 text-gray-900"
                  }`}
                  onClick={() => handleCityClick(city.slug)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  role="option"
                  aria-selected={index === highlightedIndex}
                >
                  <div className="font-medium">{city.cityName}</div>
                  <div className="text-sm text-gray-600">{city.label}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 text-gray-500 text-center">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

