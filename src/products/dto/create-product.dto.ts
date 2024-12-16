import { IsString, IsNotEmpty, IsOptional, MaxLength, Matches } from 'class-validator';

export class CreateProductDto {
  @IsOptional()
  product_id?: number;

  @IsString()
  @IsNotEmpty({ message: 'Product name is required.' })
  @MaxLength(100, { message: 'Product name must be at most 100 characters.' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Product description is required.' })
  @MaxLength(500, { message: 'Product description must be at most 500 characters.' })
  description: string;

  @IsString()
  @IsNotEmpty({ message: 'Language code is required.' })
  @Matches(/^[a-z]{2}$/, { message: 'Language code must be a valid ISO 639-1 format (e.g., "en", "th").' })
  language_code: string;
}