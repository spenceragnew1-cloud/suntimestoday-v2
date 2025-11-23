const fs = require('fs');
const path = require('path');
const slugify = require('slugify');

const isProdBuild = process.env.VERCEL || process.env.NODE_ENV === 'production';

const baseUrl = 'https://suntimestoday.com';
const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

function createSlug(text) {
  return slugify(text, {
    lower: true,
    strict: true,
    trim: true,
  });
}

// Helper to load JSON files
function loadJsonFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const buffer = fs.readFileSync(filePath);
  let content;
  // Check for UTF-16 BOM (FF FE)
  if (buffer[0] === 0xFF && buffer[1] === 0xFE) {
    content = buffer.toString('utf16le');
  } else {
    content = buffer.toString('utf8').replace(/^\uFEFF/, '');
  }
  content = content.trim();
  try {
    return JSON.parse(content);
  } catch (e) {
    console.error(`Error parsing ${filePath}:`, e.message);
    return null;
  }
}

const dataDir = path.join(__dirname, '../data');

// Load all data files
const usCitiesPath = path.join(dataDir, 'cities.json');
const globalCitiesPath = path.join(dataDir, 'global-cities.json');
const countriesPath = path.join(dataDir, 'countries.json');

const usCities = loadJsonFile(usCitiesPath);
const globalCities = loadJsonFile(globalCitiesPath);
const countries = loadJsonFile(countriesPath);

// Validate required files
if (!usCities || !Array.isArray(usCities)) {
  throw new Error('Failed to load or parse data/cities.json');
}

if (!globalCities || !Array.isArray(globalCities)) {
  throw new Error('Failed to load or parse data/global-cities.json');
}

if (!countries || !Array.isArray(countries)) {
  throw new Error('Failed to load or parse data/countries.json');
}

// Build sitemap URLs
const urls = [];

// Homepage
urls.push({
  loc: `${baseUrl}/`,
  lastmod: today,
  changefreq: 'daily',
  priority: '1.0'
});

// Near Me page
urls.push({
  loc: `${baseUrl}/sunrise-sunset/near-me`,
  lastmod: today,
  changefreq: 'weekly',
  priority: '0.8'
});

// US city pages from cities.json
usCities.forEach(city => {
  if (!city.slug) {
    if (!isProdBuild) {
      console.warn(`⚠️  Warning: US city missing slug: ${JSON.stringify(city)}`);
    }
    return;
  }
  urls.push({
    loc: `${baseUrl}/sunrise-sunset/${city.slug}`,
    lastmod: today,
    changefreq: 'daily',
    priority: '0.8'
  });
});

// Global city pages from global-cities.json
globalCities.forEach(city => {
  if (!city.slug) {
    if (!isProdBuild) {
      console.warn(`⚠️  Warning: Global city missing slug: ${JSON.stringify(city)}`);
    }
    return;
  }
  urls.push({
    loc: `${baseUrl}/sunrise-sunset/${city.slug}`,
    lastmod: today,
    changefreq: 'daily',
    priority: '0.8'
  });
});

// State hub pages (derived from US cities)
const stateMap = new Map(); // state name -> state slug

usCities.forEach(city => {
  if (city.region && !stateMap.has(city.region)) {
    stateMap.set(city.region, createSlug(city.region));
  }
});

stateMap.forEach((stateSlug, stateName) => {
  urls.push({
    loc: `${baseUrl}/sunrise-sunset/${stateSlug}`,
    lastmod: today,
    changefreq: 'daily',
    priority: '0.7'
  });
});

// Country hub pages
countries.forEach(country => {
  if (!country.countrySlug) {
    if (!isProdBuild) {
      console.warn(`⚠️  Warning: Country missing countrySlug: ${JSON.stringify(country)}`);
    }
    return;
  }
  urls.push({
    loc: `${baseUrl}/sunrise-sunset/${country.countrySlug}`,
    lastmod: today,
    changefreq: 'daily',
    priority: '0.7'
  });
});

// Monthly pages for US cities only
const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
usCities.forEach(city => {
  if (city.slug) {
    months.forEach(month => {
      urls.push({
        loc: `${baseUrl}/sunrise-sunset/${city.slug}/${month}`,
        lastmod: today,
        changefreq: 'monthly',
        priority: '0.6'
      });
    });
  }
});

// Generate XML
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

// Write to public/sitemap.xml
const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
fs.writeFileSync(sitemapPath, xml, 'utf8');

// Calculate and verify counts
const usCityCount = usCities.length;
const globalCityCount = globalCities.length;
const totalCityCount = usCityCount + globalCityCount;
const stateCount = stateMap.size;
const countryCount = countries.length;
const monthlyPageCount = usCityCount * 12; // US cities × 12 months

// Expected counts
const EXPECTED_TOTAL_CITIES = 703;
const EXPECTED_STATES = 45;
const EXPECTED_COUNTRIES = 45;
const EXPECTED_MONTHLY_PAGES = 334 * 12; // 4008
const EXPECTED_TOTAL_URLS = 795 + EXPECTED_MONTHLY_PAGES; // Previous total + monthly pages

// Verify counts
const errors = [];

if (totalCityCount !== EXPECTED_TOTAL_CITIES) {
  errors.push(`Total cities mismatch: expected ${EXPECTED_TOTAL_CITIES}, got ${totalCityCount}`);
}

if (stateCount !== EXPECTED_STATES) {
  errors.push(`State count mismatch: expected ${EXPECTED_STATES}, got ${stateCount}`);
}

if (countryCount !== EXPECTED_COUNTRIES) {
  errors.push(`Country count mismatch: expected ${EXPECTED_COUNTRIES}, got ${countryCount}`);
}

if (monthlyPageCount !== EXPECTED_MONTHLY_PAGES) {
  errors.push(`Monthly pages mismatch: expected ${EXPECTED_MONTHLY_PAGES}, got ${monthlyPageCount}`);
}

const totalUrls = urls.length;
if (totalUrls !== EXPECTED_TOTAL_URLS) {
  errors.push(`Total sitemap URLs mismatch: expected ${EXPECTED_TOTAL_URLS}, got ${totalUrls}`);
}

// Throw errors if counts don't match
if (errors.length > 0) {
  console.error('\n❌ Validation errors:');
  errors.forEach(error => console.error(`   - ${error}`));
  throw new Error('Sitemap generation failed validation checks');
}

// Final summary (always show - 1 line only)
console.log(`✅ Sitemap: ${totalUrls} URLs`);
