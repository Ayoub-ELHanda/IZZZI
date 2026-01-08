import { Injectable, Logger, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType, AlertStatus } from '@prisma/client';
import { MailerService } from '../mailer/mailer.service';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private prisma: PrismaService,
    private mailerService: MailerService,
    @Inject(forwardRef(() => NotificationsGateway))
    private notificationsGateway: NotificationsGateway,
  ) {}

  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    questionnaireId?: string,
  ) {
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        questionnaireId: questionnaireId || null,
      },
      include: {
        questionnaire: {
          include: {
            subject: {
              include: {
                class: true,
              },
            },
          },
        },
      },
    });

    await this.notificationsGateway.sendNotificationToUser(userId, notification);

    this.logger.log(`Notification créée pour l'utilisateur ${userId}: ${title}`);
    return notification;
  }

  async createAlert(
    userId: string,
    questionnaireId: string,
    type: NotificationType,
    message: string,
  ) {
    
    const existingAlert = await this.prisma.alert.findFirst({
      where: {
        userId,
        questionnaireId,
        status: AlertStatus.UNTREATED,
      },
    });

    if (existingAlert) {
      
      const updatedAlert = await this.prisma.alert.update({
        where: { id: existingAlert.id },
        data: {
          type,
          message,
          updatedAt: new Date(),
        },
        include: {
          questionnaire: {
            include: {
              subject: {
                include: {
                  class: true,
                },
              },
            },
          },
        },
      });

      await this.notificationsGateway.sendAlertToUser(userId, updatedAlert);

      await this.createNotification(
        userId,
        type,
        type === NotificationType.ALERT_POSITIVE
          ? 'Alerte positive mise à jour'
          : 'Alerte négative mise à jour',
        message,
        questionnaireId,
      );

      return updatedAlert;
    }

    const alert = await this.prisma.alert.create({
      data: {
        userId,
        questionnaireId,
        type,
        message,
      },
      include: {
        questionnaire: {
          include: {
            subject: {
              include: {
                class: true,
              },
            },
          },
        },
      },
    });

    await this.createNotification(
      userId,
      type,
      type === NotificationType.ALERT_POSITIVE
        ? 'Alerte positive détectée'
        : 'Alerte négative détectée',
      message,
      questionnaireId,
    );

    this.logger.log(`Alerte créée pour l'utilisateur ${userId} sur le questionnaire ${questionnaireId}`);
    return alert;
  }

  async getUserNotifications(userId: string, isRead?: boolean) {
    const where: any = { userId };
    if (isRead !== undefined) {
      where.isRead = isRead;
    }

    return this.prisma.notification.findMany({
      where,
      include: {
        questionnaire: {
          include: {
            subject: {
              include: {
                class: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getUserAlerts(userId: string, status?: AlertStatus) {
    const where: any = { userId };
    if (status !== undefined) {
      where.status = status;
    }

    return this.prisma.alert.findMany({
      where,
      include: {
        questionnaire: {
          include: {
            subject: {
              include: {
                class: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async markNotificationAsRead(notificationId: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId, 
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async markAllNotificationsAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async markAlertAsTreated(alertId: string, userId: string) {
    return this.prisma.alert.updateMany({
      where: {
        id: alertId,
        userId, 
      },
      data: {
        status: AlertStatus.TREATED,
        treatedAt: new Date(),
        treatedBy: userId,
      },
    });
  }

  async updateAlertComment(alertId: string, userId: string, comment: string) {
    return this.prisma.alert.updateMany({
      where: {
        id: alertId,
        userId, 
      },
      data: {
        comment,
        updatedAt: new Date(),
      },
    });
  }

  async sendMessageToStudents(alertId: string, userId: string, message: string) {
    
    const alert = await this.prisma.alert.findFirst({
      where: {
        id: alertId,
        userId, 
      },
      include: {
        questionnaire: {
          include: {
            subject: {
              include: {
                class: true,
              },
            },
          },
        },
        user: true,
      },
    });

    if (!alert) {
      throw new NotFoundException('Alerte non trouvée');
    }

    const questionnaire = alert.questionnaire;
    const subject = questionnaire.subject;
    const classItem = subject.class;
    const studentEmails = classItem.studentEmails || [];

    if (studentEmails.length === 0) {
      throw new BadRequestException('Aucun email étudiant trouvé pour cette classe');
    }

    const senderName = `${alert.user.firstName} ${alert.user.lastName}`;

    const emailPromises = studentEmails.map((email) =>
      this.mailerService.sendCustomMessageToStudents(email, {
        subjectName: subject.name,
        teacherName: subject.teacherName,
        className: classItem.name,
        message,
        senderName,
      })
    );

    try {
      await Promise.all(emailPromises);
      this.logger.log(`Message envoyé à ${studentEmails.length} étudiant(s) pour l'alerte ${alertId}`);
      
      return {
        success: true,
        message: `Message envoyé à ${studentEmails.length} étudiant(s)`,
        emailsSent: studentEmails.length,
      };
    } catch (error) {
      this.logger.error(`Erreur lors de l'envoi du message aux étudiants:`, error);
      throw new BadRequestException('Erreur lors de l\'envoi du message aux étudiants');
    }
  }

  async getUnreadNotificationCount(userId: string) {
    return this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  async getUntreatedAlertCount(userId: string) {
    return this.prisma.alert.count({
      where: {
        userId,
        status: AlertStatus.UNTREATED,
      },
    });
  }
}
