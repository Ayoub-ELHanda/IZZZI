import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    // Configure nodemailer transporter
    // In development, use Mailhog (SMTP server for testing)
    // Support both MAIL_* and SMTP_* environment variables for compatibility
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
      html: this.getPasswordResetTemplate(resetUrl),
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
    const mailOptions = {
      from: this.configService.get('MAIL_FROM') || this.configService.get('SMTP_FROM') || 'IZZZI <noreply@izzzi.io>',
      to: email,
      subject: 'Bienvenue sur IZZZI ! 🎉',
      html: this.getWelcomeTemplate(firstName),
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
      html: this.getInvitationTemplate(inviterName, inviteUrl),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Invitation email sent to ${email}`);
    } catch (error) {
      console.error('Error sending invitation email:', error);
      throw error;
    }
  }

  private getPasswordResetTemplate(resetUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .logo { text-align: center; margin-bottom: 30px; }
          .button { display: inline-block; padding: 12px 30px; background: #FFD93D; color: #2F2E2C; text-decoration: none; border-radius: 8px; font-weight: 600; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <h1 style="color: #2F2E2C;">izzzi</h1>
          </div>
          <h2>Réinitialisation de mot de passe</h2>
          <p>Vous avez demandé à réinitialiser votre mot de passe IZZZI.</p>
          <p>Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a>
          </p>
          <p>Ce lien est valide pendant 1 heure.</p>
          <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.</p>
          <div class="footer">
            <p>Cordialement,<br>L'équipe IZZZI</p>
            <p style="font-size: 12px; color: #999;">Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>${resetUrl}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getWelcomeTemplate(firstName: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .logo { text-align: center; margin-bottom: 30px; }
          .button { display: inline-block; padding: 12px 30px; background: #FFD93D; color: #2F2E2C; text-decoration: none; border-radius: 8px; font-weight: 600; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <h1 style="color: #2F2E2C;">izzzi</h1>
          </div>
          <h2>Bienvenue ${firstName} ! 🎉</h2>
          <p>Votre compte IZZZI a été créé avec succès.</p>
          <p>Vous pouvez maintenant commencer à recueillir les retours de vos étudiants et améliorer vos enseignements.</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/dashboard" class="button">Accéder à mon tableau de bord</a>
          </p>
          <div class="footer">
            <p>Cordialement,<br>L'équipe IZZZI</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async sendClassArchivedEmail(email: string, data: { userName: string; className: string; archivedAt: string }) {
    const mailOptions = {
      from: this.configService.get('MAIL_FROM') || this.configService.get('SMTP_FROM') || 'IZZZI <noreply@izzzi.io>',
      to: email,
      subject: `Classe archivée : ${data.className}`,
      html: this.getClassArchivedTemplate(data),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Class archived email sent to ${email}`);
    } catch (error) {
      console.error('Error sending class archived email:', error);
      throw error;
    }
  }

  private getInvitationTemplate(inviterName: string, inviteUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .logo { text-align: center; margin-bottom: 30px; }
          .button { display: inline-block; padding: 12px 30px; background: #FFD93D; color: #2F2E2C; text-decoration: none; border-radius: 8px; font-weight: 600; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <h1 style="color: #2F2E2C;">izzzi</h1>
          </div>
          <h2>Vous êtes invité à rejoindre IZZZI</h2>
          <p>${inviterName} vous invite à rejoindre son équipe sur IZZZI.</p>
          <p>IZZZI est une plateforme de recueil et d'analyse des retours étudiants pour l'enseignement supérieur.</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${inviteUrl}" class="button">Accepter l'invitation</a>
          </p>
          <div class="footer">
            <p>Cordialement,<br>L'équipe IZZZI</p>
            <p style="font-size: 12px; color: #999;">Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>${inviteUrl}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getClassArchivedTemplate(data: { userName: string; className: string; archivedAt: string }): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .logo { text-align: center; margin-bottom: 30px; }
          .info-box { background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .button { display: inline-block; padding: 12px 30px; background: #FFD93D; color: #2F2E2C; text-decoration: none; border-radius: 8px; font-weight: 600; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <h1 style="color: #2F2E2C;">izzzi</h1>
          </div>
          <h2>Classe archivée</h2>
          <p>Bonjour ${data.userName},</p>
          <p>Votre classe a été archivée avec succès.</p>
          <div class="info-box">
            <strong>Nom de la classe :</strong> ${data.className}<br>
            <strong>Date d'archivage :</strong> ${data.archivedAt}
          </div>
          <p>Cette classe reste accessible en consultation dans la section "Classes archivées".</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/classes/archived" class="button">Voir mes classes archivées</a>
          </p>
          <div class="footer">
            <p>Cordialement,<br>L'équipe IZZZI</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async sendQuestionnaireReminderEmail(email: string, data: { subjectName: string; teacherName: string; questionnaireUrl: string }) {
    const mailOptions = {
      from: this.configService.get('MAIL_FROM') || this.configService.get('SMTP_FROM') || 'IZZZI <noreply@izzzi.io>',
      to: email,
      subject: `Un petit retour sur votre cours ${data.subjectName} ?`,
      html: this.getQuestionnaireReminderTemplate(data),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Questionnaire reminder email sent to ${email}`);
    } catch (error) {
      console.error('Error sending questionnaire reminder email:', error);
      throw error;
    }
  }

  private getQuestionnaireReminderTemplate(data: { subjectName: string; teacherName: string; questionnaireUrl: string }): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { 
            font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
            line-height: 1.6; 
            color: #2F2E2C; 
            background-color: #FFFFFF;
            margin: 0;
            padding: 0;
          }
          .container { 
            max-width: 600px; 
            margin: 40px auto; 
            padding: 40px 30px;
            background: #FFFFFF;
          }
          .logo { 
            text-align: center; 
            margin-bottom: 40px; 
          }
          .logo h1 {
            color: #2F2E2C;
            font-family: 'Mochiy Pop One', sans-serif;
            font-size: 32px;
            margin: 0;
          }
          .title {
            font-size: 24px;
            font-weight: 600;
            color: #2F2E2C;
            margin-bottom: 20px;
            text-align: center;
          }
          .content {
            font-size: 16px;
            color: #2F2E2C;
            margin-bottom: 20px;
          }
          .highlight {
            font-weight: 600;
          }
          .info-text {
            font-size: 14px;
            color: #6B6B6B;
            margin: 15px 0;
            line-height: 1.4;
          }
          .button-container {
            text-align: center;
            margin: 30px 0;
          }
          .button { 
            display: inline-block; 
            padding: 14px 32px; 
            background: #FFD93D; 
            color: #2F2E2C; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: 600;
            font-size: 16px;
            transition: background 0.3s;
          }
          .button:hover {
            background: #F6C700;
          }
          .footer { 
            margin-top: 40px; 
            padding-top: 20px; 
            border-top: 1px solid #E5E5E5; 
            font-size: 14px; 
            color: #6B6B6B;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <h1>izzzi</h1>
          </div>
          
          <div class="title">
            Un petit retour sur votre cours<br>${data.subjectName} ?
          </div>
          
          <div class="content">
            <p>Bonjour,</p>
            <p>Vous avez suivi le cours <span class="highlight">${data.subjectName}</span> avec <span class="highlight">${data.teacherName}</span>.</p>
            <p class="info-text">
              Un petit retour de votre part serait super utile pour faire évoluer les choses dans le bon sens.
            </p>
            <p class="info-text">
              Laisser un retour prend moins d'une minute :<br>
              <span class="highlight">Donner mon avis</span>
            </p>
            <p class="info-text">
              Votre avis compte, qu'il soit positif ou plus critique.
            </p>
          </div>

          <div class="button-container">
            <a href="${data.questionnaireUrl}" class="button">Donner mon avis</a>
          </div>

          <div class="content">
            <p>Merci pour votre participation à l'amélioration des cours !</p>
          </div>
          
          <div class="footer">
            <p>À bientôt,<br>L'équipe Izzzi</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
