import {
  Controller,
  Post,
  Patch,
  Get,
  Param,
  Body,
  UseGuards,
  Request,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { Response } from 'express';
import { QuestionnairesService } from './questionnaires.service';
import { CreateQuestionnairesDto } from './dto/create-questionnaires.dto';
import { UpdateQuestionnairesDto } from './dto/update-questionnaires.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('questionnaires')
export class QuestionnairesController {
  constructor(private readonly questionnairesService: QuestionnairesService) {}

  /**
   * Crée deux questionnaires pour une matière (pendant et fin de cours)
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.RESPONSABLE_PEDAGOGIQUE)
  create(@Request() req, @Body() createDto: CreateQuestionnairesDto) {
    return this.questionnairesService.createQuestionnaires(
      req.user.userId,
      createDto
    );
  }

  /**
   * Vérifie si les questionnaires peuvent être modifiés
   * IMPORTANT: Doit venir avant les routes avec :subjectId
   */
  @Get('subject/:subjectId/can-modify')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.RESPONSABLE_PEDAGOGIQUE)
  canModify(@Request() req, @Param('subjectId') subjectId: string) {
    return this.questionnairesService.canModifyQuestionnaires(
      req.user.userId,
      subjectId
    );
  }

  /**
   * Met à jour le type de formulaire pour tous les questionnaires d'une matière
   */
  @Patch('subject/:subjectId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.RESPONSABLE_PEDAGOGIQUE)
  update(
    @Request() req,
    @Param('subjectId') subjectId: string,
    @Body() updateDto: UpdateQuestionnairesDto
  ) {
    return this.questionnairesService.updateQuestionnaires(
      req.user.userId,
      subjectId,
      updateDto
    );
  }

  /**
   * Récupère un questionnaire par son token (accès public)
   * IMPORTANT: Doit venir avant :token/qrcode pour éviter les conflits
   */
  @Get('public/:token')
  getByToken(@Param('token') token: string) {
    return this.questionnairesService.getByToken(token);
  }

  /**
   * Génère et télécharge un QR code pour un questionnaire (endpoint public)
   * IMPORTANT: Doit venir en dernier pour éviter les conflits de routes
   */
  @Get(':token/qrcode')
  async downloadQRCode(
    @Param('token') token: string,
    @Res({ passthrough: true }) res: Response
  ) {
    const qrCodeBuffer = await this.questionnairesService.generateQRCode(token);
    
    res.set({
      'Content-Type': 'image/png',
      'Content-Disposition': `attachment; filename="questionnaire-${token}.png"`,
    });

    return new StreamableFile(qrCodeBuffer);
  }

  /**
   * Récupère tous les questionnaires avec leurs retours pour le dashboard
   */
  @Get('my-responses')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.RESPONSABLE_PEDAGOGIQUE)
  getMyResponses(@Request() req) {
    // TODO: Vérifier le plan de l'utilisateur (pour l'instant, par défaut gratuit)
    const isPaidPlan = false; // À remplacer par la vérification du plan Stripe
    return this.questionnairesService.getAllQuestionnairesWithResponses(
      req.user.userId,
      isPaidPlan
    );
  }

  /**
   * Récupère les détails d'un questionnaire avec toutes ses statistiques
   */
  @Get(':questionnaireId/details')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.RESPONSABLE_PEDAGOGIQUE)
  getQuestionnaireDetails(
    @Request() req,
    @Param('questionnaireId') questionnaireId: string
  ) {
    // TODO: Vérifier le plan de l'utilisateur (pour l'instant, par défaut gratuit)
    const isPaidPlan = false; // À remplacer par la vérification du plan Stripe
    return this.questionnairesService.getQuestionnaireDetails(
      req.user.userId,
      questionnaireId,
      isPaidPlan
    );
  }

  /**
   * Envoie des emails de relance aux étudiants pour un questionnaire
   */
  @Post(':questionnaireId/send-reminders')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.RESPONSABLE_PEDAGOGIQUE)
  sendReminders(
    @Request() req,
    @Param('questionnaireId') questionnaireId: string
  ) {
    return this.questionnairesService.sendRemindersToStudents(
      req.user.userId,
      questionnaireId
    );
  }
}
