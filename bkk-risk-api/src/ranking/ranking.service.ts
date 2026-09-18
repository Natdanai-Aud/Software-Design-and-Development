import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as XLSX from 'xlsx';

@Injectable()
export class RankingService {
  private readonly fileUrl =
    'https://data.bangkok.go.th/dataset/820fa433-cdc4-4e2f-b8c7-a6c40546a5d8/resource/6cc7a43f-52b3-4381-9a8f-2b8a35c3174a/download/-heat-map-9-11-65.xlsx';

  async getRiskRanking() {
    try {
      const response = await axios.get(this.fileUrl, {
        responseType: 'arraybuffer',
      });

      const workbook = XLSX.read(response.data, {
        type: 'buffer',
      });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const rows = XLSX.utils.sheet_to_json<any>(worksheet, {
        defval: null,
      });

      const data = rows.map((row) => ({
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
    } catch (error) {
      throw new Error(
        `Failed to load risk data from BMA Open Data: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  async rebuild() {
    return await this.getRiskRanking();
  }

  async seedInitialRanking() {
    return await this.getRiskRanking();
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
