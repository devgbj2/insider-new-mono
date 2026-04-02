import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

const ISP_SIZES = ['High', 'Middle', 'Low'] as const;
const ISP_RISKS = ['Sehat', 'Relatif aman,tetap selektif', 'Risiko tinggi, exposure dibatasi'] as const;
const ISP_SCALES = ['Lokal', 'Nasional'] as const;
const ISP_AREA = ['TIF 1', 'TIF 2', 'TIF 3', 'TIF 4'] as const;
const ISP_QUALITY = ['Mature', 'Limited Readiness', 'Operationally Ready'] as const;

export class QueryIspDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isJartup?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isJartaplok?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isCustomer?: boolean;

  // Transform string tunggal jadi array agar konsisten
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsArray()
  @IsIn(ISP_SIZES, { each: true })
  size?: string[];

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsArray()
  @IsIn(ISP_RISKS, { each: true })
  risk?: string[];

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsArray()
  @IsIn(ISP_SCALES, { each: true })
  scale?: string[];

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsArray()
  @IsIn(ISP_AREA, { each: true })
  area: string[];

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsArray()
  @IsIn(ISP_QUALITY, { each: true })
  quality?: string[];
}