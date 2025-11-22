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

export function getTimezoneForCity(region: string): string {
  // Return timezone for the state, defaulting to America/New_York if not found
  return stateToTimezone[region] || "America/New_York";
}

