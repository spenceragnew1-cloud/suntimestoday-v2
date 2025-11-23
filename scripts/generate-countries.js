const fs = require('fs');
const path = require('path');
const slugify = require('slugify');

const isProdBuild = process.env.VERCEL || process.env.NODE_ENV === 'production';

function createSlug(text) {
  return slugify(text, {
    lower: true,
    strict: true,
    trim: true,
  });
}

// Read global cities data
const globalCitiesPath = path.join(__dirname, '../data/global-cities.json');
const globalCities = JSON.parse(fs.readFileSync(globalCitiesPath, 'utf8'));

// Group cities by country
const countryMap = new Map();

globalCities.forEach((city) => {
  const country = city.country;
  
  if (!countryMap.has(country)) {
    countryMap.set(country, []);
  }
  
  countryMap.get(country).push({
    city: city.city,
    admin1: city.admin1,
    country: city.country,
    lat: city.lat,
    lng: city.lng,
    slug: city.slug,
  });
});

// Create countries array
const countries = Array.from(countryMap.entries()).map(([country, cities]) => ({
  country,
  countrySlug: createSlug(country),
  cities: cities.sort((a, b) => a.city.localeCompare(b.city)), // Sort cities alphabetically
}));

// Sort countries alphabetically
countries.sort((a, b) => a.country.localeCompare(b.country));

// Write to file
const outputPath = path.join(__dirname, '../data/countries.json');
fs.writeFileSync(outputPath, JSON.stringify(countries, null, 2), 'utf8');

if (!isProdBuild) {
  console.log(`✅ Generated countries.json with ${countries.length} countries`);
  console.log(`   Total cities: ${globalCities.length}`);
}

