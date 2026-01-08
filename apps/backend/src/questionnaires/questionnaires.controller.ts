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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { QuestionnairesService } from './questionnaires.service';
import { AIService } from '../ai/ai.service';
import { CreateQuestionnairesDto } from './dto/create-questionnaires.dto';
import { UpdateQuestionnairesDto } from './dto/update-questionnaires.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('questionnaires')
@Controller('questionnaires')
export class QuestionnairesController {
  constructor(
    private readonly questionnairesService: QuestionnairesService,
    private readonly aiService: AIService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.RESPONSABLE_PEDAGOGIQUE)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new questionnaire' })
  @ApiResponse({ status: 201, description: 'Questionnaire created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiBody({ type: CreateQuestionnairesDto })
  create(@Request() req, @Body() createDto: CreateQuestionnairesDto) {
    return this.questionnairesService.createQuestionnaires(
      req.user.userId,
      createDto
    );
  }


  @Get('subject/:subjectId/can-modify')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.RESPONSABLE_PEDAGOGIQUE)
  canModify(@Request() req, @Param('subjectId') subjectId: string) {
    return this.questionnairesService.canModifyQuestionnaires(
      req.user.userId,
      subjectId
    );
  }

  
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


  @Get('public/:token')
  getByToken(@Param('token') token: string) {
    return this.questionnairesService.getByToken(token);
  }

 
  @Post('public/:token/submit')
  @ApiOperation({ summary: 'Submit a questionnaire response (Public endpoint)' })
  @ApiParam({ name: 'token', description: 'Questionnaire token', example: 'abc123-def456-ghi789' })
  @ApiResponse({ status: 200, description: 'Response submitted successfully', schema: { example: { success: true, message: 'Merci pour votre retour !' } } })
  @ApiResponse({ status: 400, description: 'Bad request - Already responded or invalid data' })
  @ApiResponse({ status: 404, description: 'Questionnaire not found' })
  @ApiBody({ 
    schema: { 
      type: 'object', 
      properties: { 
        email: { type: 'string', example: 'student@example.com' }, 
        rating: { type: 'number', example: 4, minimum: 1, maximum: 5 }, 
        comment: { type: 'string', example: 'Great course!' }, 
        isAnonymous: { type: 'boolean', example: true } 
      },
      required: ['email', 'rating']
    } 
  })
  submitResponse(
    @Param('token') token: string,
    @Body() dto: any
  ) {
    return this.questionnairesService.submitResponse(
      token,
      dto.email,
      dto.rating,
      dto.comment,
      dto.isAnonymous ?? true
    );
  }


  @Get(':token/qrcode')
  @ApiOperation({ summary: 'Download QR code for questionnaire' })
  @ApiParam({ name: 'token', description: 'Questionnaire token' })
  @ApiResponse({ status: 200, description: 'QR code image', content: { 'image/png': {} } })
  @ApiResponse({ status: 404, description: 'Questionnaire not found' })
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

  @Get(':questionnaireId/ai-summary')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.RESPONSABLE_PEDAGOGIQUE, 'SUPER_ADMIN' as any)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get AI-generated feedback summary' })
  @ApiParam({ name: 'questionnaireId', description: 'Questionnaire ID' })
  @ApiResponse({ status: 200, description: 'AI summary retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Summary not found' })
  async getAISummary(
    @Request() req,
    @Param('questionnaireId') questionnaireId: string
  ) {
    return this.aiService.generateFeedbackSummary(questionnaireId);
  }

  @Get(':questionnaireId/ai-statistics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.RESPONSABLE_PEDAGOGIQUE, 'SUPER_ADMIN' as any)
  async getAIStatistics(
    @Request() req,
    @Param('questionnaireId') questionnaireId: string
  ) {
    return this.aiService.generateStatistics(questionnaireId);
  }

  @Get(':questionnaireId/all-statistics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.RESPONSABLE_PEDAGOGIQUE, 'SUPER_ADMIN' as any)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all AI-generated statistics for a questionnaire' })
  @ApiParam({ name: 'questionnaireId', description: 'Questionnaire ID' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Questionnaire not found' })
  async getAllStatistics(
    @Request() req,
    @Param('questionnaireId') questionnaireId: string
  ) {
    // Récupérer les statistiques depuis la base de données
    const statistics = await this.questionnairesService.getQuestionnaireStatistics(questionnaireId);
    if (statistics) {
      return statistics;
    }
    // Si pas de statistiques, les générer
    return this.aiService.generateAllStatistics(questionnaireId);
  }
}
