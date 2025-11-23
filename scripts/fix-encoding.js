const fs = require('fs');
const path = require('path');

const isProdBuild = process.env.VERCEL || process.env.NODE_ENV === 'production';

const citiesPath = path.join(__dirname, '../data/cities.json');

// Read the file as buffer to detect encoding
const buffer = fs.readFileSync(citiesPath);
let citiesData;

// Check for UTF-16 LE BOM (FF FE)
if (buffer[0] === 0xFF && buffer[1] === 0xFE) {
  // UTF-16 LE encoding
  citiesData = buffer.toString('utf16le');
  if (!isProdBuild) {
    console.log('Detected UTF-16 LE encoding');
  }
} else {
  // Try UTF-8
  citiesData = buffer.toString('utf8').replace(/^\uFEFF/, '');
  if (!isProdBuild) {
    console.log('Detected UTF-8 encoding');
  }
}

// Remove any BOM and trim
citiesData = citiesData.trim();

// Parse JSON
let cities;
try {
  cities = JSON.parse(citiesData);
  if (!isProdBuild) {
    console.log(`Parsed ${cities.length} cities successfully`);
  }
} catch (e) {
  console.error('Error parsing JSON:', e.message);
  process.exit(1);
}

// Write back as UTF-8 (no BOM)
const utf8Content = JSON.stringify(cities, null, 2);
fs.writeFileSync(citiesPath, utf8Content, { encoding: 'utf8' });

// Verify the written file
const verifyBuffer = fs.readFileSync(citiesPath);
const verifyContent = verifyBuffer.toString('utf8');
const verifyJson = JSON.parse(verifyContent);

if (!isProdBuild) {
  console.log(`✅ File converted to UTF-8`);
  console.log(`   - First 4 bytes (hex): ${verifyBuffer.slice(0, 4).toString('hex')}`);
  console.log(`   - File size: ${verifyBuffer.length} bytes`);
  console.log(`   - Valid JSON with ${verifyJson.length} cities`);
}

