import { CategoryEntity } from '../domains/entities/category.entity';
import { CategoryRepository } from './../repositories/category.repository';
import { Injectable, NotFoundException } from '@nestjs/common';

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
