import os
from datetime import datetime, timedelta, timezone
from pathlib import Path
import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="Sentinel North API", version="0.1.0")
app.add_middleware(CORSMiddleware, allow_origins=[os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")], allow_methods=["GET"], allow_headers=["*"])
USGS_URL = "https://earthquake.usgs.gov/fdsnws/event/1/query"
frontend_dist = Path(__file__).resolve().parent.parent / "frontend" / "dist"
if frontend_dist.exists():
    app.mount("/assets", StaticFiles(directory=frontend_dist / "assets"), name="assets")

@app.get("/")
def frontend():
    if frontend_dist.exists(): return FileResponse(frontend_dist / "index.html")
    return {"service": "sentinel-north", "message": "Run the Vite frontend during local development."}

@app.get("/api/health")
def health(): return {"status": "ok", "service": "sentinel-north"}

@app.get("/api/incidents")
async def incidents(minmagnitude: float = 2.5):
    params = {"format": "geojson", "eventtype": "earthquake", "minmagnitude": minmagnitude, "limit": 40, "orderby": "time-asc", "starttime": (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()}
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.get(USGS_URL, params=params)
            response.raise_for_status()
            incidents = []
            for feature in response.json().get("features", []):
                properties = feature.get("properties", {})
                coordinates = (feature.get("geometry") or {}).get("coordinates") or [None, None, None]
                incidents.append({"id": feature.get("id"), "place": properties.get("place") or "Unknown location", "magnitude": properties.get("mag"), "time": properties.get("time"), "url": properties.get("url"), "depth": coordinates[2], "lat": coordinates[1], "lon": coordinates[0]})
            return {"source": "USGS Earthquake Hazards Program", "fetched_at": datetime.now(timezone.utc).isoformat(), "incidents": list(reversed(incidents))}
    except httpx.HTTPError as exc:
        raise HTTPException(502, f"Live incident feed unavailable: {exc}") from exc
