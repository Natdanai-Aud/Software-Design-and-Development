import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FindBottlenecksDto } from './dto/find-bottlenecks.dto';
import { BottlenecksService } from './bottlenecks.service';

@ApiTags('bottlenecks')
@Controller('bottlenecks')
export class BottlenecksController {
  constructor(private readonly service: BottlenecksService) {}

  @Get()
  @ApiOperation({ summary: 'ค้นหาจุดทางคนเดินข้าม' })
  @ApiQuery({ name: 'district', required: false, example: 'จตุจักร' })
  @ApiQuery({ name: 'lat', required: false, type: Number, example: 13.7563 })
  @ApiQuery({ name: 'lng', required: false, type: Number, example: 100.5018 })
  @ApiQuery({ name: 'radiusKm', required: false, type: Number, default: 5, maximum: 50 })
  findAll(@Query() query: FindBottlenecksDto) {
    return this.service.findAll(
      query.district,
      query.lat,
      query.lng,
      query.radiusKm,
    );
  }
}
