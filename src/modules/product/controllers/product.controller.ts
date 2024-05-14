import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ROLE } from '@/constants';
import { Auth } from '@/decorators';
import { AdminConfirmDto } from '@/modules/product/domains/dtos/adminConfirm.dto';
import { CreateProductDto } from '@/modules/product/domains/dtos/createProduct.dto';
import { ProductDto } from '@/modules/product/domains/dtos/product.dto';
import { ProductListOkResponse } from '@/modules/product/domains/dtos/productListOkResponse.dto';
import { ProductPageOptionsDto } from '@/modules/product/domains/dtos/productPageOption.dto';
import { ProductService } from '@/modules/product/services/product.service';

@Controller('products')
@ApiTags('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: ProductListOkResponse,
  })
  async getProductsList(@Query() productPageOptions: ProductPageOptionsDto) {
    return this.productService.getProductsList(productPageOptions);
  }

  @Get('/most-viewed')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: ProductListOkResponse,
  })
  async getMostViewedProducts(
    @Query() productPaginationParams: ProductPageOptionsDto,
  ) {
    return this.productService.getMostViewedProducts(productPaginationParams);
  }

  @Get('/most-rated')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: ProductListOkResponse,
  })
  async getMostRatedProducts(
    @Query() productPaginationParams: ProductPageOptionsDto,
  ) {
    return this.productService.getMostRatedProducts(productPaginationParams);
  }

  @Auth([ROLE.LESSOR])
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateProductDto })
  @ApiOkResponse({
    type: ProductDto,
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductDto> {
    return this.productService.createProduct(createProductDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: ProductDto,
  })
  async findProductById(@Param('id') id: number): Promise<ProductDto> {
    return this.productService.findOneById(id);
  }

  @Auth([ROLE.ADMIN])
  @HttpCode(HttpStatus.OK)
  @Patch('/admin-confirm')
  @ApiOkResponse({
    type: ProductDto,
  })
  async adminConfirm(@Body() body: AdminConfirmDto): Promise<ProductDto> {
    return this.productService.adminConfirmProduct(body);
  }
}
