# Production Docker Layout

Run from `backend/`:

```powershell
docker compose up --build
```

Scale the stateless API workers behind the Nginx web tier:

```powershell
docker compose up --build --scale api=2
```

Public entrypoint:

- Web/API proxy: `http://localhost:8080`
- Internal API service: `api:8000`
