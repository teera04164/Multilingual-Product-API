import { Test, TestingModule } from '@nestjs/testing';
import { Like, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductsService } from '../products.service';
import { Product } from '../entities/product.entity';
import { ProductTranslation } from '../entities/product-translation.entity';
import { CreateProductDto } from '../dto/create-product.dto';

const mockProductRepo = {
  findOneBy: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
};

const mockTranslationRepo = {
  save: jest.fn(),
  create: jest.fn(),
  findAndCount: jest.fn(),
};

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepo,
        },
        {
          provide: getRepositoryToken(ProductTranslation),
          useValue: mockTranslationRepo,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new product and translation', async () => {
      const dto: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        language_code: 'en',
      };

      mockProductRepo.create.mockReturnValue({});
      mockProductRepo.save.mockResolvedValue({ id: 1 });
      mockTranslationRepo.create.mockReturnValue({});
      mockTranslationRepo.save.mockResolvedValue({});

      const result = await service.create(dto);
      expect(mockProductRepo.create).toHaveBeenCalled();
      expect(mockProductRepo.save).toHaveBeenCalled();
      expect(mockTranslationRepo.create).toHaveBeenCalledWith({
        product: { id: 1 },
        name: dto.name,
        description: dto.description,
        language_code: dto.language_code,
      });
      expect(mockTranslationRepo.save).toHaveBeenCalled();
      expect(result).toEqual({ id: 1 });
    });

    it('should throw an error if product_id does not exist', async () => {
      const dto: CreateProductDto = {
        product_id: 99,
        name: 'Test Product',
        description: 'Test Description',
        language_code: 'en',
      };

      mockProductRepo.findOneBy.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow('Product not found');
      expect(mockProductRepo.findOneBy).toHaveBeenCalledWith({ id: dto.product_id });
    });
  });

  describe('searchProducts', () => {
    it('should return paginated results', async () => {
      const query = 'Test';
      const page = 1;
      const limit = 10;
      const language_code = 'en';
      const mockResults = [{ name: 'Test Product' }];

      mockTranslationRepo.findAndCount.mockResolvedValue([mockResults, 1]);

      const result = await service.searchProducts(query, page, limit, language_code);
      expect(mockTranslationRepo.findAndCount).toHaveBeenCalledWith({
        where: { name: Like(`%${query}%`), language_code },
        relations: ['product'],
        take: limit,
        skip: (page - 1) * limit,
      });
      expect(result).toEqual({
        currentPage: page,
        totalPages: 1,
        results: mockResults,
      });
    });
  });
});