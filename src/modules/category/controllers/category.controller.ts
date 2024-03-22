import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

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
  async getAllCategories(): Promise<CategoryEntity[]> {
    return this.categoryService.getAllCategories();
  }

  @Get(':id')
  @ApiOkResponse({
    type: CategoryEntity,
  })
  async getOne(@Param('id') id: number): Promise<CategoryEntity> {
    return this.categoryService.findById(id);
  }
}
