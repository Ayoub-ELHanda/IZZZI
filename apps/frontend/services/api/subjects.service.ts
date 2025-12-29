import { apiClient } from '@/lib/api/client';

export interface CreateSubjectDto {
  name: string;
  teacherName: string;
  startDate: string;
  endDate: string;
  classId: string;
}

export interface Subject {
  id: string;
  name: string;
  teacherName: string;
  startDate: string;
  endDate: string;
  classId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  questionnaires: Questionnaire[];
}

export interface Questionnaire {
  id: string;
  type: 'DURING_COURSE' | 'AFTER_COURSE';
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

export const subjectsService = {
  async create(data: CreateSubjectDto): Promise<Subject> {
    return apiClient.post<Subject>('/subjects', data);
  },

  async getByClassId(classId: string): Promise<Subject[]> {
    return apiClient.get<Subject[]>(`/subjects/class/${classId}`);
  },

  async getById(id: string): Promise<Subject> {
    return apiClient.get<Subject>(`/subjects/${id}`);
  },

  async update(id: string, data: Partial<CreateSubjectDto>): Promise<Subject> {
    return apiClient.patch<Subject>(`/subjects/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/subjects/${id}`);
  },
};
