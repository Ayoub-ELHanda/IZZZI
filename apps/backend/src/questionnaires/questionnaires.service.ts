import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '../mailer/mailer.service';
import { CreateQuestionnairesDto } from './dto/create-questionnaires.dto';
import { UpdateQuestionnairesDto } from './dto/update-questionnaires.dto';
import { QuestionnaireType } from '@prisma/client';
import { randomUUID } from 'crypto';
import * as QRCode from 'qrcode';

@Injectable()
export class QuestionnairesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService
  ) {}

  /**
   * Crée deux questionnaires pour une matière (pendant et fin de cours)
   */
  async createQuestionnaires(userId: string, dto: CreateQuestionnairesDto) {
    // Vérifier que la matière existe et appartient à l'utilisateur
    const subject = await this.prisma.subject.findFirst({
      where: {
        id: dto.subjectId,
        createdBy: userId,
      },
    });

    if (!subject) {
      throw new ForbiddenException('Subject not found or access denied');
    }

    // Vérifier qu'il n'existe pas déjà de questionnaires pour cette matière
    const existingQuestionnaires = await this.prisma.questionnaire.findMany({
      where: { subjectId: dto.subjectId },
    });

    if (existingQuestionnaires.length > 0) {
      throw new ForbiddenException('Questionnaires already exist for this subject');
    }

    // Créer les deux questionnaires (pendant le cours et fin de cours)
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

  /**
   * Met à jour le type de formulaire pour tous les questionnaires d'une matière
   * Seulement si aucune réponse n'a été enregistrée
   */
  async updateQuestionnaires(userId: string, subjectId: string, dto: UpdateQuestionnairesDto) {
    // Vérifier que la matière existe et appartient à l'utilisateur
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

    // Vérifier qu'aucun questionnaire n'a de réponses
    const hasResponses = subject.questionnaires.some(
      (q) => q._count.responses > 0
    );

    if (hasResponses) {
      throw new ForbiddenException(
        'Cannot update questionnaires with existing responses'
      );
    }

    // Mettre à jour tous les questionnaires de cette matière
    await this.prisma.questionnaire.updateMany({
      where: {
        subjectId: subjectId,
      },
      data: {
        formType: dto.formType,
      },
    });

    // Récupérer les questionnaires mis à jour
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

  /**
   * Vérifie si les questionnaires peuvent être modifiés
   */
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

  /**
   * Génère un QR code pour un questionnaire
   */
  async generateQRCode(token: string): Promise<Buffer> {
    const questionnaire = await this.prisma.questionnaire.findUnique({
      where: { token },
    });

    if (!questionnaire) {
      throw new NotFoundException('Questionnaire not found');
    }

    // Générer l'URL du questionnaire
    const url = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/questionnaire/${token}`;

    // Générer le QR code en tant que buffer PNG
    const qrCodeBuffer = await QRCode.toBuffer(url, {
      type: 'png',
      width: 500,
      margin: 2,
    });

    return qrCodeBuffer;
  }

  /**
   * Récupère un questionnaire par son token (pour les étudiants)
   */
  async getByToken(token: string) {
    const questionnaire = await this.prisma.questionnaire.findUnique({
      where: { token },
      include: {
        subject: {
          include: {
            class: true,
          },
        },
      },
    });

    if (!questionnaire || !questionnaire.isActive) {
      throw new NotFoundException('Questionnaire not found or inactive');
    }

    return questionnaire;
  }

  /**
   * Récupère tous les questionnaires avec leurs retours pour un utilisateur
   * Utilisé pour le dashboard "Mes retours"
   */
  async getAllQuestionnairesWithResponses(userId: string, isPaidPlan: boolean = false) {
    // Get user to check role
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, establishmentId: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Build where clause - admins can see all subjects in their establishment
    const whereClause: any = {};
    if (user.role !== 'ADMIN') {
      whereClause.createdBy = userId;
    } else if (user.establishmentId) {
      whereClause.class = { establishmentId: user.establishmentId };
    }

    // Récupérer tous les sujets de l'utilisateur avec leurs questionnaires
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
              // Limiter à 5 retours pour plan gratuit
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

    // Transformer les données pour le frontend
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

        // Calculer le score moyen
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
          averageRating: Math.round(averageRating * 10) / 10, // Arrondir à 1 décimale
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

  /**
   * Récupère les détails d'un questionnaire avec toutes ses statistiques
   */
  async getQuestionnaireDetails(userId: string, questionnaireId: string, isPaidPlan: boolean = false) {
    // Get user to check role
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, establishmentId: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Build where clause - admins can see all questionnaires in their establishment
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
          // Limiter à 5 retours pour plan gratuit
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

    // Calculer les statistiques
    const ratings = questionnaire.responses.map((r) => r.rating);
    const averageRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
      : 0;

    // Distribution des notes (1-5)
    const ratingDistribution = [1, 2, 3, 4, 5].map((rating) => ({
      rating,
      count: ratings.filter((r) => r === rating).length,
    }));

    // Retours avec commentaires
    const responsesWithComments = questionnaire.responses.filter((r) => r.comment);

    // Points forts et faibles (basés sur les commentaires - simplifié pour l'instant)
    // TODO: Utiliser l'IA pour analyser les commentaires
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

  /**
   * Envoie des emails de relance aux étudiants pour un questionnaire
   */
  async sendRemindersToStudents(userId: string, questionnaireId: string) {
    // Récupérer le questionnaire avec la matière et la classe
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

    // Vérifier que l'utilisateur est le créateur de la matière
    if (questionnaire.subject.createdBy !== userId) {
      throw new ForbiddenException(
        "Vous n'avez pas la permission d'envoyer des relances pour ce questionnaire"
      );
    }

    // Récupérer les emails des étudiants depuis la classe
    const studentEmails = questionnaire.subject.class.studentEmails;

    if (!studentEmails || studentEmails.length === 0) {
      throw new BadRequestException('Aucun email étudiant trouvé pour cette classe');
    }

    // Générer l'URL du questionnaire
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const questionnaireUrl = `${frontendUrl}/questionnaire/${questionnaire.token}`;

    // Envoyer les emails à tous les étudiants
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
}
