/** Raw row shape from the BMA heat-map xlsx sheet (see ranking.service.ts). */
export interface RankingSourceRow {
  no?: number | string;
  location?: string;
  district?: string;
  police_station?: string;
  lat?: number | string;
  long?: number | string;
  res_agency?: string;
}

export interface RankingRow {
  rank: number;
  location?: string;
  district?: string;
  policeStation?: string;
  lat: number;
  lng: number;
  responsibleAgency?: string;
}
