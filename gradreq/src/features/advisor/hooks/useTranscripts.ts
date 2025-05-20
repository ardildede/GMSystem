import { useState, useEffect } from "react";
import {
  getAdvisorStudents,
  getStudentTranscript,
  type Student,
  type TranscriptData,
} from "../services/transcriptService";

interface TranscriptsState {
  students: Student[];
  isLoading: boolean;
  error: Error | null;
  studentTranscript: TranscriptData | null;
  studentLoading: boolean;
  studentError: Error | null;
}

export const useTranscripts = () => {
  const [state, setState] = useState<TranscriptsState>({
    students: [],
    isLoading: true,
    error: null,
    studentTranscript: null,
    studentLoading: false,
    studentError: null,
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getAdvisorStudents();
        setState(prevState => ({
          ...prevState,
          students: data,
          isLoading: false,
          error: null,
        }));
      } catch (error) {
        setState(prevState => ({
          ...prevState,
          students: [],
          isLoading: false,
          error:
            error instanceof Error
              ? error
              : new Error("Öğrenci verileri alınamadı"),
        }));
      }
    };

    fetchStudents();
  }, []);

  const fetchStudentTranscript = async (studentId: string) => {
    setState(prevState => ({
      ...prevState,
      studentTranscript: null,
      studentLoading: true,
      studentError: null,
    }));

    try {
      const data = await getStudentTranscript(studentId);
      setState(prevState => ({
        ...prevState,
        studentTranscript: data,
        studentLoading: false,
        studentError: null,
      }));
    } catch (error) {
      setState(prevState => ({
        ...prevState,
        studentTranscript: null,
        studentLoading: false,
        studentError:
          error instanceof Error ? error : new Error("Transkript verisi alınamadı"),
      }));
    }
  };

  return {
    students: state.students,
    isLoading: state.isLoading,
    error: state.error,
    studentTranscript: state.studentTranscript,
    isStudentLoading: state.studentLoading,
    studentError: state.studentError,
    fetchStudentTranscript,
  };
}; 