import { Module } from '@nestjs/common';
import { SurchargeController } from './controllers/surcharge.controller';
import { SurchargeService } from './services/surcharge.service';
import { SurchargeRepository } from './repositories/surcharge.repository';

@Module({
  controllers: [SurchargeController],
  providers: [SurchargeService, SurchargeRepository],
  exports: [SurchargeService],
})
export class SurchargeModule {}
