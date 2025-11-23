import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getSunTimes } from "@/lib/sun";
import { getTimezoneForCity } from "@/lib/timezone";
import { createSlug } from "@/lib/slugify";
import citiesData from "@/data/cities.json";
import { formatInTimeZone } from "date-fns-tz";
import { format, parse, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths } from "date-fns";
import Link from "next/link";

interface USCity {
  name: string;
  region: string;
  country: string;
  lat: number;
  lng: number;
  slug: string;
}

const usCities: USCity[] = citiesData as USCity[];

const MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'
] as const;

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
] as const;

interface PageProps {
  params: Promise<{ slug: string; month: string }>;
}

// Let Next generate pages not returned in generateStaticParams (on-demand)
export const dynamicParams = true;

// Rebuild each month page periodically after first request (ISR with 24-hour revalidation)
// Using ISR instead of full static generation to reduce build log size (only ~300 pages prebuilt)
// 86400 seconds = 24 hours
export const revalidate = 86400;

/**
 * Generate static params for only top US cities × all months
 * 
 * NOTE: We only prebuild ~300 monthly pages (top 25 cities × 12 months) instead of all 4,008
 * to avoid hitting Vercel's 4MB build log limit. All other monthly pages are generated
 * on-demand via ISR when first requested, then cached and revalidated daily.
 * This keeps build logs small while maintaining full SEO coverage (all URLs in sitemap).
 */
const TOP_US_CITY_SLUGS = [
  "new-york-ny",
  "los-angeles-ca",
  "chicago-il",
  "houston-tx",
  "phoenix-az",
  "philadelphia-pa",
  "san-antonio-tx",
  "san-diego-ca",
  "dallas-tx",
  "san-jose-ca",
  "austin-tx",
  "jacksonville-fl",
  "fort-worth-tx",
  "columbus-oh",
  "charlotte-nc",
  "san-francisco-ca",
  "indianapolis-in",
  "seattle-wa",
  "denver-co",
  "boston-ma",
  "el-paso-tx",
  "nashville-tn",
  "detroit-mi",
  "portland-or",
  "las-vegas-nv",
];

export async function generateStaticParams() {
  return TOP_US_CITY_SLUGS.flatMap((slug) =>
    MONTHS.map((month) => ({ slug, month }))
  );
}

/**
 * Simple hash function for deterministic content generation
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * Generate unique intro content for city/month combination
 */
function generateMonthIntro(cityName: string, stateName: string, monthName: string, slug: string, month: string): string {
  const seed = hashString(`${slug}-${month}`);
  
  const introTemplates = [
    `${monthName} brings distinct daylight patterns to ${cityName}, ${stateName}. As the month progresses, sunrise and sunset times shift, creating opportunities for different types of outdoor activities and photography sessions.`,
    `Understanding sunrise and sunset times in ${cityName}, ${stateName} during ${monthName} helps residents and visitors plan their days effectively. The month's daylight characteristics reflect the city's geographic location and the Earth's position in its annual orbit.`,
    `${monthName} in ${cityName}, ${stateName} offers unique daylight conditions that change day by day. Whether you're planning morning runs, evening photography, or outdoor events, knowing the exact sun times helps maximize your activities.`,
    `The daylight patterns in ${cityName}, ${stateName} during ${monthName} showcase how sun times evolve throughout the month. These daily changes, though subtle, accumulate to create noticeable differences from the month's start to its end.`,
    `Planning around daylight in ${cityName}, ${stateName} during ${monthName} requires understanding how sunrise and sunset times shift. Each day brings slightly different opportunities for outdoor activities and natural light photography.`,
  ];
  
  const seasonalContext = [
    `During ${monthName}, the region experiences ${monthName.toLowerCase() === 'june' || monthName.toLowerCase() === 'july' ? 'some of the longest days of the year' : monthName.toLowerCase() === 'december' || monthName.toLowerCase() === 'january' ? 'some of the shortest days of the year' : 'moderate day lengths'}.`,
    `${monthName} marks ${monthName.toLowerCase() === 'june' ? 'the peak of summer daylight' : monthName.toLowerCase() === 'december' ? 'the shortest days of winter' : 'a transitional period in daylight patterns'}.`,
    `The daylight characteristics of ${monthName} in ${cityName} reflect ${monthName.toLowerCase() === 'march' || monthName.toLowerCase() === 'september' ? 'the equinox periods' : monthName.toLowerCase() === 'june' ? 'the summer solstice' : monthName.toLowerCase() === 'december' ? 'the winter solstice' : 'seasonal transitions'}.`,
  ];
  
  const goldenHourNotes = [
    `The golden hour occurs twice daily—shortly after sunrise and before sunset—providing ideal lighting conditions for photography. During ${monthName}, these periods shift gradually, offering different timing opportunities throughout the month.`,
    `Photographers and outdoor enthusiasts value the golden hour periods in ${monthName}, when the sun's low angle creates warm, soft light. Understanding when these windows occur helps plan shoots and outdoor activities.`,
    `Both morning and evening golden hours in ${monthName} offer distinct advantages. Morning light tends to be crisp and clear, while evening light often carries warmer tones, making each period valuable for different types of photography and activities.`,
  ];
  
  const practicalUses = [
    `Residents of ${cityName} use ${monthName}'s sun time data for everyday planning. Morning commuters check sunrise times, while evening joggers and cyclists rely on sunset times to plan safe routes before darkness falls.`,
    `Outdoor enthusiasts in ${cityName} benefit from accurate ${monthName} sun times when planning activities like hiking, running, cycling, and beach visits. Understanding when daylight begins and ends helps ensure safety and maximizes enjoyment.`,
    `Event planners and outdoor venue operators in ${cityName} depend on ${monthName}'s sun time data to schedule activities and coordinate lighting. This information helps create better experiences for participants throughout the month.`,
  ];
  
  const closing = [
    `Each day in ${monthName} brings slightly different sunrise and sunset times in ${cityName}, ${stateName}. While the changes may seem small day-to-day, they accumulate throughout the month, creating noticeable differences from the first to the last day.`,
    `The precise timing of sunrise and sunset in ${cityName} during ${monthName} depends on the city's specific coordinates and the Earth's position. Our calculations account for these factors to provide accurate, location-specific data.`,
    `Whether you're a long-time resident or a first-time visitor, understanding ${monthName}'s sun time patterns in ${cityName}, ${stateName} enhances your ability to plan and enjoy activities. The month's daylight characteristics are part of what makes the location unique.`,
  ];
  
  const variations = [
    seed % introTemplates.length,
    (seed + 1) % seasonalContext.length,
    (seed + 2) % goldenHourNotes.length,
    (seed + 3) % practicalUses.length,
    (seed + 4) % closing.length,
  ];
  
  const content = [
    introTemplates[variations[0]],
    seasonalContext[variations[1]],
    goldenHourNotes[variations[2]],
    practicalUses[variations[3]],
    closing[variations[4]],
  ].join(' ');
  
  // Ensure word count is reasonable (300-600 words)
  const words = content.split(/\s+/).length;
  if (words < 300) {
    const additional = `The daily variations in sun times during ${monthName} may seem minor, but they reflect the Earth's continuous motion around the sun. These changes affect everything from energy consumption to mood and daily routines. Understanding these patterns helps residents and visitors make the most of each day's available daylight.`;
    return content + ' ' + additional;
  }
  
  return content;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, month } = await params;
  
  const city = usCities.find((c) => c.slug === slug);
  if (!city) {
    return { title: "City Not Found" };
  }
  
  const monthIndex = MONTHS.indexOf(month as any);
  if (monthIndex === -1) {
    return { title: "Month Not Found" };
  }
  
  const monthName = MONTH_NAMES[monthIndex];
  const title = `${monthName} Sunrise and Sunset Times in ${city.name}, ${city.region} | SunTimesToday`;
  const description = `Find daily sunrise and sunset times for ${city.name}, ${city.region} throughout ${monthName}. Includes golden hour, day length, and detailed sun time information for every day of the month.`;
  const url = `https://suntimestoday.com/sunrise-sunset/${slug}/${month}`;
  
  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "SunTimesToday",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function MonthPage({ params }: PageProps) {
  const { slug, month } = await params;
  
  const city = usCities.find((c) => c.slug === slug);
  if (!city) {
    notFound();
  }
  
  const monthIndex = MONTHS.indexOf(month as any);
  if (monthIndex === -1) {
    notFound();
  }
  
  const monthName = MONTH_NAMES[monthIndex];
  const currentYear = new Date().getFullYear();
  
  // Get month start and end dates
  const monthStart = startOfMonth(new Date(currentYear, monthIndex, 1));
  const monthEnd = endOfMonth(monthStart);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Calculate sun times for each day
  const timezone = getTimezoneForCity(city.region);
  const dailyData = daysInMonth.map((date) => {
    const sunTimes = getSunTimes(city.lat, city.lng, date);
    const isValidDate = (d: Date): boolean => !isNaN(d.getTime());
    
    return {
      date,
      sunrise: isValidDate(sunTimes.sunrise) ? formatInTimeZone(sunTimes.sunrise, timezone, "h:mm a") : "N/A",
      sunset: isValidDate(sunTimes.sunset) ? formatInTimeZone(sunTimes.sunset, timezone, "h:mm a") : "N/A",
      dayLength: sunTimes.daylightDuration,
      morningGoldenHour: isValidDate(sunTimes.morningGoldenHourStart) && isValidDate(sunTimes.morningGoldenHourEnd)
        ? `${formatInTimeZone(sunTimes.morningGoldenHourStart, timezone, "h:mm a")} - ${formatInTimeZone(sunTimes.morningGoldenHourEnd, timezone, "h:mm a")}`
        : "N/A",
      eveningGoldenHour: isValidDate(sunTimes.eveningGoldenHourStart) && isValidDate(sunTimes.eveningGoldenHourEnd)
        ? `${formatInTimeZone(sunTimes.eveningGoldenHourStart, timezone, "h:mm a")} - ${formatInTimeZone(sunTimes.eveningGoldenHourEnd, timezone, "h:mm a")}`
        : "N/A",
      sunTimes,
    };
  });
  
  // Calculate key month stats
  const validSunrises = dailyData.filter(d => d.sunrise !== "N/A");
  const validSunsets = dailyData.filter(d => d.sunset !== "N/A");
  
  let earliestSunrise = validSunrises[0];
  let latestSunrise = validSunrises[0];
  let earliestSunset = validSunsets[0];
  let latestSunset = validSunsets[0];
  
  validSunrises.forEach((day) => {
    if (day.sunTimes.sunrise < earliestSunrise.sunTimes.sunrise) {
      earliestSunrise = day;
    }
    if (day.sunTimes.sunrise > latestSunrise.sunTimes.sunrise) {
      latestSunrise = day;
    }
  });
  
  validSunsets.forEach((day) => {
    if (day.sunTimes.sunset < earliestSunset.sunTimes.sunset) {
      earliestSunset = day;
    }
    if (day.sunTimes.sunset > latestSunset.sunTimes.sunset) {
      latestSunset = day;
    }
  });
  
  const startDayLength = dailyData[0].dayLength;
  const endDayLength = dailyData[dailyData.length - 1].dayLength;
  const dayLengthChange = endDayLength - startDayLength;
  const dayLengthChangeText = dayLengthChange > 0 
    ? `+${Math.floor(dayLengthChange / 60)}h ${dayLengthChange % 60}m`
    : `${Math.floor(dayLengthChange / 60)}h ${Math.abs(dayLengthChange % 60)}m`;
  
  // Generate intro content
  const introContent = generateMonthIntro(city.name, city.region, monthName, slug, month);
  
  // Calculate prev/next month
  const prevMonthDate = subMonths(monthStart, 1);
  const nextMonthDate = addMonths(monthStart, 1);
  const prevMonth = MONTHS[prevMonthDate.getMonth()];
  const nextMonth = MONTHS[nextMonthDate.getMonth()];
  
  // State slug
  const stateSlug = createSlug(city.region);
  
  // Create FAQ JSON-LD
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What are the sunrise times in ${city.name}, ${city.region} during ${monthName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Sunrise times in ${city.name}, ${city.region} during ${monthName} vary throughout the month. The earliest sunrise occurs on ${format(earliestSunrise.date, "MMMM d")} at ${earliestSunrise.sunrise}, while the latest sunrise is on ${format(latestSunrise.date, "MMMM d")} at ${latestSunrise.sunrise}.`,
        },
      },
      {
        "@type": "Question",
        name: `What are the sunset times in ${city.name}, ${city.region} during ${monthName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Sunset times in ${city.name}, ${city.region} during ${monthName} change daily. The earliest sunset occurs on ${format(earliestSunset.date, "MMMM d")} at ${earliestSunset.sunset}, while the latest sunset is on ${format(latestSunset.date, "MMMM d")} at ${latestSunset.sunset}.`,
        },
      },
      {
        "@type": "Question",
        name: `How much does daylight change in ${city.name}, ${city.region} during ${monthName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Daylight in ${city.name}, ${city.region} changes by ${dayLengthChangeText} from the start to the end of ${monthName}. This variation reflects the Earth's position in its orbit and affects daily planning and activities.`,
        },
      },
      {
        "@type": "Question",
        name: `When is the best time for photography in ${city.name}, ${city.region} during ${monthName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The golden hour, ideal for photography, occurs twice daily in ${city.name} during ${monthName}—shortly after sunrise and before sunset. These periods provide warm, soft lighting conditions perfect for capturing stunning images.`,
        },
      },
      {
        "@type": "Question",
        name: `What is the longest day in ${city.name}, ${city.region} during ${monthName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The longest day in ${city.name}, ${city.region} during ${monthName} occurs on ${format(dailyData.reduce((max, d) => d.dayLength > max.dayLength ? d : max, dailyData[0]).date, "MMMM d")}, with ${Math.floor(Math.max(...dailyData.map(d => d.dayLength)) / 60)} hours and ${Math.max(...dailyData.map(d => d.dayLength)) % 60} minutes of daylight.`,
        },
      },
      {
        "@type": "Question",
        name: `What is the shortest day in ${city.name}, ${city.region} during ${monthName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The shortest day in ${city.name}, ${city.region} during ${monthName} occurs on ${format(dailyData.reduce((min, d) => d.dayLength < min.dayLength ? d : min, dailyData[0]).date, "MMMM d")}, with ${Math.floor(Math.min(...dailyData.map(d => d.dayLength)) / 60)} hours and ${Math.min(...dailyData.map(d => d.dayLength)) % 60} minutes of daylight.`,
        },
      },
    ],
  };
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <main className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-4 text-sm">
            <Link href="/" className="text-blue-600 hover:text-blue-800 underline">
              Home
            </Link>
            <span className="mx-2 text-gray-500">→</span>
            <Link href={`/sunrise-sunset/${slug}`} className="text-blue-600 hover:text-blue-800 underline">
              {city.name}, {city.region}
            </Link>
            <span className="mx-2 text-gray-500">→</span>
            <span className="text-gray-700">{monthName}</span>
          </nav>
          
          <h1 className="text-4xl font-bold mb-6 text-gray-900">
            Sunrise and Sunset Times in {city.name}, {city.region} in {monthName}
          </h1>
          
          {/* Intro paragraph */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="prose max-w-none text-gray-700 leading-relaxed">
              <p>{introContent}</p>
            </div>
          </div>
          
          {/* Key Month Stats */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Key {monthName} Statistics
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Earliest sunrise: <strong>{format(earliestSunrise.date, "MMMM d")}</strong> at <strong>{earliestSunrise.sunrise}</strong></span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Latest sunrise: <strong>{format(latestSunrise.date, "MMMM d")}</strong> at <strong>{latestSunrise.sunrise}</strong></span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Earliest sunset: <strong>{format(earliestSunset.date, "MMMM d")}</strong> at <strong>{earliestSunset.sunset}</strong></span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Latest sunset: <strong>{format(latestSunset.date, "MMMM d")}</strong> at <strong>{latestSunset.sunset}</strong></span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Day length change: <strong>{dayLengthChangeText}</strong> from start to end of month</span>
              </li>
            </ul>
          </div>
          
          {/* Daily table */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8 overflow-x-auto">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Daily Sun Times for {monthName} {currentYear}
            </h2>
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900">Date</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900">Sunrise</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900">Sunset</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900">Day Length</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900">Morning Golden Hour</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900">Evening Golden Hour</th>
                </tr>
              </thead>
              <tbody>
                {dailyData.map((day, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="border border-gray-300 px-4 py-2 text-gray-900">{format(day.date, "MMM d")}</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">{day.sunrise}</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">{day.sunset}</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">
                      {Math.floor(day.dayLength / 60)}h {day.dayLength % 60}m
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700 text-sm">{day.morningGoldenHour}</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700 text-sm">{day.eveningGoldenHour}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Month navigation */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <Link
                href={`/sunrise-sunset/${slug}/${prevMonth}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                ← {MONTH_NAMES[prevMonthDate.getMonth()]}
              </Link>
              <h2 className="text-xl font-semibold text-gray-800">Browse Other Months</h2>
              <Link
                href={`/sunrise-sunset/${slug}/${nextMonth}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {MONTH_NAMES[nextMonthDate.getMonth()]} →
              </Link>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {MONTHS.map((m, idx) => (
                <Link
                  key={m}
                  href={`/sunrise-sunset/${slug}/${m}`}
                  className={`px-3 py-2 text-center rounded-lg transition-colors ${
                    m === month
                      ? "bg-blue-600 text-white font-semibold"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {MONTH_NAMES[idx].slice(0, 3)}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Internal links */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Related Pages</h2>
            <div className="space-y-2">
              <Link
                href={`/sunrise-sunset/${slug}`}
                className="block text-blue-600 hover:text-blue-800 underline"
              >
                ← Back to {city.name}, {city.region} main page
              </Link>
              <Link
                href={`/sunrise-sunset/${stateSlug}`}
                className="block text-blue-600 hover:text-blue-800 underline"
              >
                View all cities in {city.region}
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

