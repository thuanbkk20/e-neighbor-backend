import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { ROLE } from '@/constants';
import { Auth } from '@/decorators';
import { IpnQueryDto } from '@/modules/thirdparty-payment/domains/dtos/request/ipn-query.dto';
import { CreateTransactionDto } from '@/modules/thirdparty-payment/domains/dtos/request/order-transaction.dto';
import { ThirdPartyPaymentService } from '@/modules/thirdparty-payment/services/thirdparty-payment.service';

@Controller('thirdparty-payment')
@ApiTags('thirdparty-payment')
export class ThirdPartyPaymentController {
  constructor(
    private readonly thirdpartyPaymentService: ThirdPartyPaymentService,
  ) {}

  @Post('/create-transaction')
  @Auth([ROLE.USER, ROLE.LESSOR])
  @ApiBody({ type: CreateTransactionDto })
  @HttpCode(HttpStatus.TEMPORARY_REDIRECT)
  // @UsePipes(new ValidationPipe({ transform: true }))
  async createTransaction(
    @Body() transactionInfo: CreateTransactionDto,
    @Ip() userIp: string,
  ) {
    const url = await this.thirdpartyPaymentService.redirectPaymentGateway(
      transactionInfo,
      userIp,
    );
    return { url: url };
  }

  @Get('/vnpay-ipn')
  @HttpCode(HttpStatus.OK)
  async saveTransaction(@Query() params: IpnQueryDto, @Res() response: any) {
    const ipnResponse =
      await this.thirdpartyPaymentService.saveTransaction(params);
    response.status(HttpStatus.OK).json(ipnResponse); // bypassing the framework's automatic response handling
    response.end(); // Ensure the response is ended to prevent further processing
  }
}
