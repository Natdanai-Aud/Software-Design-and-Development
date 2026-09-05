import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';
import { ImportSource } from '../../common/enums';

export class CreateImportDto {
  @ApiProperty({ enum: ImportSource, example: ImportSource.THAIRSC })
  @IsEnum(ImportSource)
  source!: ImportSource;

  @ApiPropertyOptional({
    example: 'https://data.bangkok.go.th/dataset/100-risk-map',
  })
  @IsOptional()
  @IsUrl()
  datasetUrl?: string;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  note?: string | null;
}
