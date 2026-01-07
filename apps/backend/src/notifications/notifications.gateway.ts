import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NotificationsService } from './notifications.service';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/notifications',
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);
  private connectedUsers = new Map<string, string>(); // userId -> socketId

  constructor(
    private jwtService: JwtService,
    @Inject(forwardRef(() => NotificationsService))
    private notificationsService: NotificationsService,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      // Récupérer le token depuis la query string ou les headers
      const token =
        client.handshake.auth?.token ||
        client.handshake.query?.token?.toString();

      if (!token) {
        this.logger.warn(`Connexion refusée: pas de token`);
        client.disconnect();
        return;
      }

      // Vérifier le token JWT
      const payload = this.jwtService.verify(token);
      const userId = payload.userId || payload.sub;

      if (!userId) {
        this.logger.warn(`Connexion refusée: token invalide`);
        client.disconnect();
        return;
      }

      // Stocker l'ID utilisateur dans la socket
      client.userId = userId;
      this.connectedUsers.set(userId, client.id);

      // Rejoindre une room spécifique à l'utilisateur
      client.join(`user:${userId}`);

      this.logger.log(`Utilisateur connecté: ${userId} (socket: ${client.id})`);

      // Envoyer le nombre de notifications non lues au moment de la connexion
      const unreadCount =
        await this.notificationsService.getUnreadNotificationCount(userId);
      client.emit('unread_count', unreadCount);
      
      // Envoyer aussi le nombre d'alertes non traitées au moment de la connexion
      const untreatedCount =
        await this.notificationsService.getUntreatedAlertCount(userId);
      client.emit('untreated_alert_count', untreatedCount);
    } catch (error) {
      this.logger.error(`Erreur lors de la connexion: ${error.message}`);
      client.disconnect();
    }
  }

  async handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      this.connectedUsers.delete(client.userId);
      this.logger.log(
        `Utilisateur déconnecté: ${client.userId} (socket: ${client.id})`,
      );
    }
  }

  /**
   * Envoyer une notification à un utilisateur spécifique
   */
  async sendNotificationToUser(userId: string, notification: any) {
    this.server.to(`user:${userId}`).emit('new_notification', notification);
    
    // Mettre à jour le compteur de notifications non lues
    const unreadCount =
      await this.notificationsService.getUnreadNotificationCount(userId);
    this.server.to(`user:${userId}`).emit('unread_count', unreadCount);
  }

  /**
   * Envoyer une alerte à un utilisateur spécifique
   */
  async sendAlertToUser(userId: string, alert: any) {
    this.logger.log(`Envoi de l'alerte ${alert.id} à l'utilisateur ${userId} via WebSocket`);
    this.server.to(`user:${userId}`).emit('new_alert', alert);
    
    // Mettre à jour le compteur d'alertes non traitées
    const untreatedCount =
      await this.notificationsService.getUntreatedAlertCount(userId);
    this.server.to(`user:${userId}`).emit('untreated_alert_count', untreatedCount);
    this.logger.log(`Compteur d'alertes non traitées mis à jour: ${untreatedCount}`);
  }

  @SubscribeMessage('get_notifications')
  async handleGetNotifications(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { isRead?: boolean },
  ) {
    if (!client.userId) {
      return { error: 'Non authentifié' };
    }

    const notifications = await this.notificationsService.getUserNotifications(
      client.userId,
      data.isRead,
    );

    return { notifications };
  }

  @SubscribeMessage('get_alerts')
  async handleGetAlerts(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { status?: string },
  ) {
    if (!client.userId) {
      return { error: 'Non authentifié' };
    }

    const alerts = await this.notificationsService.getUserAlerts(
      client.userId,
      data.status as any,
    );

    return { alerts };
  }
}



