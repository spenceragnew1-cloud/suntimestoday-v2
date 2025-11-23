const fs = require('fs');
const path = require('path');

const isProdBuild = process.env.VERCEL || process.env.NODE_ENV === 'production';

const lastUpdatedPath = path.join(__dirname, '../data/lastUpdated.json');
const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

const data = {
  lastUpdated: today
};

fs.writeFileSync(lastUpdatedPath, JSON.stringify(data, null, 2), 'utf8');

if (!isProdBuild) {
  console.log(`✅ Updated lastUpdated.json to ${today}`);
}

