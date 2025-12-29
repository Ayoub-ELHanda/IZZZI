import { apiClient } from '@/lib/api/client';

export interface CreateClassDto {
  name: string;
  description?: string;
  studentCount: number;
  studentEmails: string[];
}

export interface Class {
  id: string;
  name: string;
  description: string | null;
  studentCount: number;
  studentEmails: string[];
  isArchived: boolean;
  archivedAt: Date | null;
  createdBy: string;
  establishmentId: string;
  createdAt: Date;
  updatedAt: Date;
}

export const classesService = {
  async getAll(archived?: boolean): Promise<Class[]> {
    const query = archived !== undefined ? `?archived=${archived}` : '';
    return apiClient.get<Class[]>(`/classes${query}`);
  },

  async getById(id: string): Promise<Class> {
    return apiClient.get<Class>(`/classes/${id}`);
  },

  async create(data: CreateClassDto): Promise<Class> {
    return apiClient.post<Class>('/classes', data);
  },

  async update(id: string, data: Partial<CreateClassDto>): Promise<Class> {
    return apiClient.patch<Class>(`/classes/${id}`, data);
  },

  async archive(id: string): Promise<Class> {
    return apiClient.post<Class>(`/classes/${id}/archive`, {});
  },
};
