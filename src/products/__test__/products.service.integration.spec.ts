import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../products.service';
import { Product } from '../entities/product.entity';
import { ProductTranslation } from '../entities/product-translation.entity';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from '../dto/create-product.dto';
import { SearchProductDto } from '../dto/search-product.dto';
import { ConfigModule } from '@nestjs/config';

describe('ProductsService (Integration)', () => {
    let service: ProductsService;
    let productRepo: Repository<Product>;
    let translationRepo: Repository<ProductTranslation>;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                 ConfigModule.forRoot(),
                TypeOrmModule.forRoot({
                    type: 'postgres',
                    host: process.env.DATABASE_HOST,
                    port: parseInt(process.env.DATABASE_PORT, 10),
                    username: process.env.DATABASE_USER,
                    password: process.env.DATABASE_PASSWORD,
                    database: process.env.DATABASE_NAME,
                    entities: [Product, ProductTranslation],
                    synchronize: true,
                }),
                TypeOrmModule.forFeature([Product, ProductTranslation]),
            ],
            providers: [ProductsService],
        }).compile();

        service = module.get<ProductsService>(ProductsService);
        productRepo = module.get<Repository<Product>>(getRepositoryToken(Product));
        translationRepo = module.get<Repository<ProductTranslation>>(getRepositoryToken(ProductTranslation));
    });

    afterEach(async () => {
        await translationRepo.query(`DELETE FROM product_translation`);
        await productRepo.query(`DELETE FROM product`);
    });

    afterAll(async () => {
        await productRepo.manager.connection.close();
    });

    describe('create', () => {
        it('should create a new product and translation', async () => {
            const dto: CreateProductDto = {
                name: 'Integration Test Product',
                description: 'Integration Test Description',
                language_code: 'en',
            };

            const product = await service.create(dto);

            const savedProduct = await productRepo.findOne({ where: { id: product.id }, relations: ['translations'] });

            expect(savedProduct).toBeDefined();
            expect(savedProduct.translations).toHaveLength(1);
            expect(savedProduct.translations[0].name).toEqual(dto.name);
        });
    });

    describe('searchProducts', () => {
        it('should return paginated results', async () => {
            const product = await productRepo.save(productRepo.create());
            await translationRepo.save(
                translationRepo.create({
                    product,
                    name: 'Integration Test Product',
                    description: 'Integration Test Description',
                    language_code: 'en',
                }),
            );

            const searchDto: SearchProductDto = {
                query: 'Integration',
                page: 1,
                limit: 10,
                language_code: 'en',
            };

            const result = await service.searchProducts(searchDto.query, searchDto.page, searchDto.limit, searchDto.language_code);

            expect(result.results).toHaveLength(1);
            expect(result.results[0].name).toEqual('Integration Test Product');
        });
    });
});
