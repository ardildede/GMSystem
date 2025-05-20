import { useState, useEffect } from "react";
import {
  getStudents,
  sendEmailToStudent,
  type Student,
} from "../services/studentService";

interface StudentsState {
  students: Student[];
  isLoading: boolean;
  error: Error | null;
}

interface EmailState {
  emailSending: boolean;
  emailSuccess: boolean;
  emailError: Error | null;
}

export const useStudents = () => {
  const [state, setState] = useState<StudentsState>({
    students: [],
    isLoading: true,
    error: null,
  });

  const [emailState, setEmailState] = useState<EmailState>({
    emailSending: false,
    emailSuccess: false,
    emailError: null,
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getStudents();
        setState({
          students: data,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setState({
          students: [],
          isLoading: false,
          error:
            error instanceof Error
              ? error
              : new Error("Öğrenci verileri alınamadı"),
        });
      }
    };

    fetchStudents();
  }, []);

  const sendEmail = async (studentId: string, subject: string, message: string) => {
    setEmailState({
      emailSending: true,
      emailSuccess: false,
      emailError: null,
    });

    try {
      await sendEmailToStudent(studentId, subject, message);
      setEmailState({
        emailSending: false,
        emailSuccess: true,
        emailError: null,
      });
      return true;
    } catch (error) {
      setEmailState({
        emailSending: false,
        emailSuccess: false,
        emailError:
          error instanceof Error ? error : new Error("E-posta gönderilemedi"),
      });
      return false;
    }
  };

  const resetEmailState = () => {
    setEmailState({
      emailSending: false,
      emailSuccess: false,
      emailError: null,
    });
  };

  return {
    ...state,
    sendEmail,
    resetEmailState,
    ...emailState,
  };
}; 