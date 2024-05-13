import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { PageMetaDto } from '@/common/dtos/page-meta.dto';
import { PageDto } from '@/common/dtos/page.dto';
import { ORDER_STATUS, SURCHARGE } from '@/constants';
import { ProductMissingFieldException } from '@/exceptions/invalid-product.exception';
import { ProductNotFoundException } from '@/exceptions/product-not-found.exception';
import { CategoryService } from '@/modules/category/services/category.service';
import { LessorService } from '@/modules/lessor/services/lessor.service';
import { OrderService } from '@/modules/order/services/order.service';
import { AdminConfirmDto } from '@/modules/product/domains/dtos/adminConfirm.dto';
import { CreateProductDto } from '@/modules/product/domains/dtos/createProduct.dto';
import { ProductDto } from '@/modules/product/domains/dtos/product.dto';
import { ProductPageOptionsDto } from '@/modules/product/domains/dtos/productPageOption.dto';
import { ProductRecordDto } from '@/modules/product/domains/dtos/productRecord.dto';
import { ProductResponseDto } from '@/modules/product/domains/dtos/productResponse.dto';
import { ProductViewDto } from '@/modules/product/domains/dtos/productView.dto';
import { InsuranceEntity } from '@/modules/product/domains/entities/insurance.entity';
import { ProductSurChargeEntity } from '@/modules/product/domains/entities/product-surcharge.entity';
import { ProductEntity } from '@/modules/product/domains/entities/product.entity';
import { InsuranceRepository } from '@/modules/product/repositories/insurance.repository';
import { ProductRepository } from '@/modules/product/repositories/product.reposiory';
import { SurchargeService } from '@/modules/surcharge/services/surcharge.service';
import { ContextProvider } from '@/providers';

@Injectable()
export class ProductService {
  constructor(
    private readonly lessorService: LessorService,
    private readonly categoryService: CategoryService,
    private readonly productRepository: ProductRepository,
    private readonly surchargeService: SurchargeService,
    private readonly insuranceRepository: InsuranceRepository,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
  ) {}

  private async productDtoToProductEntity(
    createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    const newProduct = new ProductEntity();
    newProduct.name = createProductDto.name;
    newProduct.description = createProductDto.description;
    newProduct.value = createProductDto.value;
    newProduct.mortgage = createProductDto.mortgage;
    newProduct.policies = createProductDto.policies;
    newProduct.images = createProductDto.images;
    newProduct.characteristics = createProductDto.characteristics;
    newProduct.price = createProductDto.price;
    newProduct.requiredDocuments = createProductDto.requiredDocuments;
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
            if (productSurcharge.surcharge.name === SURCHARGE.DAMAGE_FEE)
              return;
            productSurcharge.price = surcharge.price;
            await entityManager.save(productSurcharge);
            return productSurcharge;
          }),
        );

        const damageSurcharge = new ProductSurChargeEntity();
        damageSurcharge.price = 0;
        damageSurcharge.surcharge =
          await this.surchargeService.getSurchargeByName(SURCHARGE.DAMAGE_FEE);
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

        return new ProductDto(product, 0);
      },
    );
  }

  async findOneById(id: number): Promise<ProductDto> {
    const product = await this.productRepository.findOneById(id);
    if (!product) {
      throw new ProductNotFoundException();
    }
    //Update access count
    product.accessCount += 1;
    await this.productRepository.save(product);
    const completedOrder = await this.orderService.numberOfOrderByStatus(
      product.id,
      ORDER_STATUS.COMPLETED,
    );
    if (product.category.name === 'Car') {
      const insurance = await this.insuranceRepository.findByProductId(
        product.id,
      );
      return new ProductDto(product, completedOrder, insurance);
    }
    return new ProductDto(product, completedOrder);
  }

  async getEntityById(id: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOneById(id);
    if (!product) {
      throw new ProductNotFoundException(`Product with id ${id} not found!`);
    }
    return product;
  }

  async adminConfirmProduct(confirmDto: AdminConfirmDto): Promise<ProductDto> {
    const product = await this.productRepository.findOneById(
      confirmDto.productId,
    );
    if (!product) {
      throw new ProductNotFoundException(
        'No products were found with the provided id',
      );
    }
    product.isConfirmed = confirmDto.isConfirm;
    if (confirmDto.rejectReason) {
      product.rejectReason = confirmDto.rejectReason;
    }
    this.productRepository.save(product);
    const completedOrder = await this.orderService.numberOfOrderByStatus(
      product.id,
      ORDER_STATUS.COMPLETED,
    );
    return new ProductDto(product, completedOrder);
  }

  /**
   * Retrieves a list of products based on the provided pagination options.
   * @param pageOptionsDto The pagination options for querying products.
   * @returns A Promise resolving to a PageDto containing product records and pagination metadata.
   * @TODO handle these params: rating, minRentalFrequency and maxRentalFrequency
   */
  async getProductsList(
    pageOptionsDto: ProductPageOptionsDto,
  ): Promise<PageDto<ProductRecordDto>> {
    const productResponse: ProductResponseDto =
      await this.productRepository.getProductList(pageOptionsDto);

    const productRecords = await Promise.all(
      productResponse.entities.map(async (product) => {
        const completedOrder = await this.orderService.numberOfOrderByStatus(
          product.id,
          ORDER_STATUS.COMPLETED,
        );
        return new ProductRecordDto(product, completedOrder);
      }),
    );
    const itemCount = productResponse.itemCount;
    const pageMeta = new PageMetaDto({ pageOptionsDto, itemCount });
    return new PageDto(productRecords, pageMeta);
  }

  getMostViewedProducts = async (
    paginationParamsDto: ProductPageOptionsDto,
  ): Promise<PageDto<ProductViewDto>> => {
    const mostViewedQuery =
      this.productRepository.getTopFourViewedProductList(paginationParamsDto);

    const { entities } = await mostViewedQuery.getRawAndEntities();
    const mostViewedProducts = entities.map(
      (entity) => new ProductViewDto(entity),
    );

    const productsCount = await mostViewedQuery.getCount();

    const paginationMeta = new PageMetaDto({
      pageOptionsDto: paginationParamsDto,
      itemCount: productsCount,
    });

    return new PageDto(mostViewedProducts, paginationMeta);
  };

  getMostRatedProducts = async (
    paginationParamsDto: ProductPageOptionsDto,
  ): Promise<PageDto<ProductViewDto>> => {
    const mostRatedQuery =
      this.productRepository.getTopFourRatedProductList(paginationParamsDto);

    const { entities } = await await mostRatedQuery.getRawAndEntities();
    const mostRatedProducts = entities.map(
      (entity) => new ProductViewDto(entity),
    );

    const productsCount = await mostRatedQuery.getCount();

    const paginationMeta = new PageMetaDto({
      pageOptionsDto: paginationParamsDto,
      itemCount: productsCount,
    });

    return new PageDto(mostRatedProducts, paginationMeta);
  };

  async updateProductAverageStar(
    productId: number,
    averageStar: number,
  ): Promise<boolean> {
    try {
      const product = await this.productRepository.findOneBy({ id: productId });
      if (!product) {
        throw new ProductNotFoundException();
      }
      product.rating = averageStar;
      await this.productRepository.save(product);
    } catch {
      throw new InternalServerErrorException('Failed to create order');
    }
    return true;
  }
}
