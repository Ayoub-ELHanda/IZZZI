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
  CustomMessageTemplate,
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
  private readonly customMessageTemplate = new CustomMessageTemplate();
  private readonly professionalInvoiceTemplate = new ProfessionalInvoiceTemplate();
  private readonly subscriptionConfirmationTemplate = new SubscriptionConfirmationTemplate();

  constructor(private configService: ConfigService) {
    const host = this.configService.get('MAIL_HOST') || this.configService.get('SMTP_HOST') || 'localhost';
    const port = parseInt(this.configService.get('MAIL_PORT') || this.configService.get('SMTP_PORT') || '1025', 10);
    const mailUser = this.configService.get('MAIL_USER');
    const mailFrom = this.configService.get('MAIL_FROM') || this.configService.get('SMTP_FROM') || 'IZZZI <noreply@izzzi.io>';

    const isGmail = host.includes('gmail.com');
    const isSecurePort = port === 465;
    
    const transporterConfig: any = {
      host: host,
      port: port,
      secure: isSecurePort, 
      auth: mailUser
        ? {
            user: mailUser,
            pass: this.configService.get('MAIL_PASS'),
          }
        : undefined,
    };

    const isMailHog = host === 'mailhog' || host === 'localhost' || host.includes('mailhog');

    if (isGmail && port === 587) {
      transporterConfig.requireTLS = true;
      transporterConfig.tls = {
        rejectUnauthorized: false, 
      };
    }

    if (!isSecurePort && !isGmail && !isMailHog) {
      transporterConfig.requireTLS = true;
    }

    if (isMailHog) {
      transporterConfig.requireTLS = false;
      transporterConfig.secure = false;
      
      transporterConfig.auth = undefined;
    }
    
    this.transporter = nodemailer.createTransport(transporterConfig);
    `);
    '}`);
    
    if (isGmail) {
    }
    
    if (host === 'mailhog' || host === 'localhost') {
      const mailhogUrl = this.configService.get('MAILHOG_UI_URL') || 'http://localhost:8025';
    }
  }

  async sendPasswordResetEmail(email: string, resetToken: string) {
    const resetUrl = `${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;
    const mailFrom = this.configService.get('MAIL_FROM') || this.configService.get('SMTP_FROM') || 'IZZZI <noreply@izzzi.io>';

    const mailOptions = {
      from: mailFrom,
      to: email,
      subject: 'Réinitialisation de votre mot de passe - IZZZI',
      html: this.passwordResetTemplate.generate({ resetUrl }),
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return info;
    } catch (error: any) {
      throw error;
    }
  }

  async sendWelcomeEmail(email: string, firstName: string) {
    const dashboardUrl = `${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/dashboard`;
    const mailFrom = this.configService.get('MAIL_FROM') || this.configService.get('SMTP_FROM') || 'IZZZI <noreply@izzzi.io>';

    const mailOptions = {
      from: mailFrom,
      to: email,
      subject: 'Bienvenue sur IZZZI ! 🎉',
      html: this.welcomeTemplate.generate({ dashboardUrl }),
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      const mailHost = this.configService.get('MAIL_HOST') || 'localhost';
      if (mailHost === 'mailhog' || mailHost === 'localhost') {
        const mailhogUrl = this.configService.get('MAILHOG_UI_URL') || 'http://localhost:8025';
      }
      
      return info;
    } catch (error: any) {
      if (error instanceof Error) {
        const errorCode = (error as any).code;
        if (error.message.includes('Invalid login') || errorCode === 'EAUTH') {
        }
        
        if (error.message.includes('ECONNREFUSED') || errorCode === 'ECONNREFUSED') {
        }
        
        if (error.message.includes('ETIMEDOUT') || errorCode === 'ETIMEDOUT') {
        }
      }
      
      throw error;
    }
  }

  async sendInvitationEmail(email: string, inviterName: string, inviteToken: string) {
    const inviteUrl = `${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/auth/register?token=${inviteToken}`;
    const mailFrom = this.configService.get('MAIL_FROM') || this.configService.get('SMTP_FROM') || 'IZZZI <noreply@izzzi.io>';

    const mailOptions = {
      from: mailFrom,
      to: email,
      subject: `${inviterName} vous invite à rejoindre IZZZI`,
      html: this.invitationReceivedTemplate.generate({ inviterName, inviteUrl }),
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return info;
    } catch (error: any) {
      throw error;
    }
  }

  async sendInvitationConfirmationEmail(adminEmail: string, invitedEmail: string) {
    const mailFrom = this.configService.get('MAIL_FROM') || this.configService.get('SMTP_FROM') || 'IZZZI <noreply@izzzi.io>';

    const mailOptions = {
      from: mailFrom,
      to: adminEmail,
      subject: 'Invitation envoyée avec succès',
      html: this.invitationConfirmationTemplate.generate({ invitedEmail }),
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return info;
    } catch (error: any) {
    }
  }

  async sendClassArchivedEmail(email: string, data: { userName: string; className: string; archivedAt: string }) {
    const archivedClassesUrl = `${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/classes/archived`;
    const mailFrom = this.configService.get('MAIL_FROM') || this.configService.get('SMTP_FROM') || 'IZZZI <noreply@izzzi.io>';

    const mailOptions = {
      from: mailFrom,
      to: email,
      subject: `Classe archivée : ${data.className}`,
      html: this.classArchivedTemplate.generate({ ...data, archivedClassesUrl }),
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return info;
    } catch (error: any) {
      throw error;
    }
  }

  async sendQuestionnaireReminderEmail(email: string, data: { subjectName: string; teacherName: string; questionnaireUrl: string }) {
    const mailFrom = this.configService.get('MAIL_FROM') || this.configService.get('SMTP_FROM') || 'IZZZI <noreply@izzzi.io>';

    const mailOptions = {
      from: mailFrom,
      to: email,
      subject: `Un petit retour sur votre cours ${data.subjectName} ?`,
      html: this.questionnaireReminderTemplate.generate(data),
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return info;
    } catch (error: any) {
      throw error;
    }
  }

  async sendStudentAddedToClassEmail(email: string, data: { className: string; teacherName: string; studentCount: number }) {
    const mailFrom = this.configService.get('MAIL_FROM') || this.configService.get('SMTP_FROM') || 'IZZZI <noreply@izzzi.io>';

    const mailOptions = {
      from: mailFrom,
      to: email,
      subject: `Vous avez été ajouté à la classe ${data.className}`,
      html: this.studentAddedTemplate.generate(data),
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return info;
    } catch (error: any) {
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
    const mailFrom = this.configService.get('MAIL_FROM') || this.configService.get('SMTP_FROM') || 'IZZZI <noreply@izzzi.io>';

    const mailOptions = {
      from: mailFrom,
      to: email,
      subject: `Facture IZZZI - Abonnement Super Izzzi ${data.billingPeriod === 'ANNUAL' ? 'Annuel' : 'Mensuel'}`,
      html: this.paymentInvoiceTemplate.generate(data),
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return info;
    } catch (error: any) {
      throw error;
    }
  }

  async sendCustomMessageToStudents(email: string, data: {
    subjectName: string;
    teacherName: string;
    className: string;
    message: string;
    senderName?: string;
  }) {
    const mailFrom = this.configService.get('MAIL_FROM') || this.configService.get('SMTP_FROM') || 'IZZZI <noreply@izzzi.io>';

    const mailOptions = {
      from: mailFrom,
      to: email,
      subject: `Message concernant le cours ${data.subjectName}`,
      html: this.customMessageTemplate.generate(data),
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return info;
    } catch (error: any) {
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
    } catch (error) {
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
    } catch (error) {
      throw error;
    }
  }
}
