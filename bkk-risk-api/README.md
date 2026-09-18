# BKK Risk API — NestJS In-Memory Mock

Implementation of the uploaded **BKK Data Base API v0.2.0** contract without a database.

## Requirements

- Node.js 24 LTS recommended.
- npm.

## Install

```bash
npm install
```

## Environment

Copy `.env.example` to `.env`.

For the mock admin guard:

```text
ADMIN_MOCK_TOKEN=mock-admin-token
```

## Run

```bash
npm run start:dev
```

Swagger:

- http://localhost:3000/swagger
- OpenAPI JSON: http://localhost:3000/swagger-json

## Endpoints

```text
GET   /api/risk-points
GET   /api/risk-points/ranking
GET   /api/risk-points/:riskPointId
GET   /api/remediations
GET   /api/bottlenecks

POST  /api/admin/imports
POST  /api/admin/ranking/rebuild
PATCH /api/admin/remediations/:remediationId
```

## Mock admin token

```text
Authorization: Bearer mock-admin-token
```

## Important business rules

1. `/api/bottlenecks`: `lat` and `lng` must be sent together.
2. Remediation `isDelayed` is computed by the service and is not accepted from clients.
3. `/api/remediations?delayed=true` returns only delayed, unfinished work.
4. `/api/bottlenecks` can filter by `district`, `congestionLevel`, and optional radius around `lat/lng`.
5. GET ranking reads a stored/precomputed ranking. Rebuild is admin-only.
6. The OpenAPI file specifies that `riskScore` depends on accident count, fatalities, and injuries, but it does not specify exact weights. The mock uses a documented deterministic formula so this part can be swapped later.

## cURL examples

### Risk points

```bash
curl.exe "http://localhost:3000/api/risk-points"
curl.exe "http://localhost:3000/api/risk-points?district=จตุจักร&riskLevel=CRITICAL"
curl.exe "http://localhost:3000/api/risk-points/RP-001"
```

### Ranking

```bash
curl.exe "http://localhost:3000/api/risk-points/ranking"
curl.exe "http://localhost:3000/api/risk-points/ranking?district=จตุจักร&limit=5"
```

### Remediation

```bash
curl.exe "http://localhost:3000/api/remediations"
curl.exe "http://localhost:3000/api/remediations?district=จตุจักร"
curl.exe "http://localhost:3000/api/remediations?status=IN_PROGRESS&delayed=true"
```

### Bottlenecks

```bash
curl.exe "http://localhost:3000/api/bottlenecks"
curl.exe "http://localhost:3000/api/bottlenecks?district=จตุจักร&congestionLevel=BLOCKED"
curl.exe "http://localhost:3000/api/bottlenecks?lat=13.7563&lng=100.5018&radiusKm=5"
```

Invalid pair test:

```bash
curl.exe "http://localhost:3000/api/bottlenecks?lat=13.7563"
```

### Admin

```bash
curl.exe -X POST "http://localhost:3000/api/admin/imports" ^
  -H "Authorization: Bearer mock-admin-token" ^
  -H "Content-Type: application/json" ^
  -d "{\"source\":\"THAIRSC\",\"datasetUrl\":\"https://data.bangkok.go.th/dataset/100-risk-map\",\"note\":\"รอบข้อมูลประจำเดือนสิงหาคม 2569\"}"
```

```bash
curl.exe -X POST "http://localhost:3000/api/admin/ranking/rebuild" ^
  -H "Authorization: Bearer mock-admin-token"
```

```bash
curl.exe -X PATCH "http://localhost:3000/api/admin/remediations/RM-001" ^
  -H "Authorization: Bearer mock-admin-token" ^
  -H "Content-Type: application/json" ^
  -d "{\"status\":\"COMPLETED\",\"completedAt\":\"2026-08-05\",\"note\":\"ติดตั้งอุปกรณ์แล้วเสร็จ\"}"
```

Unauthorized test:

```bash
curl.exe -X POST "http://localhost:3000/api/admin/ranking/rebuild"
```
