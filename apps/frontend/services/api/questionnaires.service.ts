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
  
  async create(subjectId: string, formType: FormType): Promise<CreateQuestionnairesResponse> {
    return apiClient.post<CreateQuestionnairesResponse>('/questionnaires', {
      subjectId,
      formType: mapFormType(formType),
    });
  },

  async update(subjectId: string, formType: FormType): Promise<Questionnaire[]> {
    return apiClient.patch<Questionnaire[]>(`/questionnaires/subject/${subjectId}`, {
      formType: mapFormType(formType),
    });
  },

  async canModify(subjectId: string): Promise<CanModifyResponse> {
    return apiClient.get<CanModifyResponse>(`/questionnaires/subject/${subjectId}/can-modify`);
  },

  getQRCodeDownloadUrl(token: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    return `${baseUrl}/questionnaires/${token}/qrcode`;
  },

  async downloadQRCode(token: string): Promise<void> {
    const url = this.getQRCodeDownloadUrl(token);

    const response = await fetch(url, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Erreur lors du téléchargement du QR code');
    }

    const blob = await response.blob();

    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `questionnaire-${token}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(blobUrl);
  },

  getPublicQuestionnaireUrl(token: string): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}/questionnaire/${token}`;
  },

  async getByToken(token: string): Promise<Questionnaire> {
    return apiClient.get<Questionnaire>(`/questionnaires/public/${token}`);
  },

  async sendReminders(questionnaireId: string): Promise<{ success: boolean; message: string; emailsSent: number }> {
    return apiClient.post<{ success: boolean; message: string; emailsSent: number }>(
      `/questionnaires/${questionnaireId}/send-reminders`
    );
  },

  async getMyResponses(): Promise<SubjectWithResponses[]> {
    return apiClient.get<SubjectWithResponses[]>('/questionnaires/my-responses');
  },

  async getQuestionnaireDetails(questionnaireId: string): Promise<QuestionnaireDetails> {
    return apiClient.get<QuestionnaireDetails>(`/questionnaires/${questionnaireId}/details`);
  },
};

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
