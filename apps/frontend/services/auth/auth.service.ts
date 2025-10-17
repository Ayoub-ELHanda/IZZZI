// Authentication service
import { apiClient } from '@/lib/api/client';
import { LoginDto, RegisterDto, ApiResponse } from '@/types/dto';
import { User } from '@/types/entities';

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface AuthResponse extends ApiResponse {
  data: {
    user: User;
    tokens: AuthTokens;
  };
}

export class AuthService {
  async login(credentials: LoginDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    
    // Store tokens
    if (response.data?.tokens) {
      this.setTokens(response.data.tokens);
    }
    
    return response;
  }

  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    
    // Store tokens
    if (response.data?.tokens) {
      this.setTokens(response.data.tokens);
    }
    
    return response;
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      this.clearTokens();
    }
  }

  async refreshToken(): Promise<AuthTokens> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<{ data: AuthTokens }>('/auth/refresh', {
      refresh_token: refreshToken,
    });

    this.setTokens(response.data);
    return response.data;
  }

  async forgotPassword(email: string): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>('/auth/forgot-password', { email });
  }

  async resetPassword(token: string, password: string): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>('/auth/reset-password', { token, password });
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<{ data: User }>('/auth/me');
    return response.data;
  }

  // Token management
  private setTokens(tokens: AuthTokens): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', tokens.access_token);
      localStorage.setItem('refresh_token', tokens.refresh_token);
    }
  }

  private clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  private getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refresh_token');
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

// Export singleton instance
export const authService = new AuthService();

