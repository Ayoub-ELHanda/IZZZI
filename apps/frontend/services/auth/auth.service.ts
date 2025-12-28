import { apiClient } from '@/lib/api/client';

export interface RegisterAdminData {
  establishmentName: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface RegisterGuestData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  inviteToken: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: any;
  establishment?: any;
  token: string;
}

export const authService = {
  async registerAdmin(data: RegisterAdminData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register/admin', data);
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    return response;
  },

  async registerGuest(data: RegisterGuestData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register/guest', data);
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    return response;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    return response;
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/auth/forgot-password', { email });
    return response;
  },

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/auth/reset-password', { token, password });
    return response;
  },

  async getProfile(): Promise<any> {
    const response = await apiClient.get<any>('/auth/me');
    return response;
  },

  logout() {
    localStorage.removeItem('auth_token');
  },

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
