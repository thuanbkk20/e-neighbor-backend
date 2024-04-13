import { Injectable } from '@nestjs/common';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';

import { ProductPageOptionsDto } from '@/modules/product/domains/dtos/productPageOption.dto';
import { ProductResponseDto } from '@/modules/product/domains/dtos/productResponse.dto';
import { ProductEntity } from '@/modules/product/domains/entities/product.entity';

@Injectable()
export class ProductRepository extends Repository<ProductEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ProductEntity, dataSource.createEntityManager());
  }

  async findOneById(id: number): Promise<ProductEntity> {
    const query = this.createQueryBuilder('products')
      .leftJoinAndSelect('products.category', 'category')
      .leftJoinAndSelect('products.lessor', 'lessor')
      .leftJoinAndSelect('lessor.user', 'user')
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

    if (pageOptionsDto.rating) {
      queryBuilder = queryBuilder.andWhere('products.rating >= :rating', {
        rating: pageOptionsDto.rating,
      });
    }

    if (pageOptionsDto.minPrice) {
      queryBuilder = queryBuilder.andWhere('products.price >= :minPrice', {
        minPrice: pageOptionsDto.minPrice,
      });
    }

    if (pageOptionsDto.maxPrice) {
      queryBuilder = queryBuilder.andWhere('products.price <= :maxPrice', {
        maxPrice: pageOptionsDto.maxPrice,
      });
    }

    if (pageOptionsDto.location) {
      queryBuilder = queryBuilder.andWhere('lessor.location = :location', {
        location: pageOptionsDto.location,
      });
    }

    // Handle sort
    if (pageOptionsDto.sortField) {
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
    const productQueryBuilder = this.createQueryBuilder('products')
      .leftJoinAndSelect('products.category', 'category')
      .leftJoinAndSelect('products.lessor', 'lessor')
      .leftJoinAndSelect('lessor.user', 'user')
      .where('products.is_confirmed = :isConfirm', {
        isConfirm: paginationParams.isConfirmedByAdmin ?? true,
      })
      .andWhere('category.is_vehicle = :isVehicle', {
        isVehicle: paginationParams.isVehicle ?? true,
      });
    if (paginationParams.minPrice) {
      productQueryBuilder.andWhere('products.price >= :minPrice', {
        minPrice: paginationParams.minPrice,
      });
    }

    if (paginationParams.maxPrice) {
      productQueryBuilder.andWhere('products.price <= :maxPrice', {
        maxPrice: paginationParams.maxPrice,
      });
    }

    if (paginationParams.location) {
      productQueryBuilder.andWhere('lessor.location = :location', {
        location: paginationParams.location,
      });
    }
    productQueryBuilder
      .orderBy('products.rating', 'DESC')
      .skip(paginationParams.offset ?? 0)
      .take(paginationParams.take ?? 12);
    return productQueryBuilder;
  }

  getTopFourViewedProductList(
    paginationParams: ProductPageOptionsDto,
  ): SelectQueryBuilder<ProductEntity> {
    const productQueryBuilder = this.createQueryBuilder('products')
      .leftJoinAndSelect('products.category', 'category')
      .leftJoinAndSelect('products.lessor', 'lessor')
      .leftJoinAndSelect('lessor.user', 'user')
      .where('products.is_confirmed = :isConfirm', {
        isConfirm: paginationParams.isConfirmedByAdmin ?? true,
      })
      .andWhere('category.is_vehicle = :isVehicle', {
        isVehicle: paginationParams.isVehicle ?? true,
      });
    if (paginationParams.minPrice) {
      productQueryBuilder.andWhere('products.price >= :minPrice', {
        minPrice: paginationParams.minPrice,
      });
    }

    if (paginationParams.maxPrice) {
      productQueryBuilder.andWhere('products.price <= :maxPrice', {
        maxPrice: paginationParams.maxPrice,
      });
    }

    if (paginationParams.location) {
      productQueryBuilder.andWhere('lessor.location = :location', {
        location: paginationParams.location,
      });
    }
    productQueryBuilder
      .orderBy('products.accessCount', 'DESC')
      .skip(paginationParams.offset ?? 0)
      .take(paginationParams.take ?? 12);
    return productQueryBuilder;
  }
}
