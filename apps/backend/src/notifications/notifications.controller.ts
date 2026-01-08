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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AlertStatus } from '@prisma/client';

@ApiTags('notifications')
@ApiBearerAuth('JWT-auth')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get user notifications' })
  @ApiQuery({ name: 'isRead', required: false, type: String, description: 'Filter by read status (true/false)' })
  @ApiResponse({ status: 200, description: 'Notifications retrieved successfully' })
  async getNotifications(@Req() req, @Query('isRead') isRead?: string) {
    const isReadBoolean = isRead === 'true' ? true : isRead === 'false' ? false : undefined;
    return this.notificationsService.getUserNotifications(
      req.user.userId,
      isReadBoolean,
    );
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notifications count' })
  @ApiResponse({ status: 200, description: 'Unread count retrieved', schema: { example: { count: 5 } } })
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
