import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '../mailer/mailer.service';

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
    
    // En développement, on permet l'absence de STRIPE_SECRET_KEY
    if (!stripeSecretKey) {
      if (isDevelopment) {
        this.logger.warn('STRIPE_SECRET_KEY is not defined. Payment features will be disabled.');
        // Créer une instance Stripe avec une clé factice pour éviter les erreurs
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

  /**
   * Créer une session de checkout Stripe
   */
  async createCheckoutSession(
    userId: string,
    classCount: number,
    isAnnual: boolean,
  ) {
    // Vérifier que Stripe est configuré
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!stripeSecretKey || stripeSecretKey === 'sk_test_placeholder' || stripeSecretKey.trim() === '') {
      this.logger.error('STRIPE_SECRET_KEY is not configured');
      throw new Error('Stripe n\'est pas configuré. Veuillez définir STRIPE_SECRET_KEY dans votre fichier .env');
    }

    // Vérifier que l'instance Stripe est valide
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

      // Calculer le prix selon les paliers
      let pricePerClass: number;
      if (classCount >= 1 && classCount <= 5) {
        pricePerClass = 19;
      } else if (classCount >= 6 && classCount <= 10) {
        pricePerClass = 17;
      } else if (classCount >= 11 && classCount <= 15) {
        pricePerClass = 15;
      } else if (classCount >= 16 && classCount <= 20) {
        pricePerClass = 13;
      } else {
        throw new Error('Invalid class count');
      }

      // Appliquer la réduction de 30% si annuel
      if (isAnnual) {
        pricePerClass = Math.round(pricePerClass * 0.7);
      }

      const totalAmount = classCount * pricePerClass;

      // Créer ou récupérer le customer Stripe
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

        // Mettre à jour l'utilisateur avec le customerId
        await this.prisma.user.update({
          where: { id: userId },
          data: { stripeCustomerId: customerId },
        });
      }

      // Créer la session Stripe Checkout
      const session = await this.stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'subscription',
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: `Super Izzzi - ${isAnnual ? 'Annuel' : 'Mensuel'}`,
                description: `${classCount} classe${classCount > 1 ? 's' : ''} à ${pricePerClass}€/mois/classe`,
              },
              unit_amount: totalAmount * 100, // Stripe utilise les centimes
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
          pricePerClass: pricePerClass.toString(),
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

  /**
   * Gérer les événements webhook de Stripe
   */
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
    const pricePerClass = parseInt(session.metadata?.pricePerClass || '0');
    const isAnnual = session.metadata?.isAnnual === 'true';

    if (!userId || !session.subscription) {
      this.logger.error('Missing userId or subscription in session metadata');
      return;
    }

    // Récupérer l'abonnement Stripe
    const stripeSubscription = await this.stripe.subscriptions.retrieve(
      session.subscription as string,
    );

    // Créer l'abonnement dans la base de données
    await this.prisma.subscription.create({
      data: {
        userId,
        stripeSubscriptionId: stripeSubscription.id,
        stripePriceId: stripeSubscription.items.data[0].price.id,
        stripeProductId: stripeSubscription.items.data[0].price.product as string,
        status: 'ACTIVE',
        billingPeriod: isAnnual ? 'ANNUAL' : 'MONTHLY',
        classCount,
        pricePerClass: pricePerClass * 100, // Convertir en centimes
        totalAmount: classCount * pricePerClass * 100,
        currentPeriodStart: new Date((stripeSubscription as any).current_period_start * 1000),
        currentPeriodEnd: new Date((stripeSubscription as any).current_period_end * 1000),
      },
    });

    // Mettre à jour le statut de l'utilisateur
    await this.prisma.user.update({
      where: { id: userId },
      data: { subscriptionStatus: 'ACTIVE' },
    });

    this.logger.log(`Subscription created for user ${userId}`);
  }

  private async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
    const invoiceSubscription = (invoice as any).subscription;
    if (!invoiceSubscription) return;

    const subscription = await this.prisma.subscription.findUnique({
      where: { stripeSubscriptionId: invoiceSubscription as string },
      include: { user: true },
    });

    if (!subscription) {
      this.logger.error(`Subscription not found: ${invoiceSubscription}`);
      return;
    }

    // Créer l'enregistrement de paiement
    await this.prisma.payment.create({
      data: {
        userId: subscription.userId,
        subscriptionId: subscription.id,
        stripePaymentIntentId: (invoice as any).payment_intent as string,
        stripeInvoiceId: invoice.id,
        amount: invoice.amount_paid,
        currency: invoice.currency,
        status: 'SUCCEEDED',
        metadata: invoice.metadata as any,
      },
    });

    this.logger.log(`Payment succeeded for subscription ${subscription.id}`);

    // Envoyer l'email de facturation
    try {
      const paymentDate = new Date(invoice.created * 1000).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });

      await this.mailerService.sendPaymentInvoiceEmail(subscription.user.email, {
        userName: `${subscription.user.firstName} ${subscription.user.lastName}`,
        classCount: subscription.classCount,
        pricePerClass: subscription.pricePerClass,
        totalAmount: subscription.totalAmount,
        billingPeriod: subscription.billingPeriod,
        invoiceUrl: invoice.invoice_pdf || undefined,
        invoiceNumber: invoice.number || undefined,
        paymentDate,
      });

      this.logger.log(`Payment invoice email sent to ${subscription.user.email}`);
    } catch (error) {
      this.logger.error(`Error sending payment invoice email: ${error.message}`);
      // Ne pas faire échouer le webhook si l'email ne peut pas être envoyé
    }
  }

  private async handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    const invoiceSubscription = (invoice as any).subscription;
    if (!invoiceSubscription) return;

    const subscription = await this.prisma.subscription.findUnique({
      where: { stripeSubscriptionId: invoiceSubscription as string },
    });

    if (!subscription) return;

    // Mettre à jour le statut de l'abonnement
    await this.prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: 'PAST_DUE' },
    });

    await this.prisma.user.update({
      where: { id: subscription.userId },
      data: { subscriptionStatus: 'PAST_DUE' },
    });

    this.logger.log(`Payment failed for subscription ${subscription.id}`);
  }

  private async handleSubscriptionUpdated(stripeSubscription: Stripe.Subscription) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { stripeSubscriptionId: stripeSubscription.id },
    });

    if (!subscription) return;

    await this.prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: this.mapStripeStatus(stripeSubscription.status),
        currentPeriodStart: new Date((stripeSubscription as any).current_period_start * 1000),
        currentPeriodEnd: new Date((stripeSubscription as any).current_period_end * 1000),
        cancelAtPeriodEnd: (stripeSubscription as any).cancel_at_period_end,
      },
    });
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

    await this.prisma.user.update({
      where: { id: subscription.userId },
      data: { subscriptionStatus: 'CANCELED' },
    });
  }

  private mapStripeStatus(status: Stripe.Subscription.Status): any {
    const statusMap = {
      active: 'ACTIVE',
      past_due: 'PAST_DUE',
      canceled: 'CANCELED',
      incomplete: 'INCOMPLETE',
      trialing: 'TRIALING',
    };
    return statusMap[status] || 'ACTIVE';
  }

  /**
   * Récupérer l'abonnement actif d'un utilisateur
   */
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

  /**
   * Annuler un abonnement
   */
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

    return { success: true, message: 'Subscription will be canceled at period end' };
  }
}
