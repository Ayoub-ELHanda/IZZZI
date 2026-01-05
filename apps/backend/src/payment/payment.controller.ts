import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Headers,
  RawBodyRequest,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-checkout-session')
  @UseGuards(JwtAuthGuard)
  async createCheckoutSession(
    @Req() req: any,
    @Body() body: { classCount: number; isAnnual: boolean },
  ) {
    const userId = req.user.id;
    return this.paymentService.createCheckoutSession(
      userId,
      body.classCount,
      body.isAnnual,
    );
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    if (!req.rawBody) {
      throw new Error('Raw body is required for webhook');
    }
    return this.paymentService.handleWebhook(signature, req.rawBody);
  }

  @Get('subscription')
  @UseGuards(JwtAuthGuard)
  async getUserSubscription(@Req() req: any) {
    const userId = req.user.id;
    return this.paymentService.getUserSubscription(userId);
  }

  @Post('cancel-subscription')
  @UseGuards(JwtAuthGuard)
  async cancelSubscription(@Req() req: any) {
    const userId = req.user.id;
    return this.paymentService.cancelSubscription(userId);
  }
}
