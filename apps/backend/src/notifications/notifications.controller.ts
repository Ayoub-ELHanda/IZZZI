import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Query,
  UseGuards,
  Req,
  Body,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AlertStatus } from '@prisma/client';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  async getNotifications(@Req() req, @Query('isRead') isRead?: string) {
    const isReadBoolean = isRead === 'true' ? true : isRead === 'false' ? false : undefined;
    return this.notificationsService.getUserNotifications(
      req.user.userId,
      isReadBoolean,
    );
  }

  @Get('unread-count')
  async getUnreadCount(@Req() req) {
    const count =
      await this.notificationsService.getUnreadNotificationCount(
        req.user.userId,
      );
    return { count };
  }

  @Put(':id/read')
  async markAsRead(@Param('id') id: string, @Req() req) {
    await this.notificationsService.markNotificationAsRead(
      id,
      req.user.userId,
    );
    return { success: true };
  }

  @Put('mark-all-read')
  async markAllAsRead(@Req() req) {
    await this.notificationsService.markAllNotificationsAsRead(
      req.user.userId,
    );
    return { success: true };
  }

  @Get('alerts')
  async getAlerts(@Req() req, @Query('status') status?: AlertStatus) {
    return this.notificationsService.getUserAlerts(
      req.user.userId,
      status,
    );
  }

  @Get('alerts/untreated-count')
  async getUntreatedAlertCount(@Req() req) {
    const count =
      await this.notificationsService.getUntreatedAlertCount(req.user.userId);
    return { count };
  }

  @Put('alerts/:id/treat')
  async markAlertAsTreated(@Param('id') id: string, @Req() req) {
    await this.notificationsService.markAlertAsTreated(id, req.user.userId);
    return { success: true };
  }

  @Put('alerts/:id/comment')
  async updateAlertComment(
    @Param('id') id: string,
    @Req() req,
    @Body() body: { comment: string },
  ) {
    await this.notificationsService.updateAlertComment(
      id,
      req.user.userId,
      body.comment,
    );
    return { success: true };
  }

  @Post('alerts/:id/send-message')
  async sendMessageToStudents(
    @Param('id') id: string,
    @Req() req,
    @Body() body: { message: string },
  ) {
    const result = await this.notificationsService.sendMessageToStudents(
      id,
      req.user.userId,
      body.message,
    );
    return result;
  }
}

