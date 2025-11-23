const fs = require('fs');
const path = require('path');

// Simple slugify function (matches lib/slugify.ts behavior)
function createSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Load data files
const dataDir = path.join(__dirname, '../data');

function loadJsonFile(filename) {
  const filePath = path.join(dataDir, filename);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const content = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  return JSON.parse(content);
}

console.log('🔍 Validating routes and SEO data...\n');

// Load all data files
const usCities = loadJsonFile('cities.json');
const globalCities = loadJsonFile('global-cities.json');
const countries = loadJsonFile('countries.json');
const states = loadJsonFile('states.json'); // Optional

if (!usCities) {
  console.error('❌ ERROR: data/cities.json not found');
  process.exit(1);
}

if (!globalCities) {
  console.error('❌ ERROR: data/global-cities.json not found');
  process.exit(1);
}

if (!countries) {
  console.error('❌ ERROR: data/countries.json not found');
  process.exit(1);
}

console.log('✅ All required data files loaded\n');

// Track errors
let hasErrors = false;

// 1. Check for duplicate slugs across all datasets
console.log('1️⃣ Checking for duplicate slugs...');
const slugMap = new Map();
const duplicates = [];

// Check US city slugs
if (Array.isArray(usCities)) {
  usCities.forEach((city, index) => {
    if (!city.slug) {
      console.error(`❌ ERROR: US city at index ${index} missing slug`);
      hasErrors = true;
      return;
    }
    if (slugMap.has(city.slug)) {
      duplicates.push({ slug: city.slug, source: 'US cities', index });
    } else {
      slugMap.set(city.slug, { source: 'US cities', index });
    }
  });
}

// Check global city slugs
if (Array.isArray(globalCities)) {
  globalCities.forEach((city, index) => {
    if (!city.slug) {
      console.error(`❌ ERROR: Global city at index ${index} missing slug`);
      hasErrors = true;
      return;
    }
    if (slugMap.has(city.slug)) {
      duplicates.push({ slug: city.slug, source: 'Global cities', index });
    } else {
      slugMap.set(city.slug, { source: 'Global cities', index });
    }
  });
}

if (duplicates.length > 0) {
  console.error(`❌ ERROR: Found ${duplicates.length} duplicate slug(s):`);
  duplicates.forEach((dup) => {
    const existing = slugMap.get(dup.slug);
    console.error(`   - Slug "${dup.slug}" found in ${existing.source} and ${dup.source}`);
  });
  hasErrors = true;
} else {
  console.log(`✅ No duplicate slugs found (${slugMap.size} unique slugs)\n`);
}

// 2. Validate global cities have valid countrySlug references
console.log('2️⃣ Validating global cities → countries...');
if (!Array.isArray(countries)) {
  console.error('❌ ERROR: countries.json is not an array');
  hasErrors = true;
} else {
  const countrySlugSet = new Set(countries.map(c => c.countrySlug));
  const invalidGlobalCities = [];

  if (Array.isArray(globalCities)) {
    globalCities.forEach((city, index) => {
      if (!city.country) {
        console.error(`❌ ERROR: Global city at index ${index} missing country`);
        hasErrors = true;
        return;
      }

      // Find matching country
      const country = countries.find(c => c.country === city.country);
      if (!country) {
        invalidGlobalCities.push({
          city: city.city || `index ${index}`,
          country: city.country,
          reason: 'Country not found in countries.json'
        });
      } else if (!countrySlugSet.has(country.countrySlug)) {
        invalidGlobalCities.push({
          city: city.city || `index ${index}`,
          country: city.country,
          reason: 'Country slug missing or invalid'
        });
      }
    });
  }

  if (invalidGlobalCities.length > 0) {
    console.error(`❌ ERROR: Found ${invalidGlobalCities.length} global city(ies) with invalid country references:`);
    invalidGlobalCities.slice(0, 10).forEach((city) => {
      console.error(`   - ${city.city} (${city.country}): ${city.reason}`);
    });
    if (invalidGlobalCities.length > 10) {
      console.error(`   ... and ${invalidGlobalCities.length - 10} more`);
    }
    hasErrors = true;
  } else {
    console.log(`✅ All ${globalCities.length} global cities have valid country references\n`);
  }
}

// 3. Validate US cities have valid state slugs
console.log('3️⃣ Validating US cities → states...');
if (!Array.isArray(usCities)) {
  console.error('❌ ERROR: cities.json is not an array');
  hasErrors = true;
} else {
  // Build state map from US cities
  const stateMap = new Map(); // state name -> state slug
  usCities.forEach(city => {
    if (city.region && !stateMap.has(city.region)) {
      stateMap.set(city.region, createSlug(city.region));
    }
  });

  const invalidUsCities = [];
  usCities.forEach((city, index) => {
    if (!city.region) {
      invalidUsCities.push({
        city: city.name || `index ${index}`,
        reason: 'Missing region (state) field'
      });
    } else {
      const expectedStateSlug = createSlug(city.region);
      if (!stateMap.has(city.region)) {
        invalidUsCities.push({
          city: city.name || `index ${index}`,
          state: city.region,
          reason: 'State slug could not be generated'
        });
      }
    }
  });

  if (invalidUsCities.length > 0) {
    console.error(`❌ ERROR: Found ${invalidUsCities.length} US city(ies) with invalid state references:`);
    invalidUsCities.slice(0, 10).forEach((city) => {
      console.error(`   - ${city.city}${city.state ? ` (${city.state})` : ''}: ${city.reason}`);
    });
    if (invalidUsCities.length > 10) {
      console.error(`   ... and ${invalidUsCities.length - 10} more`);
    }
    hasErrors = true;
  } else {
    const uniqueStates = new Set(usCities.map(c => c.region)).size;
    console.log(`✅ All ${usCities.length} US cities have valid state references (${uniqueStates} unique states)\n`);
  }
}

// 4. Validate hub content files
console.log('4️⃣ Validating hub content files...');
const stateHubsContent = loadJsonFile('state-hubs-content.json');
const countryHubsContent = loadJsonFile('country-hubs-content.json');

if (!stateHubsContent || !Array.isArray(stateHubsContent)) {
  console.error('❌ ERROR: data/state-hubs-content.json not found or invalid');
  hasErrors = true;
} else {
  // Calculate unique states from US cities
  const uniqueStates = new Set();
  if (Array.isArray(usCities)) {
    usCities.forEach(city => {
      if (city.region) {
        uniqueStates.add(city.region);
      }
    });
  }
  
  // Check that every state has content
  const stateSlugs = Array.from(uniqueStates).map(state => {
    const slugify = require('slugify');
    return slugify(state, { lower: true, strict: true, trim: true });
  });
  
  const stateContentSlugs = new Set(stateHubsContent.map(h => h.slug));
  const missingStateContent = stateSlugs.filter(slug => !stateContentSlugs.has(slug));
  
  if (missingStateContent.length > 0) {
    console.error(`❌ ERROR: Missing state hub content for: ${missingStateContent.join(', ')}`);
    hasErrors = true;
  } else {
    console.log(`✅ All ${stateSlugs.length} state hubs have content\n`);
  }
}

if (!countryHubsContent || !Array.isArray(countryHubsContent)) {
  console.error('❌ ERROR: data/country-hubs-content.json not found or invalid');
  hasErrors = true;
} else {
  // Check that every country has content
  const countrySlugs = new Set(countries.map(c => c.countrySlug));
  const countryContentSlugs = new Set(countryHubsContent.map(h => h.slug));
  const missingCountryContent = Array.from(countrySlugs).filter(slug => !countryContentSlugs.has(slug));
  
  if (missingCountryContent.length > 0) {
    console.error(`❌ ERROR: Missing country hub content for: ${missingCountryContent.join(', ')}`);
    hasErrors = true;
  } else {
    console.log(`✅ All ${countrySlugs.size} country hubs have content\n`);
  }
}

// 5. Print totals and expected sitemap count
console.log('5️⃣ Summary and sitemap count...');
const usCityCount = Array.isArray(usCities) ? usCities.length : 0;
const globalCityCount = Array.isArray(globalCities) ? globalCities.length : 0;
const countryCount = Array.isArray(countries) ? countries.length : 0;

// Calculate unique states from US cities
const uniqueStates = new Set();
if (Array.isArray(usCities)) {
  usCities.forEach(city => {
    if (city.region) {
      uniqueStates.add(city.region);
    }
  });
}
const stateCount = uniqueStates.size;

// Expected sitemap URLs:
// - Homepage: 1
// - Near Me: 1
// - US city pages: usCityCount
// - Global city pages: globalCityCount
// - State pages: stateCount
// - Country pages: countryCount
const expectedSitemapCount = 1 + 1 + usCityCount + globalCityCount + stateCount + countryCount;

console.log(`   US Cities: ${usCityCount}`);
console.log(`   Global Cities: ${globalCityCount}`);
console.log(`   Total Cities: ${usCityCount + globalCityCount}`);
console.log(`   States: ${stateCount}`);
console.log(`   Countries: ${countryCount}`);
console.log(`   Expected Sitemap URLs: ${expectedSitemapCount}\n`);

// Final result
if (hasErrors) {
  console.error('❌ VALIDATION FAILED - Please fix the errors above');
  process.exit(1);
} else {
  console.log('✅ All validations passed!');
  process.exit(0);
}

