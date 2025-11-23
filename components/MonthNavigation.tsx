"use client";

import { useState } from "react";
import Link from "next/link";

interface MonthNavigationProps {
  slug: string;
  currentMonth: string;
  prevMonth: string;
  nextMonth: string;
  prevMonthName: string;
  nextMonthName: string;
  months: readonly string[];
  monthNames: readonly string[];
}

export function MonthNavigation({
  slug,
  currentMonth,
  prevMonth,
  nextMonth,
  prevMonthName,
  nextMonthName,
  months,
  monthNames,
}: MonthNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md p-8 mb-8">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <Link
          href={`/sunrise-sunset/${slug}/${prevMonth}`}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base font-medium w-full sm:w-auto text-center"
        >
          ← {prevMonthName}
        </Link>
        <h2 className="text-xl font-semibold text-gray-800">Browse Other Months</h2>
        <Link
          href={`/sunrise-sunset/${slug}/${nextMonth}`}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base font-medium w-full sm:w-auto text-center"
        >
          {nextMonthName} →
        </Link>
      </div>
      
      {/* Mobile: Collapsible accordion */}
      <div className="block sm:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors text-left font-medium flex items-center justify-between"
          aria-expanded={isOpen}
        >
          <span>Browse all months</span>
          <span className="text-xl">{isOpen ? "−" : "+"}</span>
        </button>
        {isOpen && (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {months.map((m, idx) => (
              <Link
                key={m}
                href={`/sunrise-sunset/${slug}/${m}`}
                className={`px-3 py-2 text-center rounded-lg transition-colors text-sm ${
                  m === currentMonth
                    ? "bg-blue-600 text-white font-semibold"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {monthNames[idx].slice(0, 3)}
              </Link>
            ))}
          </div>
        )}
      </div>
      
      {/* Desktop: Always visible grid */}
      <div className="hidden sm:grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {months.map((m, idx) => (
          <Link
            key={m}
            href={`/sunrise-sunset/${slug}/${m}`}
            className={`px-3 py-2 text-center rounded-lg transition-colors ${
              m === currentMonth
                ? "bg-blue-600 text-white font-semibold"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {monthNames[idx].slice(0, 3)}
          </Link>
        ))}
      </div>
    </div>
  );
}

