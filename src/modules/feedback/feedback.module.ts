import { Module } from '@nestjs/common';

import { FeedbackController } from './controllers/feedback.controller';
import { FeedbackRepository } from './repositories/feedback.repository';
import { FeedbackService } from './services/feedback.service';

import { AdminModule } from '@/modules/admin/admin.module';
import { LessorModule } from '@/modules/lessor/lessor.module';
import { OrderModule } from '@/modules/order/order.module';
import { ProductModule } from '@/modules/product/product.module';
import { UserModule } from '@/modules/user/user.module';

@Module({
  imports: [OrderModule, UserModule, AdminModule, LessorModule, ProductModule],
  controllers: [FeedbackController],
  providers: [FeedbackRepository, FeedbackService],
  exports: [FeedbackService],
})
export class FeedbackModule {}
