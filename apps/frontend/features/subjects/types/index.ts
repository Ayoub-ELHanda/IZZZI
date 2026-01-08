
export interface SubjectFormData {
  name: string;
  teacherName: string;
  teacherEmail?: string;
  startDate: string;
  endDate: string;
}

export interface CreateSubjectDTO {
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
  createdAt: string;
  updatedAt: string;
}
