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
