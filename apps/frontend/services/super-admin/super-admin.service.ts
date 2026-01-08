import { apiClient } from '@/lib/api/client';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'VISITEUR' | 'RESPONSABLE_PEDAGOGIQUE' | 'ADMIN' | 'SUPER_ADMIN';
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  establishment?: {
    id: string;
    name: string;
  };
  subscriptionStatus?: string;
  trialEndDate?: string;
  _count: {
    classes: number;
    subjects: number;
    subscriptions: number;
  };
}

export interface UserDetails extends User {
  subscriptions?: Subscription[];
  classes?: any[];
  subjects?: any[];
  _count: {
    classes: number;
    subjects: number;
    subscriptions: number;
    payments: number;
  };
}

export interface Teacher extends Omit<User, '_count'> {
  _count: {
    classes: number;
    subjects: number;
  };
}

export interface Subscription {
  id: string;
  userId: string;
  stripeSubscriptionId: string;
  status: string;
  billingPeriod: string;
  classCount: number;
  pricePerClass: number;
  totalAmount: number;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  canceledAt?: string;
  createdAt: string;
  updatedAt: string;
  payments?: Payment[];
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    establishment?: {
      id: string;
      name: string;
    };
  };
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

export const superAdminService = {
  /**
   * Récupérer tous les utilisateurs avec filtrage optionnel par rôle
   */
  async getAllUsers(role?: string): Promise<User[]> {
    const response = await apiClient.get<User[]>('/super-admin/users', {
      params: role ? { role } : {},
    });
    return response;
  },

  /**
   * Récupérer un utilisateur par ID avec ses détails complets
   */
  async getUserById(userId: string): Promise<UserDetails> {
    const response = await apiClient.get<UserDetails>(`/super-admin/users/${userId}`);
    return response;
  },

  /**
   * Récupérer tous les professeurs pédagogiques associés à un Admin
   */
  async getTeachersByAdmin(adminId: string): Promise<Teacher[]> {
    const response = await apiClient.get<Teacher[]>(`/super-admin/admins/${adminId}/teachers`);
    return response;
  },

  /**
   * Récupérer tous les abonnements d'un Admin
   */
  async getAdminSubscriptions(adminId: string): Promise<Subscription[]> {
    const response = await apiClient.get<Subscription[]>(`/super-admin/admins/${adminId}/subscriptions`);
    return response;
  },

  /**
   * Annuler un abonnement
   */
  async cancelSubscription(subscriptionId: string): Promise<Subscription> {
    const response = await apiClient.put<Subscription>(`/super-admin/subscriptions/${subscriptionId}/cancel`);
    return response;
  },

  /**
   * Renouveler un abonnement
   */
  async renewSubscription(subscriptionId: string): Promise<Subscription> {
    const response = await apiClient.put<Subscription>(`/super-admin/subscriptions/${subscriptionId}/renew`);
    return response;
  },

  /**
   * Récupérer tous les abonnements actifs avec les informations utilisateur
   */
  async getAllActiveSubscriptions(): Promise<Subscription[]> {
    const response = await apiClient.get<Subscription[]>('/super-admin/subscriptions/active');
    return response;
  },

  /**
   * Réassigner un RESPONSABLE_PEDAGOGIQUE à un autre ADMIN
   */
  async reassignTeacherToAdmin(teacherId: string, newAdminId: string): Promise<User> {
    const response = await apiClient.put<User>(`/super-admin/teachers/${teacherId}/reassign`, {
      newAdminId,
    });
    return response;
  },

  /**
   * Récupérer tous les ADMIN pour la sélection
   */
  async getAllAdmins(): Promise<User[]> {
    const response = await apiClient.get<User[]>('/super-admin/admins');
    return response;
  },
};

