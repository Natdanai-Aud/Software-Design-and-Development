import { Body, Controller, Patch, Post, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { MockAdminGuard } from '../common/guards/mock-admin.guard';
import { CreateImportDto } from './dto/create-import.dto';
import { UpdateRemediationDto } from '../remediation/dto/update-remediation.dto';
import { AdminService } from './admin.service';
import { RemediationService } from '../remediation/remediation.service';

@ApiTags('admin')
@ApiBearerAuth('bearerAuth')
@UseGuards(MockAdminGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly remediationService: RemediationService,
  ) {}

  @Post('imports')
  @ApiOperation({ summary: 'นำเข้าข้อมูลดิบและทำความสะอาดข้อมูล (เจ้าหน้าที่)' })
  createImport(@Body() dto: CreateImportDto) {
    return this.adminService.createImport(dto);
  }

  @Post('ranking/rebuild')
  @ApiOperation({ summary: 'สั่งคำนวณอันดับความเสี่ยงใหม่ (เจ้าหน้าที่)' })
  rebuildRanking() {
    return this.adminService.rebuildRanking();
  }

  @Patch('remediations/:remediationId')
  @ApiOperation({ summary: 'อัปเดตสถานะงานแก้ไข (เจ้าหน้าที่)' })
  @ApiParam({ name: 'remediationId', example: 'RM-001' })
  updateRemediation(
    @Param('remediationId') remediationId: string,
    @Body() dto: UpdateRemediationDto,
  ) {
    return this.remediationService.update(remediationId, dto);
  }
}
