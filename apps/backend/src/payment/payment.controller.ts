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
  HttpException,
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
    try {
      const userId = req.user.id;
      return await this.paymentService.createCheckoutSession(
        userId,
        body.classCount,
        body.isAnnual,
      );
    } catch (error: any) {
      // Gérer les erreurs de configuration Stripe
      if (error.message && error.message.includes('Stripe n\'est pas configuré')) {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Stripe n\'est pas configuré. Veuillez définir STRIPE_SECRET_KEY dans votre fichier .env',
            error: 'Stripe Configuration Error',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Erreur lors de la création de la session de paiement',
          error: 'Payment Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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

  @Post('verify-session')
  @UseGuards(JwtAuthGuard)
  async verifySession(@Body() body: { sessionId: string }) {
    return this.paymentService.verifyCheckoutSession(body.sessionId);
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
