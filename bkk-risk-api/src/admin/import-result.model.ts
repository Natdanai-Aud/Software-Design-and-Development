export interface ImportResult {
  source: string;
  totalRows: number;
  cleanedRows: number;
  rejectedRows: number;
  startedAt: string;
  finishedAt: string;
}
