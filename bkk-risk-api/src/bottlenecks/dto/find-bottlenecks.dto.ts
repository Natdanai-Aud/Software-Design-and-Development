import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FindBottlenecksDto {
  @ApiProperty({ example: 'จตุจักร' })
  @IsString({ message: 'ต้องระบุ district' })
  @IsNotEmpty({ message: 'district ห้ามเป็นค่าว่าง' })
  district!: string;
}