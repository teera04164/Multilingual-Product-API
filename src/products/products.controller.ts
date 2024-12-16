import { Controller, Post, Body, Get, Query, ValidationPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { SearchProductDto } from './dto/search-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Post()
  async create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Get('search')
  async search(@Query(new ValidationPipe({ transform: true })) searchDto: SearchProductDto) {
    const { query, page = 1, limit = 10, language_code } = searchDto;
    return this.productService.searchProducts(query, page, limit, language_code);
  }
}
