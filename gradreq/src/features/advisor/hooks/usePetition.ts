import { useState, useEffect } from "react";
import {
  createPetition,
  getStudentsForPetition,
  type PetitionStudent,
  type PetitionData,
} from "../services/petitionService";

interface PetitionState {
  students: PetitionStudent[];
  isLoading: boolean;
  error: Error | null;
}

interface SubmitState {
  isSubmitting: boolean;
  submitSuccess: boolean;
  submitError: Error | null;
}

export const usePetition = () => {
  const [state, setState] = useState<PetitionState>({
    students: [],
    isLoading: true,
    error: null,
  });

  const [submitState, setSubmitState] = useState<SubmitState>({
    isSubmitting: false,
    submitSuccess: false,
    submitError: null,
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getStudentsForPetition();
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

  const submitPetition = async (petitionData: PetitionData) => {
    setSubmitState({
      isSubmitting: true,
      submitSuccess: false,
      submitError: null,
    });

    try {
      await createPetition(petitionData);
      setSubmitState({
        isSubmitting: false,
        submitSuccess: true,
        submitError: null,
      });
      return true;
    } catch (error) {
      setSubmitState({
        isSubmitting: false,
        submitSuccess: false,
        submitError:
          error instanceof Error ? error : new Error("Dilekçe oluşturulamadı"),
      });
      return false;
    }
  };

  const resetSubmitState = () => {
    setSubmitState({
      isSubmitting: false,
      submitSuccess: false,
      submitError: null,
    });
  };

  return {
    ...state,
    ...submitState,
    submitPetition,
    resetSubmitState,
  };
}; 