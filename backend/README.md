# TravelTraces Stateless Services

FastAPI gateway for capabilities that cannot run from browser storage: Trace AI, geocoding, route calculation, and meetup suggestions. TravelTraces application records are stored by the frontend in versioned localStorage tables during the prototype phase.

## Run locally

```powershell
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Endpoints

- `GET /health`
- `GET /api/search?query=Manila&limit=8`
- `GET /api/reverse?lat=14.5995&lon=120.9842`
- `POST /api/route`
- `POST /api/routes/driving`
- `POST /api/meetup/suggest`
- `POST /api/chat`

Authentication, profiles, stories, pins, travel plans, events, groups, messages, achievements, and saved items are not persisted by this service.
