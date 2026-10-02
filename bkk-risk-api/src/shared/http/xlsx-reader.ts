import * as XLSX from 'xlsx';

/** Reads the first sheet of an xlsx buffer as an array of row objects. */
export function parseXlsxRows<T>(buffer: Buffer): T[] {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json<T>(worksheet, { defval: null });
}
