# BKK Risk API — NestJS In-Memory Mock

Implementation of the uploaded **BKK Data Base API v0.2.0** contract without a database.

เป็น mock backend แบบ In-Memory ที่ดึงข้อมูลจริงจากแหล่งเปิด (Open Data) เมื่อระบบเริ่มทำงาน:

- **Risk points (จุดเสี่ยงอุบัติเหตุ)** — จาก Google My Maps KML (126 จุด) และหากต้นทางล่มจะใช้ seed ในตัว; `causes`/`solutions` ได้จาก PDF วิเคราะห์ (`src/data/risk-point-pdf-details.ts`)
- **Bottlenecks (จุดทางคนเดินข้าม)** — จาก BMA Open Data ชุด `crosswalk_50` (50 เขต, ประมาณ 2,794 จุด) ดึงตอน startup
- **Ranking** — ดึงสดจากไฟล์ heat-map xlsx ของ BMA **ทุกครั้งที่เรียกใช้**

> หมายเหตุ: ระบบพึ่ง external data source — หากออฟไลน์หรือต้นทางล่ม bottlenecks จะคืน `[]`, ranking จะ error, และ risk points จะถูกแทนด้วย seed ในตัว

## Requirements

- Node.js 24 LTS recommended.
- npm.

## Install

ติดตั้ง dependencies ทั้งหมดของโปรเจกต์:

```bash
npm install
```

ติดตั้งระบบโหลดและอ่านไฟล์ xlsx ที่ใช้ดึงข้อมูลจาก BMA Open Data (`RankingService` และ `BottlenecksService`):

```bash
npm install xlsx @types/xlsx
npm install axios
```

## Environment

คัดลอก `.env.example` (ที่ root ของ repo) เป็น `.env` แล้วตั้งค่า `.env` ถูก gitignore และไม่ควรถูก commit ขึ้น git:

```text
ADMIN_MOCK_TOKEN=mock-admin-token
```

ค่า `ADMIN_MOCK_TOKEN` ถูกโหลดตอน start ที่ `src/main.ts` จาก `../.env` และใช้ตรวจสิทธิ์ส่วน admin (backend mock) — ค่าเริ่มต้นเป็นค่าสำหรับพัฒนาการเท่านั้น ต้องเปลี่ยนเมื่อนำไปใช้งานจริง

## Run

```bash
npm run start:dev    # development (watch mode)
npm run start:prod   # production build (ต้อง npm run build ก่อน)
```

Swagger:

- http://localhost:3000/swagger
- OpenAPI JSON: http://localhost:3000/swagger-json

พอร์ตเริ่มต้น 3000 เปลี่ยนได้ผ่าน environment `PORT`

## Endpoints

| Method & path | Query / Body | หมายเหตุ |
| --- | --- | --- |
| `GET /api/risk-points` | `district`, `riskLevel` (`LOW`/`MEDIUM`/`HIGH`/`CRITICAL`) | list view ไม่มี `causes`/`solutions` |
| `GET /api/risk-points/:riskPointId` | — | รายละเอียดครบรวม `causes`/`solutions`; `404` ถ้าไม่พบ |
| `GET /api/risk-points/ranking` | `district`, `limit` (1–100, default 10) | ดึงสดจาก BMA heat-map xlsx ทุกครั้ง |
| `GET /api/remediations` | `district`, `status` (`PENDING`/`IN_PROGRESS`/`COMPLETED`/`CANCELLED`) | 96 รายการ `RM-PDF-001…096`; ตัด `startedAt`/`dueAt` ออกจาก response |
| `GET /api/bottlenecks` | `district` (บังคับ) | ข้อมูลจริง crosswalk_50, `CW-001…`; ว่างถ้าดึงข้อมูลไม่สำเร็จ; ไม่ส่ง `district` → `400` |
| `POST /api/admin/imports` | Bearer; body `source` (enum), `datasetUrl`?, `note`? | จำลอง pipeline นำเข้าข้อมูล (ผล mock) |
| `POST /api/admin/ranking/rebuild` | Bearer | re-fetch อันดับความเสี่ยงจาก BMA ใหม่ |
| `PATCH /api/admin/remediations/:remediationId` | Bearer; body `status`?/`dueAt`?/`completedAt`?/`note`? | `404` ถ้าไม่พบรายการ |

## Mock admin token

ใช้ค่า `ADMIN_MOCK_TOKEN` จาก `.env` (ค่าเริ่มต้นใน `.env.example` คือ `mock-admin-token` — ใช้กับการพัฒนาเท่านั้น):

```text
Authorization: Bearer mock-admin-token
```

## Important business rules

1. Validation เป็นแบบ whitelist เข้มงวด (`forbidNonWhitelisted`) — query/body ที่ไม่อยู่ใน spec จะได้ `400` (เช่น `?congestionLevel=…`, `?delayed=…`, `?lat=…&lng=…` ที่ถูกลบออกไปแล้ว)
2. `/api/bottlenecks`: ต้องส่ง `district` เสมอ — ไม่ส่งหรือว่าง → `400`
3. `/api/risk-points/:id` และ `/api/remediations` มี `404` เมื่อไม่พบรายการ
4. Endpoint ส่วน admin ทั้งหมดต้องมี `Authorization: Bearer <ADMIN_MOCK_TOKEN>` — ไม่ส่งหรือ token ผิด → `401`
5. `GET /api/risk-points/ranking` ดึงข้อมูลสดจาก BMA ทุกครั้ง; `POST /api/admin/ranking/rebuild` เป็นงาน admin เท่านั้น
6. Remediation response ไม่เปิดเผย `startedAt`/`dueAt`; `causes`/`solutions` ของจุดเสี่ยงแสดงเฉพาะใน detail (`GET /api/risk-points/:id`)

## cURL examples

### Risk points

```bash
curl.exe "http://localhost:3000/api/risk-points"
curl.exe "http://localhost:3000/api/risk-points?district=สวนหลวง&riskLevel=CRITICAL"
curl.exe "http://localhost:3000/api/risk-points/RP-001"
```

### Ranking

```bash
curl.exe "http://localhost:3000/api/risk-points/ranking"
curl.exe "http://localhost:3000/api/risk-points/ranking?district=สวนหลวง&limit=5"
```

### Remediation

```bash
curl.exe "http://localhost:3000/api/remediations"
curl.exe "http://localhost:3000/api/remediations?district=สวนหลวง"
curl.exe "http://localhost:3000/api/remediations?status=IN_PROGRESS"
```

### Bottlenecks

```bash
curl.exe "http://localhost:3000/api/bottlenecks?district=ห้วยขวาง"
```

ไม่ส่ง `district` → `400` (ต้องส่งเสมอ):

```bash
curl.exe "http://localhost:3000/api/bottlenecks"
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
curl.exe -X PATCH "http://localhost:3000/api/admin/remediations/RM-PDF-001" ^
  -H "Authorization: Bearer mock-admin-token" ^
  -H "Content-Type: application/json" ^
  -d "{\"status\":\"COMPLETED\",\"completedAt\":\"2026-08-05\",\"note\":\"ติดตั้งอุปกรณ์แล้วเสร็จ\"}"
```

Unauthorized test:

```bash
curl.exe -X POST "http://localhost:3000/api/admin/ranking/rebuild"
```

## Testing

```bash
npm test    # jest — 4 suites / 34 tests
npm run lint
```