import { Module } from '@nestjs/common';

import { SurchargeController } from './controllers/surcharge.controller';
import { SurchargeRepository } from './repositories/surcharge.repository';
import { SurchargeService } from './services/surcharge.service';

@Module({
  controllers: [SurchargeController],
  providers: [SurchargeService, SurchargeRepository],
  exports: [SurchargeService],
})
export class SurchargeModule {}
