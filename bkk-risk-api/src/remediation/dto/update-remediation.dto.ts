import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { RemediationStatus } from '../../common/enums';

export class UpdateRemediationDto {
  @ApiPropertyOptional({ enum: RemediationStatus })
  @IsOptional()
  @IsEnum(RemediationStatus)
  status?: RemediationStatus;

  @ApiPropertyOptional({ type: String, nullable: true, example: '2026-08-30' })
  @IsOptional()
  @IsDateString()
  dueAt?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true, example: '2026-08-05' })
  @IsOptional()
  @IsDateString()
  completedAt?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  @IsOptional()
  @IsString()
  note?: string | null;
}
