'use client';

import React, { useState } from 'react';
import { X, MessageSquare, Mail, Save, Edit2 } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { Alert, notificationsService } from '../../services/notifications/notifications.service';
import { SendMessageModal } from './SendMessageModal';

interface AlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AlertsModal({ isOpen, onClose }: AlertsModalProps) {
  const [activeTab, setActiveTab] = useState<'untreated' | 'treated'>('untreated');
  const [editingCommentFor, setEditingCommentFor] = useState<string | null>(null);
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});
  const [isSavingComment, setIsSavingComment] = useState<Record<string, boolean>>({});
  const [sendMessageModalOpen, setSendMessageModalOpen] = useState(false);
  const [selectedAlertForMessage, setSelectedAlertForMessage] = useState<Alert | null>(null);
  const {
    alerts,
    untreatedAlertCount,
    markAlertAsTreated,
    updateAlertComment,
    getAlertsByStatus,
  } = useNotifications();

  if (!isOpen) return null;

  const untreatedAlerts = getAlertsByStatus('UNTREATED');
  const treatedAlerts = getAlertsByStatus('TREATED');
  const displayedAlerts = activeTab === 'untreated' ? untreatedAlerts : treatedAlerts;

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

  const getAlertIcon = (type: string) => {
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

  const getAlertColor = (type: string) => {
    return type === 'ALERT_POSITIVE' ? '#4CAF50' : '#FF6B35';
  };

  const handleMarkAsTreated = async (alertId: string) => {
    await markAlertAsTreated(alertId);
  };

  const handleStartCommenting = (alertId: string, currentComment?: string) => {
    setEditingCommentFor(alertId);
    setCommentTexts((prev) => ({
      ...prev,
      [alertId]: currentComment || '',
    }));
  };

  const handleCancelCommenting = (alertId: string) => {
    setEditingCommentFor(null);
    setCommentTexts((prev) => {
      const newTexts = { ...prev };
      delete newTexts[alertId];
      return newTexts;
    });
  };

  const handleSaveComment = async (alertId: string) => {
    const comment = commentTexts[alertId] || '';
    setIsSavingComment((prev) => ({ ...prev, [alertId]: true }));
    try {
      await updateAlertComment(alertId, comment);
      setEditingCommentFor(null);
      setCommentTexts((prev) => {
        const newTexts = { ...prev };
        delete newTexts[alertId];
        return newTexts;
      });
    } catch (error) {
    } finally {
      setIsSavingComment((prev) => ({ ...prev, [alertId]: false }));
    }
  };

  const handleOpenSendMessage = (alert: Alert) => {
    setSelectedAlertForMessage(alert);
    setSendMessageModalOpen(true);
  };

  const handleSendMessage = async (message: string) => {
    if (!selectedAlertForMessage) {
      throw new Error('Aucune alerte sélectionnée');
    }
    await notificationsService.sendMessageToStudents(selectedAlertForMessage.id, message);
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
          maxWidth: '800px',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: '24px',
            borderBottom: '1px solid #E5E5E5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '24px',
                fontWeight: 700,
                color: '#2F2E2C',
                margin: 0,
                marginBottom: '8px',
              }}
            >
              Alertes
            </h2>
            <div
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
                color: '#666666',
              }}
            >
              {untreatedAlerts.length} alerte{untreatedAlerts.length > 1 ? 's' : ''} disponible{untreatedAlerts.length > 1 ? 's' : ''}
            </div>
          </div>
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
        <div
          style={{
            padding: '0 24px',
            borderBottom: '1px solid #E5E5E5',
            display: 'flex',
            gap: '24px',
          }}
        >
          <button
            onClick={() => setActiveTab('untreated')}
            style={{
              background: 'none',
              border: 'none',
              padding: '16px 0',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              color: activeTab === 'untreated' ? '#2F2E2C' : '#999999',
              cursor: 'pointer',
              borderBottom:
                activeTab === 'untreated' ? '2px solid #2F2E2C' : '2px solid transparent',
              transition: 'all 0.2s',
            }}
          >
            Non traitées {untreatedAlertCount > 0 && `(${untreatedAlertCount})`}
          </button>
          <button
            onClick={() => setActiveTab('treated')}
            style={{
              background: 'none',
              border: 'none',
              padding: '16px 0',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              color: activeTab === 'treated' ? '#2F2E2C' : '#999999',
              cursor: 'pointer',
              borderBottom:
                activeTab === 'treated' ? '2px solid #2F2E2C' : '2px solid transparent',
              transition: 'all 0.2s',
            }}
          >
            Traitées
          </button>
        </div>
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
          }}
        >
          {displayedAlerts.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#999999',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
              }}
            >
              {activeTab === 'untreated'
                ? 'Aucune alerte non traitée'
                : 'Aucune alerte traitée'}
            </div>
          ) : (
            displayedAlerts.map((alert, index) => {
              const color = getAlertColor(alert.type);
              const courseName = alert.questionnaire?.subject.name || 'Cours';
              const teacherName = alert.questionnaire?.subject.teacherName || '';
              const className = alert.questionnaire?.subject.class.name || '';

              return (
                <div
                  key={alert.id}
                  style={{
                    padding: '20px',
                    marginBottom: '16px',
                    backgroundColor: '#FFFFFF',
                    border: `1px solid ${color}`,
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ flexShrink: 0 }}>{getAlertIcon(alert.type)}</div>
                      <div>
                        <div
                          style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '14px',
                            fontWeight: 700,
                            color: '#2F2E2C',
                          }}
                        >
                          Alerte {index + 1}/{displayedAlerts.length}
                        </div>
                        {alert.status === 'UNTREATED' && (
                          <button
                            style={{
                              marginTop: '4px',
                              padding: '4px 12px',
                              backgroundColor: color,
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '4px',
                              fontFamily: 'Poppins, sans-serif',
                              fontSize: '12px',
                              fontWeight: 500,
                              cursor: 'pointer',
                            }}
                          >
                            à traiter
                          </button>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '12px',
                          color: '#666666',
                        }}
                      >
                        Marquée comme traitée
                      </span>
                      <div
                        onClick={() => {
                          if (alert.status === 'UNTREATED') {
                            handleMarkAsTreated(alert.id);
                          }
                        }}
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          border: '2px solid #E5E5E5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: alert.status === 'UNTREATED' ? 'pointer' : 'default',
                          backgroundColor: alert.status === 'TREATED' ? '#4CAF50' : '#FFFFFF',
                          transition: 'all 0.2s',
                        }}
                      >
                        {alert.status === 'TREATED' && (
                          <div
                            style={{
                              width: '12px',
                              height: '12px',
                              borderRadius: '50%',
                              backgroundColor: '#FFFFFF',
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '13px',
                      color: '#2F2E2C',
                      lineHeight: '1.6',
                      paddingLeft: '30px',
                    }}
                  >
                    {alert.message}
                  </div>
                  <div
                    style={{
                      paddingLeft: '30px',
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '12px',
                      color: '#666666',
                    }}
                  >
                    {courseName} • {className} • {teacherName}
                  </div>
                  <div
                    style={{
                      paddingLeft: '30px',
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '11px',
                      color: '#999999',
                    }}
                  >
                    {formatDate(alert.createdAt)}
                  </div>
                  {(alert.comment || editingCommentFor === alert.id) && (
                    <div
                      style={{
                        paddingLeft: '30px',
                        marginTop: '12px',
                        padding: '12px',
                        backgroundColor: '#F5F5F5',
                        borderRadius: '8px',
                        border: '1px solid #E5E5E5',
                      }}
                    >
                      <div
                        style={{
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#2F2E2C',
                          marginBottom: '8px',
                        }}
                      >
                        Commentaire :
                      </div>
                      {editingCommentFor === alert.id ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <textarea
                            value={commentTexts[alert.id] || ''}
                            onChange={(e) =>
                              setCommentTexts((prev) => ({
                                ...prev,
                                [alert.id]: e.target.value,
                              }))
                            }
                            placeholder="Ajoutez un commentaire..."
                            style={{
                              width: '100%',
                              minHeight: '80px',
                              padding: '10px',
                              fontFamily: 'Poppins, sans-serif',
                              fontSize: '13px',
                              color: '#2F2E2C',
                              border: '1px solid #E5E5E5',
                              borderRadius: '6px',
                              resize: 'vertical',
                            }}
                          />
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => handleCancelCommenting(alert.id)}
                              disabled={isSavingComment[alert.id]}
                              style={{
                                padding: '6px 16px',
                                backgroundColor: '#FFFFFF',
                                color: '#666666',
                                border: '1px solid #E5E5E5',
                                borderRadius: '6px',
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '12px',
                                fontWeight: 500,
                                cursor: isSavingComment[alert.id] ? 'not-allowed' : 'pointer',
                                opacity: isSavingComment[alert.id] ? 0.5 : 1,
                              }}
                            >
                              Annuler
                            </button>
                            <button
                              onClick={() => handleSaveComment(alert.id)}
                              disabled={isSavingComment[alert.id]}
                              style={{
                                padding: '6px 16px',
                                backgroundColor: '#4CAF50',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '6px',
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '12px',
                                fontWeight: 500,
                                cursor: isSavingComment[alert.id] ? 'not-allowed' : 'pointer',
                                opacity: isSavingComment[alert.id] ? 0.5 : 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                              }}
                            >
                              <Save size={14} />
                              {isSavingComment[alert.id] ? 'Enregistrement...' : 'Enregistrer'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <p
                            style={{
                              fontFamily: 'Poppins, sans-serif',
                              fontSize: '13px',
                              color: '#2F2E2C',
                              margin: 0,
                              flex: 1,
                              lineHeight: '1.5',
                            }}
                          >
                            {alert.comment}
                          </p>
                          <button
                            onClick={() => handleStartCommenting(alert.id, alert.comment)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '4px',
                              marginLeft: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              color: '#666666',
                            }}
                            title="Modifier le commentaire"
                          >
                            <Edit2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  <div
                    style={{
                      display: 'flex',
                      gap: '12px',
                      paddingLeft: '30px',
                      marginTop: '8px',
                    }}
                  >
                    {!alert.comment && editingCommentFor !== alert.id && (
                      <button
                        onClick={() => handleStartCommenting(alert.id)}
                        style={{
                          padding: '10px 20px',
                          backgroundColor: '#FFD93D',
                          color: '#2F2E2C',
                          border: 'none',
                          borderRadius: '8px',
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '13px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <MessageSquare size={16} />
                        Commenter
                      </button>
                    )}
                    <button
                      onClick={() => handleOpenSendMessage(alert)}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#FFFFFF',
                        color: '#2F2E2C',
                        border: '1px solid #E5E5E5',
                        borderRadius: '8px',
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '13px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <Mail size={16} />
                      Envoyer un message aux étudiants
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      {selectedAlertForMessage && (
        <SendMessageModal
          isOpen={sendMessageModalOpen}
          onClose={() => {
            setSendMessageModalOpen(false);
            setSelectedAlertForMessage(null);
          }}
          onSubmit={handleSendMessage}
          subjectName={selectedAlertForMessage.questionnaire.subject.name}
          className={selectedAlertForMessage.questionnaire.subject.class.name}
          studentCount={selectedAlertForMessage.questionnaire.subject.class.studentEmails?.length || 0}
        />
      )}
    </div>
  );
}
