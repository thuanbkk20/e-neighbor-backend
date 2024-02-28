import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CategoryService } from '../services/category.service';
import { CategoryEntity } from '../domains/entities/category.entity';

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
