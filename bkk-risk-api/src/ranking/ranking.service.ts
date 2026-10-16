import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { fetchArrayBuffer } from '../shared/http/downloader';
import { parseXlsxRows } from '../shared/http/xlsx-reader';
import { RankingRow, RankingSourceRow } from './ranking-row.model';

const HEAT_MAP_XLSX_URL =
  'https://data.bangkok.go.th/dataset/820fa433-cdc4-4e2f-b8c7-a6c40546a5d8/resource/6cc7a43f-52b3-4381-9a8f-2b8a35c3174a/download/-heat-map-9-11-65.xlsx';

const FETCH_TIMEOUT_MS = 20_000;

@Injectable()
export class RankingService {
  async getRiskRanking() {
    const result = await fetchArrayBuffer(HEAT_MAP_XLSX_URL, FETCH_TIMEOUT_MS);

    if (!result.ok) {
      throw new InternalServerErrorException(
        'Failed to load risk data from BMA Open Data',
        {
          cause:
            result.errorMessage ?? `HTTP ${result.status} ${result.statusText}`,
        },
      );
    }

    const rows = parseXlsxRows<RankingSourceRow>(result.buffer as Buffer);

    const data: RankingRow[] = rows.map((row) => ({
      rank: Number(row.no),
      location: row.location,
      district: row.district,
      policeStation: row.police_station,
      lat: Number(row.lat),
      lng: Number(row.long),
      responsibleAgency: row.res_agency,
    }));

    return {
      total: data.length,
      data,
    };
  }

  async rebuild() {
    return this.getRiskRanking();
  }

  async findTop(district?: string, limit?: number) {
    const result = await this.getRiskRanking();
    let data = result.data;

    if (district) {
      data = data.filter((item) => item.district === district);
    }

    if (limit) {
      data = data.slice(0, Number(limit));
    }

    return {
      total: data.length,
      data,
    };
  }
}
