import { IsString, IsOptional, IsNotEmpty, Matches, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchProductDto {
  @IsString()
  @IsNotEmpty()
  query: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @Matches(/^[a-z]{2}$/, { message: 'Language code must be a valid ISO 639-1 format.' })
  language_code?: string;
}
