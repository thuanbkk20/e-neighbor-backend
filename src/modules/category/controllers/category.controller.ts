import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { CategoryOptionsDto } from '@/modules/category/domains/dtos/categoryOptions.dto';
import { CategoryEntity } from '@/modules/category/domains/entities/category.entity';
import { CategoryService } from '@/modules/category/services/category.service';

@Controller('categories')
@ApiTags('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOkResponse({
    type: [CategoryEntity],
  })
  async getAllCategories(
    @Query() categoryOptions: CategoryOptionsDto,
  ): Promise<CategoryEntity[]> {
    return this.categoryService.getAllCategories(categoryOptions);
  }

  @Get(':id')
  @ApiOkResponse({
    type: CategoryEntity,
  })
  async getOne(@Param('id') id: number): Promise<CategoryEntity> {
    return this.categoryService.findById(id);
  }
}
