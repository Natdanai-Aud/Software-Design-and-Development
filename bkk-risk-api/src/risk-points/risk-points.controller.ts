import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FindRiskPointsDto } from './dto/find-risk-points.dto';
import { RiskPointsService } from './risk-points.service';

@ApiTags('risk-points')
@Controller('risk-points')
export class RiskPointsController {
  constructor(private readonly service: RiskPointsService) {}

  @Get()
  @ApiOperation({ summary: 'ค้นหาจุดเสี่ยงอุบัติเหตุสำหรับแสดงบนแผนที่' })
  @ApiQuery({ name: 'district', required: false, example: 'จตุจักร' })
  @ApiQuery({ name: 'riskLevel', required: false, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] })
  @ApiResponse({ status: 200 })
  findAll(@Query() query: FindRiskPointsDto) {
    return this.service.findAll(query.district, query.riskLevel);
  }

  @Get(':riskPointId')
  @ApiOperation({ summary: 'ดูรายละเอียดจุดเสี่ยง พร้อมสาเหตุและแนวทางแก้ไข' })
  @ApiParam({ name: 'riskPointId', example: 'RP-001' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404, description: 'Not Found' })
  findOne(@Param('riskPointId') riskPointId: string) {
    return this.service.findOne(riskPointId);
  }
}
