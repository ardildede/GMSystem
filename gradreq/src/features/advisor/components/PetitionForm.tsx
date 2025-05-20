import { useState } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Autocomplete,
  TextField,
  Typography,
  Grid,
  Paper,
  Button,
  SelectChangeEvent,
  CircularProgress,
} from '@mui/material';
import type { PetitionStudent } from '../services/petitionService';

export interface PetitionFormData {
  type: string;
  studentId: string;
  content: string;
}

interface PetitionFormProps {
  students: PetitionStudent[];
  isSubmitting: boolean;
  onSubmit: (data: PetitionFormData) => Promise<boolean>;
}

const PetitionForm = ({ students, isSubmitting, onSubmit }: PetitionFormProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [petitionType, setPetitionType] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [petitionContent, setPetitionContent] = useState('');
  const [errors, setErrors] = useState<{
    type?: string;
    student?: string;
    content?: string;
  }>({});
  const [formComplete, setFormComplete] = useState(false);

  const steps = ['Dilekçe Türü', 'Öğrenci Seçimi', 'Dilekçe İçeriği', 'Gözden Geçir'];

  const handleNext = () => {
    const newErrors: {
      type?: string;
      student?: string;
      content?: string;
    } = {};
    
    if (activeStep === 0 && !petitionType) {
      newErrors.type = 'Dilekçe türü seçmelisiniz';
    }
    
    if (activeStep === 1 && !selectedStudent) {
      newErrors.student = 'Öğrenci seçmelisiniz';
    }
    
    if (activeStep === 2 && petitionContent.trim().length < 50) {
      newErrors.content = 'Dilekçe içeriği en az 50 karakter olmalıdır';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Eğer son adıma geldiysek formun tamamlandığını işaretleyelim
    if (activeStep === steps.length - 2) {
      setFormComplete(true);
    }

    setErrors({});
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    const success = await onSubmit({
      type: petitionType,
      studentId: selectedStudent as string,
      content: petitionContent
    });
    
    return success;
  };

  const handleTypeChange = (event: SelectChangeEvent) => {
    setPetitionType(event.target.value as string);
    if (errors.type) {
      setErrors({ ...errors, type: undefined });
    }
  };

  const handleStudentChange = (_event: React.SyntheticEvent, value: string | null) => {
    setSelectedStudent(value);
    if (errors.student) {
      setErrors({ ...errors, student: undefined });
    }
  };

  const handleContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPetitionContent(event.target.value);
    if (errors.content && event.target.value.trim().length >= 50) {
      setErrors({ ...errors, content: undefined });
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <FormControl fullWidth error={!!errors.type}>
            <InputLabel id="petition-type-label">Dilekçe Türü</InputLabel>
            <Select
              labelId="petition-type-label"
              id="petition-type"
              value={petitionType}
              label="Dilekçe Türü"
              onChange={handleTypeChange}
            >
              <MenuItem value="course_substitution">Ders Muafiyet Dilekçesi</MenuItem>
              <MenuItem value="graduation_extension">Mezuniyet Uzatma Dilekçesi</MenuItem>
              <MenuItem value="leave_of_absence">İzin Dilekçesi</MenuItem>
              <MenuItem value="course_withdrawal">Ders Çekilme Dilekçesi</MenuItem>
              <MenuItem value="special_request">Özel İstek Dilekçesi</MenuItem>
            </Select>
            {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
          </FormControl>
        );
      case 1:
        return (
          <Autocomplete
            id="student-select"
            options={students.map(student => student.id)}
            getOptionLabel={(option) => {
              const student = students.find(s => s.id === option);
              return student ? `${student.name} (${student.id})` : option;
            }}
            value={selectedStudent}
            onChange={handleStudentChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Öğrenci Seçiniz"
                error={!!errors.student}
                helperText={errors.student}
              />
            )}
          />
        );
      case 2:
        return (
          <TextField
            fullWidth
            id="petition-content"
            label="Dilekçe İçeriği"
            multiline
            rows={12}
            value={petitionContent}
            onChange={handleContentChange}
            error={!!errors.content}
            helperText={errors.content || `${petitionContent.length}/500 karakter (Min: 50)`}
            inputProps={{ maxLength: 500 }}
          />
        );
      case 3:
        const selectedStudentData = students.find(s => s.id === selectedStudent);
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Dilekçe Detayları
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Dilekçe Türü:</Typography>
                <Typography variant="body1" fontWeight={500}>
                  {petitionType === 'course_substitution' ? 'Ders Muafiyet Dilekçesi' :
                   petitionType === 'graduation_extension' ? 'Mezuniyet Uzatma Dilekçesi' :
                   petitionType === 'leave_of_absence' ? 'İzin Dilekçesi' :
                   petitionType === 'course_withdrawal' ? 'Ders Çekilme Dilekçesi' :
                   'Özel İstek Dilekçesi'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Öğrenci:</Typography>
                <Typography variant="body1" fontWeight={500}>
                  {selectedStudentData ? `${selectedStudentData.name} (${selectedStudentData.id})` : ''}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">Dilekçe İçeriği:</Typography>
                <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {petitionContent}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );
      default:
        return 'Bilinmeyen Adım';
    }
  };

  return (
    <Box>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mb: 4, minHeight: '250px' }}>
        {getStepContent(activeStep)}
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          color="inherit"
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: 1 }}
        >
          Geri
        </Button>
        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Gönderiliyor...
              </>
            ) : 'Gönder'}
          </Button>
        ) : (
          <Button 
            variant="contained" 
            onClick={handleNext}
          >
            İleri
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default PetitionForm; 