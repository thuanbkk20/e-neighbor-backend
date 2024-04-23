import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { ROLE } from '@/constants';
import { Auth } from '@/decorators';
import { CreateTransactionDto } from '@/modules/thirdparty-payment/domains/dtos/request/order-transaction.dto';
import { ThirdpartyPaymentService } from '@/modules/thirdparty-payment/services/thirdparty-payment.service';

@Controller('thirdparty-payment')
@ApiTags('thirdparty-payment')
export class ThirdpartyPaymentController {
  constructor(
    private readonly thirdpartyPaymentService: ThirdpartyPaymentService,
  ) {}

  @Post('/create-transaction')
  @Auth([ROLE.USER, ROLE.LESSOR])
  @ApiBody({ type: CreateTransactionDto })
  @HttpCode(HttpStatus.TEMPORARY_REDIRECT)
  // @UsePipes(new ValidationPipe({ transform: true }))
  async getProductsList(
    @Body() transactionInfo: CreateTransactionDto,
    @Ip() userIp: string,
  ) {
    const url = await this.thirdpartyPaymentService.redirectPaymentGateway(
      transactionInfo,
      userIp,
    );
    return { url: url };
  }
}
