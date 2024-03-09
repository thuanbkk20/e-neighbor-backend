import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ROLE } from '../../../constants';
import { Auth } from '../../../decorators';
import { CreateProductDto } from '../domains/dtos/createProduct.dto';
import { ProductService } from '../services/product.service';
import { ProductDto } from '../domains/dtos/product.dto';

@Controller('products')
@ApiTags('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Auth([ROLE.LESSOR])
  @Post()
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
  @ApiOkResponse({
    type: ProductDto,
  })
  async findProductById(@Param('id') id: number): Promise<ProductDto> {
    return this.productService.findOneById(id);
  }
}
