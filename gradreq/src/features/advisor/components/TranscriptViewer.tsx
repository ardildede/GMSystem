import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import type { TranscriptData } from '../services/transcriptService';

interface TranscriptViewerProps {
  transcript: TranscriptData | null;
  isLoading: boolean;
  error: Error | null;
}

const TranscriptViewer = ({ transcript, isLoading, error }: TranscriptViewerProps) => {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Alert severity="error">
        Transkript verileri yüklenirken bir hata oluştu: {error.message}
      </Alert>
    );
  }
  
  if (!transcript) {
    return (
      <Typography>Transkript verisi bulunamadı.</Typography>
    );
  }

  return (
    <>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="body2" color="text.secondary">Öğrenci Adı:</Typography>
          <Typography variant="body1" fontWeight={500}>{transcript.studentInfo.name}</Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">Öğrenci No:</Typography>
          <Typography variant="body1" fontWeight={500}>{transcript.studentInfo.id}</Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">Bölüm:</Typography>
          <Typography variant="body1" fontWeight={500}>{transcript.studentInfo.department}</Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">GANO:</Typography>
          <Typography variant="h6" fontWeight={600} color="primary">{transcript.gpa}</Typography>
        </Box>
      </Box>
      
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.03)' }}>
              <TableCell><Typography fontWeight={500}>Ders Kodu</Typography></TableCell>
              <TableCell><Typography fontWeight={500}>Ders Adı</Typography></TableCell>
              <TableCell align="center"><Typography fontWeight={500}>Kredi</Typography></TableCell>
              <TableCell align="center"><Typography fontWeight={500}>Not</Typography></TableCell>
              <TableCell><Typography fontWeight={500}>Dönem</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transcript.courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>{course.id}</TableCell>
                <TableCell>{course.name}</TableCell>
                <TableCell align="center">{course.credits}</TableCell>
                <TableCell align="center">
                  <Chip 
                    label={course.grade} 
                    size="small"
                    color={
                      course.grade === 'AA' || course.grade === 'BA' ? 'success' :
                      course.grade === 'BB' || course.grade === 'CB' ? 'primary' :
                      course.grade === 'CC' || course.grade === 'DC' ? 'warning' : 
                      'error'
                    }
                    sx={{ fontWeight: 500 }}
                  />
                </TableCell>
                <TableCell>{course.semester}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Bu bilgiler resmi olmayan transkript bilgileridir. Resmi transkript için Öğrenci İşleri'ne başvurunuz.
        </Typography>
      </Box>
    </>
  );
};

export default TranscriptViewer; 