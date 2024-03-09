import { InsuranceRepository } from './../repositories/insurance.repository';
import { InsuranceEntity } from './../domains/entities/insurance.entity';
import { LessorService } from './../../lessor/services/lessor.service';
import { CreateProductDto } from './../domains/dtos/createProduct.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.reposiory';
import { ProductEntity } from '../domains/entities/product.entity';
import { ProductSurchargeRepository } from '../repositories/product-surcharge.repository';
import { getKeyByValue } from '../../../interfaces';
import {
  MORTGAGE,
  MORTGAGE_MAPPING,
  REQUIRED_DOCUMENTS,
  REQUIRED_DOCUMENTS_MAPPING,
  SURCHARGE,
} from '../../../constants';
import { CategoryService } from '../../category/services/category.service';
import { ProductSurChargeEntity } from '../domains/entities/product-surcharge.entity';
import { ContextProvider } from '../../../providers';
import { ProductMissingFieldException } from '../../../exceptions/invalid-product.exception';
import { ProductDto } from '../domains/dtos/product.dto';
import { EntityManager } from 'typeorm';
import { SurchargeService } from '../../surcharge/services/surcharge.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly lessorService: LessorService,
    private readonly categoryService: CategoryService,
    private readonly productRepository: ProductRepository,
    private readonly productSurchargeRepository: ProductSurchargeRepository,
    private readonly surchargeService: SurchargeService,
    private readonly insuranceRepository: InsuranceRepository,
  ) {}

  private async productDtoToProductEntity(
    createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    const newProduct = new ProductEntity();
    newProduct.name = createProductDto.name;
    newProduct.description = createProductDto.description;
    newProduct.value = createProductDto.value;
    const mortgageKey = getKeyByValue(
      MORTGAGE_MAPPING,
      createProductDto.mortgage,
    );
    newProduct.mortgage = MORTGAGE[mortgageKey];
    newProduct.policies = createProductDto.policies;
    newProduct.images = createProductDto.images;
    newProduct.characteristics = createProductDto.characteristics;
    newProduct.price = createProductDto.price;
    const requiredDocumentsKey = getKeyByValue(
      REQUIRED_DOCUMENTS_MAPPING,
      createProductDto.requiredDocuments,
    );
    newProduct.requiredDocuments = REQUIRED_DOCUMENTS[requiredDocumentsKey];
    newProduct.timeUnit = createProductDto.timeUnit;
    newProduct.category = await this.categoryService.findById(
      createProductDto.category,
    );
    return newProduct;
  }

  async createProduct(createProductDto: CreateProductDto): Promise<ProductDto> {
    return await this.productRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        const newProduct =
          await this.productDtoToProductEntity(createProductDto);

        if (newProduct.category.name === 'Car' && !createProductDto.insurance) {
          throw new ProductMissingFieldException('Insurance is required');
        }

        const surcharges = await Promise.all(
          createProductDto.surcharge.map(async (surcharge) => {
            const productSurcharge = new ProductSurChargeEntity();
            productSurcharge.surcharge =
              await this.surchargeService.getSurchargeById(
                surcharge.surchargeId,
              );
            if (!productSurcharge.surcharge) {
              throw new NotFoundException('Surcharge not found');
            }
            if (productSurcharge.surcharge.name === SURCHARGE.DAMAGE) return;
            productSurcharge.price = surcharge.price;
            await entityManager.save(productSurcharge);
            return productSurcharge;
          }),
        );

        const damageSurcharge = new ProductSurChargeEntity();
        damageSurcharge.price = 0;
        damageSurcharge.surcharge =
          await this.surchargeService.getSurchargeByName(SURCHARGE.DAMAGE);
        await entityManager.save(damageSurcharge);
        surcharges.push(damageSurcharge);

        newProduct.productSurcharges = surcharges;

        const uploader = await this.lessorService.findOneById(
          ContextProvider.getAuthUser().id,
        );
        newProduct.lessor = uploader;

        const product = await entityManager.save(newProduct);

        if (newProduct.category.name === 'Car') {
          const insurance = new InsuranceEntity();
          insurance.name = createProductDto.insurance.name;
          insurance.description = createProductDto.insurance.description;
          insurance.images = createProductDto.insurance.images;
          insurance.issueDate = createProductDto.insurance.issueDate;
          insurance.expirationDate = createProductDto.insurance.expirationDate;
          insurance.product = product;
          await entityManager.save(insurance);
        }

        return new ProductDto(product);
      },
    );
  }

  async findOneById(id: number): Promise<ProductDto> {
    const product = await this.productRepository.findOneById(id);
    if (product.category.name === 'Car') {
      const insurance = await this.insuranceRepository.findByProductId(
        product.id,
      );
      return new ProductDto(product, insurance);
    }
    return new ProductDto(product);
  }
}
