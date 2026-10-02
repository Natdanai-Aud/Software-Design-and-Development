import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { RemediationStatus } from '../remediation-status.enum';

export class FindRemediationsDto {
  @ApiPropertyOptional({ example: 'จตุจักร' })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional({ enum: RemediationStatus })
  @IsOptional()
  @IsEnum(RemediationStatus)
  status?: RemediationStatus;
}
