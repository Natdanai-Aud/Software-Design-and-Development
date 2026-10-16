import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import * as XLSX from 'xlsx';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';
import { GOOGLE_MAPS_KML_URL } from '../src/risk-points/kml-risk-point.source';

/**
 * Full-app characterization test: locks the behavior contract in section 4
 * of the refactor spec so a future change can't silently break it. Uses the
 * exact same `configureApp` as main.ts, so this test sees the real prefix,
 * validation rules and Swagger document.
 *
 * All three external data sources (KML, BMA heat-map xlsx, crosswalk_50
 * xlsx) go through the shared fetch-based downloader
 * (src/shared/http/downloader.ts), so mocking `global.fetch` here is enough
 * to make every request deterministic and offline — no real network calls.
 */

const ADMIN_TOKEN = 'e2e-mock-admin-token';

const RANKING_ROWS = [
  {
    no: 1,
    location: 'แยกทดสอบ 1',
    district: 'จตุจักร',
    police_station: 'สน.ทดสอบ',
    lat: 13.8065,
    long: 100.5745,
    res_agency: 'สำนักการจราจรและขนส่ง',
  },
  {
    no: 2,
    location: 'แยกทดสอบ 2',
    district: 'บางนา',
    police_station: 'สน.ทดสอบ 2',
    lat: 13.6687,
    long: 100.603,
    res_agency: 'สำนักการจราจรและขนส่ง',
  },
];

function buildRankingXlsxArrayBuffer(): ArrayBuffer {
  const worksheet = XLSX.utils.json_to_sheet(RANKING_ROWS);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  const buffer: Buffer = XLSX.write(workbook, {
    type: 'buffer',
    bookType: 'xlsx',
  });
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  ) as ArrayBuffer;
}

function mockFetch(url: string): Promise<unknown> {
  if (url === GOOGLE_MAPS_KML_URL) {
    // Force the seed-data fallback so risk-point IDs/content are deterministic.
    return Promise.resolve({
      ok: false,
      status: 500,
      statusText: 'Server Error',
    });
  }
  if (url.includes('heat-map')) {
    return Promise.resolve({
      ok: true,
      arrayBuffer: () => Promise.resolve(buildRankingXlsxArrayBuffer()),
    });
  }
  if (url.includes('crosswalk.xlsx')) {
    // Every one of the 50 district downloads fails, matching this sandbox's
    // real offline behavior (see the refactor spec, section 1).
    return Promise.resolve({ ok: false, status: 403, statusText: 'Forbidden' });
  }
  return Promise.reject(new Error(`unexpected fetch in e2e test: ${url}`));
}

describe('AppModule (e2e)', () => {
  let app: INestApplication;
  let originalFetch: typeof fetch;
  let originalToken: string | undefined;

  beforeAll(async () => {
    originalFetch = global.fetch;
    originalToken = process.env.ADMIN_MOCK_TOKEN;
    process.env.ADMIN_MOCK_TOKEN = ADMIN_TOKEN;
    global.fetch = jest.fn(mockFetch) as unknown as typeof fetch;

    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    global.fetch = originalFetch;
    if (originalToken === undefined) {
      delete process.env.ADMIN_MOCK_TOKEN;
    } else {
      process.env.ADMIN_MOCK_TOKEN = originalToken;
    }
  });

  describe('GET /api/risk-points', () => {
    it('returns all 100 seeded points without causes/solutions', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/risk-points')
        .expect(200);

      expect(res.body).toHaveLength(100);
      expect(res.body[0].riskPointId).toBe('RP-001');
      expect(res.body[0]).not.toHaveProperty('causes');
      expect(res.body[0]).not.toHaveProperty('solutions');
    });

    it('rejects an unknown query parameter', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/risk-points?foo=bar')
        .expect(400);

      expect(res.body.message).toEqual(['property foo should not exist']);
    });

    it('rejects an invalid riskLevel', async () => {
      await request(app.getHttpServer())
        .get('/api/risk-points?riskLevel=FOO')
        .expect(400);
    });
  });

  describe('GET /api/risk-points/:riskPointId', () => {
    it('returns causes and solutions for a known point', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/risk-points/RP-001')
        .expect(200);

      expect(res.body.causes.length).toBeGreaterThan(0);
      expect(res.body.solutions.length).toBeGreaterThan(0);
    });

    it('returns 404 with the Thai not-found message', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/risk-points/RP-999')
        .expect(404);

      expect(res.body.message).toBe('ไม่พบจุดเสี่ยงรหัส RP-999');
    });
  });

  describe('GET /api/risk-points/ranking', () => {
    it('is reachable and not shadowed by GET /api/risk-points/:riskPointId', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/risk-points/ranking')
        .expect(200);

      expect(res.body.total).toBe(2);
      expect(res.body.data).toHaveLength(2);
    });

    it('rejects limit below 1', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/risk-points/ranking?limit=0')
        .expect(400);

      expect(res.body.message).toEqual(['limit must not be less than 1']);
    });
  });

  describe('GET /api/remediations', () => {
    it('returns the one seeded remediation without startedAt/dueAt', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/remediations')
        .expect(200);

      expect(res.body).toHaveLength(1);
      expect(res.body[0].remediationId).toBe('RM-PDF-001');
      expect(res.body[0]).not.toHaveProperty('startedAt');
      expect(res.body[0]).not.toHaveProperty('dueAt');
    });

    it('rejects an invalid status', async () => {
      await request(app.getHttpServer())
        .get('/api/remediations?status=BAD')
        .expect(400);
    });
  });

  describe('GET /api/bottlenecks', () => {
    it('requires district', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/bottlenecks')
        .expect(400);

      expect(res.body.message).toEqual(
        expect.arrayContaining([
          'district ห้ามเป็นค่าว่าง',
          'ต้องระบุ district',
        ]),
      );
    });

    it('returns an empty array when the upstream download fails', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/bottlenecks?district=ห้วยขวาง')
        .expect(200);

      expect(res.body).toEqual([]);
    });
  });

  describe('admin auth', () => {
    it('rejects requests with no Authorization header', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/admin/ranking/rebuild')
        .expect(401);

      expect(res.body.message).toBe('กรุณาเข้าสู่ระบบก่อนใช้งาน');
    });

    it('rejects requests with the wrong token', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/admin/ranking/rebuild')
        .set('Authorization', 'Bearer wrong-token')
        .expect(401);

      expect(res.body.message).toBe('โทเคนไม่ถูกต้องหรือหมดอายุ');
    });
  });

  describe('POST /api/admin/imports', () => {
    it('returns the mocked import pipeline result', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/admin/imports')
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
        .send({ source: 'THAIRSC' })
        .expect(201);

      expect(res.body).toMatchObject({
        source: 'THAIRSC',
        totalRows: 100,
        cleanedRows: 97,
        rejectedRows: 3,
      });
    });

    it('rejects an unknown field', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/admin/imports')
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
        .send({ source: 'THAIRSC', extra: 1 })
        .expect(400);

      expect(res.body.message).toEqual(['property extra should not exist']);
    });
  });

  describe('POST /api/admin/ranking/rebuild', () => {
    it('returns the same shape as GET ranking', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/admin/ranking/rebuild')
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
        .expect(201);

      expect(res.body.total).toBe(2);
      expect(res.body.data).toHaveLength(2);
    });
  });

  describe('PATCH /api/admin/remediations/:remediationId', () => {
    it('persists the update — a later GET reflects it', async () => {
      await request(app.getHttpServer())
        .patch('/api/admin/remediations/RM-PDF-001')
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
        .send({ status: 'IN_PROGRESS', note: 'e2e note' })
        .expect(200);

      const res = await request(app.getHttpServer())
        .get('/api/remediations?status=IN_PROGRESS')
        .expect(200);

      expect(res.body).toHaveLength(1);
      expect(res.body[0].note).toBe('e2e note');
    });

    it('returns 404 for an unknown remediation', async () => {
      const res = await request(app.getHttpServer())
        .patch('/api/admin/remediations/RM-PDF-999')
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
        .send({ status: 'COMPLETED' })
        .expect(404);

      expect(res.body.message).toBe('ไม่พบงานแก้ไขรหัส RM-PDF-999');
    });
  });

  describe('GET /swagger-json', () => {
    it('exposes all 8 paths with the original operationIds', async () => {
      const res = await request(app.getHttpServer())
        .get('/swagger-json')
        .expect(200);

      expect(Object.keys(res.body.paths).sort()).toEqual(
        [
          '/api/admin/imports',
          '/api/admin/ranking/rebuild',
          '/api/admin/remediations/{remediationId}',
          '/api/bottlenecks',
          '/api/remediations',
          '/api/risk-points',
          '/api/risk-points/ranking',
          '/api/risk-points/{riskPointId}',
        ].sort(),
      );

      expect(res.body.paths['/api/risk-points/ranking'].get.operationId).toBe(
        'RankingController_findTop',
      );
      expect(
        res.body.paths['/api/admin/remediations/{remediationId}'].patch
          .operationId,
      ).toBe('AdminController_updateRemediation');
    });
  });
});
