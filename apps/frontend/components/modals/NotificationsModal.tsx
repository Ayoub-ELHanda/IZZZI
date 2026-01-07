'use client';

import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { Notification } from '../../services/notifications/notifications.service';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsModal({ isOpen, onClose }: NotificationsModalProps) {
  const [activeTab, setActiveTab] = useState<'unread' | 'read'>('unread');
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    getNotificationsByReadStatus,
  } = useNotifications();

  if (!isOpen) return null;

  const unreadNotifications = getNotificationsByReadStatus(false);
  const readNotifications = getNotificationsByReadStatus(true);
  const displayedNotifications =
    activeTab === 'unread' ? unreadNotifications : readNotifications;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'Il y a moins d\'une heure';
    } else if (diffInHours < 24) {
      return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
    }
  };

  const getNotificationIcon = (type: string) => {
    if (type === 'ALERT_POSITIVE') {
      return <span style={{ fontSize: '18px' }}>❤️</span>;
    } else {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF6B35">
          <path d="M12 2L22 20H2L12 2Z" />
        </svg>
      );
    }
  };

  const getNotificationColor = (type: string) => {
    return type === 'ALERT_POSITIVE' ? '#4CAF50' : '#FF6B35';
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          width: '90%',
          maxWidth: '600px',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '24px',
            borderBottom: '1px solid #E5E5E5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h2
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '24px',
              fontWeight: 700,
              color: '#2F2E2C',
              margin: 0,
            }}
          >
            Notifications
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={24} color="#2F2E2C" />
          </button>
        </div>

        {/* Tabs */}
        <div
          style={{
            padding: '0 24px',
            borderBottom: '1px solid #E5E5E5',
            display: 'flex',
            gap: '24px',
          }}
        >
          <button
            onClick={() => setActiveTab('unread')}
            style={{
              background: 'none',
              border: 'none',
              padding: '16px 0',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              color: activeTab === 'unread' ? '#2F2E2C' : '#999999',
              cursor: 'pointer',
              borderBottom:
                activeTab === 'unread' ? '2px solid #2F2E2C' : '2px solid transparent',
              transition: 'all 0.2s',
            }}
          >
            Non lues {unreadCount > 0 && `(${unreadCount})`}
          </button>
          <button
            onClick={() => setActiveTab('read')}
            style={{
              background: 'none',
              border: 'none',
              padding: '16px 0',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              color: activeTab === 'read' ? '#2F2E2C' : '#999999',
              cursor: 'pointer',
              borderBottom:
                activeTab === 'read' ? '2px solid #2F2E2C' : '2px solid transparent',
              transition: 'all 0.2s',
            }}
          >
            Lues
          </button>
        </div>

        {/* Mark all as read button */}
        {activeTab === 'unread' && unreadNotifications.length > 0 && (
          <div
            style={{
              padding: '16px 24px',
              borderBottom: '1px solid #E5E5E5',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <button
              onClick={handleMarkAllAsRead}
              style={{
                background: 'none',
                border: 'none',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
                color: '#2F2E2C',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: 0,
              }}
            >
              <Check size={16} color="#2F2E2C" />
              Marquer comme lues
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 24px',
          }}
        >
          {displayedNotifications.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#999999',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
              }}
            >
              {activeTab === 'unread'
                ? 'Aucune notification non lue'
                : 'Aucune notification lue'}
            </div>
          ) : (
            displayedNotifications.map((notification) => {
              const color = getNotificationColor(notification.type);
              const courseName = notification.questionnaire?.subject.name || 'Cours';
              const teacherName = notification.questionnaire?.subject.teacherName || '';

              return (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  style={{
                    padding: '16px',
                    marginBottom: '12px',
                    backgroundColor: notification.isRead ? '#F9F9F9' : '#FFFFFF',
                    border: `1px solid ${color}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    transition: 'background-color 0.2s',
                  }}
                >
                  <div style={{ flexShrink: 0, marginTop: '2px' }}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#2F2E2C',
                        marginBottom: '4px',
                      }}
                    >
                      {notification.type === 'ALERT_POSITIVE'
                        ? `Alerte positive détectée sur le cours ${courseName} de ${teacherName}`
                        : `Alerte négative détectée sur le cours ${courseName} de ${teacherName}`}
                    </div>
                    <div
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '12px',
                        color: '#666666',
                        marginBottom: '8px',
                      }}
                    >
                      {notification.message}
                    </div>
                    <div
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '11px',
                        color: '#999999',
                      }}
                    >
                      {formatDate(notification.createdAt)}
                    </div>
                  </div>
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: '2px solid #E5E5E5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {notification.isRead && (
                      <div
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          backgroundColor: '#4CAF50',
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}



