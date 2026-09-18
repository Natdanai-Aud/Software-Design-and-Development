import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FindRemediationsDto } from './dto/find-remediations.dto';
import { RemediationService } from './remediation.service';

@ApiTags('remediation')
@Controller('remediations')
export class RemediationController {
  constructor(private readonly service: RemediationService) {}

  @Get()
  @ApiOperation({ summary: 'ติดตามสถานะการแก้ไขของทุกจุดเสี่ยง' })
  @ApiQuery({ name: 'district', required: false, example: 'จตุจักร' })
  @ApiQuery({ name: 'status', required: false, enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] })
  @ApiQuery({ name: 'delayed', required: false, type: Boolean, example: true })
  findAll(@Query() query: FindRemediationsDto) {
    return this.service.findAll(query.district, query.status, query.delayed);
  }
}
