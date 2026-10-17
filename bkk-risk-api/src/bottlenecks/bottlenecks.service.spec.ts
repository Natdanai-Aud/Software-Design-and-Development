import {
  CROSSWALK_RESOURCE_IDS,
  BottlenecksService,
} from './bottlenecks.service';
import { fetchArrayBuffer } from '../shared/http/downloader';
import * as XLSX from 'xlsx';

jest.mock('../shared/http/downloader', () => ({
  fetchArrayBuffer: jest.fn(),
}));

const fetchArrayBufferMock = fetchArrayBuffer as jest.Mock;

function makeCrosswalkBuffer(district: string, location: string): Buffer {
  const worksheet = XLSX.utils.json_to_sheet([
    { District: district, location, Lat: 13.8, Long: 100.58 },
  ]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  const bytes: Uint8Array = XLSX.write(workbook, {
    type: 'buffer',
    bookType: 'xlsx',
  });
  return Buffer.from(bytes);
}

describe('BottlenecksService', () => {
  const service = new BottlenecksService();

  it('tracks all 50 district-level crosswalk resources', () => {
    expect(CROSSWALK_RESOURCE_IDS).toHaveLength(50);
    const unique = new Set(CROSSWALK_RESOURCE_IDS);
    expect(unique.size).toBe(50);
  });

  describe('parseRows', () => {
    it('maps standard crosswalk_50 columns to a Bottleneck', () => {
      const rows = [
        {
          ID: 1,
          District: 'ห้วยขวาง',
          Road: 'ถนนลาดพร้าว',
          location: 'ซอยลาดพร้าว 41',
          C_Type: 'Thermo',
          Lat: 13.800794,
          Long: 100.583209,
          Cross_Marking: 'ต้องปรับปรุง',
          Num_Lane: 4,
        },
      ];

      const [item] = service.parseRows(rows);

      expect(item).toEqual({
        bottleneckId: '',
        nameTh: 'ซอยลาดพร้าว 41',
        district: 'ห้วยขวาง',
        road: 'ถนนลาดพร้าว',
        lat: 13.800794,
        lng: 100.583209,
        crossMarking: 'ต้องปรับปรุง',
        cType: 'Thermo',
        numLane: 4,
      });
    });

    it('normalizes case and naming variants of the headers', () => {
      const rows = [
        {
          '\uFEFFID': 2,
          District: 'บางซื่อ',
          Road: 'ถนนประชาราษฎร์สาย 2',
          location: 'แยกบางซื่อ',
          c_type: 'Thermo',
          lat: 13.778547,
          lng: 100.573781,
          cross_Marking: 'ปกติ',
          num_lane: 20,
        },
        {
          ID: 3,
          district: 'บางขุนเทียน',
          road: 'ถนนพระราม 2',
          location: 'หน้าตลาดภายใน',
          CType: 'Thermo',
          Latitude: 13.7001,
          Longitude: 100.4533,
          Crossmarking: 'ปกติ',
          NumLane: 8,
        },
      ];

      const items = service.parseRows(rows);

      expect(items).toHaveLength(2);
      expect(items[0].lat).toBe(13.778547);
      expect(items[0].lng).toBe(100.573781);
      expect(items[0].numLane).toBe(20);
      expect(items[1].lat).toBe(13.7001);
      expect(items[1].lng).toBe(100.4533);
      expect(items[1].numLane).toBe(8);
    });

    it('drops rows whose coordinates are missing or invalid', () => {
      const rows = [
        {
          District: 'ห้วยขวาง',
          location: 'ไม่มีพิกัด',
          Lat: null,
          Long: null,
        },
        {
          District: 'ปทุมวัน',
          location: 'ค่าพิกัดไม่ใช่ตัวเลข',
          Lat: 'abc',
          Long: 100.5331,
        },
        {
          District: 'สวนหลวง',
          location: 'จุดสมบูรณ์',
          Lat: 13.7403,
          Long: 100.6326,
        },
      ];

      const items = service.parseRows(rows);

      expect(items).toHaveLength(1);
      expect(items[0].nameTh).toBe('จุดสมบูรณ์');
    });

    it('falls back to the Road column when location is empty', () => {
      const rows = [
        {
          District: 'คลองเตย',
          Road: 'ถนนพระราม 4',
          location: '',
          Lat: 13.7186,
          Long: 100.5499,
        },
      ];

      const [item] = service.parseRows(rows);

      expect(item.nameTh).toBe('ถนนพระราม 4');
    });

    it('maps optional columns to null when absent', () => {
      const rows = [
        {
          District: 'ห้วยขวาง',
          location: 'จุดต่ำสุด',
          Lat: 13.8,
          Long: 100.58,
        },
      ];

      const [item] = service.parseRows(rows);

      expect(item.crossMarking).toBeNull();
      expect(item.cType).toBeNull();
      expect(item.numLane).toBeNull();
    });
  });

  describe('fetchBottlenecks', () => {
    beforeEach(() => {
      fetchArrayBufferMock.mockReset();
    });

    it('returns null when every download fails with an error message', async () => {
      fetchArrayBufferMock.mockResolvedValue({
        ok: false,
        errorMessage: 'network down',
      });

      await expect(service.fetchBottlenecks()).resolves.toBeNull();
      expect(fetchArrayBufferMock).toHaveBeenCalledTimes(
        CROSSWALK_RESOURCE_IDS.length,
      );
    });

    it('returns null when every download fails with an HTTP status', async () => {
      fetchArrayBufferMock.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Server Error',
      });

      await expect(service.fetchBottlenecks()).resolves.toBeNull();
    });

    it('merges partial successes and numbers them CW-001..', async () => {
      fetchArrayBufferMock.mockImplementation((url: string) =>
        url.includes(CROSSWALK_RESOURCE_IDS[0])
          ? {
              ok: true,
              buffer: makeCrosswalkBuffer('ห้วยขวาง', 'จุดที่หนึ่ง'),
            }
          : { ok: false, status: 404, statusText: 'Not Found' },
      );

      const items = await service.fetchBottlenecks();

      expect(items).toHaveLength(1);
      expect(items?.[0]).toMatchObject({
        bottleneckId: 'CW-001',
        district: 'ห้วยขวาง',
        nameTh: 'จุดที่หนึ่ง',
      });
    });

    it('caches merged bottlenecks on init so findAll filters by district', async () => {
      fetchArrayBufferMock.mockImplementation((url: string) =>
        url.includes(CROSSWALK_RESOURCE_IDS[0])
          ? {
              ok: true,
              buffer: makeCrosswalkBuffer('ห้วยขวาง', 'จุดที่หนึ่ง'),
            }
          : {
              ok: true,
              buffer: makeCrosswalkBuffer('ปทุมวัน', 'จุดที่สอง'),
            },
      );

      await service.onModuleInit();

      const huaiKhwang = service.findAll('ห้วยขวาง');
      expect(huaiKhwang).toHaveLength(1);
      expect(huaiKhwang[0].bottleneckId).toBe('CW-001');
      expect(service.findAll('ไม่มีเขตนี้')).toEqual([]);
    });
  });
});
