import { LessorService } from './services/lessor.service';
import { LessorRepository } from './repositories/lessor.repository';
import { Module } from '@nestjs/common';

@Module({
  exports: [LessorService],
  providers: [LessorService, LessorRepository],
})
export class LessorModule {}
