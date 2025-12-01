import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog | SunTimesToday",
  description: "Educational articles about sunrise, sunset, daylight patterns, and seasonal changes.",
  openGraph: {
    title: "Blog | SunTimesToday",
    description: "Educational articles about sunrise, sunset, daylight patterns, and seasonal changes.",
    type: "website",
  },
};

export default function BlogIndex() {
  const articles = [
    {
      title: "What Time Is Dawn Tomorrow?",
      excerpt: "Find out what time dawn is tomorrow in your area. See dawn time tables, how dawn is defined, and how dawn differs from sunrise.",
      slug: "what-time-is-dawn-tomorrow",
      date: "2024",
    },
    {
      title: "What Time Is Dusk Today?",
      excerpt: "Find out what time dusk is today based on your location. Learn the difference between dusk, civil dusk, and nautical dusk — plus golden hour details.",
      slug: "what-time-is-dusk-today",
      date: "2024",
    },
    {
      title: "What Is Golden Hour? Best Times, Tips & Sunlight Explained",
      excerpt: "Learn what golden hour is, when it happens, and how to use it for better photos, outdoor plans, and daily routines—plus how to find golden hour times for your city.",
      slug: "golden-hour",
      date: "2024",
    },
    {
      title: "Why the Shortest Day of the Year Matters: Winter Solstice & Daylight Changes Explained",
      excerpt: "Learn about the winter solstice, why December 21st has the least daylight, and how days get longer after the shortest day. Explore sunrise and sunset patterns in your city.",
      slug: "shortest-day-of-the-year",
      date: "2024",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-4 text-sm">
          <Link href="/" className="text-blue-600 hover:text-blue-800 underline">
            Home
          </Link>
          <span className="mx-2 text-gray-500">→</span>
          <span className="text-gray-700">Blog</span>
        </nav>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">Blog</h1>

        <div className="space-y-8">
          {articles.map((article) => (
            <article key={article.slug} className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                <Link
                  href={`/blog/${article.slug}`}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  {article.title}
                </Link>
              </h2>
              <p className="text-gray-600 mb-4">{article.excerpt}</p>
              <Link
                href={`/blog/${article.slug}`}
                className="text-blue-600 hover:text-blue-800 underline font-medium"
              >
                Read more →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

