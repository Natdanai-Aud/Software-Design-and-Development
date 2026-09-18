import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { CongestionLevel } from '../../common/enums';

export class FindBottlenecksDto {
  @ApiPropertyOptional({ example: 'จตุจักร' })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional({ enum: CongestionLevel })
  @IsOptional()
  @IsEnum(CongestionLevel)
  congestionLevel?: CongestionLevel;

  @ApiPropertyOptional({ example: 13.7563 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat?: number;

  @ApiPropertyOptional({ example: 100.5018 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  lng?: number;

  @ApiPropertyOptional({ example: 5, default: 5, maximum: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(50)
  radiusKm?: number = 5;
}
