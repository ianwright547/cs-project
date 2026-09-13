# Threshold Outside

A location-based outdoor conditions dashboard. Run `npm install` and `npm run dev` in `frontend`, then open http://localhost:5173.

The browser requests current CAMS air-quality estimates and weather model conditions from Open-Meteo, plus USGS earthquakes within 100 km during the previous 24 hours. Four cities can be compared; results are never fabricated. Data refreshes every five minutes or on request.

The transparent calculation is in `frontend/src/assessment.ts`. The most serious condition wins; failed, invalid, or stale feeds cannot produce a favorable result. AQI above 150 triggers high risk; 51–150 prompts caution. Weather and seismic limits are project heuristics, documented in the dashboard. Earthquake magnitude does not establish whether staying indoors is appropriate.

This prototype does not include official weather alerts, UV, or individual health needs. Air and weather values are model estimates rather than local sensor measurements.

The existing FastAPI endpoint and Docker files are preliminary scaffolding. The running dashboard calls public APIs directly; PostgreSQL persistence and AWS deployment are not implemented or verified.

Sources: https://open-meteo.com/en/docs/air-quality-api (CAMS attribution), https://open-meteo.com/en/docs, https://earthquake.usgs.gov/fdsnws/event/1/.
