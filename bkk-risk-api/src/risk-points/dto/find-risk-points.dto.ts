import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { RiskLevel } from '../../common/enums';

export class FindRiskPointsDto {
  @ApiPropertyOptional({ example: 'จตุจักร' })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional({ enum: RiskLevel, example: RiskLevel.CRITICAL })
  @IsOptional()
  @IsEnum(RiskLevel)
  riskLevel?: RiskLevel;
}
