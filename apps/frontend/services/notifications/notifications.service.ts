import { apiClient } from '@/lib/api/client';

export interface Notification {
  id: string;
  type: 'ALERT_POSITIVE' | 'ALERT_NEGATIVE';
  title: string;
  message: string;
  questionnaireId?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  questionnaire?: {
    id: string;
    subject: {
      name: string;
      teacherName: string;
      class: {
        name: string;
      };
    };
  };
}

export interface Alert {
  id: string;
  questionnaireId: string;
  type: 'ALERT_POSITIVE' | 'ALERT_NEGATIVE';
  message: string;
  status: 'UNTREATED' | 'TREATED';
  comment?: string;
  treatedAt?: string;
  treatedBy?: string;
  createdAt: string;
  updatedAt?: string;
  questionnaire: {
    id: string;
    subject: {
      name: string;
      teacherName: string;
      class: {
        name: string;
        studentEmails?: string[];
      };
    };
  };
}

export const notificationsService = {
  async getNotifications(isRead?: boolean): Promise<Notification[]> {
    const response = await apiClient.get<Notification[]>('/notifications', {
      params: isRead !== undefined ? { isRead } : {},
    });
    return response;
  },

  async getUnreadCount(): Promise<number> {
    const response = await apiClient.get<{ count: number }>(
      '/notifications/unread-count',
    );
    return response.count;
  },

  async markAsRead(notificationId: string): Promise<void> {
    await apiClient.put(`/notifications/${notificationId}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await apiClient.put('/notifications/mark-all-read');
  },

  async getAlerts(status?: 'UNTREATED' | 'TREATED'): Promise<Alert[]> {
    const response = await apiClient.get<Alert[]>('/notifications/alerts', {
      params: status ? { status } : {},
    });
    return response;
  },

  async getUntreatedAlertCount(): Promise<number> {
    const response = await apiClient.get<{ count: number }>(
      '/notifications/alerts/untreated-count',
    );
    return response.count;
  },

  async markAlertAsTreated(alertId: string): Promise<void> {
    await apiClient.put(`/notifications/alerts/${alertId}/treat`);
  },

  async updateAlertComment(alertId: string, comment: string): Promise<void> {
    await apiClient.put(`/notifications/alerts/${alertId}/comment`, {
      comment,
    });
  },

  async sendMessageToStudents(alertId: string, message: string): Promise<{ success: boolean; message: string; emailsSent: number }> {
    const response = await apiClient.post<{ success: boolean; message: string; emailsSent: number }>(
      `/notifications/alerts/${alertId}/send-message`,
      { message },
    );
    return response;
  },
};
