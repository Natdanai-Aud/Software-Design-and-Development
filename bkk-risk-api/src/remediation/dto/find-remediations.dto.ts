import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
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

  @ApiPropertyOptional({ type: Boolean, default: false })
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  delayed?: boolean;
}
