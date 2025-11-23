// Map US states to their primary timezone
const stateToTimezone: Record<string, string> = {
  "Alabama": "America/Chicago",
  "Alaska": "America/Anchorage",
  "Arizona": "America/Phoenix",
  "Arkansas": "America/Chicago",
  "California": "America/Los_Angeles",
  "Colorado": "America/Denver",
  "Connecticut": "America/New_York",
  "Delaware": "America/New_York",
  "Florida": "America/New_York", // Most of FL is Eastern, but panhandle is Central
  "Georgia": "America/New_York",
  "Hawaii": "Pacific/Honolulu",
  "Idaho": "America/Denver", // Most of ID is Mountain, but panhandle is Pacific
  "Illinois": "America/Chicago",
  "Indiana": "America/Indiana/Indianapolis", // Most of IN is Eastern
  "Iowa": "America/Chicago",
  "Kansas": "America/Chicago", // Most of KS is Central
  "Kentucky": "America/New_York", // Most of KY is Eastern
  "Louisiana": "America/Chicago",
  "Maine": "America/New_York",
  "Maryland": "America/New_York",
  "Massachusetts": "America/New_York",
  "Michigan": "America/Detroit",
  "Minnesota": "America/Chicago",
  "Mississippi": "America/Chicago",
  "Missouri": "America/Chicago",
  "Montana": "America/Denver",
  "Nebraska": "America/Chicago", // Most of NE is Central
  "Nevada": "America/Los_Angeles",
  "New Hampshire": "America/New_York",
  "New Jersey": "America/New_York",
  "New Mexico": "America/Denver",
  "New York": "America/New_York",
  "North Carolina": "America/New_York",
  "North Dakota": "America/Chicago", // Most of ND is Central
  "Ohio": "America/New_York",
  "Oklahoma": "America/Chicago",
  "Oregon": "America/Los_Angeles",
  "Pennsylvania": "America/New_York",
  "Rhode Island": "America/New_York",
  "South Carolina": "America/New_York",
  "South Dakota": "America/Chicago", // Most of SD is Central
  "Tennessee": "America/Chicago", // Most of TN is Central
  "Texas": "America/Chicago", // Most of TX is Central, but El Paso is Mountain
  "Utah": "America/Denver",
  "Vermont": "America/New_York",
  "Virginia": "America/New_York",
  "Washington": "America/Los_Angeles",
  "West Virginia": "America/New_York",
  "Wisconsin": "America/Chicago",
  "Wyoming": "America/Denver",
};

// Basic country to timezone mapping for global cities
const countryToTimezone: Record<string, string> = {
  "United Kingdom": "Europe/London",
  "France": "Europe/Paris",
  "Germany": "Europe/Berlin",
  "Italy": "Europe/Rome",
  "Spain": "Europe/Madrid",
  "Netherlands": "Europe/Amsterdam",
  "Belgium": "Europe/Brussels",
  "Switzerland": "Europe/Zurich",
  "Austria": "Europe/Vienna",
  "Sweden": "Europe/Stockholm",
  "Norway": "Europe/Oslo",
  "Denmark": "Europe/Copenhagen",
  "Finland": "Europe/Helsinki",
  "Poland": "Europe/Warsaw",
  "Czech Republic": "Europe/Prague",
  "Greece": "Europe/Athens",
  "Portugal": "Europe/Lisbon",
  "Ireland": "Europe/Dublin",
  "Romania": "Europe/Bucharest",
  "Hungary": "Europe/Budapest",
  "Russia": "Europe/Moscow",
  "Turkey": "Europe/Istanbul",
  "Japan": "Asia/Tokyo",
  "China": "Asia/Shanghai",
  "India": "Asia/Kolkata",
  "South Korea": "Asia/Seoul",
  "Thailand": "Asia/Bangkok",
  "Singapore": "Asia/Singapore",
  "Malaysia": "Asia/Kuala_Lumpur",
  "Indonesia": "Asia/Jakarta",
  "Philippines": "Asia/Manila",
  "Vietnam": "Asia/Ho_Chi_Minh",
  "Australia": "Australia/Sydney",
  "New Zealand": "Pacific/Auckland",
  "Canada": "America/Toronto",
  "Mexico": "America/Mexico_City",
  "Brazil": "America/Sao_Paulo",
  "Argentina": "America/Buenos_Aires",
  "Chile": "America/Santiago",
  "Colombia": "America/Bogota",
  "Peru": "America/Lima",
  "South Africa": "Africa/Johannesburg",
  "Egypt": "Africa/Cairo",
  "Morocco": "Africa/Casablanca",
  "United Arab Emirates": "Asia/Dubai",
  "Saudi Arabia": "Asia/Riyadh",
  "Israel": "Asia/Jerusalem",
  "Lebanon": "Asia/Beirut",
  "Jordan": "Asia/Amman",
};

export function getTimezoneForCity(region: string, country?: string): string {
  // First try US state mapping
  if (stateToTimezone[region]) {
    return stateToTimezone[region];
  }
  
  // Then try country mapping for global cities
  if (country && countryToTimezone[country]) {
    return countryToTimezone[country];
  }
  
  // Default fallback - use UTC but ensure it's a valid timezone
  // For unknown regions/countries, we'll use a safe default
  return "Etc/UTC";
}

