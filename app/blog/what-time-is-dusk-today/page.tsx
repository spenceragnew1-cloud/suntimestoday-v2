import { Metadata } from "next";
import Link from "next/link";
import { DuskTimeLocation } from "@/components/DuskTimeLocation";

export const metadata: Metadata = {
  title: "What Time Is Dusk Today? | Today's Dusk & Evening Light Guide",
  description: "Find out what time dusk is today based on your location. Learn the difference between dusk, civil dusk, and nautical dusk — plus golden hour details.",
  openGraph: {
    title: "What Time Is Dusk Today? | Today's Dusk & Evening Light Guide",
    description: "Find out what time dusk is today based on your location. Learn the difference between dusk, civil dusk, and nautical dusk — plus golden hour details.",
    type: "article",
    url: "https://suntimestoday.com/blog/what-time-is-dusk-today",
  },
  twitter: {
    card: "summary",
    title: "What Time Is Dusk Today? | Today's Dusk & Evening Light Guide",
    description: "Find out what time dusk is today based on your location. Learn the difference between dusk, civil dusk, and nautical dusk — plus golden hour details.",
  },
  alternates: {
    canonical: "https://suntimestoday.com/blog/what-time-is-dusk-today",
  },
};

export default function WhatTimeIsDuskTodayBlogPost() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What time is dusk today?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Dusk time varies by location and changes daily. Civil dusk typically occurs 20-30 minutes after sunset, when the sun is 6 degrees below the horizon. To find dusk time for your city today, use SunTimesToday to look up your location's sunset time and add approximately 20-30 minutes."
        }
      },
      {
        "@type": "Question",
        "name": "What is the difference between dusk and sunset?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sunset is the exact moment when the sun disappears below the horizon. Dusk is the period of twilight that follows sunset, when there's still some light in the sky but the sun is below the horizon. Civil dusk occurs when the sun is 6 degrees below the horizon, typically 20-30 minutes after sunset."
        }
      },
      {
        "@type": "Question",
        "name": "What is civil dusk vs nautical dusk vs astronomical dusk?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Civil dusk occurs when the sun is 6 degrees below the horizon - this is when most people consider it 'dusk' and streetlights turn on. Nautical dusk happens when the sun is 12 degrees below the horizon - the horizon is still visible at sea. Astronomical dusk occurs when the sun is 18 degrees below the horizon - this is when the sky is fully dark and stars are clearly visible."
        }
      },
      {
        "@type": "Question",
        "name": "How long does dusk last?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Civil dusk typically lasts about 20-30 minutes, ending when nautical dusk begins. The total twilight period from sunset to full darkness (astronomical dusk) can last 60-90 minutes depending on your latitude and the time of year."
        }
      },
      {
        "@type": "Question",
        "name": "Is dusk the same as twilight?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, dusk is part of twilight. Dusk specifically refers to evening twilight - the period after sunset when there's still light in the sky. Morning twilight before sunrise is called dawn. Both are periods when the sun is below the horizon but still provides some illumination."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <article className="max-w-3xl mx-auto space-y-6">
          {/* Breadcrumb */}
          <nav className="mb-4 text-sm">
            <Link href="/" className="text-blue-600 hover:text-blue-800 underline">
              Home
            </Link>
            <span className="mx-2 text-gray-500">→</span>
            <Link href="/blog" className="text-blue-600 hover:text-blue-800 underline">
              Blog
            </Link>
            <span className="mx-2 text-gray-500">→</span>
            <span className="text-gray-700">What Time Is Dusk Today?</span>
          </nav>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            What Time Is Dusk Today?
          </h1>

          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
            <p className="text-lg">
              If you&apos;ve ever wondered &quot;what time is dusk today?&quot; you&apos;re not alone. Dusk time changes every day and varies by location, making it tricky to plan evening activities, photography sessions, or simply know when the streetlights will turn on.
            </p>

            <p>
              In this guide, we&apos;ll explain what dusk is, how it differs from sunset, and how to quickly find dusk time for your city today. We&apos;ll also break down the different types of dusk—civil dusk, nautical dusk, and astronomical dusk—so you know exactly what to expect as evening turns into night.
            </p>

            <DuskTimeLocation />

            <hr className="my-8 border-gray-300" />

            <h2 className="text-3xl font-semibold text-gray-900 mt-8 mb-4">
              What Is Dusk?
            </h2>

            <p>
              Dusk is the period of twilight that happens after sunset, when the sun has disappeared below the horizon but there&apos;s still some light in the sky. It&apos;s that beautiful, soft time of day when the sky glows with orange, pink, and purple colors before fading to full darkness.
            </p>

            <p>
              Many people use the word &quot;dusk&quot; to mean the moment when it starts getting noticeably dark, but astronomers actually define dusk more precisely. There are three types of dusk, each marking a different stage of evening twilight.
            </p>

            <hr className="my-8 border-gray-300" />

            <h2 className="text-3xl font-semibold text-gray-900 mt-8 mb-4">
              Dusk vs Sunset: What&apos;s the Difference?
            </h2>

            <p>
              Sunset and dusk are related but different:
            </p>

            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Sunset</strong> is the exact moment when the sun disappears below the horizon. It&apos;s a specific time, like 6:42 PM.</li>
              <li><strong>Dusk</strong> is the period of twilight that follows sunset. It&apos;s not a single moment but a window of time when there&apos;s still light in the sky.</li>
            </ul>

            <p>
              Think of it this way: sunset is when the sun goes down, and dusk is what happens next. Dusk time typically begins about 20-30 minutes after sunset, though this varies by location and season.
            </p>

            <p>
              If you want to find both sunset and dusk times for your area, check out <Link href="/" className="text-blue-600 hover:text-blue-800 underline">SunTimesToday</Link> for accurate, location-specific information.
            </p>

            <hr className="my-8 border-gray-300" />

            <h2 className="text-3xl font-semibold text-gray-900 mt-8 mb-4">
              Types of Dusk: Civil, Nautical, and Astronomical
            </h2>

            <p>
              Astronomers divide dusk into three stages based on how far the sun is below the horizon. Each stage has different characteristics and uses:
            </p>

            <div className="overflow-x-auto my-6">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Type of Dusk</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Sun Position</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">When It Happens</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">What You&apos;ll See</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 font-medium">Civil Dusk</td>
                    <td className="border border-gray-300 px-4 py-3">6° below horizon</td>
                    <td className="border border-gray-300 px-4 py-3">20-30 min after sunset</td>
                    <td className="border border-gray-300 px-4 py-3">Bright enough to read outside; streetlights turn on</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-medium">Nautical Dusk</td>
                    <td className="border border-gray-300 px-4 py-3">12° below horizon</td>
                    <td className="border border-gray-300 px-4 py-3">40-50 min after sunset</td>
                    <td className="border border-gray-300 px-4 py-3">Horizon still visible at sea; too dark to read</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 font-medium">Astronomical Dusk</td>
                    <td className="border border-gray-300 px-4 py-3">18° below horizon</td>
                    <td className="border border-gray-300 px-4 py-3">60-90 min after sunset</td>
                    <td className="border border-gray-300 px-4 py-3">Fully dark; stars clearly visible</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-2xl font-semibold text-gray-900 mt-6 mb-3">
              Civil Dusk
            </h3>

            <p>
              Civil dusk is what most people mean when they say &quot;dusk.&quot; It occurs when the sun is 6 degrees below the horizon, typically 20-30 minutes after sunset. At civil dusk:
            </p>

            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>There&apos;s still enough light to see clearly without artificial lighting</li>
              <li>Streetlights and outdoor lights typically turn on automatically</li>
              <li>The sky often shows beautiful orange and pink colors</li>
              <li>It&apos;s still bright enough to read a book outside</li>
            </ul>

            <p>
              This is the most practical &quot;dusk time&quot; for planning evening activities. If someone asks &quot;what time is dusk today?&quot; they&apos;re usually asking about civil dusk.
            </p>

            <h3 className="text-2xl font-semibold text-gray-900 mt-6 mb-3">
              Nautical Dusk
            </h3>

            <p>
              Nautical dusk happens when the sun is 12 degrees below the horizon, usually 40-50 minutes after sunset. The name comes from navigation—at this point, sailors can still see the horizon line at sea, which helps with navigation using stars.
            </p>

            <p>
              At nautical dusk, it&apos;s noticeably darker. You&apos;ll need artificial light to read, and the brightest stars start becoming visible. The sky transitions from the warm colors of civil dusk to deeper blues and purples.
            </p>

            <h3 className="text-2xl font-semibold text-gray-900 mt-6 mb-3">
              Astronomical Dusk
            </h3>

            <p>
              Astronomical dusk occurs when the sun is 18 degrees below the horizon, typically 60-90 minutes after sunset. This marks the end of twilight and the beginning of true night.
            </p>

            <p>
              At astronomical dusk, the sky is fully dark. All but the faintest stars are visible, making it the best time for stargazing and astronomy. Light pollution from cities can make it harder to reach true astronomical darkness, but in rural areas, this is when the night sky really comes alive.
            </p>

            <hr className="my-8 border-gray-300" />

            <h2 className="text-3xl font-semibold text-gray-900 mt-8 mb-4">
              How to Find Dusk Time for Your City Today
            </h2>

            <p>
              Since dusk time changes daily and varies by location, the easiest way to find it is to use accurate sun time data for your city. Here&apos;s how:
            </p>

            <ol className="list-decimal list-inside space-y-3 ml-4">
              <li>
                <strong>Look up your city&apos;s sunset time.</strong>
                <br />
                <span className="ml-6">Use <Link href="/sunrise-sunset-near-me" className="text-blue-600 hover:text-blue-800 underline">SunTimesToday&apos;s location finder</Link> or search for your specific city.</span>
              </li>
              <li>
                <strong>Add 20-30 minutes to sunset time.</strong>
                <br />
                <span className="ml-6">This gives you a good estimate for civil dusk time. For example, if sunset is at 6:15 PM, civil dusk is approximately 6:35-6:45 PM.</span>
              </li>
              <li>
                <strong>Check the exact dusk times on SunTimesToday.</strong>
                <br />
                <span className="ml-6">Many city pages show civil dusk, nautical dusk, and astronomical dusk times directly, so you don&apos;t have to calculate them yourself.</span>
              </li>
            </ol>

            <p>
              The exact dusk time depends on your latitude (how far north or south you are) and the time of year. In summer, dusk can last longer, especially at higher latitudes. In winter, dusk happens earlier and may be shorter.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
              <p className="text-lg font-semibold text-gray-900 mb-2">
                View Dusk Time in Your City
              </p>
              <p className="text-gray-700 mb-4">
                Get accurate dusk times for your location, updated daily.
              </p>
              <Link
                href="/sunrise-sunset-near-me"
                className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              >
                View Dusk Time in Your City
              </Link>
            </div>

            <hr className="my-8 border-gray-300" />

            <h2 className="text-3xl font-semibold text-gray-900 mt-8 mb-4">
              Dusk and Golden Hour
            </h2>

            <p>
              Dusk and <Link href="/blog/golden-hour" className="text-blue-600 hover:text-blue-800 underline">golden hour</Link> are related but different. Golden hour happens <em>before</em> sunset, when the sun is still above the horizon but low in the sky. Dusk happens <em>after</em> sunset, when the sun is below the horizon.
            </p>

            <p>
              Here&apos;s the timeline of an evening:
            </p>

            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Golden hour</strong> (1 hour before sunset): Warm, soft light perfect for photography</li>
              <li><strong>Sunset</strong>: The sun disappears below the horizon</li>
              <li><strong>Civil dusk</strong> (20-30 min after sunset): Still bright, streetlights turn on</li>
              <li><strong>Nautical dusk</strong> (40-50 min after sunset): Getting darker, horizon still visible</li>
              <li><strong>Astronomical dusk</strong> (60-90 min after sunset): Fully dark, stars visible</li>
            </ul>

            <p>
              Both golden hour and dusk offer beautiful lighting, but they serve different purposes. Golden hour is ideal for photography and outdoor activities while there&apos;s still direct sunlight. Dusk is perfect for watching the sky change colors, planning evening walks, or simply enjoying the transition from day to night.
            </p>

            <hr className="my-8 border-gray-300" />

            <h2 className="text-3xl font-semibold text-gray-900 mt-8 mb-4">
              Why Dusk Time Changes
            </h2>

            <p>
              Dusk time isn&apos;t the same every day. It changes because:
            </p>

            <h3 className="text-2xl font-semibold text-gray-900 mt-6 mb-3">
              Daily Changes
            </h3>

            <p>
              The sun&apos;s position changes slightly each day as Earth moves around the sun. This means sunset time shifts by a few minutes each day, and dusk time shifts with it. In summer, dusk happens later. In winter, it happens earlier.
            </p>

            <h3 className="text-2xl font-semibold text-gray-900 mt-6 mb-3">
              Location Matters
            </h3>

            <p>
              Your latitude (how far north or south you are) affects how long dusk lasts. Near the equator, dusk is shorter—maybe 20-30 minutes total. At higher latitudes (like Alaska or northern Canada), dusk can last much longer, especially around the summer solstice.
            </p>

            <h3 className="text-2xl font-semibold text-gray-900 mt-6 mb-3">
              Seasonal Variations
            </h3>

            <p>
              In summer, the sun sets later and at a shallower angle, making dusk last longer. In winter, the sun sets earlier and more steeply, so dusk is shorter. This is why it feels like &quot;dusk lasts forever&quot; on summer evenings in places like Seattle or London.
            </p>

            <hr className="my-8 border-gray-300" />

            <h2 className="text-3xl font-semibold text-gray-900 mt-8 mb-4">
              Frequently Asked Questions About Dusk
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  What time is dusk today?
                </h3>
                <p>
                  Dusk time varies by location and changes daily. Civil dusk typically occurs 20-30 minutes after sunset, when the sun is 6 degrees below the horizon. To find dusk time for your city today, use SunTimesToday to look up your location&apos;s sunset time and add approximately 20-30 minutes, or check the exact dusk times listed on your city&apos;s page.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  What is the difference between dusk and sunset?
                </h3>
                <p>
                  Sunset is the exact moment when the sun disappears below the horizon. Dusk is the period of twilight that follows sunset, when there&apos;s still some light in the sky but the sun is below the horizon. Civil dusk occurs when the sun is 6 degrees below the horizon, typically 20-30 minutes after sunset.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  What is civil dusk vs nautical dusk vs astronomical dusk?
                </h3>
                <p>
                  Civil dusk occurs when the sun is 6 degrees below the horizon—this is when most people consider it &quot;dusk&quot; and streetlights turn on. Nautical dusk happens when the sun is 12 degrees below the horizon—the horizon is still visible at sea. Astronomical dusk occurs when the sun is 18 degrees below the horizon—this is when the sky is fully dark and stars are clearly visible.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  How long does dusk last?
                </h3>
                <p>
                  Civil dusk typically lasts about 20-30 minutes, ending when nautical dusk begins. The total twilight period from sunset to full darkness (astronomical dusk) can last 60-90 minutes depending on your latitude and the time of year. At higher latitudes in summer, dusk can last even longer.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  Is dusk the same as twilight?
                </h3>
                <p>
                  Yes, dusk is part of twilight. Dusk specifically refers to evening twilight—the period after sunset when there&apos;s still light in the sky. Morning twilight before sunrise is called dawn. Both are periods when the sun is below the horizon but still provides some illumination.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  Why does dusk time change every day?
                </h3>
                <p>
                  Dusk time changes because the sun&apos;s position relative to Earth changes slightly each day as our planet orbits the sun. This causes sunset time to shift by a few minutes daily, and dusk time shifts with it. Seasonal changes also affect dusk duration—summer dusks last longer, especially at higher latitudes.
                </p>
              </div>
            </div>

            <hr className="my-8 border-gray-300" />

            <h2 className="text-3xl font-semibold text-gray-900 mt-8 mb-4">
              Plan Your Evening Around Dusk
            </h2>

            <p>
              Now that you know what dusk is and how to find dusk time for your location, you can plan your evenings better. Whether you&apos;re scheduling a photography session, planning an evening walk, or just want to know when the streetlights will turn on, understanding dusk makes it easier.
            </p>

            <p>
              Remember: dusk time changes every day and varies by location. For the most accurate information, check <Link href="/" className="text-blue-600 hover:text-blue-800 underline">SunTimesToday</Link> for your city&apos;s current dusk times.
            </p>

            <div className="bg-gray-100 rounded-lg p-6 my-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Featured Cities: Dusk Times Today
              </h3>
              <p className="text-gray-700 mb-4">
                Check dusk times for major cities across the United States:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <Link href="/sunrise-sunset/new-york-ny" className="text-blue-600 hover:text-blue-800 underline">
                    Dusk Time in New York, NY
                  </Link>
                </li>
                <li>
                  <Link href="/sunrise-sunset/los-angeles-ca" className="text-blue-600 hover:text-blue-800 underline">
                    Dusk Time in Los Angeles, CA
                  </Link>
                </li>
                <li>
                  <Link href="/sunrise-sunset/chicago-il" className="text-blue-600 hover:text-blue-800 underline">
                    Dusk Time in Chicago, IL
                  </Link>
                </li>
                <li>
                  <Link href="/sunrise-sunset/houston-tx" className="text-blue-600 hover:text-blue-800 underline">
                    Dusk Time in Houston, TX
                  </Link>
                </li>
                <li>
                  <Link href="/sunrise-sunset/phoenix-az" className="text-blue-600 hover:text-blue-800 underline">
                    Dusk Time in Phoenix, AZ
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}

