import * as XLSX from 'xlsx';
import { parseXlsxRows } from './xlsx-reader';

function makeXlsxBuffer(rows: Record<string, unknown>[]): Buffer {
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  const bytes: Uint8Array = XLSX.write(workbook, {
    type: 'buffer',
    bookType: 'xlsx',
  });
  return Buffer.from(bytes);
}

describe('parseXlsxRows', () => {
  it('reads the first sheet as row objects', () => {
    const buffer = makeXlsxBuffer([
      { District: 'ห้วยขวาง', Lat: 13.8 },
      { District: 'ปทุมวัน', Lat: 13.74 },
    ]);

    const rows = parseXlsxRows<Record<string, unknown>>(buffer);

    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({ District: 'ห้วยขวาง', Lat: 13.8 });
    expect(rows[1]).toMatchObject({ District: 'ปทุมวัน', Lat: 13.74 });
  });

  it('returns null for missing cells', () => {
    const buffer = makeXlsxBuffer([
      { District: 'ห้วยขวาง', Lat: 13.8 },
      { District: 'ปทุมวัน' },
    ]);

    const rows = parseXlsxRows<Record<string, unknown>>(buffer);

    expect(rows).toHaveLength(2);
    expect(rows[1]).toMatchObject({ District: 'ปทุมวัน', Lat: null });
  });

  it('returns an empty array for an empty sheet', () => {
    const buffer = makeXlsxBuffer([]);

    expect(parseXlsxRows(buffer)).toEqual([]);
  });
});
