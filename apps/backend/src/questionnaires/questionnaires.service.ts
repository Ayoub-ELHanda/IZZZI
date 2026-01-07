import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '../mailer/mailer.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { AIService } from '../ai/ai.service';
import { CreateQuestionnairesDto } from './dto/create-questionnaires.dto';
import { UpdateQuestionnairesDto } from './dto/update-questionnaires.dto';
import { QuestionnaireType, NotificationType } from '@prisma/client';
import { randomUUID } from 'crypto';
import * as QRCode from 'qrcode';

@Injectable()
export class QuestionnairesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
    private readonly notificationsService: NotificationsService,
    private readonly notificationsGateway: NotificationsGateway,
    private readonly aiService: AIService
  ) {}

 
  async createQuestionnaires(userId: string, dto: CreateQuestionnairesDto) {
  
    const subject = await this.prisma.subject.findFirst({
      where: {
        id: dto.subjectId,
        createdBy: userId,
      },
    });

    if (!subject) {
      throw new ForbiddenException('Subject not found or access denied');
    }

    
    const existingQuestionnaires = await this.prisma.questionnaire.findMany({
      where: { subjectId: dto.subjectId },
    });

    if (existingQuestionnaires.length > 0) {
      throw new ForbiddenException('Questionnaires already exist for this subject');
    }

  
    const duringCourseToken = randomUUID();
    const afterCourseToken = randomUUID();

    const [duringCourseQuestionnaire, afterCourseQuestionnaire] = await Promise.all([
      this.prisma.questionnaire.create({
        data: {
          type: QuestionnaireType.DURING_COURSE,
          formType: dto.formType,
          subjectId: dto.subjectId,
          token: duringCourseToken,
        },
        include: {
          _count: {
            select: {
              responses: true,
            },
          },
        },
      }),
      this.prisma.questionnaire.create({
        data: {
          type: QuestionnaireType.AFTER_COURSE,
          formType: dto.formType,
          subjectId: dto.subjectId,
          token: afterCourseToken,
        },
        include: {
          _count: {
            select: {
              responses: true,
            },
          },
        },
      }),
    ]);

    return {
      duringCourse: duringCourseQuestionnaire,
      afterCourse: afterCourseQuestionnaire,
    };
  }


  async updateQuestionnaires(userId: string, subjectId: string, dto: UpdateQuestionnairesDto) {
   
    const subject = await this.prisma.subject.findFirst({
      where: {
        id: subjectId,
        createdBy: userId,
      },
      include: {
        questionnaires: {
          include: {
            _count: {
              select: {
                responses: true,
              },
            },
          },
        },
      },
    });

    if (!subject) {
      throw new ForbiddenException('Subject not found or access denied');
    }

    if (!subject.questionnaires || subject.questionnaires.length === 0) {
      throw new NotFoundException('No questionnaires found for this subject');
    }


    const hasResponses = subject.questionnaires.some(
      (q) => q._count.responses > 0
    );

    if (hasResponses) {
      throw new ForbiddenException(
        'Cannot update questionnaires with existing responses'
      );
    }

    await this.prisma.questionnaire.updateMany({
      where: {
        subjectId: subjectId,
      },
      data: {
        formType: dto.formType,
      },
    });


    return this.prisma.questionnaire.findMany({
      where: {
        subjectId: subjectId,
      },
      include: {
        _count: {
          select: {
            responses: true,
          },
        },
      },
    });
  }


   
  async canModifyQuestionnaires(userId: string, subjectId: string) {
    const subject = await this.prisma.subject.findFirst({
      where: {
        id: subjectId,
        createdBy: userId,
      },
      include: {
        questionnaires: {
          include: {
            _count: {
              select: {
                responses: true,
              },
            },
          },
        },
      },
    });

    if (!subject) {
      throw new ForbiddenException('Subject not found or access denied');
    }

    if (!subject.questionnaires || subject.questionnaires.length === 0) {
      return { canModify: true, reason: null };
    }

    const hasResponses = subject.questionnaires.some(
      (q) => q._count.responses > 0
    );

    return {
      canModify: !hasResponses,
      reason: hasResponses ? 'Questionnaires have existing responses' : null,
    };
  }


  async generateQRCode(token: string): Promise<Buffer> {
    const questionnaire = await this.prisma.questionnaire.findUnique({
      where: { token },
    });

    if (!questionnaire) {
      throw new NotFoundException('Questionnaire not found');
    }

    
    const url = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/questionnaire/${token}`;

    const qrCodeBuffer = await QRCode.toBuffer(url, {
      type: 'png',
      width: 500,
      margin: 2,
    });

    return qrCodeBuffer;
  }


  async getByToken(token: string) {
    const questionnaire = await this.prisma.questionnaire.findUnique({
      where: { token },
      include: {
        subject: {
          include: {
            class: {
              include: {
                establishment: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!questionnaire || !questionnaire.isActive) {
      throw new NotFoundException('Questionnaire not found or inactive');
    }

    return {
      ...questionnaire,
      subject: {
        ...questionnaire.subject,
        class: {
          ...questionnaire.subject.class,
          school: questionnaire.subject.class.establishment?.name || 'École non renseignée',
        },
      },
    };
  }

  async submitResponse(token: string, email: string, rating: number, comment?: string, isAnonymous: boolean = true) {
  
    const questionnaire = await this.prisma.questionnaire.findUnique({
      where: { token },
      include: {
        subject: {
          include: {
            class: {
              select: {
                id: true,
                name: true,
                studentEmails: true,
              },
            },
          },
        },
      },
    });

    if (!questionnaire || !questionnaire.isActive) {
      throw new NotFoundException('Questionnaire introuvable ou inactif');
    }


    const studentEmails = questionnaire.subject.class.studentEmails || [];
    const isAnonymousEmail = email.endsWith('@questionnaire.com');
    
    if (!isAnonymousEmail && !studentEmails.includes(email)) {
      throw new ForbiddenException(
        'Accès refusé : Cet email ne fait pas partie de cette classe'
      );
    }

    const existingResponse = await this.prisma.response.findFirst({
      where: {
        questionnaireId: questionnaire.id,
        studentEmail: email,
      },
    });

    if (existingResponse) {
      throw new BadRequestException('Vous avez déjà répondu à ce questionnaire');
    }


    const response = await this.prisma.response.create({
      data: {
        questionnaireId: questionnaire.id,
        rating,
        comment: comment || null,
        isAnonymous,
        studentEmail: email, 
      },
    });

    // Vérifier et générer des alertes après la soumission
    await this.checkAndGenerateAlerts(questionnaire.id);

    // Générer automatiquement toutes les statistiques IA après chaque nouveau retour
    this.aiService.generateAllStatistics(questionnaire.id)
      .then(() => {
        console.log(`Statistics generated for questionnaire ${questionnaire.id} after new response`);
      })
      .catch((error) => {
        console.error(`Failed to generate statistics for questionnaire ${questionnaire.id}: ${error.message}`);
      });

    return {
      success: true,
      message: 'Merci pour votre retour !',
      response: {
        id: response.id,
        rating: response.rating,
        createdAt: response.createdAt,
      },
    };
  }

  /**
   * Vérifier les critères d'alerte et générer des alertes si nécessaire
   */
  private async checkAndGenerateAlerts(questionnaireId: string) {
    const questionnaire = await this.prisma.questionnaire.findUnique({
      where: { id: questionnaireId },
      include: {
        responses: true,
        subject: {
          include: {
            class: true,
            user: true,
          },
        },
      },
    });

    if (!questionnaire || questionnaire.responses.length === 0) {
      return;
    }

    const userId = questionnaire.subject.createdBy;
    const totalResponses = questionnaire.responses.length;
    const averageRating =
      questionnaire.responses.reduce((sum, r) => sum + r.rating, 0) /
      totalResponses;

    // Critères d'alerte
    const hasLowRating = averageRating < 3.5;
    const hasLowResponses = totalResponses < 5;

    // Générer des alertes selon les critères
    if (hasLowRating || hasLowResponses) {
      const alertType = questionnaire.type === QuestionnaireType.DURING_COURSE
        ? NotificationType.ALERT_POSITIVE
        : NotificationType.ALERT_NEGATIVE;

      let message = '';
      if (hasLowRating && hasLowResponses) {
        message = `Score moyen faible (${averageRating.toFixed(1)}/5) et nombre de retours insuffisant (${totalResponses} retours).`;
      } else if (hasLowRating) {
        message = `Score moyen faible détecté sur le cours ${questionnaire.subject.name} de ${questionnaire.subject.teacherName} (${averageRating.toFixed(1)}/5).`;
      } else if (hasLowResponses) {
        message = `Nombre de retours insuffisant sur le cours ${questionnaire.subject.name} de ${questionnaire.subject.teacherName} (${totalResponses} retours).`;
      }

      // Créer l'alerte
      const alert = await this.notificationsService.createAlert(
        userId,
        questionnaireId,
        alertType,
        message,
      );

      // Envoyer via WebSocket
      await this.notificationsGateway.sendAlertToUser(userId, alert);

      // Générer la synthèse AI uniquement lors de la création d'une nouvelle alerte
      // Vérifier si une synthèse existe déjà pour éviter les appels API inutiles
      try {
        const existingSummary = await this.prisma.feedbackSummary.findUnique({
          where: { questionnaireId },
        });

        if (!existingSummary) {
          // Générer la synthèse en arrière-plan (ne pas bloquer la réponse)
          this.aiService.generateFeedbackSummary(questionnaireId).catch((error) => {
            console.error('Error generating feedback summary:', error);
          });
        }
      } catch (error) {
        // Ignorer les erreurs de génération de synthèse pour ne pas bloquer la création d'alerte
        console.error('Error checking/generating feedback summary:', error);
      }
    } else if (averageRating >= 4.5 && totalResponses >= 5) {
      // Alerte positive pour les bons scores
      const alert = await this.notificationsService.createAlert(
        userId,
        questionnaireId,
        NotificationType.ALERT_POSITIVE,
        `Excellent score détecté sur le cours ${questionnaire.subject.name} de ${questionnaire.subject.teacherName} (${averageRating.toFixed(1)}/5 avec ${totalResponses} retours).`,
      );

      await this.notificationsGateway.sendAlertToUser(userId, alert);

      // Générer la synthèse AI uniquement lors de la création d'une nouvelle alerte
      try {
        const existingSummary = await this.prisma.feedbackSummary.findUnique({
          where: { questionnaireId },
        });

        if (!existingSummary) {
          // Générer la synthèse en arrière-plan (ne pas bloquer la réponse)
          this.aiService.generateFeedbackSummary(questionnaireId).catch((error) => {
            console.error('Error generating feedback summary:', error);
          });
        }
      } catch (error) {
        // Ignorer les erreurs de génération de synthèse pour ne pas bloquer la création d'alerte
        console.error('Error checking/generating feedback summary:', error);
      }
    }
  }

  
  async getAllQuestionnairesWithResponses(userId: string, isPaidPlan: boolean = false) {

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, establishmentId: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }


    const whereClause: any = {};
    if (user.role !== 'ADMIN') {
      whereClause.createdBy = userId;
    } else if (user.establishmentId) {
      whereClause.class = { establishmentId: user.establishmentId };
    }

    const subjects = await this.prisma.subject.findMany({
      where: whereClause,
      include: {
        class: {
          select: {
            id: true,
            name: true,
          },
        },
        questionnaires: {
          include: {
            responses: {
              orderBy: {
                createdAt: 'desc',
              },
         
              ...(isPaidPlan ? {} : { take: 5 }),
            },
            _count: {
              select: {
                responses: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return subjects.map((subject) => ({
      id: subject.id,
      name: subject.name,
      teacherName: subject.teacherName,
      className: subject.class.name,
      classId: subject.class.id,
      startDate: subject.startDate,
      endDate: subject.endDate,
      questionnaires: subject.questionnaires.map((questionnaire) => {
        const totalResponses = questionnaire._count.responses;
        const visibleResponses = isPaidPlan 
          ? questionnaire.responses.length 
          : Math.min(questionnaire.responses.length, 5);
        const hiddenResponses = isPaidPlan ? 0 : Math.max(0, totalResponses - 5);

        const averageRating = questionnaire.responses.length > 0
          ? questionnaire.responses.reduce((sum, r) => sum + r.rating, 0) / questionnaire.responses.length
          : 0;

        return {
          id: questionnaire.id,
          type: questionnaire.type,
          token: questionnaire.token,
          totalResponses,
          visibleResponses,
          hiddenResponses,
          averageRating: Math.round(averageRating * 10) / 10, 
          responses: questionnaire.responses.map((response) => ({
            id: response.id,
            rating: response.rating,
            comment: response.comment,
            isAnonymous: response.isAnonymous,
            createdAt: response.createdAt,
          })),
        };
      }),
    }));
  }

  async getQuestionnaireDetails(userId: string, questionnaireId: string, isPaidPlan: boolean = false) {
   
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, establishmentId: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    
    const whereClause: any = { id: questionnaireId };
    if (user.role !== 'ADMIN') {
      whereClause.subject = { createdBy: userId };
    } else if (user.establishmentId) {
      whereClause.subject = { class: { establishmentId: user.establishmentId } };
    }

    const questionnaire = await this.prisma.questionnaire.findFirst({
      where: whereClause,
      include: {
        subject: {
          include: {
            class: {
              select: {
                id: true,
                name: true,
                studentCount: true,
              },
            },
          },
        },
        responses: {
          orderBy: {
            createdAt: 'desc',
          },
          
          ...(isPaidPlan ? {} : { take: 5 }),
        },
        _count: {
          select: {
            responses: true,
          },
        },
      },
    });

    if (!questionnaire) {
      throw new NotFoundException('Questionnaire not found or access denied');
    }

    const totalResponses = questionnaire._count.responses;
    const visibleResponses = isPaidPlan 
      ? questionnaire.responses.length 
      : Math.min(questionnaire.responses.length, 5);
    const hiddenResponses = isPaidPlan ? 0 : Math.max(0, totalResponses - 5);

    const ratings = questionnaire.responses.map((r) => r.rating);
    const averageRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
      : 0;

 
    const ratingDistribution = [1, 2, 3, 4, 5].map((rating) => ({
      rating,
      count: ratings.filter((r) => r === rating).length,
    }));

 
    const responsesWithComments = questionnaire.responses.filter((r) => r.comment);

   
    const positiveComments = responsesWithComments.filter((r) => r.rating >= 4);
    const negativeComments = responsesWithComments.filter((r) => r.rating <= 2);

    return {
      id: questionnaire.id,
      type: questionnaire.type,
      token: questionnaire.token,
      subject: {
        id: questionnaire.subject.id,
        name: questionnaire.subject.name,
        teacherName: questionnaire.subject.teacherName,
        className: questionnaire.subject.class.name,
        studentCount: questionnaire.subject.class.studentCount,
      },
      totalResponses,
      visibleResponses,
      hiddenResponses,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingDistribution,
      responses: questionnaire.responses.map((response) => ({
        id: response.id,
        rating: response.rating,
        comment: response.comment,
        isAnonymous: response.isAnonymous,
        createdAt: response.createdAt,
      })),
      positiveComments: positiveComments.length,
      negativeComments: negativeComments.length,
      isPaidPlan,
    };
  }

   
  async sendRemindersToStudents(userId: string, questionnaireId: string) {
 
    const questionnaire = await this.prisma.questionnaire.findUnique({
      where: { id: questionnaireId },
      include: {
        subject: {
          include: {
            class: true,
          },
        },
      },
    });

    if (!questionnaire) {
      throw new NotFoundException('Questionnaire non trouvé');
    }

 
    if (questionnaire.subject.createdBy !== userId) {
      throw new ForbiddenException(
        "Vous n'avez pas la permission d'envoyer des relances pour ce questionnaire"
      );
    }

    
    const studentEmails = questionnaire.subject.class.studentEmails;

    if (!studentEmails || studentEmails.length === 0) {
      throw new BadRequestException('Aucun email étudiant trouvé pour cette classe');
    }

   
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const questionnaireUrl = `${frontendUrl}/questionnaire/${questionnaire.token}`;


    const emailPromises = studentEmails.map((email) =>
      this.mailerService.sendQuestionnaireReminderEmail(email, {
        subjectName: questionnaire.subject.name,
        teacherName: questionnaire.subject.teacherName,
        questionnaireUrl,
      })
    );

    try {
      await Promise.all(emailPromises);
      
      return {
        success: true,
        message: `Emails de relance envoyés à ${studentEmails.length} étudiant(s)`,
        emailsSent: studentEmails.length,
      };
    } catch (error) {
      console.error('Error sending reminder emails:', error);
      throw new BadRequestException('Erreur lors de l\'envoi des emails de relance');
    }
  }

  /**
   * Récupérer les statistiques d'un questionnaire depuis la base de données
   */
  async getQuestionnaireStatistics(questionnaireId: string) {
    const statistics = await this.prisma.questionnaireStatistics.findUnique({
      where: { questionnaireId },
    });
    return statistics;
  }
}
