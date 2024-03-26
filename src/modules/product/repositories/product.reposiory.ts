import { Injectable } from '@nestjs/common';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';

import { PRODUCT_LIST_SORT_FIELD } from '@/constants/product-list-sort-field';
import { ProductPageOptionsDto } from '@/modules/product/domains/dtos/productPageOption.dto';
import { ProductResponseDto } from '@/modules/product/domains/dtos/productResponse.dto';
import { ProductEntity } from '@/modules/product/domains/entities/product.entity';

@Injectable()
export class ProductRepository extends Repository<ProductEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ProductEntity, dataSource.createEntityManager());
  }

  productsQueryBuilder = this.createQueryBuilder('products')
    .leftJoinAndSelect('products.category', 'category')
    .leftJoinAndSelect('products.lessor', 'lessor');

  async findOneById(id: number): Promise<ProductEntity> {
    const query = this.createQueryBuilder('products')
      .leftJoinAndSelect('products.category', 'category')
      .leftJoinAndSelect('products.lessor', 'lessor')
      .leftJoinAndSelect('products.productSurcharges', 'productSurcharges')
      .leftJoinAndSelect('productSurcharges.surcharge', 'surcharge')
      .where('products.id = :id', { id: id });
    return query.getOne();
  }

  async getProductList(
    pageOptionsDto: ProductPageOptionsDto,
  ): Promise<ProductResponseDto> {
    let queryBuilder = this.createQueryBuilder('products')
      .leftJoinAndSelect('products.category', 'category')
      .leftJoinAndSelect('products.lessor', 'lessor')
      .where('products.is_confirmed = :isConfirm', {
        isConfirm: pageOptionsDto.isConfirmedByAdmin,
      });

    // Handle filter
    if (pageOptionsDto.name) {
      const name = pageOptionsDto.name.toLowerCase();
      queryBuilder = queryBuilder.andWhere('LOWER(products.name) LIKE :name', {
        name: `%${name}%`,
      });
    }

    if (pageOptionsDto.categoryId) {
      queryBuilder = queryBuilder.andWhere('category.id = :id', {
        id: pageOptionsDto.categoryId,
      });
    } else if (pageOptionsDto.isVehicle) {
      queryBuilder = queryBuilder.andWhere('category.is_vehicle = :isVehicle', {
        isVehicle: pageOptionsDto.isVehicle,
      });
    }

    if (pageOptionsDto.lessorId) {
      queryBuilder = queryBuilder.andWhere('lessor.id = :id', {
        id: pageOptionsDto.lessorId,
      });
    }

    if (pageOptionsDto.status) {
      queryBuilder = queryBuilder.andWhere('products.status = :status', {
        status: pageOptionsDto.status,
      });
    }

    // Handle sort
    if (
      pageOptionsDto.sortField &&
      pageOptionsDto.sortField != PRODUCT_LIST_SORT_FIELD.CREATED_AT
    ) {
      queryBuilder = queryBuilder
        .orderBy('products.' + pageOptionsDto.sortField, pageOptionsDto.order)
        .addOrderBy('products.id', 'DESC');
    } else {
      queryBuilder = queryBuilder.orderBy('products.id', 'DESC');
    }

    const skip = (pageOptionsDto.page - 1) * pageOptionsDto.take;
    // Handle paging
    queryBuilder.skip(skip).take(pageOptionsDto.take);

    // Retrieve entities
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    return new ProductResponseDto(entities, itemCount);
  }

  getTopFourRatedProductList(
    paginationParams: ProductPageOptionsDto,
  ): SelectQueryBuilder<ProductEntity> {
    return this.productsQueryBuilder
      .where('products.is_confirmed = :isConfirm', {
        isConfirm: true,
      })
      .andWhere('category.is_vehicle = :isVehicle', {
        isVehicle: paginationParams.isVehicle,
      })
      .orderBy('products.rating', 'DESC')
      .skip(paginationParams.offset ?? 0)
      .take(4);
  }

  getTopFourViewedProductList(
    paginationParams: ProductPageOptionsDto,
  ): SelectQueryBuilder<ProductEntity> {
    return this.productsQueryBuilder
      .where('products.is_confirmed = :isConfirm', {
        isConfirm: true,
      })
      .andWhere('category.is_vehicle = :isVehicle', {
        isVehicle: paginationParams.isVehicle,
      })
      .orderBy('products.accessCount', 'DESC')
      .skip(paginationParams.offset ?? 0);
  }
}
