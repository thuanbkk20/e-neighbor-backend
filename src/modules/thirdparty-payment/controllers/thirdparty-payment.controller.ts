import { Body, Controller, Ip, Post, Res } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

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
  // @UsePipes(new ValidationPipe({ transform: true }))
  async getProductsList(
    @Body() transactionInfo: CreateTransactionDto,
    @Ip() userIp: string,
    @Res() res: Response,
  ) {
    const url = await this.thirdpartyPaymentService.redirectPaymentGateway(
      transactionInfo,
      userIp,
    );
    return res.redirect(302, url);
  }
}
