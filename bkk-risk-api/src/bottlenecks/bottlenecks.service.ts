import { BadRequestException, Injectable } from '@nestjs/common';
import { MockDataService } from '../common/mock-data.service';
import { Bottleneck } from '../common/models';

@Injectable()
export class BottlenecksService {
  constructor(private readonly mockData: MockDataService) {}

  private distanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
    const R = 6371;
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(a));
  }

  findAll(
    district?: string,
    congestionLevel?: string,
    lat?: number,
    lng?: number,
    radiusKm = 5,
  ): Bottleneck[] {
    const hasLat = lat !== undefined;
    const hasLng = lng !== undefined;

    if (hasLat !== hasLng) {
      throw new BadRequestException('ต้องส่ง lng มาคู่กับ lat เสมอ');
    }

    return this.mockData.bottlenecks
      .filter((item) => !district || item.district === district)
      .filter(
        (item) =>
          !congestionLevel ||
          item.congestionLevel === congestionLevel,
      )
      .filter((item) => {
        if (lat === undefined || lng === undefined) return true;
        return this.distanceKm(lat, lng, item.lat, item.lng) <= radiusKm;
      });
  }
}
