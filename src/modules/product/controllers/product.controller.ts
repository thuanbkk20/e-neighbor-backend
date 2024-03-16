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
import { ROLE } from '../../../constants';
import { Auth } from '../../../decorators';
import { CreateProductDto } from '../domains/dtos/createProduct.dto';
import { ProductService } from '../services/product.service';
import { ProductDto } from '../domains/dtos/product.dto';
import { AdminConfirmDto } from '../domains/dtos/adminConfirm.dto';
import { ProductPageOptionsDto } from '../domains/dtos/productPageOption.dto';
import { ProductListOkResponse } from '../domains/dtos/productListOkResponse.dto';

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
