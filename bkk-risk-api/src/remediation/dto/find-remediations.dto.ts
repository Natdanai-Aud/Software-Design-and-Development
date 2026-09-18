import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { RemediationStatus } from '../../common/enums';

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
