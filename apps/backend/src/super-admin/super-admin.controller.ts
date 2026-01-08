import {
  Controller,
  Get,
  Put,
  Param,
  Query,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('super-admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
export class SuperAdminController {
  constructor(private superAdminService: SuperAdminService) {}


  @Get('users')
  async getAllUsers(@Query('role') role?: string) {

    if (role && !Object.values(UserRole).includes(role as UserRole)) {
      return this.superAdminService.getAllUsers(undefined);
    }
    return this.superAdminService.getAllUsers(role as UserRole | undefined);
  }

  
  @Get('users/:id')
  async getUserById(@Param('id') id: string) {
    return this.superAdminService.getUserById(id);
  }

  /**
   * Récupérer tous les professeurs pédagogiques associés à un Admin
   */
  @Get('admins/:adminId/teachers')
  async getTeachersByAdmin(@Param('adminId') adminId: string) {
    return this.superAdminService.getTeachersByAdmin(adminId);
  }

  /**
   * Récupérer tous les abonnements d'un Admin
   */
  @Get('admins/:adminId/subscriptions')
  async getAdminSubscriptions(@Param('adminId') adminId: string) {
    return this.superAdminService.getAdminSubscriptions(adminId);
  }

  /**
   * Annuler un abonnement
   */
  @Put('subscriptions/:subscriptionId/cancel')
  async cancelSubscription(@Param('subscriptionId') subscriptionId: string) {
    return this.superAdminService.cancelSubscription(subscriptionId);
  }

  /**
   * Renouveler un abonnement
   */
  @Put('subscriptions/:subscriptionId/renew')
  async renewSubscription(@Param('subscriptionId') subscriptionId: string) {
    return this.superAdminService.renewSubscription(subscriptionId);
  }

  /**
   * Récupérer tous les abonnements actifs avec les informations utilisateur
   */
  @Get('subscriptions/active')
  async getAllActiveSubscriptions() {
    return this.superAdminService.getAllActiveSubscriptions();
  }

  /**
   * Récupérer tous les abonnements (pour debug)
   */
  @Get('subscriptions/all')
  async getAllSubscriptions() {
    return this.superAdminService.getAllSubscriptions();
  }

  /**
   * Réassigner un RESPONSABLE_PEDAGOGIQUE à un autre ADMIN
   */
  @Put('teachers/:teacherId/reassign')
  async reassignTeacherToAdmin(
    @Param('teacherId') teacherId: string,
    @Body() body: { newAdminId: string },
  ) {
    return this.superAdminService.reassignTeacherToAdmin(teacherId, body.newAdminId);
  }

  /**
   * Récupérer tous les ADMIN pour la sélection
   */
  @Get('admins')
  async getAllAdmins() {
    return this.superAdminService.getAllAdmins();
  }
}

