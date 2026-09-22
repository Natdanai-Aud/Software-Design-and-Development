import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { Bottleneck } from '../common/models';

/**
 * BMA Open Data dataset "crosswalk_50" (ข้อมูลทางคนเดินข้ามในพื้นที่กรุงเทพมหานคร)
 * — 50 district-level xlsx files. Each row is one pedestrian crossing.
 * Loaded once at startup and cached in memory.
 */
export const CROSSWALK_DATASET_ID = '5cce1f20-d3de-4b80-a3fe-1254bb600453';

export const CROSSWALK_RESOURCE_IDS = [
  '8d9d3077-465a-4609-8ae4-54b7533a51dc',
  'ec2e7ac0-aeaf-4088-9890-4399c2ccac7a',
  '3de3f689-90cb-4d21-af3f-6f4a52932ea9',
  'b31bdd5a-509b-4d73-940c-da1a9bc3fce7',
  '703cdf48-8edd-4de3-bde2-1fe672be2758',
  'dfd2c335-2654-4714-a918-c4db711eacae',
  '57cb3a70-f67a-494a-a3fb-20f140e01edc',
  'de8fb8da-7f3b-4db6-8c98-6c792a8ba142',
  '8bf8bd31-6451-4f89-8149-06f898a7a93f',
  '18c12fd2-62ce-40d8-8780-89ac0dcd6ed9',
  '80c3b14f-736e-4d0e-9923-565ea0a9b7b8',
  '711f65d4-b4ae-4e30-846b-4f7ea1638319',
  '14b567b3-953e-4054-97ad-831519f36402',
  'a512973b-e86f-40cc-b11d-0054a79cc76c',
  '43e4eff5-fd15-4b63-a41b-87705580bdbc',
  'f2162deb-e82c-468c-b703-3dc1d116506d',
  'd872f19e-44e1-46da-92a6-e15c1495bbf2',
  '7fa0d61b-6e8a-4164-9a58-614d25f8ec31',
  'a8b9525d-eb3f-45a4-9f12-f526113df76b',
  'b2b63ddf-997e-43b1-8351-832d910c3641',
  '0e84a4de-4832-4c0e-99ef-1f5b97238af3',
  'cf89b823-8fee-4314-9fcc-765113ccc7ed',
  'dba9678f-ecad-452c-90d9-19fb285c4644',
  '6bf59893-4008-4740-a767-4dc529eccc55',
  'b13ed6fa-5d5c-4899-8c05-bb61f3fe5ce3',
  '20e94b02-619f-4dee-9de1-1001d3441f50',
  '153a7b20-fc72-41bc-9865-cb67847c8a6e',
  '285850e5-a82c-45e8-9fc7-5c298e190ffc',
  'cdaed5ab-ffd0-413b-b120-e97fb98e363a',
  'bddbed01-eea8-4433-b013-20d8607ae1c0',
  '15e8b240-9882-4a14-bc92-2c90c549226e',
  '60e41610-be68-4e5d-8cd4-bbc7718a1e7e',
  'f601e406-bc13-44f1-84b5-1be24380bd4c',
  'cc024be7-2f33-45e6-958c-d546f60a3803',
  'c3391140-8559-4d15-bd07-d05596d68ab3',
  '4d2b1ec4-339e-47a5-9bc2-8a7393d013ad',
  'a72bdba1-552d-40a0-93db-e5f9842b70c0',
  '8b64bf29-c6dd-4c0b-a8b6-0125863ec64d',
  'b7e80423-5a58-4653-8557-d5fbbd783924',
  '8681b268-4946-4807-bb4f-9a8e4dde577c',
  'b41e4ed6-30af-4744-b7dd-b89255a67104',
  'aa107626-ad50-4f9b-9832-148f79a52fce',
  '0b6c7be6-94a9-49ec-b3ec-931c20dcd2c5',
  '8229cced-8ebf-4d3f-a07e-cf1897d86ad1',
  'f9812128-5790-4906-9dc4-cb7fa64a05bb',
  '615e25f6-14ba-4210-aaa4-818aa8590b74',
  '8c880275-5682-478b-b251-9557fa9e3f8d',
  'e76d2c95-6541-4635-8dfe-d97551745e50',
  'a0933cad-189c-4b9c-880d-3d266b6c733e',
  '02ef73ea-f925-4e0c-a569-ffdbe121fff2',
];

const FETCH_TIMEOUT_MS = 20_000;
const CONCURRENCY = 10;

@Injectable()
export class BottlenecksService implements OnModuleInit {
  private readonly logger = new Logger(BottlenecksService.name);

  private _bottlenecks: Bottleneck[] = [];

  async onModuleInit() {
    const crosswalks = await this.fetchBottlenecks();
    if (crosswalks) {
      this._bottlenecks = crosswalks;
    } else {
      this._bottlenecks = [];
    }
  }

  async fetchBottlenecks(): Promise<Bottleneck[] | null> {
    const results = await this.mapLimit(
      CROSSWALK_RESOURCE_IDS,
      CONCURRENCY,
      (resourceId) => this.fetchOne(resourceId),
    );

    const succeeded = results.filter(
      (r): r is Bottleneck[] => r !== null,
    );

    if (succeeded.length === 0) {
      this.logger.warn('All crosswalk xlsx downloads failed');
      return null;
    }

    if (succeeded.length < CROSSWALK_RESOURCE_IDS.length) {
      this.logger.warn(
        `Crosswalk download partial: ${succeeded.length}/${CROSSWALK_RESOURCE_IDS.length} files`,
      );
    }

    const merged = succeeded.flat();
    return merged.map((item, index) => ({
      ...item,
      bottleneckId: `CW-${String(index + 1).padStart(3, '0')}`,
    }));
  }

  parseRows(rows: Record<string, unknown>[]): Bottleneck[] {
    return rows
      .map((row) => this.mapRow(row))
      .filter((item): item is Bottleneck => item !== null);
  }

  findAll(district: string): Bottleneck[] {
    return this._bottlenecks.filter((item) => item.district === district);
  }

  private async fetchOne(resourceId: string): Promise<Bottleneck[] | null> {
    const url = `https://data.bangkok.go.th/dataset/${CROSSWALK_DATASET_ID}/resource/${resourceId}/download/crosswalk.xlsx`;
    try {
      const response = await axios.get<ArrayBuffer>(url, {
        responseType: 'arraybuffer',
        timeout: FETCH_TIMEOUT_MS,
      });

      const workbook = XLSX.read(response.data, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
        worksheet,
        { defval: null },
      );

      return this.parseRows(rows);
    } catch (error) {
      this.logger.warn(
        `Crosswalk xlsx fetch failed [${resourceId}]: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      return null;
    }
  }

  private mapRow(row: Record<string, unknown>): Bottleneck | null {
    const fields = new Map<string, unknown>();

    for (const [key, value] of Object.entries(row)) {
      const normalized = KEY_ALIASES[normalizeKey(key)];
      if (normalized && value !== null && value !== undefined && value !== '') {
        fields.set(normalized, value);
      }
    }

    const lat = Number(fields.get('lat'));
    const lng = Number(fields.get('lng'));
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return null;
    }

    const location = String(fields.get('location') ?? '').trim();
    const road = String(fields.get('road') ?? '').trim();

    return {
      bottleneckId: '',
      nameTh: location || road || 'ทางคนเดินข้าม',
      district: String(fields.get('district') ?? '').trim(),
      road: road || undefined,
      lat,
      lng,
      crossMarking: this.stringOrNull(fields.get('crossMarking')),
      cType: this.stringOrNull(fields.get('cType')),
      numLane: this.numberOrNull(fields.get('numLane')),
    };
  }

  private stringOrNull(value: unknown): string | null {
    const text = String(value ?? '').trim();
    return text ? text : null;
  }

  private numberOrNull(value: unknown): number | null {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }

  private async mapLimit<T, R>(
    items: T[],
    limit: number,
    fn: (item: T) => Promise<R>,
  ): Promise<R[]> {
    const results: R[] = new Array(items.length);
    let cursor = 0;

    const worker = async () => {
      while (true) {
        const index = cursor;
        cursor += 1;
        if (index >= items.length) break;
        results[index] = await fn(items[index]);
      }
    };

    const workers = Array.from({ length: Math.min(limit, items.length) }, () =>
      worker(),
    );
    await Promise.all(workers);
    return results;
  }
}

function normalizeKey(key: string): string {
  return String(key ?? '')
    .replace(/^\uFEFF/, '')
    .trim()
    .toLowerCase()
    .replace(/[\s_\-]+/g, '');
}

const KEY_ALIASES: Record<string, string> = {
  lat: 'lat',
  latitude: 'lat',
  long: 'lng',
  longitude: 'lng',
  lng: 'lng',
  district: 'district',
  road: 'road',
  location: 'location',
  ctype: 'cType',
  crossmarking: 'crossMarking',
  numlane: 'numLane',
};