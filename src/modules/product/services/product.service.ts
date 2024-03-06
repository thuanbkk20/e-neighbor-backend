import { InsuranceRepository } from './../repositories/insurance.repository';
import { InsuranceEntity } from './../domains/entities/insurance.entity';
import { LessorService } from './../../lessor/services/lessor.service';
import { CreateProductDto } from './../domains/dtos/createProduct.dto';
import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.reposiory';
import { ProductEntity } from '../domains/entities/product.entity';
import { ProductSurchargeRepository } from '../repositories/product-surcharge.repository';
import { getKeyByValue } from '../../../interfaces';
import {
  MORTGAGE,
  MORTGAGE_MAPPING,
  REQUIRED_DOCUMENTS,
  REQUIRED_DOCUMENTS_MAPPING,
} from '../../../constants';
import { CategoryService } from '../../category/services/category.service';
import { ProductSurChargeEntity } from '../domains/entities/product-surcharge.entity';
import { ContextProvider } from '../../../providers';
import { ProductMissingFieldException } from '../../../exceptions/invalid-product.exception';
import { ProductDto } from '../domains/dtos/product.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly lessorService: LessorService,
    private readonly categoryService: CategoryService,
    private readonly productRepository: ProductRepository,
    private readonly surchargeRepository: ProductSurchargeRepository,
    private readonly insuranceRepository: InsuranceRepository,
  ) {}

  async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    //Create new Product entity to save
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

    //Check if new product is a car
    if (newProduct.category.name === 'Car' && !createProductDto.insurance) {
      throw new ProductMissingFieldException('Insurance is required');
    }

    //Save surcharge
    const surcharges = await Promise.all(
      createProductDto.surcharge.map(async (surcharge) => {
        const newSurcharge = new ProductSurChargeEntity();
        newSurcharge.price = surcharge.price;
        newSurcharge.product = newProduct;
        await this.surchargeRepository.save(newSurcharge);
        return newSurcharge;
      }),
    );

    newProduct.productSurcharges = surcharges;

    const uploader = await this.lessorService.findOneById(
      ContextProvider.getAuthUser().id,
    );

    newProduct.lessor = uploader;

    const product = await this.productRepository.save(newProduct);

    //save insurance if new product is a car
    const insurance = new InsuranceEntity();
    insurance.name = createProductDto.insurance.name;
    insurance.description = createProductDto.insurance.description;
    insurance.images = createProductDto.insurance.images;
    insurance.issueDate = createProductDto.insurance.issueDate;
    insurance.expirationDate = createProductDto.insurance.expirationDate;
    insurance.product = product;

    await this.insuranceRepository.save(insurance);

    return product;
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
