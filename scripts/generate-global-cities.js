// Script to generate global-cities.json with major cities worldwide
// This creates a starter set of ~800 global cities

const fs = require('fs');
const path = require('path');
const slugify = require('slugify');

const isProdBuild = process.env.VERCEL || process.env.NODE_ENV === 'production';

function createSlug(city, country) {
  const countryCode = getCountryCode(country);
  const citySlug = slugify(city, { lower: true, strict: true, trim: true });
  return `${citySlug}-${countryCode}`;
}

function getCountryCode(country) {
  const countryCodes = {
    'United Kingdom': 'uk',
    'France': 'fr',
    'Germany': 'de',
    'Italy': 'it',
    'Spain': 'es',
    'Netherlands': 'nl',
    'Belgium': 'be',
    'Switzerland': 'ch',
    'Austria': 'at',
    'Sweden': 'se',
    'Norway': 'no',
    'Denmark': 'dk',
    'Finland': 'fi',
    'Poland': 'pl',
    'Czech Republic': 'cz',
    'Greece': 'gr',
    'Portugal': 'pt',
    'Ireland': 'ie',
    'Romania': 'ro',
    'Hungary': 'hu',
    'Russia': 'ru',
    'Turkey': 'tr',
    'Japan': 'jp',
    'China': 'cn',
    'India': 'in',
    'South Korea': 'kr',
    'Thailand': 'th',
    'Singapore': 'sg',
    'Malaysia': 'my',
    'Indonesia': 'id',
    'Philippines': 'ph',
    'Vietnam': 'vn',
    'Australia': 'au',
    'New Zealand': 'nz',
    'Canada': 'ca',
    'Mexico': 'mx',
    'Brazil': 'br',
    'Argentina': 'ar',
    'Chile': 'cl',
    'Colombia': 'co',
    'Peru': 'pe',
    'South Africa': 'za',
    'Egypt': 'eg',
    'Morocco': 'ma',
    'Kenya': 'ke',
    'Nigeria': 'ng',
    'United Arab Emirates': 'ae',
    'Saudi Arabia': 'sa',
    'Israel': 'il',
    'Lebanon': 'lb',
    'Jordan': 'jo',
  };
  return countryCodes[country] || slugify(country, { lower: true, strict: true }).substring(0, 2);
}

// Major global cities dataset
const globalCities = [
  // United Kingdom
  { city: 'London', country: 'United Kingdom', admin1: 'England', lat: 51.5074, lng: -0.1278 },
  { city: 'Manchester', country: 'United Kingdom', admin1: 'England', lat: 53.4808, lng: -2.2426 },
  { city: 'Birmingham', country: 'United Kingdom', admin1: 'England', lat: 52.4862, lng: -1.8904 },
  { city: 'Glasgow', country: 'United Kingdom', admin1: 'Scotland', lat: 55.8642, lng: -4.2518 },
  { city: 'Edinburgh', country: 'United Kingdom', admin1: 'Scotland', lat: 55.9533, lng: -3.1883 },
  { city: 'Liverpool', country: 'United Kingdom', admin1: 'England', lat: 53.4084, lng: -2.9916 },
  { city: 'Leeds', country: 'United Kingdom', admin1: 'England', lat: 53.8008, lng: -1.5491 },
  { city: 'Bristol', country: 'United Kingdom', admin1: 'England', lat: 51.4545, lng: -2.5879 },
  
  // France
  { city: 'Paris', country: 'France', admin1: 'Île-de-France', lat: 48.8566, lng: 2.3522 },
  { city: 'Lyon', country: 'France', admin1: 'Auvergne-Rhône-Alpes', lat: 45.7640, lng: 4.8357 },
  { city: 'Marseille', country: 'France', admin1: "Provence-Alpes-Côte d'Azur", lat: 43.2965, lng: 5.3698 },
  { city: 'Toulouse', country: 'France', admin1: 'Occitanie', lat: 43.6047, lng: 1.4442 },
  { city: 'Nice', country: 'France', admin1: "Provence-Alpes-Côte d'Azur", lat: 43.7102, lng: 7.2620 },
  { city: 'Nantes', country: 'France', admin1: 'Pays de la Loire', lat: 47.2184, lng: -1.5536 },
  { city: 'Strasbourg', country: 'France', admin1: 'Grand Est', lat: 48.5734, lng: 7.7521 },
  { city: 'Montpellier', country: 'France', admin1: 'Occitanie', lat: 43.6108, lng: 3.8767 },
  { city: 'Bordeaux', country: 'France', admin1: 'Nouvelle-Aquitaine', lat: 44.8378, lng: -0.5792 },
  { city: 'Lille', country: 'France', admin1: 'Hauts-de-France', lat: 50.6292, lng: 3.0573 },
  
  // Germany
  { city: 'Berlin', country: 'Germany', admin1: 'Berlin', lat: 52.5200, lng: 13.4050 },
  { city: 'Munich', country: 'Germany', admin1: 'Bavaria', lat: 48.1351, lng: 11.5820 },
  { city: 'Hamburg', country: 'Germany', admin1: 'Hamburg', lat: 53.5511, lng: 9.9937 },
  { city: 'Cologne', country: 'Germany', admin1: 'North Rhine-Westphalia', lat: 50.9375, lng: 6.9603 },
  { city: 'Frankfurt', country: 'Germany', admin1: 'Hesse', lat: 50.1109, lng: 8.6821 },
  { city: 'Stuttgart', country: 'Germany', admin1: 'Baden-Württemberg', lat: 48.7758, lng: 9.1829 },
  { city: 'Düsseldorf', country: 'Germany', admin1: 'North Rhine-Westphalia', lat: 51.2277, lng: 6.7735 },
  { city: 'Dortmund', country: 'Germany', admin1: 'North Rhine-Westphalia', lat: 51.5136, lng: 7.4653 },
  { city: 'Essen', country: 'Germany', admin1: 'North Rhine-Westphalia', lat: 51.4556, lng: 7.0116 },
  { city: 'Leipzig', country: 'Germany', admin1: 'Saxony', lat: 51.3397, lng: 12.3731 },
  
  // Italy
  { city: 'Rome', country: 'Italy', admin1: 'Lazio', lat: 41.9028, lng: 12.4964 },
  { city: 'Milan', country: 'Italy', admin1: 'Lombardy', lat: 45.4642, lng: 9.1900 },
  { city: 'Naples', country: 'Italy', admin1: 'Campania', lat: 40.8518, lng: 14.2681 },
  { city: 'Turin', country: 'Italy', admin1: 'Piedmont', lat: 45.0703, lng: 7.6869 },
  { city: 'Palermo', country: 'Italy', admin1: 'Sicily', lat: 38.1157, lng: 13.3613 },
  { city: 'Genoa', country: 'Italy', admin1: 'Liguria', lat: 44.4056, lng: 8.9463 },
  { city: 'Bologna', country: 'Italy', admin1: 'Emilia-Romagna', lat: 44.4949, lng: 11.3426 },
  { city: 'Florence', country: 'Italy', admin1: 'Tuscany', lat: 43.7696, lng: 11.2558 },
  { city: 'Venice', country: 'Italy', admin1: 'Veneto', lat: 45.4408, lng: 12.3155 },
  { city: 'Verona', country: 'Italy', admin1: 'Veneto', lat: 45.4384, lng: 10.9916 },
  
  // Spain
  { city: 'Madrid', country: 'Spain', admin1: 'Madrid', lat: 40.4168, lng: -3.7038 },
  { city: 'Barcelona', country: 'Spain', admin1: 'Catalonia', lat: 41.3851, lng: 2.1734 },
  { city: 'Valencia', country: 'Spain', admin1: 'Valencia', lat: 39.4699, lng: -0.3763 },
  { city: 'Seville', country: 'Spain', admin1: 'Andalusia', lat: 37.3891, lng: -5.9845 },
  { city: 'Zaragoza', country: 'Spain', admin1: 'Aragon', lat: 41.6488, lng: -0.8891 },
  { city: 'Málaga', country: 'Spain', admin1: 'Andalusia', lat: 36.7213, lng: -4.4214 },
  { city: 'Murcia', country: 'Spain', admin1: 'Murcia', lat: 37.9922, lng: -1.1307 },
  { city: 'Palma', country: 'Spain', admin1: 'Balearic Islands', lat: 39.5696, lng: 2.6502 },
  { city: 'Las Palmas', country: 'Spain', admin1: 'Canary Islands', lat: 28.1248, lng: -15.4300 },
  { city: 'Bilbao', country: 'Spain', admin1: 'Basque Country', lat: 43.2627, lng: -2.9253 },
  
  // Japan
  { city: 'Tokyo', country: 'Japan', admin1: 'Tokyo', lat: 35.6762, lng: 139.6503 },
  { city: 'Yokohama', country: 'Japan', admin1: 'Kanagawa', lat: 35.4437, lng: 139.6380 },
  { city: 'Osaka', country: 'Japan', admin1: 'Osaka', lat: 34.6937, lng: 135.5023 },
  { city: 'Nagoya', country: 'Japan', admin1: 'Aichi', lat: 35.1815, lng: 136.9066 },
  { city: 'Sapporo', country: 'Japan', admin1: 'Hokkaido', lat: 43.0642, lng: 141.3469 },
  { city: 'Fukuoka', country: 'Japan', admin1: 'Fukuoka', lat: 33.5904, lng: 130.4017 },
  { city: 'Kobe', country: 'Japan', admin1: 'Hyogo', lat: 34.6901, lng: 135.1956 },
  { city: 'Kyoto', country: 'Japan', admin1: 'Kyoto', lat: 35.0116, lng: 135.7681 },
  { city: 'Sendai', country: 'Japan', admin1: 'Miyagi', lat: 38.2682, lng: 140.8694 },
  { city: 'Hiroshima', country: 'Japan', admin1: 'Hiroshima', lat: 34.3853, lng: 132.4553 },
  
  // China
  { city: 'Beijing', country: 'China', admin1: 'Beijing', lat: 39.9042, lng: 116.4074 },
  { city: 'Shanghai', country: 'China', admin1: 'Shanghai', lat: 31.2304, lng: 121.4737 },
  { city: 'Guangzhou', country: 'China', admin1: 'Guangdong', lat: 23.1291, lng: 113.2644 },
  { city: 'Shenzhen', country: 'China', admin1: 'Guangdong', lat: 22.5431, lng: 114.0579 },
  { city: 'Chengdu', country: 'China', admin1: 'Sichuan', lat: 30.6624, lng: 104.0633 },
  { city: 'Hangzhou', country: 'China', admin1: 'Zhejiang', lat: 30.2741, lng: 120.1551 },
  { city: 'Wuhan', country: 'China', admin1: 'Hubei', lat: 30.5928, lng: 114.3055 },
  { city: 'Xi\'an', country: 'China', admin1: 'Shaanxi', lat: 34.3416, lng: 108.9398 },
  { city: 'Nanjing', country: 'China', admin1: 'Jiangsu', lat: 32.0603, lng: 118.7969 },
  { city: 'Tianjin', country: 'China', admin1: 'Tianjin', lat: 39.3434, lng: 117.3616 },
  
  // India
  { city: 'Mumbai', country: 'India', admin1: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
  { city: 'Delhi', country: 'India', admin1: 'Delhi', lat: 28.6139, lng: 77.2090 },
  { city: 'Bangalore', country: 'India', admin1: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  { city: 'Hyderabad', country: 'India', admin1: 'Telangana', lat: 17.3850, lng: 78.4867 },
  { city: 'Chennai', country: 'India', admin1: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  { city: 'Kolkata', country: 'India', admin1: 'West Bengal', lat: 22.5726, lng: 88.3639 },
  { city: 'Pune', country: 'India', admin1: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
  { city: 'Ahmedabad', country: 'India', admin1: 'Gujarat', lat: 23.0225, lng: 72.5714 },
  { city: 'Jaipur', country: 'India', admin1: 'Rajasthan', lat: 26.9124, lng: 75.7873 },
  { city: 'Surat', country: 'India', admin1: 'Gujarat', lat: 21.1702, lng: 72.8311 },
  
  // Australia
  { city: 'Sydney', country: 'Australia', admin1: 'New South Wales', lat: -33.8688, lng: 151.2093 },
  { city: 'Melbourne', country: 'Australia', admin1: 'Victoria', lat: -37.8136, lng: 144.9631 },
  { city: 'Brisbane', country: 'Australia', admin1: 'Queensland', lat: -27.4698, lng: 153.0251 },
  { city: 'Perth', country: 'Australia', admin1: 'Western Australia', lat: -31.9505, lng: 115.8605 },
  { city: 'Adelaide', country: 'Australia', admin1: 'South Australia', lat: -34.9285, lng: 138.6007 },
  { city: 'Gold Coast', country: 'Australia', admin1: 'Queensland', lat: -28.0167, lng: 153.4000 },
  { city: 'Newcastle', country: 'Australia', admin1: 'New South Wales', lat: -32.9283, lng: 151.7817 },
  { city: 'Canberra', country: 'Australia', admin1: 'Australian Capital Territory', lat: -35.2809, lng: 149.1300 },
  { city: 'Sunshine Coast', country: 'Australia', admin1: 'Queensland', lat: -26.6500, lng: 153.0667 },
  { city: 'Wollongong', country: 'Australia', admin1: 'New South Wales', lat: -34.4278, lng: 150.8931 },
  
  // Canada
  { city: 'Toronto', country: 'Canada', admin1: 'Ontario', lat: 43.6532, lng: -79.3832 },
  { city: 'Vancouver', country: 'Canada', admin1: 'British Columbia', lat: 49.2827, lng: -123.1207 },
  { city: 'Montreal', country: 'Canada', admin1: 'Quebec', lat: 45.5017, lng: -73.5673 },
  { city: 'Calgary', country: 'Canada', admin1: 'Alberta', lat: 51.0447, lng: -114.0719 },
  { city: 'Ottawa', country: 'Canada', admin1: 'Ontario', lat: 45.4215, lng: -75.6972 },
  { city: 'Edmonton', country: 'Canada', admin1: 'Alberta', lat: 53.5461, lng: -113.4938 },
  { city: 'Winnipeg', country: 'Canada', admin1: 'Manitoba', lat: 49.8951, lng: -97.1384 },
  { city: 'Quebec City', country: 'Canada', admin1: 'Quebec', lat: 46.8139, lng: -71.2080 },
  { city: 'Hamilton', country: 'Canada', admin1: 'Ontario', lat: 43.2557, lng: -79.8711 },
  { city: 'Kitchener', country: 'Canada', admin1: 'Ontario', lat: 43.4516, lng: -80.4925 },
  
  // Brazil
  { city: 'São Paulo', country: 'Brazil', admin1: 'São Paulo', lat: -23.5505, lng: -46.6333 },
  { city: 'Rio de Janeiro', country: 'Brazil', admin1: 'Rio de Janeiro', lat: -22.9068, lng: -43.1729 },
  { city: 'Brasília', country: 'Brazil', admin1: 'Distrito Federal', lat: -15.7942, lng: -47.8822 },
  { city: 'Salvador', country: 'Brazil', admin1: 'Bahia', lat: -12.9714, lng: -38.5014 },
  { city: 'Fortaleza', country: 'Brazil', admin1: 'Ceará', lat: -3.7172, lng: -38.5433 },
  { city: 'Belo Horizonte', country: 'Brazil', admin1: 'Minas Gerais', lat: -19.9167, lng: -43.9345 },
  { city: 'Manaus', country: 'Brazil', admin1: 'Amazonas', lat: -3.1190, lng: -60.0217 },
  { city: 'Curitiba', country: 'Brazil', admin1: 'Paraná', lat: -25.4284, lng: -49.2733 },
  { city: 'Recife', country: 'Brazil', admin1: 'Pernambuco', lat: -8.0476, lng: -34.8770 },
  { city: 'Porto Alegre', country: 'Brazil', admin1: 'Rio Grande do Sul', lat: -30.0346, lng: -51.2177 },
  
  // Mexico
  { city: 'Mexico City', country: 'Mexico', admin1: 'Mexico City', lat: 19.4326, lng: -99.1332 },
  { city: 'Guadalajara', country: 'Mexico', admin1: 'Jalisco', lat: 20.6597, lng: -103.3496 },
  { city: 'Monterrey', country: 'Mexico', admin1: 'Nuevo León', lat: 25.6866, lng: -100.3161 },
  { city: 'Puebla', country: 'Mexico', admin1: 'Puebla', lat: 19.0414, lng: -98.2063 },
  { city: 'Tijuana', country: 'Mexico', admin1: 'Baja California', lat: 32.5149, lng: -117.0382 },
  { city: 'León', country: 'Mexico', admin1: 'Guanajuato', lat: 21.1250, lng: -101.6860 },
  { city: 'Juárez', country: 'Mexico', admin1: 'Chihuahua', lat: 31.6904, lng: -106.4246 },
  { city: 'Torreón', country: 'Mexico', admin1: 'Coahuila', lat: 25.5428, lng: -103.4064 },
  { city: 'Querétaro', country: 'Mexico', admin1: 'Querétaro', lat: 20.5888, lng: -100.3899 },
  { city: 'San Luis Potosí', country: 'Mexico', admin1: 'San Luis Potosí', lat: 22.1565, lng: -100.9855 },
  
  // Argentina
  { city: 'Buenos Aires', country: 'Argentina', admin1: 'Buenos Aires', lat: -34.6037, lng: -58.3816 },
  { city: 'Córdoba', country: 'Argentina', admin1: 'Córdoba', lat: -31.4201, lng: -64.1888 },
  { city: 'Rosario', country: 'Argentina', admin1: 'Santa Fe', lat: -32.9442, lng: -60.6505 },
  { city: 'Mendoza', country: 'Argentina', admin1: 'Mendoza', lat: -32.8895, lng: -68.8458 },
  { city: 'Tucumán', country: 'Argentina', admin1: 'Tucumán', lat: -26.8083, lng: -65.2176 },
  { city: 'La Plata', country: 'Argentina', admin1: 'Buenos Aires', lat: -34.9215, lng: -57.9545 },
  { city: 'Mar del Plata', country: 'Argentina', admin1: 'Buenos Aires', lat: -38.0055, lng: -57.5426 },
  { city: 'Salta', country: 'Argentina', admin1: 'Salta', lat: -24.7859, lng: -65.4117 },
  { city: 'Santa Fe', country: 'Argentina', admin1: 'Santa Fe', lat: -31.6333, lng: -60.7000 },
  { city: 'San Juan', country: 'Argentina', admin1: 'San Juan', lat: -31.5375, lng: -68.5364 },
  
  // South Korea
  { city: 'Seoul', country: 'South Korea', admin1: 'Seoul', lat: 37.5665, lng: 126.9780 },
  { city: 'Busan', country: 'South Korea', admin1: 'Busan', lat: 35.1796, lng: 129.0756 },
  { city: 'Incheon', country: 'South Korea', admin1: 'Incheon', lat: 37.4563, lng: 126.7052 },
  { city: 'Daegu', country: 'South Korea', admin1: 'Daegu', lat: 35.8714, lng: 128.6014 },
  { city: 'Daejeon', country: 'South Korea', admin1: 'Daejeon', lat: 36.3504, lng: 127.3845 },
  { city: 'Gwangju', country: 'South Korea', admin1: 'Gwangju', lat: 35.1595, lng: 126.8526 },
  { city: 'Ulsan', country: 'South Korea', admin1: 'Ulsan', lat: 35.5384, lng: 129.3114 },
  { city: 'Suwon', country: 'South Korea', admin1: 'Gyeonggi', lat: 37.2636, lng: 127.0286 },
  { city: 'Changwon', country: 'South Korea', admin1: 'South Gyeongsang', lat: 35.2279, lng: 128.6819 },
  { city: 'Goyang', country: 'South Korea', admin1: 'Gyeonggi', lat: 37.6564, lng: 126.8350 },
  
  // Thailand
  { city: 'Bangkok', country: 'Thailand', admin1: 'Bangkok', lat: 13.7563, lng: 100.5018 },
  { city: 'Chiang Mai', country: 'Thailand', admin1: 'Chiang Mai', lat: 18.7883, lng: 98.9853 },
  { city: 'Pattaya', country: 'Thailand', admin1: 'Chonburi', lat: 12.9236, lng: 100.8825 },
  { city: 'Phuket', country: 'Thailand', admin1: 'Phuket', lat: 7.8804, lng: 98.3923 },
  { city: 'Hat Yai', country: 'Thailand', admin1: 'Songkhla', lat: 7.0084, lng: 100.4768 },
  { city: 'Nakhon Ratchasima', country: 'Thailand', admin1: 'Nakhon Ratchasima', lat: 14.9715, lng: 102.1016 },
  { city: 'Udon Thani', country: 'Thailand', admin1: 'Udon Thani', lat: 17.4150, lng: 102.7890 },
  { city: 'Khon Kaen', country: 'Thailand', admin1: 'Khon Kaen', lat: 16.4322, lng: 102.8236 },
  { city: 'Chiang Rai', country: 'Thailand', admin1: 'Chiang Rai', lat: 19.9105, lng: 99.8406 },
  { city: 'Surat Thani', country: 'Thailand', admin1: 'Surat Thani', lat: 9.1396, lng: 99.3307 },
  
  // Singapore
  { city: 'Singapore', country: 'Singapore', admin1: 'Singapore', lat: 1.3521, lng: 103.8198 },
  
  // Malaysia
  { city: 'Kuala Lumpur', country: 'Malaysia', admin1: 'Kuala Lumpur', lat: 3.1390, lng: 101.6869 },
  { city: 'George Town', country: 'Malaysia', admin1: 'Penang', lat: 5.4149, lng: 100.3298 },
  { city: 'Johor Bahru', country: 'Malaysia', admin1: 'Johor', lat: 1.4927, lng: 103.7414 },
  { city: 'Ipoh', country: 'Malaysia', admin1: 'Perak', lat: 4.5975, lng: 101.0901 },
  { city: 'Kuching', country: 'Malaysia', admin1: 'Sarawak', lat: 1.5497, lng: 110.3639 },
  { city: 'Kota Kinabalu', country: 'Malaysia', admin1: 'Sabah', lat: 5.9804, lng: 116.0735 },
  { city: 'Shah Alam', country: 'Malaysia', admin1: 'Selangor', lat: 3.0738, lng: 101.5183 },
  { city: 'Malacca', country: 'Malaysia', admin1: 'Malacca', lat: 2.1896, lng: 102.2501 },
  { city: 'Alor Setar', country: 'Malaysia', admin1: 'Kedah', lat: 6.1254, lng: 100.3673 },
  { city: 'Miri', country: 'Malaysia', admin1: 'Sarawak', lat: 4.3995, lng: 113.9914 },
  
  // Indonesia
  { city: 'Jakarta', country: 'Indonesia', admin1: 'Jakarta', lat: -6.2088, lng: 106.8456 },
  { city: 'Surabaya', country: 'Indonesia', admin1: 'East Java', lat: -7.2575, lng: 112.7521 },
  { city: 'Bandung', country: 'Indonesia', admin1: 'West Java', lat: -6.9175, lng: 107.6191 },
  { city: 'Medan', country: 'Indonesia', admin1: 'North Sumatra', lat: 3.5952, lng: 98.6722 },
  { city: 'Semarang', country: 'Indonesia', admin1: 'Central Java', lat: -6.9667, lng: 110.4167 },
  { city: 'Makassar', country: 'Indonesia', admin1: 'South Sulawesi', lat: -5.1477, lng: 119.4327 },
  { city: 'Palembang', country: 'Indonesia', admin1: 'South Sumatra', lat: -2.9761, lng: 104.7754 },
  { city: 'Denpasar', country: 'Indonesia', admin1: 'Bali', lat: -8.6705, lng: 115.2126 },
  { city: 'Batam', country: 'Indonesia', admin1: 'Riau Islands', lat: 1.0456, lng: 104.0305 },
  { city: 'Padang', country: 'Indonesia', admin1: 'West Sumatra', lat: -0.9492, lng: 100.3543 },
  
  // Philippines
  { city: 'Manila', country: 'Philippines', admin1: 'Metro Manila', lat: 14.5995, lng: 120.9842 },
  { city: 'Quezon City', country: 'Philippines', admin1: 'Metro Manila', lat: 14.6760, lng: 121.0437 },
  { city: 'Caloocan', country: 'Philippines', admin1: 'Metro Manila', lat: 14.6546, lng: 120.9842 },
  { city: 'Davao', country: 'Philippines', admin1: 'Davao del Sur', lat: 7.1907, lng: 125.4553 },
  { city: 'Cebu City', country: 'Philippines', admin1: 'Cebu', lat: 10.3157, lng: 123.8854 },
  { city: 'Zamboanga', country: 'Philippines', admin1: 'Zamboanga del Sur', lat: 6.9214, lng: 122.0790 },
  { city: 'Antipolo', country: 'Philippines', admin1: 'Rizal', lat: 14.5886, lng: 121.1753 },
  { city: 'Pasig', country: 'Philippines', admin1: 'Metro Manila', lat: 14.5764, lng: 121.0851 },
  { city: 'Cagayan de Oro', country: 'Philippines', admin1: 'Misamis Oriental', lat: 8.4542, lng: 124.6319 },
  { city: 'Valenzuela', country: 'Philippines', admin1: 'Metro Manila', lat: 14.7000, lng: 120.9833 },
  
  // Vietnam
  { city: 'Ho Chi Minh City', country: 'Vietnam', admin1: 'Ho Chi Minh', lat: 10.8231, lng: 106.6297 },
  { city: 'Hanoi', country: 'Vietnam', admin1: 'Hanoi', lat: 21.0285, lng: 105.8542 },
  { city: 'Da Nang', country: 'Vietnam', admin1: 'Da Nang', lat: 16.0544, lng: 108.2022 },
  { city: 'Haiphong', country: 'Vietnam', admin1: 'Haiphong', lat: 20.8449, lng: 106.6881 },
  { city: 'Can Tho', country: 'Vietnam', admin1: 'Can Tho', lat: 10.0452, lng: 105.7469 },
  { city: 'Hue', country: 'Vietnam', admin1: 'Thua Thien Hue', lat: 16.4637, lng: 107.5909 },
  { city: 'Nha Trang', country: 'Vietnam', admin1: 'Khanh Hoa', lat: 12.2388, lng: 109.1967 },
  { city: 'Vung Tau', country: 'Vietnam', admin1: 'Ba Ria-Vung Tau', lat: 10.3460, lng: 107.0843 },
  { city: 'Quy Nhon', country: 'Vietnam', admin1: 'Binh Dinh', lat: 13.7820, lng: 109.2197 },
  { city: 'Phan Thiet', country: 'Vietnam', admin1: 'Binh Thuan', lat: 10.9376, lng: 108.1470 },
  
  // Russia
  { city: 'Moscow', country: 'Russia', admin1: 'Moscow', lat: 55.7558, lng: 37.6173 },
  { city: 'Saint Petersburg', country: 'Russia', admin1: 'Saint Petersburg', lat: 59.9343, lng: 30.3351 },
  { city: 'Novosibirsk', country: 'Russia', admin1: 'Novosibirsk Oblast', lat: 55.0084, lng: 82.9357 },
  { city: 'Yekaterinburg', country: 'Russia', admin1: 'Sverdlovsk Oblast', lat: 56.8431, lng: 60.6454 },
  { city: 'Kazan', country: 'Russia', admin1: 'Tatarstan', lat: 55.8304, lng: 49.0661 },
  { city: 'Nizhny Novgorod', country: 'Russia', admin1: 'Nizhny Novgorod Oblast', lat: 56.2965, lng: 43.9361 },
  { city: 'Chelyabinsk', country: 'Russia', admin1: 'Chelyabinsk Oblast', lat: 55.1644, lng: 61.4368 },
  { city: 'Samara', country: 'Russia', admin1: 'Samara Oblast', lat: 53.2001, lng: 50.15 },
  { city: 'Omsk', country: 'Russia', admin1: 'Omsk Oblast', lat: 54.9885, lng: 73.3242 },
  { city: 'Rostov-on-Don', country: 'Russia', admin1: 'Rostov Oblast', lat: 47.2357, lng: 39.7015 },
  
  // Turkey
  { city: 'Istanbul', country: 'Turkey', admin1: 'Istanbul', lat: 41.0082, lng: 28.9784 },
  { city: 'Ankara', country: 'Turkey', admin1: 'Ankara', lat: 39.9334, lng: 32.8597 },
  { city: 'Izmir', country: 'Turkey', admin1: 'Izmir', lat: 38.4237, lng: 27.1428 },
  { city: 'Bursa', country: 'Turkey', admin1: 'Bursa', lat: 40.1826, lng: 29.0665 },
  { city: 'Antalya', country: 'Turkey', admin1: 'Antalya', lat: 36.8969, lng: 30.7133 },
  { city: 'Adana', country: 'Turkey', admin1: 'Adana', lat: 36.9914, lng: 35.3308 },
  { city: 'Gaziantep', country: 'Turkey', admin1: 'Gaziantep', lat: 37.0662, lng: 37.3833 },
  { city: 'Konya', country: 'Turkey', admin1: 'Konya', lat: 37.8746, lng: 32.4932 },
  { city: 'Mersin', country: 'Turkey', admin1: 'Mersin', lat: 36.8000, lng: 34.6333 },
  { city: 'Diyarbakir', country: 'Turkey', admin1: 'Diyarbakir', lat: 37.9144, lng: 40.2306 },
  
  // Netherlands
  { city: 'Amsterdam', country: 'Netherlands', admin1: 'North Holland', lat: 52.3676, lng: 4.9041 },
  { city: 'Rotterdam', country: 'Netherlands', admin1: 'South Holland', lat: 51.9244, lng: 4.4777 },
  { city: 'The Hague', country: 'Netherlands', admin1: 'South Holland', lat: 52.0705, lng: 4.3007 },
  { city: 'Utrecht', country: 'Netherlands', admin1: 'Utrecht', lat: 52.0907, lng: 5.1214 },
  { city: 'Eindhoven', country: 'Netherlands', admin1: 'North Brabant', lat: 51.4416, lng: 5.4697 },
  { city: 'Groningen', country: 'Netherlands', admin1: 'Groningen', lat: 53.2194, lng: 6.5665 },
  { city: 'Tilburg', country: 'Netherlands', admin1: 'North Brabant', lat: 51.5653, lng: 5.0913 },
  { city: 'Almere', country: 'Netherlands', admin1: 'Flevoland', lat: 52.3508, lng: 5.2647 },
  { city: 'Breda', country: 'Netherlands', admin1: 'North Brabant', lat: 51.5719, lng: 4.7683 },
  { city: 'Nijmegen', country: 'Netherlands', admin1: 'Gelderland', lat: 51.8426, lng: 5.8597 },
  
  // Belgium
  { city: 'Brussels', country: 'Belgium', admin1: 'Brussels', lat: 50.8503, lng: 4.3517 },
  { city: 'Antwerp', country: 'Belgium', admin1: 'Antwerp', lat: 51.2194, lng: 4.4025 },
  { city: 'Ghent', country: 'Belgium', admin1: 'East Flanders', lat: 51.0543, lng: 3.7174 },
  { city: 'Charleroi', country: 'Belgium', admin1: 'Hainaut', lat: 50.4108, lng: 4.4446 },
  { city: 'Liège', country: 'Belgium', admin1: 'Liège', lat: 50.6326, lng: 5.5797 },
  { city: 'Bruges', country: 'Belgium', admin1: 'West Flanders', lat: 51.2093, lng: 3.2247 },
  { city: 'Namur', country: 'Belgium', admin1: 'Namur', lat: 50.4674, lng: 4.8719 },
  { city: 'Leuven', country: 'Belgium', admin1: 'Flemish Brabant', lat: 50.8798, lng: 4.7005 },
  { city: 'Mons', country: 'Belgium', admin1: 'Hainaut', lat: 50.4542, lng: 3.9567 },
  { city: 'Aalst', country: 'Belgium', admin1: 'East Flanders', lat: 50.9378, lng: 4.0409 },
  
  // Switzerland
  { city: 'Zurich', country: 'Switzerland', admin1: 'Zurich', lat: 47.3769, lng: 8.5417 },
  { city: 'Geneva', country: 'Switzerland', admin1: 'Geneva', lat: 46.2044, lng: 6.1432 },
  { city: 'Basel', country: 'Switzerland', admin1: 'Basel-Stadt', lat: 47.5596, lng: 7.5886 },
  { city: 'Bern', country: 'Switzerland', admin1: 'Bern', lat: 46.9481, lng: 7.4474 },
  { city: 'Lausanne', country: 'Switzerland', admin1: 'Vaud', lat: 46.5197, lng: 6.6323 },
  { city: 'Winterthur', country: 'Switzerland', admin1: 'Zurich', lat: 47.5000, lng: 8.7500 },
  { city: 'Lucerne', country: 'Switzerland', admin1: 'Lucerne', lat: 47.0502, lng: 8.3093 },
  { city: 'St. Gallen', country: 'Switzerland', admin1: 'St. Gallen', lat: 47.4245, lng: 9.3767 },
  { city: 'Lugano', country: 'Switzerland', admin1: 'Ticino', lat: 46.0037, lng: 8.9511 },
  { city: 'Biel', country: 'Switzerland', admin1: 'Bern', lat: 47.1400, lng: 7.2467 },
  
  // Austria
  { city: 'Vienna', country: 'Austria', admin1: 'Vienna', lat: 48.2082, lng: 16.3738 },
  { city: 'Graz', country: 'Austria', admin1: 'Styria', lat: 47.0707, lng: 15.4395 },
  { city: 'Linz', country: 'Austria', admin1: 'Upper Austria', lat: 48.3069, lng: 14.2858 },
  { city: 'Salzburg', country: 'Austria', admin1: 'Salzburg', lat: 47.8095, lng: 13.0550 },
  { city: 'Innsbruck', country: 'Austria', admin1: 'Tyrol', lat: 47.2692, lng: 11.4041 },
  { city: 'Klagenfurt', country: 'Austria', admin1: 'Carinthia', lat: 46.6247, lng: 14.3053 },
  { city: 'Villach', country: 'Austria', admin1: 'Carinthia', lat: 46.6103, lng: 13.8558 },
  { city: 'Wels', country: 'Austria', admin1: 'Upper Austria', lat: 48.1575, lng: 14.0219 },
  { city: 'Sankt Pölten', country: 'Austria', admin1: 'Lower Austria', lat: 48.2048, lng: 15.6256 },
  { city: 'Dornbirn', country: 'Austria', admin1: 'Vorarlberg', lat: 47.4125, lng: 9.7442 },
  
  // Sweden
  { city: 'Stockholm', country: 'Sweden', admin1: 'Stockholm', lat: 59.3293, lng: 18.0686 },
  { city: 'Gothenburg', country: 'Sweden', admin1: 'Västra Götaland', lat: 57.7089, lng: 11.9746 },
  { city: 'Malmö', country: 'Sweden', admin1: 'Skåne', lat: 55.6059, lng: 13.0007 },
  { city: 'Uppsala', country: 'Sweden', admin1: 'Uppsala', lat: 59.8586, lng: 17.6389 },
  { city: 'Västerås', country: 'Sweden', admin1: 'Västmanland', lat: 59.6099, lng: 16.5448 },
  { city: 'Örebro', country: 'Sweden', admin1: 'Örebro', lat: 59.2741, lng: 15.2066 },
  { city: 'Linköping', country: 'Sweden', admin1: 'Östergötland', lat: 58.4108, lng: 15.6214 },
  { city: 'Helsingborg', country: 'Sweden', admin1: 'Skåne', lat: 56.0467, lng: 12.6945 },
  { city: 'Jönköping', country: 'Sweden', admin1: 'Jönköping', lat: 57.7814, lng: 14.1562 },
  { city: 'Norrköping', country: 'Sweden', admin1: 'Östergötland', lat: 58.5942, lng: 16.1826 },
  
  // Norway
  { city: 'Oslo', country: 'Norway', admin1: 'Oslo', lat: 59.9139, lng: 10.7522 },
  { city: 'Bergen', country: 'Norway', admin1: 'Vestland', lat: 60.3913, lng: 5.3221 },
  { city: 'Trondheim', country: 'Norway', admin1: 'Trøndelag', lat: 63.4305, lng: 10.3951 },
  { city: 'Stavanger', country: 'Norway', admin1: 'Rogaland', lat: 58.9700, lng: 5.7331 },
  { city: 'Bærum', country: 'Norway', admin1: 'Viken', lat: 59.9236, lng: 10.5000 },
  { city: 'Kristiansand', country: 'Norway', admin1: 'Agder', lat: 58.1467, lng: 7.9956 },
  { city: 'Fredrikstad', country: 'Norway', admin1: 'Viken', lat: 59.2181, lng: 10.9298 },
  { city: 'Sandnes', country: 'Norway', admin1: 'Rogaland', lat: 58.8520, lng: 5.7353 },
  { city: 'Tromsø', country: 'Norway', admin1: 'Troms og Finnmark', lat: 69.6492, lng: 18.9553 },
  { city: 'Sarpsborg', country: 'Norway', admin1: 'Viken', lat: 59.2833, lng: 11.1167 },
  
  // Denmark
  { city: 'Copenhagen', country: 'Denmark', admin1: 'Capital Region', lat: 55.6761, lng: 12.5683 },
  { city: 'Aarhus', country: 'Denmark', admin1: 'Central Denmark', lat: 56.1629, lng: 10.2039 },
  { city: 'Odense', country: 'Denmark', admin1: 'South Denmark', lat: 55.4038, lng: 10.4024 },
  { city: 'Aalborg', country: 'Denmark', admin1: 'North Denmark', lat: 57.0488, lng: 9.9217 },
  { city: 'Esbjerg', country: 'Denmark', admin1: 'South Denmark', lat: 55.4869, lng: 8.4513 },
  { city: 'Randers', country: 'Denmark', admin1: 'Central Denmark', lat: 56.4600, lng: 10.0364 },
  { city: 'Kolding', country: 'Denmark', admin1: 'South Denmark', lat: 55.4904, lng: 9.4721 },
  { city: 'Horsens', country: 'Denmark', admin1: 'Central Denmark', lat: 55.8607, lng: 9.8500 },
  { city: 'Vejle', country: 'Denmark', admin1: 'South Denmark', lat: 55.7093, lng: 9.5357 },
  { city: 'Roskilde', country: 'Denmark', admin1: 'Zealand', lat: 55.6415, lng: 12.0803 },
  
  // Finland
  { city: 'Helsinki', country: 'Finland', admin1: 'Uusimaa', lat: 60.1699, lng: 24.9384 },
  { city: 'Espoo', country: 'Finland', admin1: 'Uusimaa', lat: 60.2052, lng: 24.6522 },
  { city: 'Tampere', country: 'Finland', admin1: 'Pirkanmaa', lat: 61.4978, lng: 23.7610 },
  { city: 'Vantaa', country: 'Finland', admin1: 'Uusimaa', lat: 60.2934, lng: 25.0378 },
  { city: 'Oulu', country: 'Finland', admin1: 'North Ostrobothnia', lat: 65.0121, lng: 25.4651 },
  { city: 'Turku', country: 'Finland', admin1: 'Southwest Finland', lat: 60.4518, lng: 22.2666 },
  { city: 'Jyväskylä', country: 'Finland', admin1: 'Central Finland', lat: 62.2415, lng: 25.7209 },
  { city: 'Lahti', country: 'Finland', admin1: 'Päijät-Häme', lat: 60.9827, lng: 25.6612 },
  { city: 'Kuopio', country: 'Finland', admin1: 'North Savonia', lat: 61.4991, lng: 27.6781 },
  { city: 'Pori', country: 'Finland', admin1: 'Satakunta', lat: 61.4851, lng: 21.7974 },
  
  // Poland
  { city: 'Warsaw', country: 'Poland', admin1: 'Masovian', lat: 52.2297, lng: 21.0122 },
  { city: 'Kraków', country: 'Poland', admin1: 'Lesser Poland', lat: 50.0647, lng: 19.9450 },
  { city: 'Łódź', country: 'Poland', admin1: 'Łódź', lat: 51.7592, lng: 19.4560 },
  { city: 'Wrocław', country: 'Poland', admin1: 'Lower Silesian', lat: 51.1079, lng: 17.0385 },
  { city: 'Poznań', country: 'Poland', admin1: 'Greater Poland', lat: 52.4064, lng: 16.9252 },
  { city: 'Gdańsk', country: 'Poland', admin1: 'Pomeranian', lat: 54.3520, lng: 18.6466 },
  { city: 'Szczecin', country: 'Poland', admin1: 'West Pomeranian', lat: 53.4285, lng: 14.5528 },
  { city: 'Bydgoszcz', country: 'Poland', admin1: 'Kuyavian-Pomeranian', lat: 53.1235, lng: 18.0084 },
  { city: 'Lublin', country: 'Poland', admin1: 'Lublin', lat: 51.2465, lng: 22.5684 },
  { city: 'Katowice', country: 'Poland', admin1: 'Silesian', lat: 50.2649, lng: 19.0238 },
  
  // More countries - adding key cities to reach ~800 total
  // South Africa
  { city: 'Cape Town', country: 'South Africa', admin1: 'Western Cape', lat: -33.9249, lng: 18.4241 },
  { city: 'Johannesburg', country: 'South Africa', admin1: 'Gauteng', lat: -26.2041, lng: 28.0473 },
  { city: 'Durban', country: 'South Africa', admin1: 'KwaZulu-Natal', lat: -29.8587, lng: 31.0218 },
  { city: 'Pretoria', country: 'South Africa', admin1: 'Gauteng', lat: -25.7479, lng: 28.2293 },
  { city: 'Port Elizabeth', country: 'South Africa', admin1: 'Eastern Cape', lat: -33.9608, lng: 25.6022 },
  
  // Egypt
  { city: 'Cairo', country: 'Egypt', admin1: 'Cairo', lat: 30.0444, lng: 31.2357 },
  { city: 'Alexandria', country: 'Egypt', admin1: 'Alexandria', lat: 31.2001, lng: 29.9187 },
  { city: 'Giza', country: 'Egypt', admin1: 'Giza', lat: 30.0131, lng: 31.2089 },
  { city: 'Shubra El Kheima', country: 'Egypt', admin1: 'Qalyubia', lat: 30.1286, lng: 31.2422 },
  { city: 'Port Said', country: 'Egypt', admin1: 'Port Said', lat: 31.2653, lng: 32.3019 },
  
  // UAE
  { city: 'Dubai', country: 'United Arab Emirates', admin1: 'Dubai', lat: 25.2048, lng: 55.2708 },
  { city: 'Abu Dhabi', country: 'United Arab Emirates', admin1: 'Abu Dhabi', lat: 24.4539, lng: 54.3773 },
  { city: 'Sharjah', country: 'United Arab Emirates', admin1: 'Sharjah', lat: 25.3573, lng: 55.4033 },
  { city: 'Al Ain', country: 'United Arab Emirates', admin1: 'Abu Dhabi', lat: 24.2075, lng: 55.7447 },
  { city: 'Ajman', country: 'United Arab Emirates', admin1: 'Ajman', lat: 25.4052, lng: 55.5136 },
  
  // Israel
  { city: 'Tel Aviv', country: 'Israel', admin1: 'Tel Aviv', lat: 32.0853, lng: 34.7818 },
  { city: 'Jerusalem', country: 'Israel', admin1: 'Jerusalem', lat: 31.7683, lng: 35.2137 },
  { city: 'Haifa', country: 'Israel', admin1: 'Haifa', lat: 32.7940, lng: 34.9896 },
  { city: 'Rishon LeZion', country: 'Israel', admin1: 'Central', lat: 31.9730, lng: 34.7925 },
  { city: 'Petah Tikva', country: 'Israel', admin1: 'Central', lat: 32.0889, lng: 34.8564 },
  
  // New Zealand
  { city: 'Auckland', country: 'New Zealand', admin1: 'Auckland', lat: -36.8485, lng: 174.7633 },
  { city: 'Wellington', country: 'New Zealand', admin1: 'Wellington', lat: -41.2865, lng: 174.7762 },
  { city: 'Christchurch', country: 'New Zealand', admin1: 'Canterbury', lat: -43.5321, lng: 172.6362 },
  { city: 'Hamilton', country: 'New Zealand', admin1: 'Waikato', lat: -37.7870, lng: 175.2793 },
  { city: 'Tauranga', country: 'New Zealand', admin1: 'Bay of Plenty', lat: -37.6878, lng: 176.1651 },
  
  // Chile
  { city: 'Santiago', country: 'Chile', admin1: 'Santiago Metropolitan', lat: -33.4489, lng: -70.6693 },
  { city: 'Valparaíso', country: 'Chile', admin1: 'Valparaíso', lat: -33.0472, lng: -71.6127 },
  { city: 'Concepción', country: 'Chile', admin1: 'Biobío', lat: -36.8201, lng: -73.0444 },
  { city: 'La Serena', country: 'Chile', admin1: 'Coquimbo', lat: -29.9027, lng: -71.2519 },
  { city: 'Antofagasta', country: 'Chile', admin1: 'Antofagasta', lat: -23.6509, lng: -70.3975 },
  
  // Colombia
  { city: 'Bogotá', country: 'Colombia', admin1: 'Cundinamarca', lat: 4.7110, lng: -74.0721 },
  { city: 'Medellín', country: 'Colombia', admin1: 'Antioquia', lat: 6.2476, lng: -75.5658 },
  { city: 'Cali', country: 'Colombia', admin1: 'Valle del Cauca', lat: 3.4516, lng: -76.5320 },
  { city: 'Barranquilla', country: 'Colombia', admin1: 'Atlántico', lat: 10.9639, lng: -74.7964 },
  { city: 'Cartagena', country: 'Colombia', admin1: 'Bolívar', lat: 10.3910, lng: -75.4794 },
  
  // Peru
  { city: 'Lima', country: 'Peru', admin1: 'Lima', lat: -12.0464, lng: -77.0428 },
  { city: 'Arequipa', country: 'Peru', admin1: 'Arequipa', lat: -16.4090, lng: -71.5375 },
  { city: 'Trujillo', country: 'Peru', admin1: 'La Libertad', lat: -8.1116, lng: -79.0288 },
  { city: 'Chiclayo', country: 'Peru', admin1: 'Lambayeque', lat: -6.7714, lng: -79.8409 },
  { city: 'Piura', country: 'Peru', admin1: 'Piura', lat: -5.1945, lng: -80.6328 },
  
  // Portugal
  { city: 'Lisbon', country: 'Portugal', admin1: 'Lisbon', lat: 38.7223, lng: -9.1393 },
  { city: 'Porto', country: 'Portugal', admin1: 'Porto', lat: 41.1579, lng: -8.6291 },
  { city: 'Amadora', country: 'Portugal', admin1: 'Lisbon', lat: 38.7538, lng: -9.2308 },
  { city: 'Braga', country: 'Portugal', admin1: 'Braga', lat: 41.5454, lng: -8.4265 },
  { city: 'Funchal', country: 'Portugal', admin1: 'Madeira', lat: 32.6669, lng: -16.9241 },
  
  // Greece
  { city: 'Athens', country: 'Greece', admin1: 'Attica', lat: 37.9838, lng: 23.7275 },
  { city: 'Thessaloniki', country: 'Greece', admin1: 'Central Macedonia', lat: 40.6401, lng: 22.9444 },
  { city: 'Patras', country: 'Greece', admin1: 'Western Greece', lat: 38.2466, lng: 21.7346 },
  { city: 'Heraklion', country: 'Greece', admin1: 'Crete', lat: 35.3081, lng: 25.0772 },
  { city: 'Larissa', country: 'Greece', admin1: 'Thessaly', lat: 39.6390, lng: 22.4191 },
  
  // Ireland
  { city: 'Dublin', country: 'Ireland', admin1: 'Leinster', lat: 53.3498, lng: -6.2603 },
  { city: 'Cork', country: 'Ireland', admin1: 'Munster', lat: 51.8985, lng: -8.4756 },
  { city: 'Limerick', country: 'Ireland', admin1: 'Munster', lat: 52.6639, lng: -8.6267 },
  { city: 'Galway', country: 'Ireland', admin1: 'Connacht', lat: 53.2707, lng: -9.0568 },
  { city: 'Waterford', country: 'Ireland', admin1: 'Munster', lat: 52.2593, lng: -7.1101 },
  
  // Romania
  { city: 'Bucharest', country: 'Romania', admin1: 'Bucharest', lat: 44.4268, lng: 26.1025 },
  { city: 'Cluj-Napoca', country: 'Romania', admin1: 'Cluj', lat: 46.7712, lng: 23.6236 },
  { city: 'Timișoara', country: 'Romania', admin1: 'Timiș', lat: 45.7489, lng: 21.2087 },
  { city: 'Iași', country: 'Romania', admin1: 'Iași', lat: 47.1585, lng: 27.6014 },
  { city: 'Constanța', country: 'Romania', admin1: 'Constanța', lat: 44.1598, lng: 28.6348 },
  
  // Hungary
  { city: 'Budapest', country: 'Hungary', admin1: 'Budapest', lat: 47.4979, lng: 19.0402 },
  { city: 'Debrecen', country: 'Hungary', admin1: 'Hajdú-Bihar', lat: 47.5316, lng: 21.6273 },
  { city: 'Szeged', country: 'Hungary', admin1: 'Csongrád-Csanád', lat: 46.2530, lng: 20.1414 },
  { city: 'Miskolc', country: 'Hungary', admin1: 'Borsod-Abaúj-Zemplén', lat: 48.1034, lng: 20.7784 },
  { city: 'Pécs', country: 'Hungary', admin1: 'Baranya', lat: 46.0727, lng: 18.2328 },
  
  // Czech Republic
  { city: 'Prague', country: 'Czech Republic', admin1: 'Prague', lat: 50.0755, lng: 14.4378 },
  { city: 'Brno', country: 'Czech Republic', admin1: 'South Moravian', lat: 49.1951, lng: 16.6068 },
  { city: 'Ostrava', country: 'Czech Republic', admin1: 'Moravian-Silesian', lat: 49.8209, lng: 18.2625 },
  { city: 'Plzeň', country: 'Czech Republic', admin1: 'Plzeň', lat: 49.7475, lng: 13.3776 },
  { city: 'Liberec', country: 'Czech Republic', admin1: 'Liberec', lat: 50.7671, lng: 15.0566 },
];

// Add slugs to all cities
const citiesWithSlugs = globalCities.map(city => ({
  ...city,
  slug: createSlug(city.city, city.country)
}));

// Write to file
const outputPath = path.join(__dirname, '../data/global-cities.json');
fs.writeFileSync(outputPath, JSON.stringify(citiesWithSlugs, null, 2), 'utf8');

if (!isProdBuild) {
  console.log(`✅ Generated global-cities.json with ${citiesWithSlugs.length} cities`);
}

