// Types for student data
export interface Student {
  id: string;
  name: string;
  department: string;
  gpa: string;
  status: 'Normal Öğrenim' | 'Şartlı Geçme' | 'Mezuniyet Aşaması';
  email?: string;
  phone?: string;
  lastMeeting?: string;
}

// Mock student data
const mockStudents: Student[] = [
  {
    id: "20190101023",
    name: "Ahmet Yılmaz",
    department: "Bilgisayar Mühendisliği",
    gpa: "3.42",
    status: "Normal Öğrenim",
    email: "ahmet.yilmaz@example.com",
    phone: "+90 555 123 4567",
    lastMeeting: "15.05.2023",
  },
  {
    id: "20190102034",
    name: "Ayşe Kaya",
    department: "Bilgisayar Mühendisliği",
    gpa: "2.85",
    status: "Şartlı Geçme",
    email: "ayse.kaya@example.com",
    phone: "+90 555 234 5678",
    lastMeeting: "10.06.2023",
  },
  {
    id: "20180103045",
    name: "Mehmet Demir",
    department: "Elektrik-Elektronik Mühendisliği",
    gpa: "3.78",
    status: "Mezuniyet Aşaması",
    email: "mehmet.demir@example.com",
    phone: "+90 555 345 6789",
    lastMeeting: "05.07.2023",
  },
  {
    id: "20190104056",
    name: "Zeynep Öztürk",
    department: "Bilgisayar Mühendisliği",
    gpa: "3.21",
    status: "Normal Öğrenim",
    email: "zeynep.ozturk@example.com",
    phone: "+90 555 456 7890",
  },
  {
    id: "20180105067",
    name: "Can Yıldız",
    department: "Elektrik-Elektronik Mühendisliği",
    gpa: "2.65",
    status: "Şartlı Geçme",
    email: "can.yildiz@example.com",
    phone: "+90 555 567 8901",
    lastMeeting: "20.04.2023",
  },
  {
    id: "20170106078",
    name: "Elif Şahin",
    department: "Makine Mühendisliği",
    gpa: "3.95",
    status: "Mezuniyet Aşaması",
    email: "elif.sahin@example.com",
    phone: "+90 555 678 9012",
    lastMeeting: "12.06.2023",
  },
  {
    id: "20190107089",
    name: "Burak Koç",
    department: "Makine Mühendisliği",
    gpa: "3.15",
    status: "Normal Öğrenim",
    email: "burak.koc@example.com",
    phone: "+90 555 789 0123",
  },
  {
    id: "20190108090",
    name: "Deniz Arslan",
    department: "Endüstri Mühendisliği",
    gpa: "2.75",
    status: "Şartlı Geçme",
    email: "deniz.arslan@example.com",
    phone: "+90 555 890 1234",
    lastMeeting: "25.05.2023",
  },
];

// API function to get students data
export const getStudents = async (): Promise<Student[]> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  return mockStudents;
};

// API function to send email to student
export const sendEmailToStudent = async (
  studentId: string,
  subject: string,
  message: string
): Promise<{ success: boolean }> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate validation
  if (!studentId.trim() || !subject.trim() || !message.trim()) {
    throw new Error("Tüm alanlar doldurulmalıdır");
  }

  // Find student to validate the ID
  const student = mockStudents.find(student => student.id === studentId);
  if (!student) {
    throw new Error("Öğrenci bulunamadı");
  }

  // Simulate successful response
  return { success: true };
}; 