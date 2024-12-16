import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { ProductTranslation } from './entities/product-translation.entity';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(ProductTranslation) private translationRepo: Repository<ProductTranslation>,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    let product: Product;

    if (dto.product_id) {
      product = await this.productRepo.findOneBy({ id: dto.product_id });
      if (!product) throw new Error('Product not found');
    } else {
      product = await this.productRepo.save(this.productRepo.create());
    }

    const translation = this.translationRepo.create({
      product,
      name: dto.name,
      description: dto.description,
      language_code: dto.language_code,
    });

    await this.translationRepo.save(translation);
    return product;
  }

  async searchProducts(query: string, page: number, limit: number, language_code?: string) {
    const where = { name: Like(`%${query}%`) };
    if (language_code) Object.assign(where, { language_code });

    const [results, total] = await this.translationRepo.findAndCount({
      where,
      relations: ['product'],
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      results,
    };
  }
}
