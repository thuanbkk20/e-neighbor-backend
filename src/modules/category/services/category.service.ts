import { Injectable, NotFoundException } from '@nestjs/common';

import { CategoryOptionsDto } from '@/modules/category/domains/dtos/categoryOptions.dto';
import { CategoryEntity } from '@/modules/category/domains/entities/category.entity';
import { CategoryRepository } from '@/modules/category/repositories/category.repository';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async getAllCategories(
    categoryOptions: CategoryOptionsDto,
  ): Promise<CategoryEntity[]> {
    console.log(categoryOptions);
    const categoryResult = await this.categoryRepository.find({
      select: {
        id: true,
        name: true,
      },
      where: categoryOptions,
    });

    return categoryResult;
  }

  async findById(id: number): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOneBy({
      id: id,
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }
}
