import { LessorService } from './../../lessor/services/lessor.service';
import { CreateProductDto } from './../domains/dtos/createProduct.dto';
import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.reposiory';
import { ProductEntity } from '../domains/entities/product.entity';
import { SurchargeRepository } from '../repositories/surcharge.repository';
import { getKeyByValue } from '../../../interfaces';
import {
  MORTGAGE,
  MORTGAGE_MAPPING,
  REQUIRED_DOCUMENTS,
  REQUIRED_DOCUMENTS_MAPPING,
} from '../../../constants';
import { CategoryService } from '../../category/services/category.service';
import { SurChargeEntity } from '../domains/entities/surcharge.entity';
import { ContextProvider } from '../../../providers';

@Injectable()
export class ProductService {
  constructor(
    private readonly lessorService: LessorService,
    private readonly categoryService: CategoryService,
    private readonly productRepository: ProductRepository,
    private readonly surchargeRepository: SurchargeRepository,
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

    //Save surcharge
    const surcharges = await Promise.all(
      createProductDto.surcharge.map(async (surcharge) => {
        const newSurcharge = new SurChargeEntity();
        newSurcharge.description = surcharge.description;
        newSurcharge.name = surcharge.name;
        newSurcharge.price = surcharge.price;
        newSurcharge.product = newProduct;
        await this.surchargeRepository.save(newSurcharge);
        return newSurcharge;
      }),
    );

    newProduct.surcharge = surcharges;

    const uploader = await this.lessorService.findOneById(
      ContextProvider.getAuthUser().id,
    );

    newProduct.lessor = uploader;

    return this.productRepository.save(newProduct);
  }

  async findOneById(id: number): Promise<ProductEntity> {
    return this.productRepository.findOneById(id);
  }
}
