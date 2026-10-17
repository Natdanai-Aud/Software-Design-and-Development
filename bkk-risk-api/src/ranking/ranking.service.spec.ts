import { InternalServerErrorException } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { fetchArrayBuffer } from '../shared/http/downloader';
import { RankingService } from './ranking.service';

jest.mock('../shared/http/downloader', () => ({
  fetchArrayBuffer: jest.fn(),
}));

const fetchArrayBufferMock = fetchArrayBuffer as jest.Mock;

function makeRankingBuffer(): Buffer {
  const worksheet = XLSX.utils.json_to_sheet([
    {
      no: 1,
      location: 'แยกอโศก',
      district: 'วัฒนา',
      police_station: 'สน.ทองหล่อ',
      lat: 13.73,
      long: 100.56,
      res_agency: 'กทม.',
    },
    {
      no: 2,
      location: 'แยกห้วยขวาง',
      district: 'ห้วยขวาง',
      police_station: 'สน.ห้วยขวาง',
      lat: 13.78,
      long: 100.57,
      res_agency: 'กทม.',
    },
  ]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  const bytes: Uint8Array = XLSX.write(workbook, {
    type: 'buffer',
    bookType: 'xlsx',
  });
  return Buffer.from(bytes);
}

describe('RankingService', () => {
  const service = new RankingService();

  beforeEach(() => {
    fetchArrayBufferMock.mockReset();
  });

  describe('getRiskRanking', () => {
    it('maps xlsx rows to ranking rows with a total', async () => {
      fetchArrayBufferMock.mockResolvedValue({
        ok: true,
        buffer: makeRankingBuffer(),
      });

      const result = await service.getRiskRanking();

      expect(result.total).toBe(2);
      expect(result.data[0]).toEqual({
        rank: 1,
        location: 'แยกอโศก',
        district: 'วัฒนา',
        policeStation: 'สน.ทองหล่อ',
        lat: 13.73,
        lng: 100.56,
        responsibleAgency: 'กทม.',
      });
    });

    it('throws when the download fails with an error message', async () => {
      fetchArrayBufferMock.mockResolvedValue({
        ok: false,
        errorMessage: 'network down',
      });

      await expect(service.getRiskRanking()).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('throws when the download fails with an HTTP status', async () => {
      fetchArrayBufferMock.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Server Error',
      });

      await expect(service.getRiskRanking()).rejects.toThrow(
        'Failed to load risk data from BMA Open Data',
      );
    });
  });

  describe('rebuild', () => {
    it('delegates to getRiskRanking', async () => {
      fetchArrayBufferMock.mockResolvedValue({
        ok: true,
        buffer: makeRankingBuffer(),
      });

      const result = await service.rebuild();

      expect(result.total).toBe(2);
      expect(fetchArrayBufferMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('findTop', () => {
    beforeEach(() => {
      fetchArrayBufferMock.mockResolvedValue({
        ok: true,
        buffer: makeRankingBuffer(),
      });
    });

    it('returns everything when no filter is given', async () => {
      const result = await service.findTop();

      expect(result.total).toBe(2);
    });

    it('filters by district', async () => {
      const result = await service.findTop('ห้วยขวาง');

      expect(result.total).toBe(1);
      expect(result.data[0].location).toBe('แยกห้วยขวาง');
    });

    it('limits the number of rows', async () => {
      const result = await service.findTop(undefined, 1);

      expect(result.total).toBe(1);
      expect(result.data[0].rank).toBe(1);
    });

    it('combines district filter and limit', async () => {
      const result = await service.findTop('วัฒนา', 5);

      expect(result.total).toBe(1);
      expect(result.data[0].district).toBe('วัฒนา');
    });
  });
});
