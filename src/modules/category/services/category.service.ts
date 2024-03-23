import { Injectable, NotFoundException } from '@nestjs/common';

import { CategoryEntity } from '@/modules/category/domains/entities/category.entity';
import { CategoryRepository } from '@/modules/category/repositories/category.repository';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async getAllCategories(): Promise<CategoryEntity[]> {
    return this.categoryRepository.find();
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
