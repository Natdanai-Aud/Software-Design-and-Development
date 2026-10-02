export interface Bottleneck {
  bottleneckId: string;
  nameTh: string;
  district: string;
  road?: string;
  lat: number;
  lng: number;
  /** สภาพเส้นทางข้ามจากชุดข้อมูล crosswalk_50 (ปกติ / ต้องปรับปรุง / ... ) */
  crossMarking: string | null;
  /** ประเภททางข้าม เช่น Thermo */
  cType: string | null;
  /** จำนวนช่องจราจร */
  numLane: number | null;
}
