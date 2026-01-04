import { apiClient } from '@/lib/api/client';

export type FormType = 'basic' | 'technical' | 'soft-skills' | 'logiciel';

export interface CreateQuestionnairesDto {
  subjectId: string;
  formType: string;
}

export interface UpdateQuestionnairesDto {
  formType: string;
}

export interface Questionnaire {
  id: string;
  type: 'DURING_COURSE' | 'AFTER_COURSE';
  formType: string;
  subjectId: string;
  token: string;
  qrCodeUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    responses: number;
  };
}

export interface CreateQuestionnairesResponse {
  duringCourse: Questionnaire;
  afterCourse: Questionnaire;
}

export interface CanModifyResponse {
  canModify: boolean;
  reason: string | null;
}


const mapFormType = (formType: FormType): string => {
  const mapping: Record<FormType, string> = {
    'basic': 'BASIC',
    'technical': 'TECHNICAL',
    'soft-skills': 'SOFT_SKILLS',
    'logiciel': 'LOGICIEL',
  };
  return mapping[formType] || 'BASIC';
};

export const questionnairesService = {
  /**
   * Crée deux questionnaires pour une matière
   */
  async create(subjectId: string, formType: FormType): Promise<CreateQuestionnairesResponse> {
    return apiClient.post<CreateQuestionnairesResponse>('/questionnaires', {
      subjectId,
      formType: mapFormType(formType),
    });
  },

  /**
   * Met à jour le type de formulaire pour une matière
   */
  async update(subjectId: string, formType: FormType): Promise<Questionnaire[]> {
    return apiClient.patch<Questionnaire[]>(`/questionnaires/subject/${subjectId}`, {
      formType: mapFormType(formType),
    });
  },

  /**
   * Vérifie si les questionnaires peuvent être modifiés
   */
  async canModify(subjectId: string): Promise<CanModifyResponse> {
    return apiClient.get<CanModifyResponse>(`/questionnaires/subject/${subjectId}/can-modify`);
  },

  /**
   * Génère l'URL pour télécharger le QR code
   */
  getQRCodeDownloadUrl(token: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    return `${baseUrl}/questionnaires/${token}/qrcode`;
  },

  /**
   * Télécharge le QR code pour un questionnaire (endpoint public)
   */
  async downloadQRCode(token: string): Promise<void> {
    const url = this.getQRCodeDownloadUrl(token);
    
    // Télécharger le fichier directement (endpoint public)
    const response = await fetch(url, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Erreur lors du téléchargement du QR code');
    }

    // Convertir la réponse en blob
    const blob = await response.blob();
    
    // Créer un lien temporaire pour télécharger le fichier
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `questionnaire-${token}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Libérer l'URL blob
    window.URL.revokeObjectURL(blobUrl);
  },

  /**
   * Génère le lien public pour un questionnaire
   */
  getPublicQuestionnaireUrl(token: string): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}/questionnaire/${token}`;
  },

  /**
   * Récupère un questionnaire par son token (pour les étudiants)
   */
  async getByToken(token: string): Promise<Questionnaire> {
    return apiClient.get<Questionnaire>(`/questionnaires/public/${token}`);
  },

  /**
   * Envoie des emails de relance aux étudiants pour un questionnaire
   */
  async sendReminders(questionnaireId: string): Promise<{ success: boolean; message: string; emailsSent: number }> {
    return apiClient.post<{ success: boolean; message: string; emailsSent: number }>(
      `/questionnaires/${questionnaireId}/send-reminders`
    );
  },

  /**
   * Récupère tous les questionnaires avec leurs retours pour le dashboard
   */
  async getMyResponses(): Promise<SubjectWithResponses[]> {
    return apiClient.get<SubjectWithResponses[]>('/questionnaires/my-responses');
  },

  /**
   * Récupère les détails d'un questionnaire avec toutes ses statistiques
   */
  async getQuestionnaireDetails(questionnaireId: string): Promise<QuestionnaireDetails> {
    return apiClient.get<QuestionnaireDetails>(`/questionnaires/${questionnaireId}/details`);
  },
};

// Types pour les retours
export interface Response {
  id: string;
  rating: number;
  comment: string | null;
  isAnonymous: boolean;
  createdAt: string;
}

export interface QuestionnaireWithResponses {
  id: string;
  type: 'DURING_COURSE' | 'AFTER_COURSE';
  token: string;
  totalResponses: number;
  visibleResponses: number;
  hiddenResponses: number;
  averageRating: number;
  responses: Response[];
}

export interface SubjectWithResponses {
  id: string;
  name: string;
  teacherName: string;
  className: string;
  classId: string;
  startDate: string;
  endDate: string;
  questionnaires: QuestionnaireWithResponses[];
}

export interface RatingDistribution {
  rating: number;
  count: number;
}

export interface QuestionnaireDetails {
  id: string;
  type: 'DURING_COURSE' | 'AFTER_COURSE';
  token: string;
  subject: {
    id: string;
    name: string;
    teacherName: string;
    className: string;
    studentCount: number;
  };
  totalResponses: number;
  visibleResponses: number;
  hiddenResponses: number;
  averageRating: number;
  ratingDistribution: RatingDistribution[];
  responses: Response[];
  positiveComments: number;
  negativeComments: number;
  isPaidPlan: boolean;
}
