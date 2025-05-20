import type { Student } from './studentService';

// Types for transcript data
export interface Course {
  id: string;
  name: string;
  credits: number;
  grade: string;
  semester: string;
}

export interface StudentInfo {
  name: string;
  id: string;
  department: string;
}

export interface TranscriptData {
  studentInfo: StudentInfo;
  courses: Course[];
  gpa: string;
}

// Mock list of advisor's students (we're reusing the Student interface from studentService)
export const getAdvisorStudents = async (): Promise<Student[]> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Here we'd normally fetch data from the server, but for mock data
  // we're importing the same function from studentService
  const { getStudents } = await import('./studentService');
  return getStudents();
};

// Mock course data for a specific student
const mockCoursesMap: Record<string, Course[]> = {
  "20190101023": [
    {
      id: "CENG311",
      name: "Algorithms",
      credits: 4,
      grade: "AA",
      semester: "Fall 2021-2022",
    },
    {
      id: "CENG371",
      name: "Database Management",
      credits: 4,
      grade: "BA",
      semester: "Spring 2021-2022",
    },
    {
      id: "MATH101",
      name: "Calculus I",
      credits: 4,
      grade: "BB",
      semester: "Fall 2020-2021",
    },
    {
      id: "PHYS101",
      name: "Physics I",
      credits: 4,
      grade: "CB",
      semester: "Fall 2020-2021",
    },
    {
      id: "MATH102",
      name: "Calculus II",
      credits: 4,
      grade: "BA",
      semester: "Spring 2020-2021",
    },
    {
      id: "PHYS102",
      name: "Physics II",
      credits: 4,
      grade: "CB",
      semester: "Spring 2020-2021",
    },
    {
      id: "CENG211",
      name: "Data Structures",
      credits: 4,
      grade: "AA",
      semester: "Fall 2021-2022",
    },
    {
      id: "ENG101",
      name: "English I",
      credits: 3,
      grade: "BB",
      semester: "Fall 2020-2021",
    },
  ],
  "20190102034": [
    {
      id: "CENG311",
      name: "Algorithms",
      credits: 4,
      grade: "CB",
      semester: "Fall 2021-2022",
    },
    {
      id: "CENG371",
      name: "Database Management",
      credits: 4,
      grade: "CC",
      semester: "Spring 2021-2022",
    },
    {
      id: "MATH101",
      name: "Calculus I",
      credits: 4,
      grade: "CC",
      semester: "Fall 2020-2021",
    },
    {
      id: "PHYS101",
      name: "Physics I",
      credits: 4,
      grade: "DC",
      semester: "Fall 2020-2021",
    },
    {
      id: "MATH102",
      name: "Calculus II",
      credits: 4,
      grade: "DC",
      semester: "Spring 2020-2021",
    },
    {
      id: "PHYS102",
      name: "Physics II",
      credits: 4,
      grade: "DD",
      semester: "Spring 2020-2021",
    },
    {
      id: "CENG211",
      name: "Data Structures",
      credits: 4,
      grade: "BB",
      semester: "Fall 2021-2022",
    },
    {
      id: "ENG101",
      name: "English I",
      credits: 3,
      grade: "BB",
      semester: "Fall 2020-2021",
    },
  ],
};

// Function to calculate GPA
const calculateGPA = (courses: Course[]): string => {
  const gradePoints: Record<string, number> = {
    AA: 4.0,
    BA: 3.5,
    BB: 3.0,
    CB: 2.5,
    CC: 2.0,
    DC: 1.5,
    DD: 1.0,
    FF: 0.0,
  };

  let totalPoints = 0;
  let totalCredits = 0;

  courses.forEach((course) => {
    totalPoints += gradePoints[course.grade] * course.credits;
    totalCredits += course.credits;
  });

  return (totalPoints / totalCredits).toFixed(2);
};

// API function to get transcript data for a specific student
export const getStudentTranscript = async (studentId: string): Promise<TranscriptData> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Get student details
  const { getStudents } = await import('./studentService');
  const students = await getStudents();
  const student = students.find(s => s.id === studentId);
  
  if (!student) {
    throw new Error("Öğrenci bulunamadı");
  }

  // Find the student's courses or use default courses
  const courses = mockCoursesMap[studentId] || mockCoursesMap["20190101023"];

  // Calculate GPA
  const gpa = calculateGPA(courses);

  return {
    studentInfo: {
      name: student.name,
      id: student.id,
      department: student.department,
    },
    courses,
    gpa,
  };
}; 