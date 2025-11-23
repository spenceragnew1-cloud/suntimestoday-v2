const fs = require('fs');
const path = require('path');
const slugify = require('slugify');

// Simple hash function for deterministic seeding
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

function createSlug(text) {
  return slugify(text, {
    lower: true,
    strict: true,
    trim: true,
  });
}

// Template sections with variations
const introTemplates = [
  "Understanding sunrise and sunset times in {hub} helps residents and visitors plan their days effectively. The region experiences significant variations in daylight throughout the year, influenced by its geographic location and seasonal changes.",
  "Sunrise and sunset patterns in {hub} reflect the area's unique position on Earth. These daily cycles change dramatically between summer and winter, affecting everything from outdoor activities to photography opportunities.",
  "The daylight patterns in {hub} offer fascinating insights into how geography shapes our daily experience of time. From the earliest summer sunrises to the latest winter sunsets, the region's sun times tell a story of latitude and season.",
  "Planning around daylight in {hub} requires understanding how sunrise and sunset times shift throughout the year. The region's location creates distinct seasonal patterns that impact outdoor recreation, photography, and daily scheduling.",
  "Sun times in {hub} vary significantly across the calendar, creating opportunities and challenges for those who depend on natural light. Whether you're planning a morning run or an evening photography session, knowing these patterns is essential.",
];

const seasonalVariations = [
  "During summer months, days stretch longer with earlier sunrises and later sunsets. Winter brings shorter days, with the sun rising later and setting earlier. This seasonal shift can span several hours of daylight difference.",
  "Summer solstice brings the longest days, with sunrise occurring as early as possible and sunset extending well into the evening. Conversely, winter solstice marks the shortest days, with compressed daylight hours.",
  "The transition between seasons creates gradual changes in sun times. Spring brings increasingly earlier sunrises and later sunsets, while autumn reverses this pattern, gradually shortening daylight hours each day.",
  "Seasonal extremes in {hub} showcase the dramatic range of daylight available. Summer days can feel endless with extended evening light, while winter days require careful planning to maximize limited daylight hours.",
  "Throughout the year, {hub} experiences a wide range of daylight durations. The difference between the longest and shortest days can be substantial, affecting how residents and visitors structure their activities.",
];

const goldenHourDescriptions = [
  "The golden hour occurs twice daily—shortly after sunrise and before sunset—when the sun sits low in the sky, casting warm, soft light ideal for photography. This period typically lasts about an hour, though exact timing varies by season and location.",
  "Photographers and outdoor enthusiasts prize the golden hour for its exceptional lighting conditions. During these windows, the sun's angle creates warm tones and soft shadows, making it perfect for capturing landscapes, portraits, and cityscapes.",
  "Golden hour timing shifts with the seasons. In summer, the morning golden hour may start as early as 5 AM, while winter brings later starts. Evening golden hour similarly adjusts, creating different opportunities throughout the year.",
  "The quality of light during golden hour makes it invaluable for photography, videography, and simply enjoying outdoor spaces. Understanding when these periods occur helps maximize their potential for creative and recreational activities.",
  "Both morning and evening golden hours offer distinct advantages. Morning light tends to be crisp and clear, while evening light often carries warmer tones. Planning around these times can significantly enhance outdoor experiences.",
];

const whyItMatters = [
  "For photographers, knowing exact sunrise and sunset times enables planning shoots during optimal lighting conditions. The golden hour provides that perfect window for capturing stunning images with natural, flattering light.",
  "Outdoor enthusiasts rely on daylight information to plan activities like hiking, running, cycling, and beach visits. Understanding when daylight begins and ends helps ensure safety and maximizes enjoyment of outdoor spaces.",
  "Travelers benefit from accurate sun times when planning itineraries and activities. Whether scheduling sightseeing, outdoor dining, or photography sessions, knowing daylight patterns helps create more effective travel plans.",
  "Residents use sun time data for practical daily planning—from morning commutes to evening activities. The seasonal variations in daylight affect energy usage, mood, and overall quality of life throughout the year.",
  "Event planners and outdoor venue operators depend on accurate sun times to schedule activities, coordinate lighting, and ensure optimal conditions for gatherings. This information helps create better experiences for participants.",
];

const closingStatements = [
  "Each city in {hub} has its own unique sun time profile based on its specific coordinates. While regional patterns provide general guidance, checking individual city pages gives you the precise information needed for your location.",
  "The diversity of locations within {hub} means sun times can vary by several minutes across the region. Coastal areas, inland cities, and higher elevations each experience slightly different daylight patterns.",
  "Technology and precise calculations ensure the sun time data for {hub} remains accurate and up-to-date. Our daily updates account for the Earth's orbital variations and provide reliable information year-round.",
  "Whether you're a long-time resident or a first-time visitor, understanding {hub}'s sun time patterns enhances your ability to plan and enjoy activities. The region's daylight characteristics are part of what makes it unique.",
  "From the earliest morning light to the last rays of evening, {hub}'s sun times create a rhythm that shapes daily life. Embracing these patterns helps residents and visitors make the most of each day's available daylight.",
];

// Generate content for a hub
function generateHubContent(hubName, slug, cities, isState = false) {
  const seed = hashString(slug);
  const variations = [
    seed % introTemplates.length,
    (seed + 1) % seasonalVariations.length,
    (seed + 2) % goldenHourDescriptions.length,
    (seed + 3) % whyItMatters.length,
    (seed + 4) % closingStatements.length,
  ];

  // Calculate latitude statistics
  const lats = cities.map(c => Number(c.lat)).filter(lat => !isNaN(lat));
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const meanLat = lats.reduce((a, b) => a + b, 0) / lats.length;
  
  // Determine hemisphere and seasonal patterns
  const isNorthern = meanLat > 0;
  const absLat = Math.abs(meanLat);
  
  // Estimate daylight variation
  let daylightVariation = "moderate";
  if (absLat > 50) daylightVariation = "extreme";
  else if (absLat > 35) daylightVariation = "significant";
  else if (absLat < 20) daylightVariation = "minimal";

  // Build content sections
  const intro = introTemplates[variations[0]].replace(/{hub}/g, hubName);
  const seasonal = seasonalVariations[variations[1]].replace(/{hub}/g, hubName);
  const goldenHour = goldenHourDescriptions[variations[2]];
  const whyMatters = whyItMatters[variations[3]];
  const closing = closingStatements[variations[4]].replace(/{hub}/g, hubName);

  // Add latitude-specific details
  let latitudeContext = "";
  if (absLat > 50) {
    latitudeContext = `Located at higher latitudes, ${hubName} experiences dramatic seasonal variations in daylight. The difference between summer and winter day lengths can be substantial, with summer days extending well into the evening and winter days providing limited daylight hours.`;
  } else if (absLat > 35) {
    latitudeContext = `At mid-latitudes, ${hubName} sees noticeable seasonal changes in sun times. Summer brings extended daylight hours, while winter compresses the day, creating distinct seasonal rhythms that affect daily life and activities.`;
  } else {
    latitudeContext = `Situated closer to the equator, ${hubName} experiences relatively consistent day lengths throughout the year. While there are still seasonal variations, the changes are more subtle compared to higher-latitude regions.`;
  }

  // Add more detailed sections to reach target word count
  const cityCount = cities.length;
  const cityCountText = cityCount > 1 
    ? `With ${cityCount} cities tracked across ${hubName}, there's comprehensive coverage of sun times throughout the region.`
    : `The city data for ${hubName} provides detailed sun time information.`;

  const practicalApplications = [
    `Residents of ${hubName} use sun time data for everyday planning. Morning commuters check sunrise times to know when natural light will be available, while evening joggers and cyclists rely on sunset times to plan safe routes before darkness falls.`,
    `The tourism industry in ${hubName} benefits from accurate sun time information. Hotels, tour operators, and outdoor activity providers use this data to schedule experiences during optimal daylight hours, enhancing visitor satisfaction.`,
    `Agricultural and horticultural activities in ${hubName} depend on understanding daylight patterns. Farmers, gardeners, and greenhouse operators use sun time data to optimize growing conditions and plan maintenance schedules.`,
    `Urban planning in ${hubName} considers sun times when designing public spaces, parks, and recreational facilities. Understanding daylight patterns helps create environments that maximize natural light and encourage outdoor activity.`,
    `Health and wellness professionals in ${hubName} recognize the importance of daylight exposure. Sun time data helps people plan outdoor exercise, vitamin D exposure, and activities that support circadian rhythm regulation.`,
  ][seed % 5];

  const technicalDetails = [
    `The calculation of sun times in ${hubName} accounts for several factors: the Earth's elliptical orbit, axial tilt, and each location's precise geographic coordinates. These calculations ensure accuracy to within minutes, accounting for the region's position relative to the equator and prime meridian.`,
    `Time zone considerations affect how sun times are displayed for ${hubName}. The region may span multiple time zones or observe daylight saving time, which shifts clock times but doesn't change the actual solar events. Our data accounts for these variations.`,
    `Atmospheric conditions can slightly affect the perceived timing of sunrise and sunset in ${hubName}, though our calculations use standard atmospheric refraction models. Actual visual sunrise may appear a minute or two earlier than calculated due to light bending through the atmosphere.`,
    `The precision of sun time calculations for ${hubName} relies on astronomical algorithms that account for the Earth's complex motion. These include nutation, precession, and the equation of time, ensuring that displayed times match actual solar events.`,
    `Longitude variations within ${hubName} create small but measurable differences in sun times. Cities further east experience sunrise and sunset earlier than those to the west, with differences typically ranging from a few minutes to over an hour depending on the region's width.`,
  ][(seed + 1) % 5];

  const additionalContext = [
    `Understanding these patterns helps residents of ${hubName} adapt their routines throughout the year. Summer's extended daylight encourages evening activities and outdoor dining, while winter's shorter days prompt earlier indoor activities and different scheduling approaches.`,
    `The impact of daylight on daily life in ${hubName} extends beyond simple scheduling. Research shows that exposure to natural light affects mood, energy levels, and sleep patterns. Planning activities around optimal daylight hours can enhance overall well-being.`,
    `For businesses in ${hubName}, sun time data informs operational decisions. Restaurants with outdoor seating, retail stores with window displays, and service providers scheduling home visits all benefit from understanding daylight patterns.`,
    `Educational institutions in ${hubName} use sun time information for planning outdoor activities, field trips, and sports events. Knowing when daylight will be available helps ensure student safety and optimal learning conditions.`,
    `The relationship between sun times and energy consumption in ${hubName} is significant. Longer summer days reduce the need for artificial lighting, while shorter winter days increase it. Understanding these patterns helps with energy planning and conservation efforts.`,
  ][(seed + 2) % 5];

  const regionalSpecifics = [
    `Each city within ${hubName} has unique characteristics that influence its sun times. Elevation differences, proximity to large bodies of water, and local topography all play roles in how sunlight reaches different locations.`,
    `The geographic diversity of ${hubName} means that while general patterns apply, local conditions create variations. Mountainous areas may experience earlier sunrises and later sunsets due to elevation, while coastal regions may have different patterns due to marine influences.`,
    `Urban and rural areas within ${hubName} may experience slightly different perceptions of daylight due to building density and light pollution, though the actual solar events remain consistent. Our calculations focus on true solar times regardless of local conditions.`,
    `The spread of cities across ${hubName} creates a comprehensive picture of regional sun time patterns. By tracking multiple locations, we can identify trends and help users understand how their specific location compares to regional averages.`,
    `Historical sun time data for ${hubName} shows consistent patterns year over year, with only minor variations due to the Earth's orbital mechanics. This consistency makes the data reliable for long-term planning and comparison.`,
  ][(seed + 3) % 5];

  // Combine all sections
  const content = [
    intro,
    latitudeContext,
    seasonal,
    goldenHour,
    whyMatters,
    cityCountText,
    practicalApplications,
    technicalDetails,
    additionalContext,
    regionalSpecifics,
    closing,
  ].join(' ');

  // Ensure word count is between 400-800
  const words = content.split(/\s+/).length;
  let finalContent = content;
  
  if (words < 400) {
    // Add more detail
    const additionalDetail = `The precise timing of sunrise and sunset in ${hubName} depends on each location's specific coordinates. Cities at different longitudes within the region may experience sunrises and sunsets that differ by several minutes. This variation means that while general patterns apply across ${hubName}, checking individual city pages provides the most accurate information for planning purposes. Weather patterns and local geography can also influence how sunlight reaches different areas, making location-specific data particularly valuable.`;
    finalContent = content + ' ' + additionalDetail;
  } else if (words > 800) {
    // Trim to fit
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const targetSentences = Math.floor(800 / 15); // Rough estimate: 15 words per sentence
    finalContent = sentences.slice(0, Math.min(targetSentences, sentences.length)).join('. ') + '.';
  }

  return {
    hubName,
    slug,
    content: finalContent.trim(),
    wordCount: finalContent.split(/\s+/).length,
    latitudeStats: {
      minLat: minLat.toFixed(2),
      maxLat: maxLat.toFixed(2),
      meanLat: meanLat.toFixed(2),
      isNorthern,
      daylightVariation,
    },
  };
}

// Load data
const dataDir = path.join(__dirname, '../data');
const citiesData = JSON.parse(fs.readFileSync(path.join(dataDir, 'cities.json'), 'utf8').replace(/^\uFEFF/, ''));
const globalCitiesData = JSON.parse(fs.readFileSync(path.join(dataDir, 'global-cities.json'), 'utf8').replace(/^\uFEFF/, ''));
const countriesData = JSON.parse(fs.readFileSync(path.join(dataDir, 'countries.json'), 'utf8').replace(/^\uFEFF/, ''));

// Generate state hub content
const stateMap = new Map();
citiesData.forEach(city => {
  if (!stateMap.has(city.region)) {
    stateMap.set(city.region, createSlug(city.region));
  }
});

const stateHubsContent = [];
stateMap.forEach((stateSlug, stateName) => {
  const stateCities = citiesData.filter(c => c.region === stateName);
  const content = generateHubContent(stateName, stateSlug, stateCities, true);
  stateHubsContent.push(content);
});

// Generate country hub content
const countryHubsContent = [];
countriesData.forEach(country => {
  const content = generateHubContent(country.country, country.countrySlug, country.cities, false);
  countryHubsContent.push(content);
});

// Write output files
fs.writeFileSync(
  path.join(dataDir, 'state-hubs-content.json'),
  JSON.stringify(stateHubsContent, null, 2),
  'utf8'
);

fs.writeFileSync(
  path.join(dataDir, 'country-hubs-content.json'),
  JSON.stringify(countryHubsContent, null, 2),
  'utf8'
);

console.log(`✅ Generated content for ${stateHubsContent.length} state hubs`);
console.log(`✅ Generated content for ${countryHubsContent.length} country hubs`);
console.log(`   Average word count (states): ${Math.round(stateHubsContent.reduce((sum, c) => sum + c.wordCount, 0) / stateHubsContent.length)}`);
console.log(`   Average word count (countries): ${Math.round(countryHubsContent.reduce((sum, c) => sum + c.wordCount, 0) / countryHubsContent.length)}`);

