
export interface ClassFormData {
  className: string;
  studentCount: string;
  studentEmails: string;
  description: string;
}

export interface CreateClassDTO {
  name: string;
  studentCount: number;
  studentEmails: string[];
  description?: string;
}

export interface Class {
  id: string;
  name: string;
  studentCount: number;
  studentEmails: string[];
  description?: string;
  createdAt: string;
  updatedAt: string;
}
