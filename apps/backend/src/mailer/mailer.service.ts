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

  constructor(private configService: ConfigService) {
    const host = this.configService.get('MAIL_HOST') || this.configService.get('SMTP_HOST') || 'localhost';
    const port = parseInt(this.configService.get('MAIL_PORT') || this.configService.get('SMTP_PORT') || '1025', 10);
    const mailUser = this.configService.get('MAIL_USER');
    const mailFrom = this.configService.get('MAIL_FROM') || this.configService.get('SMTP_FROM') || 'IZZZI <noreply@izzzi.io>';
    
    // Configuration pour Gmail et autres serveurs SMTP
    const isGmail = host.includes('gmail.com');
    const isSecurePort = port === 465;
    
    const transporterConfig: any = {
      host: host,
      port: port,
      secure: isSecurePort, // true pour 465 (SSL), false pour 587 (STARTTLS)
      auth: mailUser
        ? {
            user: mailUser,
            pass: this.configService.get('MAIL_PASS'),
          }
        : undefined,
    };

    // Détecter si on utilise MailHog (pas de STARTTLS nécessaire)
    const isMailHog = host === 'mailhog' || host === 'localhost' || host.includes('mailhog');
    
    // Pour Gmail avec le port 587, activer STARTTLS
    if (isGmail && port === 587) {
      transporterConfig.requireTLS = true;
      transporterConfig.tls = {
        rejectUnauthorized: false, // En développement, peut être nécessaire pour certains environnements
      };
    }

    // Pour les autres serveurs SMTP avec STARTTLS (sauf MailHog)
    if (!isSecurePort && !isGmail && !isMailHog) {
      transporterConfig.requireTLS = true;
    }
    
    // Pour MailHog, désactiver complètement STARTTLS
    if (isMailHog) {
      transporterConfig.requireTLS = false;
      transporterConfig.secure = false;
      // MailHog n'a pas besoin d'authentification
      transporterConfig.auth = undefined;
    }
    
    this.transporter = nodemailer.createTransport(transporterConfig);
    
    console.log(`📧 Mailer Service Configuration:`);
    console.log(`   Host: ${host}`);
    console.log(`   Port: ${port}`);
    console.log(`   Secure: ${isSecurePort} (${isSecurePort ? 'SSL' : 'STARTTLS'})`);
    console.log(`   From: ${mailFrom}`);
    console.log(`   Auth: ${mailUser ? 'Yes' : 'No (using MailHog for development)'}`);
    
    if (isGmail) {
      console.log(`   📬 Gmail SMTP configured`);
      console.log(`   ⚠️  Make sure you're using an App Password, not your regular Gmail password`);
    }
    
    if (host === 'mailhog' || host === 'localhost') {
      const mailhogUrl = this.configService.get('MAILHOG_UI_URL') || 'http://localhost:8025';
      console.log(`   📬 MailHog UI: ${mailhogUrl}`);
      console.log(`   ⚠️  Emails will be captured by MailHog and won't be sent to real addresses.`);
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
      console.log(`📤 Attempting to send password reset email to ${email}...`);
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Password reset email sent successfully to ${email}`);
      console.log(`   Message ID: ${info.messageId}`);
      return info;
    } catch (error: any) {
      console.error(`❌ Error sending password reset email to ${email}:`, error.message || error);
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
      console.log(`📤 Attempting to send welcome email to ${email}...`);
      console.log(`   From: ${mailFrom}`);
      
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Welcome email sent successfully to ${email}`);
      console.log(`   Message ID: ${info.messageId}`);
      console.log(`   Response: ${info.response}`);
      
      // En développement avec MailHog, informer où trouver l'email
      const mailHost = this.configService.get('MAIL_HOST') || 'localhost';
      if (mailHost === 'mailhog' || mailHost === 'localhost') {
        const mailhogUrl = this.configService.get('MAILHOG_UI_URL') || 'http://localhost:8025';
        console.log(`   📧 Email captured by MailHog. View it at: ${mailhogUrl}`);
      }
      
      return info;
    } catch (error: any) {
      console.error(`❌ Error sending welcome email to ${email}:`);
      console.error(`   Error code: ${error?.code || 'N/A'}`);
      console.error(`   Error command: ${error?.command || 'N/A'}`);
      
      if (error instanceof Error) {
        console.error(`   Error message: ${error.message}`);
        
        // Messages d'erreur spécifiques pour Gmail
        const errorCode = (error as any).code;
        if (error.message.includes('Invalid login') || errorCode === 'EAUTH') {
          console.error(`   ⚠️  Gmail authentication failed. Make sure you're using an App Password, not your regular password.`);
          console.error(`   📖 How to create an App Password: https://support.google.com/accounts/answer/185833`);
        }
        
        if (error.message.includes('ECONNREFUSED') || errorCode === 'ECONNREFUSED') {
          console.error(`   ⚠️  Cannot connect to SMTP server. Check MAIL_HOST and MAIL_PORT configuration.`);
        }
        
        if (error.message.includes('ETIMEDOUT') || errorCode === 'ETIMEDOUT') {
          console.error(`   ⚠️  Connection timeout. Check your network and firewall settings.`);
        }
        
        console.error(`   Error stack: ${error.stack}`);
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
      console.log(`📤 Attempting to send invitation email to ${email}...`);
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Invitation email sent successfully to ${email}`);
      console.log(`   Message ID: ${info.messageId}`);
      return info;
    } catch (error: any) {
      console.error(`❌ Error sending invitation email to ${email}:`, error.message || error);
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
      console.log(`📤 Attempting to send invitation confirmation email to ${adminEmail}...`);
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Invitation confirmation email sent successfully to ${adminEmail}`);
      console.log(`   Message ID: ${info.messageId}`);
      return info;
    } catch (error: any) {
      console.error(`❌ Error sending invitation confirmation email to ${adminEmail}:`, error.message || error);
      // Ne pas bloquer le processus si l'email de confirmation échoue
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
      console.log(`📤 Attempting to send class archived email to ${email}...`);
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Class archived email sent successfully to ${email}`);
      console.log(`   Message ID: ${info.messageId}`);
      return info;
    } catch (error: any) {
      console.error(`❌ Error sending class archived email to ${email}:`, error.message || error);
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
      console.log(`📤 Attempting to send questionnaire reminder email to ${email}...`);
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Questionnaire reminder email sent successfully to ${email}`);
      console.log(`   Message ID: ${info.messageId}`);
      return info;
    } catch (error: any) {
      console.error(`❌ Error sending questionnaire reminder email to ${email}:`, error.message || error);
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
      console.log(`📤 Attempting to send student added to class email to ${email}...`);
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Student added to class email sent successfully to ${email}`);
      console.log(`   Message ID: ${info.messageId}`);
      return info;
    } catch (error: any) {
      console.error(`❌ Error sending student added to class email to ${email}:`, error.message || error);
      // Ne pas bloquer le processus si l'email échoue
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
      console.log(`📤 Attempting to send payment invoice email to ${email}...`);
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Payment invoice email sent successfully to ${email}`);
      console.log(`   Message ID: ${info.messageId}`);
      return info;
    } catch (error: any) {
      console.error(`❌ Error sending payment invoice email to ${email}:`, error.message || error);
      throw error;
    }
  }
}
