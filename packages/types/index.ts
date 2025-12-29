
export enum UserRole {
  VISITEUR = 'VISITEUR',
  RESPONSABLE_PEDAGOGIQUE = 'RESPONSABLE_PEDAGOGIQUE',
  ADMIN = 'ADMIN',
}

// Common types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  espaceId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Espace {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Classe {
  id: string;
  name: string;
  espaceId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Matiere {
  id: string;
  name: string;
  classeId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Questionnaire {
  id: string;
  type: 'pendant_cours' | 'apres_cours';
  matiereId: string;
  publicLink: string;
  qrCode?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Avis {
  id: string;
  questionnaireId: string;
  content: string;
  sentiment?: 'positif' | 'neutre' | 'negatif';
  studentPseudo?: string;
  createdAt: Date;
}

// DTOs for API requests/responses
export interface CreateClasseDto {
  name: string;
}

export interface CreateMatiereDto {
  name: string;
  classeId: string;
}

export interface CreateAvisDto {
  questionnaireId: string;
  content: string;
  studentPseudo?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
