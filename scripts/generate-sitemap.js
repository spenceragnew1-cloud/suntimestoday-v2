const fs = require('fs');
const path = require('path');
const slugify = require('slugify');

const baseUrl = 'https://suntimestoday.com';
const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

function createSlug(text) {
  return slugify(text, {
    lower: true,
    strict: true,
    trim: true,
  });
}

// Read cities data
const citiesPath = path.join(__dirname, '../data/cities.json');
let cities = [];
if (fs.existsSync(citiesPath)) {
  let citiesData;
  // Check for UTF-16 BOM (FF FE)
  const buffer = fs.readFileSync(citiesPath);
  if (buffer[0] === 0xFF && buffer[1] === 0xFE) {
    // UTF-16 LE encoding
    citiesData = buffer.toString('utf16le');
  } else {
    // Try UTF-8
    citiesData = buffer.toString('utf8').replace(/^\uFEFF/, '');
  }
  citiesData = citiesData.trim();
  // Try to parse, with better error handling
  try {
    cities = JSON.parse(citiesData);
  } catch (e) {
    console.error('Error parsing cities.json:', e.message);
    cities = [];
  }
}

// Read questions data (if it exists)
const questionsPath = path.join(__dirname, '../data/questions.json');
let questions = [];
if (fs.existsSync(questionsPath)) {
  const questionsData = fs.readFileSync(questionsPath, 'utf8').replace(/^\uFEFF/, ''); // Remove BOM if present
  questions = JSON.parse(questionsData);
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

// City pages from cities.json
if (cities && Array.isArray(cities)) {
  cities.forEach(city => {
    if (city.slug) {
      urls.push({
        loc: `${baseUrl}/sunrise-sunset/${city.slug}`,
        lastmod: today,
        changefreq: 'daily',
        priority: '0.8'
      });
    }
  });
}

// State hub pages
if (cities && Array.isArray(cities)) {
  const stateMap = new Map(); // state name -> state slug
  
  cities.forEach(city => {
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
}

// Note: Q&A pages removed - this is a suntimestoday project, not Q&A site

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

const stateCount = new Set(cities.map(c => c.region)).size;

console.log(`✅ Generated sitemap.xml with ${urls.length} URLs`);
console.log(`   - Homepage: 1`);
console.log(`   - Near Me page: 1`);
console.log(`   - City pages: ${cities.length}`);
console.log(`   - State pages: ${stateCount}`);

