import { LessorNotFoundException } from 'src/exceptions';
import { LessorEntity } from '../domains/entities/lessor.entity';
import { LessorRepository } from './../repositories/lessor.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LessorService {
  constructor(private readonly lessorRepository: LessorRepository) {}

  async findOneById(id: number): Promise<LessorEntity> {
    const lessor = await this.lessorRepository.findOneById(id);

    if (!lessor) {
      throw new LessorNotFoundException();
    }
    return lessor;
  }
}
