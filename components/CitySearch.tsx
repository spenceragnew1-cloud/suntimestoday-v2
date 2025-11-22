"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
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

export function CitySearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Extract state abbreviation from slug (e.g., "madison-wi" -> "wi")
  const getStateAbbr = (slug: string): string => {
    const parts = slug.split("-");
    return parts[parts.length - 1] || "";
  };

  // Filter cities based on query
  const filteredCities = useMemo(() => {
    if (!query.trim()) return [];

    const normalizedQuery = query.trim().toLowerCase();

    return cities
      .filter((city) => {
        const cityName = city.name.toLowerCase();
        const stateName = city.region.toLowerCase();
        const stateAbbr = getStateAbbr(city.slug).toLowerCase();

        return (
          cityName.includes(normalizedQuery) ||
          stateName.includes(normalizedQuery) ||
          stateAbbr.includes(normalizedQuery)
        );
      })
      .slice(0, 10);
  }, [query]);

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
    <div className="relative w-full max-w-2xl mx-auto mb-8">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder="Search a city (e.g., Madison or WI)"
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
                  key={city.slug}
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
                  <div className="font-medium">{city.name}</div>
                  <div className="text-sm text-gray-600">{city.region}</div>
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

