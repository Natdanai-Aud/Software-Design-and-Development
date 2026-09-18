import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RankingQueryDto } from './dto/ranking-query.dto';
import { RankingService } from './ranking.service';

@ApiTags('ranking')
@Controller('risk-points/ranking')
export class RankingController {
  constructor(private readonly service: RankingService) {
    this.service.seedInitialRanking();
  }

  @Get()
  @ApiOperation({ summary: 'ดูอันดับจุดเสี่ยง (ค่าเริ่มต้น Top 10)' })
  @ApiQuery({ name: 'district', required: false, example: 'จตุจักร' })
  @ApiQuery({ name: 'limit', required: false, type: Number, default: 10, minimum: 1, maximum: 100 })
  findTop(@Query() query: RankingQueryDto) {
    return this.service.findTop(query.district, query.limit);
  }
}
