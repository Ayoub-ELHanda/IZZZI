import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import {
  PasswordResetTemplate,
  WelcomeTemplate,
  InvitationReceivedTemplate,
  InvitationConfirmationTemplate,
  ClassArchivedTemplate,
  QuestionnaireReminderTemplate,
  StudentAddedTemplate,
  PaymentInvoiceTemplate,
  ProfessionalInvoiceTemplate,
  SubscriptionConfirmationTemplate,
} from './templates';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;
  private readonly passwordResetTemplate = new PasswordResetTemplate();
  private readonly welcomeTemplate = new WelcomeTemplate();
  private readonly invitationReceivedTemplate = new InvitationReceivedTemplate();
  private readonly invitationConfirmationTemplate = new InvitationConfirmationTemplate();
  private readonly classArchivedTemplate = new ClassArchivedTemplate();
  private readonly questionnaireReminderTemplate = new QuestionnaireReminderTemplate();
  private readonly studentAddedTemplate = new StudentAddedTemplate();
  private readonly paymentInvoiceTemplate = new PaymentInvoiceTemplate();
  private readonly professionalInvoiceTemplate = new ProfessionalInvoiceTemplate();
  private readonly subscriptionConfirmationTemplate = new SubscriptionConfirmationTemplate();

  constructor(private configService: ConfigService) {
    const host = this.configService.get('MAIL_HOST') || this.configService.get('SMTP_HOST') || 'localhost';
    const port = parseInt(this.configService.get('MAIL_PORT') || this.configService.get('SMTP_PORT') || '1025', 10);
    
    this.transporter = nodemailer.createTransport({
      host: host,
      port: port,
      secure: false,
      auth: this.configService.get('MAIL_USER')
        ? {
            user: this.configService.get('MAIL_USER'),
            pass: this.configService.get('MAIL_PASS'),
          }
        : undefined,
    });
    
    console.log(`Mailer configured: ${host}:${port}`);
  }

  async sendPasswordResetEmail(email: string, resetToken: string) {
    const resetUrl = `${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: this.configService.get('MAIL_FROM') || this.configService.get('SMTP_FROM') || 'IZZZI <noreply@izzzi.io>',
      to: email,
      subject: 'Réinitialisation de votre mot de passe - IZZZI',
      html: this.passwordResetTemplate.generate({ resetUrl }),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to ${email}`);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(email: string, firstName: string) {
    const dashboardUrl = `${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/dashboard`;

    const mailOptions = {
      from: this.configService.get('MAIL_FROM') || this.configService.get('SMTP_FROM') || 'IZZZI <noreply@izzzi.io>',
      to: email,
      subject: 'Bienvenue sur IZZZI ! 🎉',
      html: this.welcomeTemplate.generate({ dashboardUrl }),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Welcome email sent to ${email}`);
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  }

  async sendInvitationEmail(email: string, inviterName: string, inviteToken: string) {
    const inviteUrl = `${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/auth/register?token=${inviteToken}`;

    const mailOptions = {
      from: this.configService.get('MAIL_FROM') || this.configService.get('SMTP_FROM') || 'IZZZI <noreply@izzzi.io>',
      to: email,
      subject: `${inviterName} vous invite à rejoindre IZZZI`,
      html: this.invitationReceivedTemplate.generate({ inviterName, inviteUrl }),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Invitation email sent to ${email}`);
    } catch (error) {
      console.error('Error sending invitation email:', error);
      throw error;
    }
  }

  async sendInvitationConfirmationEmail(adminEmail: string, invitedEmail: string) {
    const mailOptions = {
      from: this.configService.get('MAIL_FROM') || this.configService.get('SMTP_FROM') || 'IZZZI <noreply@izzzi.io>',
      to: adminEmail,
      subject: 'Invitation envoyée avec succès',
      html: this.invitationConfirmationTemplate.generate({ invitedEmail }),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Invitation confirmation email sent to ${adminEmail}`);
    } catch (error) {
      console.error('Error sending invitation confirmation email:', error);
    }
  }

  async sendClassArchivedEmail(email: string, data: { userName: string; className: string; archivedAt: string }) {
    const archivedClassesUrl = `${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/classes/archived`;

    const mailOptions = {
      from: this.configService.get('MAIL_FROM') || this.configService.get('SMTP_FROM') || 'IZZZI <noreply@izzzi.io>',
      to: email,
      subject: `Classe archivée : ${data.className}`,
      html: this.classArchivedTemplate.generate({ ...data, archivedClassesUrl }),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Class archived email sent to ${email}`);
    } catch (error) {
      console.error('Error sending class archived email:', error);
      throw error;
    }
  }

  async sendQuestionnaireReminderEmail(email: string, data: { subjectName: string; teacherName: string; questionnaireUrl: string }) {
    const mailOptions = {
      from: this.configService.get('MAIL_FROM') || this.configService.get('SMTP_FROM') || 'IZZZI <noreply@izzzi.io>',
      to: email,
      subject: `Un petit retour sur votre cours ${data.subjectName} ?`,
      html: this.questionnaireReminderTemplate.generate(data),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Questionnaire reminder email sent to ${email}`);
    } catch (error) {
      console.error('Error sending questionnaire reminder email:', error);
      throw error;
    }
  }

  async sendStudentAddedToClassEmail(email: string, data: { className: string; teacherName: string; studentCount: number }) {
    const mailOptions = {
      from: this.configService.get('MAIL_FROM') || this.configService.get('SMTP_FROM') || 'IZZZI <noreply@izzzi.io>',
      to: email,
      subject: `Vous avez été ajouté à la classe ${data.className}`,
      html: this.studentAddedTemplate.generate(data),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Student added to class email sent to ${email}`);
    } catch (error) {
      console.error('Error sending student added to class email:', error);
    }
  }

  async sendPaymentInvoiceEmail(email: string, data: {
    userName: string;
    classCount: number;
    pricePerClass: number;
    totalAmount: number;
    billingPeriod: string;
    invoiceUrl?: string;
    invoiceNumber?: string;
    paymentDate: string;
  }) {
    const mailOptions = {
      from: this.configService.get('MAIL_FROM') || this.configService.get('SMTP_FROM') || 'IZZZI <noreply@izzzi.io>',
      to: email,
      subject: `Facture IZZZI - Abonnement Super Izzzi ${data.billingPeriod === 'ANNUAL' ? 'Annuel' : 'Mensuel'}`,
      html: this.paymentInvoiceTemplate.generate(data),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Payment invoice email sent to ${email}`);
    } catch (error) {
      console.error('Error sending payment invoice email:', error);
      throw error;
    }
  }

  async sendProfessionalInvoiceEmail(email: string, data: {
    customerName: string;
    customerEmail: string;
    invoiceNumber: string;
    invoiceDate: string;
    billingPeriod: string;
    planName: string;
    planDescription: string;
    unitPrice: string;
    lineTotal: string;
    subtotal: string;
    taxAmount: string;
    totalAmount: string;
    paymentMethod: string;
    paymentDate: string;
    transactionId: string;
    invoiceUrl?: string;
  }) {
    const mailOptions = {
      from: this.configService.get('MAIL_FROM') || this.configService.get('SMTP_FROM') || 'IZZZI <noreply@izzzi.io>',
      to: email,
      subject: `Facture IZZZI N° ${data.invoiceNumber} - ${data.planName}`,
      html: this.professionalInvoiceTemplate.generate(data),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Professional invoice email sent to ${email} - Invoice #${data.invoiceNumber}`);
    } catch (error) {
      console.error('Error sending professional invoice email:', error);
      throw error;
    }
  }

  async sendSubscriptionConfirmationEmail(email: string, data: {
    userName: string;
    planName: string;
    classCount: number;
    pricePerClass: number;
    totalAmount: number;
    billingPeriod: string;
    nextBillingDate: string;
  }) {
    const dashboardUrl = `${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/dashboard`;
    
    const mailOptions = {
      from: this.configService.get('MAIL_FROM') || this.configService.get('SMTP_FROM') || 'IZZZI <noreply@izzzi.io>',
      to: email,
      subject: `🎉 Bienvenue dans ${data.planName} !`,
      html: this.subscriptionConfirmationTemplate.generate({ ...data, dashboardUrl }),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Subscription confirmation email sent to ${email}`);
    } catch (error) {
      console.error('Error sending subscription confirmation email:', error);
      throw error;
    }
  }
}
