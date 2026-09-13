export type Check = { name: string; value: string; detail: string; risk: number; time?: string }
export function verdict(checks: Check[]) {
  if (checks.some(c => c.risk === 2)) return { tone: 'bad', title: 'No — conditions need attention', label: 'Avoid outdoor activity', detail: 'One or more monitored conditions exceed this project’s high-risk limits. Review the reasons below and local guidance.' }
  if (checks.length < 3 || checks.some(c => c.risk < 0)) return { tone: 'unknown', title: 'Unable to assess', label: 'Data incomplete', detail: 'A required feed is unavailable or outdated. We cannot give an all-clear.' }
  if (checks.some(c => c.risk === 1)) return { tone: 'warn', title: 'Use caution outside', label: 'Caution', detail: 'Some conditions deserve attention. Check the affected category before making outdoor plans.' }
  return { tone: 'good', title: 'Yes — conditions look favorable', label: 'Favorable', detail: 'No configured air, weather, or nearby earthquake thresholds are exceeded. This is a limited conditions check, not a guarantee of safety.' }
}
export const cities = [
  { name: 'Indianapolis', country: 'United States', lat: 39.7684, lon: -86.1581 },
  { name: 'Los Angeles', country: 'United States', lat: 34.0522, lon: -118.2437 },
  { name: 'Delhi', country: 'India', lat: 28.6139, lon: 77.209 },
  { name: 'Reykjavík', country: 'Iceland', lat: 64.1466, lon: -21.9426 },
]
async function json(url: string) { const r = await fetch(url, { signal: AbortSignal.timeout(20000) }); if (!r.ok) throw Error(`HTTP ${r.status}`); return r.json() }
function current(data: any, fields: string[]) { const c = data.current; const age = Date.now() - Date.parse(c?.time + 'Z'); if (!Number.isFinite(age) || age > 3 * 3600000 || age < -3600000 || fields.some(f => typeof c[f] !== 'number' || !Number.isFinite(c[f]))) throw Error('Missing or stale readings'); return c }
export async function assess(city: typeof cities[number]): Promise<Check[]> {
  const coords = `latitude=${city.lat}&longitude=${city.lon}`
  const requests = [
    json(`https://air-quality-api.open-meteo.com/v1/air-quality?${coords}&current=us_aqi,pm2_5&timezone=GMT`).then(d => { const c = current(d, ['us_aqi', 'pm2_5']); return { name: 'Air quality', value: `${Math.round(c.us_aqi)} AQI`, risk: c.us_aqi > 150 ? 2 : c.us_aqi > 50 ? 1 : 0, detail: `${c.us_aqi <= 50 ? 'Good air quality' : c.us_aqi <= 100 ? 'Moderate air quality' : c.us_aqi <= 150 ? 'Unhealthy for sensitive groups' : 'Unhealthy air quality'} · PM2.5 ${c.pm2_5.toFixed(1)} µg/m³. CAMS model estimate.`, time: c.time + 'Z' } }),
    json(`https://api.open-meteo.com/v1/forecast?${coords}&current=apparent_temperature,wind_speed_10m,weather_code&timezone=GMT`).then(d => { const c = current(d, ['apparent_temperature', 'wind_speed_10m', 'weather_code']); const risk = c.apparent_temperature >= 40 || c.apparent_temperature <= -15 || c.wind_speed_10m >= 60 || c.weather_code >= 95 ? 2 : c.apparent_temperature >= 32 || c.apparent_temperature <= 0 || c.wind_speed_10m >= 35 || c.weather_code >= 51 ? 1 : 0; return { name: 'Weather', value: `${Math.round(c.apparent_temperature)}°C`, risk, detail: `Feels like · wind ${Math.round(c.wind_speed_10m)} km/h · ${c.weather_code >= 95 ? 'thunderstorms' : c.weather_code >= 71 ? 'snow / showers' : c.weather_code >= 51 ? 'rain / drizzle' : c.weather_code >= 45 ? 'fog' : 'no precipitation indicated'}. Weather model estimate; official alerts not included.`, time: c.time + 'Z' } }),
    json(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&${coords}&maxradiuskm=100&minmagnitude=2.5&starttime=${new Date(Date.now()-86400000).toISOString()}&orderby=time&limit=20000`).then(d => { if (!Array.isArray(d.features) || d.features.length >= 20000 || d.features.some((f: any) => typeof f.properties?.mag !== 'number')) throw Error('Incomplete earthquake feed'); const max = Math.max(0, ...d.features.map((f: any) => f.properties.mag)); return { name: 'Earthquakes', value: `${d.features.length} nearby`, risk: max >= 4.5 ? 1 : 0, detail: d.features.length ? `Largest M${max.toFixed(1)} within 100 km in 24 hours. ${max >= 4.5 ? 'Review local reports; magnitude alone does not determine local danger.' : 'No M4.5+ events reported.'}` : 'No M2.5+ earthquakes reported within 100 km in the last 24 hours.', time: new Date().toISOString() } }),
  ]
  const results = await Promise.allSettled(requests)
  return results.map((r, i) => r.status === 'fulfilled' ? r.value : { name: ['Air quality', 'Weather', 'Earthquakes'][i], value: 'Unavailable', detail: 'Could not retrieve a complete, current feed. Retry to check again.', risk: -1 })
}
