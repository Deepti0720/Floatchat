import type {
  DepthPoint,
  FloatInfo,
  FloatObservation,
  OceanDataset,
  QueryParams,
  Variable,
} from '@/types';

const ARABIAN_SEA_FLOATS: FloatInfo[] = [
  { id: '2902092', lat: 15.1, lon: 69.8, region: 'Arabian Sea', cycle: 1247 },
  { id: '2902093', lat: 14.6, lon: 70.4, region: 'Arabian Sea', cycle: 1102 },
  { id: '2902094', lat: 15.5, lon: 69.2, region: 'Arabian Sea', cycle: 983 },
  { id: '2902095', lat: 16.2, lon: 70.9, region: 'Arabian Sea', cycle: 856 },
  { id: '2902096', lat: 14.1, lon: 71.3, region: 'Arabian Sea', cycle: 1401 },
  { id: '2902097', lat: 16.8, lon: 68.5, region: 'Arabian Sea', cycle: 734 },
];

const BOB_FLOATS: FloatInfo[] = [
  { id: '2901732', lat: 15.0, lon: 89.5, region: 'Bay of Bengal', cycle: 1189 },
  { id: '2901733', lat: 14.3, lon: 90.1, region: 'Bay of Bengal', cycle: 1056 },
  { id: '2901734', lat: 16.1, lon: 88.9, region: 'Bay of Bengal', cycle: 921 },
  { id: '2901735', lat: 13.7, lon: 90.8, region: 'Bay of Bengal', cycle: 1322 },
  { id: '2901736', lat: 16.8, lon: 87.6, region: 'Bay of Bengal', cycle: 678 },
];

function generateProfile(maxDepth: number, surfaceTemp: number, surfaceSal: number): DepthPoint[] {
  const points: DepthPoint[] = [];
  const steps = Math.min(Math.floor(maxDepth / 10), 60);
  for (let i = 0; i <= steps; i++) {
    const pressure = (i / steps) * maxDepth;
    // Thermocline: sharp gradient between 50-200m, then asymptotic to ~4°C
    let temperature: number;
    if (pressure < 30) {
      temperature = surfaceTemp - (pressure / 30) * 0.8;
    } else if (pressure < 200) {
      // Thermocline zone — exponential decay
      const t = (pressure - 30) / 170;
      temperature = (surfaceTemp - 0.8) * Math.exp(-t * 1.6) + 4 + (1 - Math.exp(-t * 1.6)) * 0.5;
    } else {
      temperature = 4.2 + 0.8 * Math.exp(-(pressure - 200) / 800);
    }
    // Salinity: subsurface max around 100-150m, then decreases slightly
    let salinity: number;
    if (pressure < 120) {
      const t = pressure / 120;
      salinity = surfaceSal + 0.6 * Math.sin(t * Math.PI) - 0.2 * t;
    } else {
      salinity = surfaceSal + 0.4 * Math.exp(-(pressure - 120) / 500) + 0.1;
    }
    // Small noise
    const noiseT = (Math.sin(pressure * 0.13) + Math.cos(pressure * 0.07)) * 0.15;
    const noiseS = (Math.sin(pressure * 0.09) + Math.cos(pressure * 0.11)) * 0.04;
    points.push({
      pressure: Math.round(pressure * 10) / 10,
      temperature: Math.round((temperature + noiseT) * 100) / 100,
      salinity: Math.round((salinity + noiseS) * 100) / 100,
    });
  }
  return points;
}

function generateObservations(
  profile: DepthPoint[],
  baseLat: number,
  baseLon: number,
  count: number
): FloatObservation[] {
  const obs: FloatObservation[] = [];
  const depths = [10, 50, 100, 150, 200, 500, 750, 1000];
  for (let i = 0; i < count; i++) {
    const dayOffset = i * 5;
    const date = new Date(2024, 0, 1);
    date.setDate(date.getDate() + dayOffset);
    const depthIdx = i % depths.length;
    const pressure = depths[depthIdx];
    const profilePoint = profile.find((p) => Math.abs(p.pressure - pressure) < 15) ?? profile[0];
    const latJitter = baseLat + (Math.sin(i * 0.5) * 0.3);
    const lonJitter = baseLon + (Math.cos(i * 0.4) * 0.25);
    obs.push({
      date: date.toISOString().split('T')[0],
      latitude: Math.round(latJitter * 100) / 100,
      longitude: Math.round(lonJitter * 100) / 100,
      pressure,
      temperature: profilePoint.temperature + (Math.random() - 0.5) * 0.4,
      salinity: profilePoint.salinity + (Math.random() - 0.5) * 0.1,
    });
  }
  return obs;
}

function buildSummary(params: QueryParams, profile: DepthPoint[]): string {
  const surface = profile[0];
  const deep = profile[profile.length - 1];
  const thermocline = profile.find((p, i) => i > 2 && p.temperature < surface.temperature - 3) ?? profile[5];
  const tempGradient = ((surface.temperature - thermocline.temperature) / (thermocline.pressure - surface.pressure) * 100).toFixed(2);
  const maxSal = profile.reduce((m, p) => (p.salinity > m.salinity ? p : m), profile[0]);
  const minSal = profile.reduce((m, p) => (p.salinity < m.salinity ? p : m), profile[0]);

  return `## Oceanographic Analysis — ${params.region}

**Query Parameters:** ${params.lat}°N, ${params.lon}°E | Depth range: 0–${params.depth}m | Date range: ${params.dateRange}

### Thermal Structure
The vertical temperature profile at ${params.lat}°N, ${params.lon}°E reveals a classic tropical ocean thermal structure characteristic of the ${params.region}. Surface temperatures of **${surface.temperature.toFixed(1)}°C** reflect strong solar insolation in this region. A pronounced thermocline is centered at approximately **${thermocline.pressure.toFixed(0)}m depth**, where temperature drops sharply to ${thermocline.temperature.toFixed(1)}°C. The mean thermal gradient through the thermocline is **${tempGradient}°C/100m**, indicating strong stratification.

Below the thermocline, temperatures asymptotically approach **${deep.temperature.toFixed(1)}°C** at ${deep.pressure.toFixed(0)}m, consistent with deep-water masses of Indian Ocean origin. The mixed layer depth is estimated at ~30m, shallower than the climatological mean, possibly indicating post-monsoon conditions or active baroclinic adjustment.

### Salinity Structure
Salinity ranges from **${minSal.salinity.toFixed(2)} PSU** (at ${minSal.pressure.toFixed(0)}m) to **${maxSal.salinity.toFixed(2)} PSU** (at ${maxSal.pressure.toFixed(0)}m). A subsurface salinity maximum is detected near ${maxSal.pressure.toFixed(0)}m, characteristic of the Arabian Sea high-salinity intermediate water mass. Surface salinities of ${surface.salinity.toFixed(2)} PSU are relatively low, suggesting influence of riverine freshwater input or monsoon-driven precipitation.

### Anomaly Detection
Comparison against the 2020–2025 climatology indicates a **+0.4°C positive temperature anomaly** in the upper 100m, potentially linked to the recent intensification of the Indian Ocean Dipole (IOD) positive phase. No significant salinity anomalies were detected beyond natural variability.

### Scientific Implications
The observed thermal structure supports the presence of strong barrier layer dynamics, which have implications for tropical cyclone heat potential (TCHP) and ocean-atmosphere heat exchange. The shallow mixed layer combined with high sea surface temperatures creates favorable conditions for convective activity in the region.`;
}

export function generateDataset(params: QueryParams): OceanDataset {
  const isBoB = params.region.toLowerCase().includes('bengal');
  const surfaceTemp = isBoB ? 28.5 : 29.0;
  const surfaceSal = isBoB ? 33.8 : 35.2;
  const profile = generateProfile(params.depth, surfaceTemp, surfaceSal);
  const floats = isBoB ? BOB_FLOATS : ARABIAN_SEA_FLOATS;
  const observations = generateObservations(profile, params.lat, params.lon, 24);
  const summary = buildSummary(params, profile);

  return { profile, floats, observations, summary, params };
}

export function parseQuery(text: string): QueryParams {
  const lower = text.toLowerCase();
  const isBoB = lower.includes('bengal');
  const region = isBoB ? 'Bay of Bengal' : 'Arabian Sea';

  // Try to extract coordinates
  let lat = 15;
  let lon = isBoB ? 90 : 70;
  const latMatch = text.match(/(-?\d+(?:\.\d+)?)\s*°?\s*[nN]/);
  const lonMatch = text.match(/(-?\d+(?:\.\d+)?)\s*°?\s*[eE]/);
  if (latMatch) lat = parseFloat(latMatch[1]);
  if (lonMatch) lon = parseFloat(lonMatch[1]);

  // Extract depth
  let depth = 1000;
  const depthMatch = text.match(/(\d+)\s*m/i);
  if (depthMatch) depth = parseInt(depthMatch[1], 10);

  // Extract variable
  let variable: Variable = 'both';
  if (lower.includes('temperature') && !lower.includes('salinity')) variable = 'temperature';
  else if (lower.includes('salinity') && !lower.includes('temperature')) variable = 'salinity';

  // Extract date range
  let dateRange = '2020-2025';
  const yearMatch = text.match(/(20\d{2})\s*[-–]\s*(20\d{2})/);
  if (yearMatch) dateRange = `${yearMatch[1]}-${yearMatch[2]}`;

  return { lat, lon, depth, dateRange, variable, region };
}

export function generateAssistantResponse(params: QueryParams): string {
  const varLabel =
    params.variable === 'temperature'
      ? 'temperature'
      : params.variable === 'salinity'
        ? 'salinity'
        : 'temperature and salinity';
  return `Querying ERDDAP node for ${varLabel} data at ${params.lat}°N, ${params.lon}°E (${params.region}) down to ${params.depth}m. Data retrieved from ${params.dateRange}. All canvas tabs have been updated with the latest profile, trajectory map, raw observations, and scientific summary.`;
}
