
export * from '@izzzi/types';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
  espaceId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClasseWithDetails {
  id: string;
  name: string;
  espaceId: string;
  studentCount: number;
  subjectCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MatiereWithStats {
  id: string;
  name: string;
  classeId: string;
  averageScore?: number;
  feedbackCount: number;
  lastFeedbackAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
