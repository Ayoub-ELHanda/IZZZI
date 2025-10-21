// Classes API service
import { apiClient } from '@/lib/api/client';
import { CreateClasseDto, Classe, ApiResponse } from '@/types/entities';
import { PaginatedResponse, PaginationParams } from '@/types/dto';

export class ClassesService {
  async getAll(params?: PaginationParams): Promise<PaginatedResponse<Classe>> {
    const queryParams = new URLSearchParams(params as any).toString();
    return apiClient.get<PaginatedResponse<Classe>>(`/classes?${queryParams}`);
  }

  async getById(id: string): Promise<Classe> {
    const response = await apiClient.get<{ data: Classe }>(`/classes/${id}`);
    return response.data;
  }

  async create(data: CreateClasseDto): Promise<Classe> {
    const response = await apiClient.post<{ data: Classe }>('/classes', data);
    return response.data;
  }

  async update(id: string, data: Partial<CreateClasseDto>): Promise<Classe> {
    const response = await apiClient.put<{ data: Classe }>(`/classes/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<ApiResponse> {
    return apiClient.delete<ApiResponse>(`/classes/${id}`);
  }
}

// Export singleton instance
export const classesService = new ClassesService();

