import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '../mailer/mailer.service';
import { SubscriptionStatus } from '@prisma/client';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private mailerService: MailerService,
  ) {
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    const isDevelopment = this.configService.get<string>('NODE_ENV') !== 'production';

    if (!stripeSecretKey) {
      if (isDevelopment) {
        this.logger.warn('STRIPE_SECRET_KEY is not defined. Payment features will be disabled.');
        
        this.stripe = new Stripe('sk_test_placeholder', {
          apiVersion: '2025-12-15.clover',
        });
        return;
      }
      throw new Error('STRIPE_SECRET_KEY is not defined');
    }

    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-12-15.clover',
    });
  }

  async createCheckoutSession(
    userId: string,
    classCount: number,
    isAnnual: boolean,
  ) {

    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!stripeSecretKey || stripeSecretKey === 'sk_test_placeholder' || stripeSecretKey.trim() === '') {
      this.logger.error('STRIPE_SECRET_KEY is not configured');
      throw new Error('Stripe n\'est pas configuré. Veuillez définir STRIPE_SECRET_KEY dans votre fichier .env');
    }

    if (!this.stripe || !stripeSecretKey.startsWith('sk_test_') && !stripeSecretKey.startsWith('sk_live_')) {
      this.logger.error('Invalid Stripe configuration');
      throw new Error('Configuration Stripe invalide. Veuillez vérifier votre clé API.');
    }

    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      let monthlyPrice: number;
      if (classCount >= 1 && classCount <= 5) {
        monthlyPrice = 19;
      } else if (classCount >= 6 && classCount <= 10) {
        monthlyPrice = 17;
      } else if (classCount >= 11 && classCount <= 15) {
        monthlyPrice = 15;
      } else if (classCount >= 16 && classCount <= 20) {
        monthlyPrice = 13;
      } else {
        throw new Error('Invalid class count');
      }

      let totalAmount: number;
      if (isAnnual) {
        
        const annualPrice = monthlyPrice * 12;
        totalAmount = Math.round(annualPrice * 0.7);
      } else {
        totalAmount = monthlyPrice;
      }

      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await this.stripe.customers.create({
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          metadata: {
            userId: user.id,
          },
        });
        customerId = customer.id;

        await this.prisma.user.update({
          where: { id: userId },
          data: { stripeCustomerId: customerId },
        });
      }

      const session = await this.stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'subscription',
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: `Super Izzzi - ${isAnnual ? 'Annuel' : 'Mensuel'}`,
                description: `${classCount} classe${classCount > 1 ? 's' : ''}`,
              },
              unit_amount: totalAmount * 100, 
              recurring: {
                interval: isAnnual ? 'year' : 'month',
              },
            },
            quantity: 1,
          },
        ],
        success_url: `${this.configService.get('FRONTEND_URL') || 'http://localhost:3001'}/checkout/confirm?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${this.configService.get('FRONTEND_URL') || 'http://localhost:3001'}/checkout?canceled=true`,
        metadata: {
          userId,
          classCount: classCount.toString(),
          totalAmount: totalAmount.toString(),
          isAnnual: isAnnual.toString(),
        },
      });

      return {
        sessionId: session.id,
        url: session.url,
      };
    } catch (error) {
      this.logger.error('Error creating checkout session:', error);
      throw error;
    }
  }

  async handleWebhook(signature: string, payload: Buffer) {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');

    if (!webhookSecret || !stripeSecretKey) {
      throw new Error('Stripe webhook is not configured. Please set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET environment variables.');
    }

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );
    } catch (err) {
      this.logger.error(`Webhook signature verification failed: ${err.message}`);
      throw new Error('Webhook signature verification failed');
    }

    this.logger.log(`Received webhook event: ${event.type}`);

    try {
      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
          break;

        case 'invoice.payment_succeeded':
          await this.handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
          break;
        
        case 'invoice_payment.paid':

          this.logger.log('invoice_payment.paid received (already handled by invoice.payment_succeeded)');
          break;

        case 'invoice.payment_failed':
          await this.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
          break;

        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
          break;

        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
          break;

        default:
          this.logger.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      this.logger.error(`Error handling webhook event ${event.type}:`, error);
      throw error;
    }

    return { received: true };
  }

  private async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    const userId = session.metadata?.userId;
    const classCount = parseInt(session.metadata?.classCount || '0');
    const totalAmount = parseInt(session.metadata?.totalAmount || '0');
    const isAnnual = session.metadata?.isAnnual === 'true';

    if (!userId || !session.subscription) {
      this.logger.error('Missing userId or subscription in session metadata');
      return;
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      this.logger.error(`User not found: ${userId}`);
      return;
    }

    const stripeSubscription = await this.stripe.subscriptions.retrieve(
      session.subscription as string,
    );

    const subscriptionItem = (stripeSubscription as any).items.data[0];
    const currentPeriodStart = subscriptionItem.current_period_start;
    const currentPeriodEnd = subscriptionItem.current_period_end;

    if (!currentPeriodStart || !currentPeriodEnd) {
      this.logger.error(`Invalid subscription dates - start: ${currentPeriodStart}, end: ${currentPeriodEnd}`);
      return;
    }

    const newSubscription = await this.prisma.subscription.create({
      data: {
        userId,
        stripeSubscriptionId: stripeSubscription.id,
        stripePriceId: stripeSubscription.items.data[0].price.id,
        stripeProductId: stripeSubscription.items.data[0].price.product as string,
        status: SubscriptionStatus.ACTIVE,
        billingPeriod: isAnnual ? 'ANNUAL' : 'MONTHLY',
        classCount,
        pricePerClass: totalAmount * 100, 
        totalAmount: totalAmount * 100, 
        currentPeriodStart: new Date(currentPeriodStart * 1000),
        currentPeriodEnd: new Date(currentPeriodEnd * 1000),
      },
    });

    await this.updateEstablishmentSubscriptionStatus(userId, SubscriptionStatus.ACTIVE);

    try {
      const planName = isAnnual ? 'Super Izzzi - Annuel' : 'Super Izzzi - Mensuel';
      const nextBillingDate = newSubscription.currentPeriodEnd.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });

      await this.mailerService.sendSubscriptionConfirmationEmail(user.email, {
        userName: `${user.firstName} ${user.lastName}`,
        planName,
        classCount,
        pricePerClass: totalAmount * 100, 
        totalAmount: totalAmount * 100,
        billingPeriod: isAnnual ? 'ANNUAL' : 'MONTHLY',
        nextBillingDate,
      });

      this.logger.log(`✅ Subscription confirmation email sent to ${user.email}`);
    } catch (error) {
      this.logger.error(`Error sending subscription confirmation email: ${error.message}`);
      
    }

    try {
      const latestInvoiceId = (stripeSubscription as any).latest_invoice;
      if (latestInvoiceId) {
        const invoice = await this.stripe.invoices.retrieve(latestInvoiceId as string);
        const paymentIntent = (invoice as any).payment_intent;

        const existingPayment = await this.prisma.payment.findFirst({
          where: {
            OR: [
              { stripeInvoiceId: invoice.id },
              ...(paymentIntent ? [{ stripePaymentIntentId: paymentIntent as string }] : []),
            ],
          },
        });

        if (!existingPayment) {
          await this.prisma.payment.create({
            data: {
              userId,
              subscriptionId: newSubscription.id,
              stripePaymentIntentId: paymentIntent ? (paymentIntent as string) : `temp_${invoice.id}_${Date.now()}`,
              stripeInvoiceId: invoice.id,
              amount: invoice.amount_paid,
              currency: invoice.currency,
              status: 'SUCCEEDED',
              metadata: invoice.metadata as any,
            },
          });
        }

        try {
          await this.sendInvoiceEmail(invoice, newSubscription, user);
          this.logger.log(`✅ Initial invoice email sent to ${user.email}`);
        } catch (emailError) {
          this.logger.error(`Error sending initial invoice email: ${emailError.message}`);
          
        }
      }
    } catch (error) {
      this.logger.error(`Error creating payment: ${error.message}`);
      
    }
  }

  private async sendInvoiceEmail(invoice: Stripe.Invoice, subscription: any, user: any) {
    
    const paymentDate = new Date(invoice.created * 1000).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    
    const invoiceDate = new Date(invoice.created * 1000).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    const totalTTC = invoice.amount_paid / 100;
    const totalHT = totalTTC / 1.20; 
    const taxAmount = totalTTC - totalHT;

    const formatAmount = (amount: number) => `${amount.toFixed(2)}€`;

    let paymentMethod = 'Carte bancaire';
    const chargeId = (invoice as any).charge;
    if (chargeId) {
      try {
        const charge = await this.stripe.charges.retrieve(chargeId as string);
        const paymentMethodDetails = (charge as any).payment_method_details;
        if (paymentMethodDetails?.card) {
          paymentMethod = `${paymentMethodDetails.card.brand.toUpperCase()} •••• ${paymentMethodDetails.card.last4}`;
        }
      } catch (error) {
        this.logger.warn('Could not retrieve payment method details');
      }
    }

    const invoiceNumber = invoice.number || `INV-${new Date().getFullYear()}-${String(invoice.created).slice(-6)}`;

    const planName = subscription.billingPeriod === 'ANNUAL' ? 'Super Izzzi - Annuel' : 'Super Izzzi - Mensuel';
    const planDescription = `${subscription.classCount} classe${subscription.classCount > 1 ? 's' : ''} - Facturation ${subscription.billingPeriod === 'ANNUAL' ? 'annuelle' : 'mensuelle'}`;

    const periodStart = subscription.currentPeriodStart.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
    const periodEnd = subscription.currentPeriodEnd.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
    const billingPeriod = `${periodStart} au ${periodEnd}`;

    await this.mailerService.sendProfessionalInvoiceEmail(user.email, {
      customerName: `${user.firstName} ${user.lastName}`,
      customerEmail: user.email,
      invoiceNumber,
      invoiceDate,
      billingPeriod,
      planName,
      planDescription,
      unitPrice: formatAmount(totalTTC),
      lineTotal: formatAmount(totalTTC),
      subtotal: formatAmount(totalHT),
      taxAmount: formatAmount(taxAmount),
      totalAmount: formatAmount(totalTTC),
      paymentMethod,
      paymentDate,
      transactionId: invoice.id,
      invoiceUrl: invoice.invoice_pdf || invoice.hosted_invoice_url || undefined,
    });
  }

  private async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
    
    let invoiceSubscription = (invoice as any).subscription;

    if (!invoiceSubscription && (invoice as any).parent?.subscription_details?.subscription) {
      invoiceSubscription = (invoice as any).parent.subscription_details.subscription;
    }
    
    if (!invoiceSubscription) {
      return;
    }

    const subscription = await this.prisma.subscription.findUnique({
      where: { stripeSubscriptionId: invoiceSubscription as string },
      include: { user: true },
    });

    if (!subscription) {
      
      return;
    }

    try {
      const paymentIntent = (invoice as any).payment_intent;

      const existingPayment = await this.prisma.payment.findFirst({
        where: {
          OR: [
            { stripeInvoiceId: invoice.id },
            ...(paymentIntent ? [{ stripePaymentIntentId: paymentIntent as string }] : []),
          ],
        },
      });

      if (!existingPayment) {
        await this.prisma.payment.create({
          data: {
            userId: subscription.userId,
            subscriptionId: subscription.id,
            stripePaymentIntentId: paymentIntent ? (paymentIntent as string) : `temp_${invoice.id}_${Date.now()}`,
            stripeInvoiceId: invoice.id,
            amount: invoice.amount_paid,
            currency: invoice.currency,
            status: 'SUCCEEDED',
            metadata: invoice.metadata as any,
          },
        });
      }
    } catch (error) {
      this.logger.error(`Error creating payment: ${error.message}`);
      
    }

    try {
      await this.sendInvoiceEmail(invoice, subscription, subscription.user);
      this.logger.log(`✅ Recurring invoice email sent to ${subscription.user.email}`);
    } catch (error) {
      this.logger.error(`Error sending invoice email: ${error.message}`);
    }
  }

  private async handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    const invoiceSubscription = (invoice as any).subscription;
    if (!invoiceSubscription) return;

    const subscription = await this.prisma.subscription.findUnique({
      where: { stripeSubscriptionId: invoiceSubscription as string },
    });

    if (!subscription) return;

    await this.prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: 'PAST_DUE' },
    });

    await this.updateEstablishmentSubscriptionStatus(subscription.userId, SubscriptionStatus.PAST_DUE);

    this.logger.warn(`⚠️ Payment failed for subscription ${subscription.id}`);
  }

  private async handleSubscriptionUpdated(stripeSubscription: Stripe.Subscription) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { stripeSubscriptionId: stripeSubscription.id },
    });

    if (!subscription) return;

    const newStatus = this.mapStripeStatus(stripeSubscription.status);

    await this.prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: newStatus,
        currentPeriodStart: new Date((stripeSubscription as any).current_period_start * 1000),
        currentPeriodEnd: new Date((stripeSubscription as any).current_period_end * 1000),
        cancelAtPeriodEnd: (stripeSubscription as any).cancel_at_period_end,
      },
    });

    await this.updateEstablishmentSubscriptionStatus(subscription.userId, newStatus);
  }

  private async handleSubscriptionDeleted(stripeSubscription: Stripe.Subscription) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { stripeSubscriptionId: stripeSubscription.id },
    });

    if (!subscription) return;

    await this.prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: 'CANCELED',
        canceledAt: new Date(),
      },
    });

    await this.updateEstablishmentSubscriptionStatus(subscription.userId, SubscriptionStatus.CANCELED);
  }

  private mapStripeStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
    const statusMap: Record<string, SubscriptionStatus> = {
      active: SubscriptionStatus.ACTIVE,
      past_due: SubscriptionStatus.PAST_DUE,
      canceled: SubscriptionStatus.CANCELED,
      incomplete: SubscriptionStatus.INCOMPLETE,
      trialing: SubscriptionStatus.TRIALING,
    };
    return statusMap[status] || SubscriptionStatus.ACTIVE;
  }

  private async updateEstablishmentSubscriptionStatus(userId: string, status: SubscriptionStatus) {
    try {
  
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { establishmentId: true, role: true },
      });

      if (!user || !user.establishmentId) {
        this.logger.warn(`User ${userId} has no establishment, skipping shared subscription update`);
        return;
      }

      const establishmentUsers = await this.prisma.user.findMany({
        where: {
          establishmentId: user.establishmentId,
          role: {
            in: ['ADMIN', 'RESPONSABLE_PEDAGOGIQUE'],
          },
        },
        select: { id: true, email: true, role: true },
      });

      if (establishmentUsers.length === 0) {
        this.logger.warn(`No users found for establishment ${user.establishmentId}`);
        return;
      }

      await this.prisma.user.updateMany({
        where: {
          id: {
            in: establishmentUsers.map(u => u.id),
          },
        },
        data: {
          subscriptionStatus: status,
        },
      });

      this.logger.log(
        `✅ Shared subscription status (${status}) updated for ${establishmentUsers.length} user(s) in establishment ${user.establishmentId}`,
      );

      establishmentUsers.forEach(u => {
        this.logger.log(`   - ${u.role}: ${u.email} → ${status}`);
      });
    } catch (error) {
      this.logger.error(`Error updating establishment subscription status: ${error.message}`);
        }
  }

  async verifyCheckoutSession(sessionId: string) {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);
      
      if (session.payment_status === 'paid' && session.subscription) {
        const userId = session.metadata?.userId;
        const totalAmount = session.metadata?.totalAmount;
        
        if (!userId) {
          throw new Error('User ID not found in session metadata');
        }

      let amount: number | null = null;
        if (totalAmount) {
        
          amount = parseInt(totalAmount);
          this.logger.debug(`Amount from metadata: ${amount}€`);
        } else if (session.amount_total) {
   
          amount = session.amount_total / 100;
          this.logger.debug(`Amount from session.amount_total: ${amount}€`);
        } else {
          this.logger.warn('No amount found in session metadata or amount_total');
        }

        const existingSubscription = await this.prisma.subscription.findFirst({
          where: {
            userId,
            stripeSubscriptionId: session.subscription as string,
          },
        });

        if (!existingSubscription) {
          await this.handleCheckoutSessionCompleted(session);
        }

        this.logger.debug(`Returning payment verification: amount=${amount}, classCount=${session.metadata?.classCount}, isAnnual=${session.metadata?.isAnnual}`);
   
        return {
          status: 'paid',
          userId,
          subscriptionStatus: SubscriptionStatus.ACTIVE,
          amount: amount, 
          totalAmount: amount, 
          classCount: parseInt(session.metadata?.classCount || '0'),
          isAnnual: session.metadata?.isAnnual === 'true',
        };
      }

      return {
        status: session.payment_status,
        subscriptionStatus: null,
      };
    } catch (error) {
      this.logger.error('Error verifying checkout session:', error);
      throw error;
    }
  }

  async getUserSubscription(userId: string) {
    return this.prisma.subscription.findFirst({
      where: {
        userId,
        status: {
          in: ['ACTIVE', 'TRIALING', 'PAST_DUE'],
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async cancelSubscription(userId: string) {
    const subscription = await this.getUserSubscription(userId);

    if (!subscription) {
      throw new Error('No active subscription found');
    }

    await this.stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    await this.prisma.subscription.update({
      where: { id: subscription.id },
      data: { cancelAtPeriodEnd: true },
    });

    this.logger.log(`✅ Subscription ${subscription.id} will be canceled at period end for user ${userId} and their establishment`);

    return { success: true, message: 'Subscription will be canceled at period end' };
  }
}
