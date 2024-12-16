import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module'; // Adjust based on your project structure
import { Product } from '../entities/product.entity';
import { ProductTranslation } from '../entities/product-translation.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ProductsController (e2e)', () => {
  let app: INestApplication;
  let productRepo: Repository<Product>;
  let translationRepo: Repository<ProductTranslation>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    productRepo = moduleFixture.get<Repository<Product>>(getRepositoryToken(Product));
    translationRepo = moduleFixture.get<Repository<ProductTranslation>>(getRepositoryToken(ProductTranslation));
  });

  afterAll(async () => {
    await translationRepo.query(`DELETE FROM product_translation`);
    await productRepo.query(`DELETE FROM product`);
});

  afterAll(async () => {
    await app.close();
  });

  describe('/products (POST)', () => {
    it('should create a new product and translation', async () => {
      const dto = {
        name: 'Test Product',
        description: 'Test Description',
        language_code: 'en',
      };

      const response = await request(app.getHttpServer())
        .post('/products')
        .send(dto)
        .expect(201);

      const createdProduct = await productRepo.findOne({
        where: { id: response.body.id },
        relations: ['translations'],
      });

      expect(createdProduct).toBeDefined();
      expect(createdProduct.translations).toHaveLength(1);
      expect(createdProduct.translations[0].name).toBe(dto.name);
    });
  });

  describe('/products/search (GET)', () => {
    it('should return paginated search results', async () => {
      const response = await request(app.getHttpServer())
        .get('/products/search')
        .query({ query: 'Test', page: 1, limit: 10, language_code: 'en' })
        .expect(200);
      expect(response.body.results).toHaveLength(1);
      expect(response.body.results[0].name).toBe('Test Product');
    });
  });
});
