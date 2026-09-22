import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindBottlenecksDto } from './dto/find-bottlenecks.dto';
import { BottlenecksService } from './bottlenecks.service';

@ApiTags('bottlenecks')
@Controller('bottlenecks')
export class BottlenecksController {
  constructor(private readonly service: BottlenecksService) {}

  @Get()
  @ApiOperation({ summary: 'ค้นหาจุดทางคนเดินข้าม' })
  findAll(@Query() query: FindBottlenecksDto) {
    return this.service.findAll(query.district);
  }
}