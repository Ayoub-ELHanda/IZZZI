import { apiClient } from '@/lib/api/client';

export interface RegisterAdminData {
  establishmentName: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface RegisterInvitedData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  inviteToken: string;
}

export interface InviteUserData {
  email: string;
  firstName: string;
  lastName: string;
  role: 'RESPONSABLE_PEDAGOGIQUE';
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

function setToken(token: string) {
  localStorage.setItem('auth_token', token);
  document.cookie = `auth_token=${token}; path=/; max-age=2592000; SameSite=Lax`;
}

function removeToken() {
  localStorage.removeItem('auth_token');
  document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

export const authService = {
  async registerAdmin(data: RegisterAdminData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register/admin', data);
    if (response.token) {
      setToken(response.token);
    }
    return response;
  },

  async registerInvited(data: RegisterInvitedData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register/invited', data);
    if (response.token) {
      setToken(response.token);
    }
    return response;
  },

  async inviteUser(data: InviteUserData): Promise<{ message: string; inviteToken?: string }> {
    const response = await apiClient.post<{ message: string; inviteToken?: string }>('/auth/invite', data);
    return response;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    if (response.token) {
      setToken(response.token);
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

  async getCurrentUser(): Promise<any> {
    return this.getProfile();
  },

  async updateProfile(data: {
    firstName: string;
    lastName: string;
    email: string;
    establishmentName?: string;
    profilePicture?: string;
  }): Promise<any> {
    const response = await apiClient.post<any>('/auth/profile', data);
    return response;
  },

  async changePassword(data: {
    oldPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/auth/change-password', data);
    return response;
  },

  async deleteAccount(): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>('/auth/account');
    removeToken();
    return response;
  },

  logout() {
    removeToken();
  },

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
