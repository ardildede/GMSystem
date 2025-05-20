import type { Student } from './studentService';

export type PetitionStudent = Pick<Student, 'id' | 'name' | 'department'>;

export interface PetitionData {
  type: string;
  studentId: string;
  content: string;
}

export interface PetitionResult {
  id: string;
  type: string;
  studentId: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

// API function to get students for petition
export const getStudentsForPetition = async (): Promise<PetitionStudent[]> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // In a real app, this would fetch from the API
  // Here we're using the studentService
  const { getStudents } = await import('./studentService');
  const students = await getStudents();
  
  // Map to PetitionStudent type
  return students.map(student => ({
    id: student.id,
    name: student.name,
    department: student.department,
  }));
};

// API function to create a petition
export const createPetition = async (
  petitionData: PetitionData
): Promise<PetitionResult> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1200));

  // Validate petition data
  if (!petitionData.type || !petitionData.studentId || !petitionData.content) {
    throw new Error("Tüm dilekçe alanları doldurulmalıdır");
  }

  if (petitionData.content.trim().length < 50) {
    throw new Error("Dilekçe içeriği en az 50 karakter olmalıdır");
  }

  // Verify student exists
  const { getStudents } = await import('./studentService');
  const students = await getStudents();
  const student = students.find(s => s.id === petitionData.studentId);
  
  if (!student) {
    throw new Error("Öğrenci bulunamadı");
  }

  // Simulate successful response with created petition
  const now = new Date().toISOString();
  return {
    id: `petition-${Math.floor(Math.random() * 10000)}`,
    ...petitionData,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };
}; 