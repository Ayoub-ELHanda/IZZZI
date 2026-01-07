import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { notificationsService, Notification, Alert } from '../services/notifications/notifications.service';
import { authService } from '../services/auth/auth.service';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';
const WS_URL = API_BASE_URL.replace('/api', '');

export function useNotifications() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [untreatedAlertCount, setUntreatedAlertCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // S'assurer que le hook ne s'exécute que côté client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Initialiser la connexion WebSocket
  useEffect(() => {
    // Ne pas s'exécuter côté serveur
    if (typeof window === 'undefined' || !isMounted) {
      return;
    }

    const token = authService.getToken();
    if (!token) {
      return;
    }

    const newSocket = io(`${WS_URL}/notifications`, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('✅ Connecté au serveur WebSocket');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Déconnecté du serveur WebSocket');
      setIsConnected(false);
    });

    newSocket.on('new_notification', (notification: Notification) => {
      console.log('📬 Nouvelle notification reçue:', notification);
      setNotifications((prev) => {
        // Vérifier si la notification existe déjà (éviter les doublons)
        const exists = prev.some((n) => n.id === notification.id);
        if (exists) {
          return prev; // Ne pas ajouter de doublon
        }
        return [notification, ...prev];
      });
      // Incrémenter seulement si la notification n'est pas lue
      if (!notification.isRead) {
        setUnreadCount((prev) => prev + 1);
      }
    });

    newSocket.on('new_alert', (alert: Alert) => {
      console.log('🚨 Nouvelle alerte reçue:', alert);
      setAlerts((prev) => {
        // Vérifier si l'alerte existe déjà (mise à jour)
        const existingIndex = prev.findIndex((a) => a.id === alert.id);
        if (existingIndex !== -1) {
          // Mettre à jour l'alerte existante et la déplacer en haut de la liste
          const existingAlert = prev[existingIndex];
          const wasUntreated = existingAlert.status === 'UNTREATED';
          const isNowUntreated = alert.status === 'UNTREATED';
          
          const updated = [...prev];
          updated.splice(existingIndex, 1); // Retirer l'ancienne
          const newAlerts = [alert, ...updated]; // Ajouter la mise à jour en haut
          
          // Mettre à jour le compteur seulement si le statut change
          if (wasUntreated && !isNowUntreated) {
            // L'alerte était non traitée et est maintenant traitée
            setUntreatedAlertCount((prev) => Math.max(0, prev - 1));
          } else if (!wasUntreated && isNowUntreated) {
            // L'alerte était traitée et est maintenant non traitée (peu probable mais possible)
            setUntreatedAlertCount((prev) => prev + 1);
          }
          // Si le statut reste UNTREATED, ne pas changer le compteur (c'est une mise à jour)
          
          return newAlerts;
        }
        // Nouvelle alerte : ajouter en haut de la liste
        if (alert.status === 'UNTREATED') {
          setUntreatedAlertCount((prev) => prev + 1);
        }
        return [alert, ...prev];
      });
    });

    newSocket.on('unread_count', (count: number) => {
      setUnreadCount(count);
    });

    newSocket.on('untreated_alert_count', (count: number) => {
      setUntreatedAlertCount(count);
    });

    setSocket(newSocket);

    // Charger les notifications et alertes initiales
    loadNotifications();
    loadAlerts();
    loadCounts();

    return () => {
      newSocket.close();
    };
  }, [isMounted]);

  const loadNotifications = useCallback(async () => {
    try {
      const data = await notificationsService.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    }
  }, []);

  const loadAlerts = useCallback(async () => {
    try {
      const data = await notificationsService.getAlerts();
      setAlerts(data);
    } catch (error) {
      console.error('Erreur lors du chargement des alertes:', error);
    }
  }, []);

  const loadCounts = useCallback(async () => {
    try {
      const [unread, untreated] = await Promise.all([
        notificationsService.getUnreadCount(),
        notificationsService.getUntreatedAlertCount(),
      ]);
      setUnreadCount(unread);
      setUntreatedAlertCount(untreated);
    } catch (error) {
      console.error('Erreur lors du chargement des compteurs:', error);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await notificationsService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationsService.markAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true, readAt: new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Erreur lors du marquage de toutes comme lues:', error);
    }
  }, []);

  const markAlertAsTreated = useCallback(async (alertId: string) => {
    try {
      await notificationsService.markAlertAsTreated(alertId);
      setAlerts((prev) =>
        prev.map((a) =>
          a.id === alertId
            ? { ...a, status: 'TREATED' as const, treatedAt: new Date().toISOString() }
            : a
        )
      );
      setUntreatedAlertCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erreur lors du marquage comme traitée:', error);
    }
  }, []);

  const updateAlertComment = useCallback(async (alertId: string, comment: string) => {
    try {
      await notificationsService.updateAlertComment(alertId, comment);
      setAlerts((prev) =>
        prev.map((a) =>
          a.id === alertId ? { ...a, comment } : a
        )
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour du commentaire:', error);
      throw error;
    }
  }, []);

  const getNotificationsByReadStatus = useCallback(
    (isRead: boolean) => {
      return notifications.filter((n) => n.isRead === isRead);
    },
    [notifications]
  );

  const getAlertsByStatus = useCallback(
    (status: 'UNTREATED' | 'TREATED') => {
      return alerts
        .filter((a) => a.status === status)
        .sort((a, b) => {
          // Trier par updatedAt ou createdAt (le plus récent en premier)
          const dateA = new Date((a as any).updatedAt || a.createdAt).getTime();
          const dateB = new Date((b as any).updatedAt || b.createdAt).getTime();
          return dateB - dateA;
        });
    },
    [alerts]
  );

  return {
    socket,
    notifications,
    alerts,
    unreadCount: isMounted ? unreadCount : 0, // Retourner 0 côté serveur pour éviter l'hydratation
    untreatedAlertCount: isMounted ? untreatedAlertCount : 0, // Retourner 0 côté serveur
    isConnected,
    markAsRead,
    markAllAsRead,
    markAlertAsTreated,
    updateAlertComment,
    getNotificationsByReadStatus,
    getAlertsByStatus,
    refreshNotifications: loadNotifications,
    refreshAlerts: loadAlerts,
  };
}

