import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import AdvisorDashboardLayout from '../layout/AdvisorDashboardLayout';
import { useTranscripts } from '../hooks/useTranscripts';

const TranscriptsPage = () => {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const { 
    students, 
    studentTranscript, 
    isLoading, 
    error, 
    fetchStudentTranscript 
  } = useTranscripts();

  const handleDialogOpen = async (studentId: string) => {
    setSelectedStudent(studentId);
    await fetchStudentTranscript(studentId);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleDepartmentChange = (event: SelectChangeEvent) => {
    setDepartmentFilter(event.target.value);
  };

  // Filter students based on search query and department filter
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           student.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === '' || student.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  // Get unique departments for filter dropdown
  const departments = [...new Set(students.map(student => student.department))];

  return (
    <AdvisorDashboardLayout>
      <Box>
        <Typography variant="h4" gutterBottom>
          Öğrenci Transkript İnceleme
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Danışmanlık verdiğiniz öğrencilerin transkriptlerini görüntüleyebilir ve inceleyebilirsiniz.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            placeholder="Öğrenci Adı veya ID Ara"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ flexGrow: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="department-filter-label">Bölüm</InputLabel>
            <Select
              labelId="department-filter-label"
              id="department-filter"
              value={departmentFilter}
              label="Bölüm"
              onChange={handleDepartmentChange}
            >
              <MenuItem value="">
                <em>Tümü</em>
              </MenuItem>
              {departments.map(department => (
                <MenuItem key={department} value={department}>
                  {department}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.03)' }}>
                <TableCell><Typography fontWeight={500}>Öğrenci No</Typography></TableCell>
                <TableCell><Typography fontWeight={500}>Ad Soyad</Typography></TableCell>
                <TableCell><Typography fontWeight={500}>Bölüm</Typography></TableCell>
                <TableCell align="center"><Typography fontWeight={500}>GANO</Typography></TableCell>
                <TableCell align="center"><Typography fontWeight={500}>Durum</Typography></TableCell>
                <TableCell align="right"><Typography fontWeight={500}>İşlemler</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.department}</TableCell>
                  <TableCell align="center">{student.gpa}</TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={student.status} 
                      size="small"
                      color={
                        student.status === 'Normal Öğrenim' ? 'success' :
                        student.status === 'Şartlı Geçme' ? 'warning' : 'error'
                      }
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button 
                      variant="outlined" 
                      size="small" 
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleDialogOpen(student.id)}
                    >
                      Transkript
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Transcript Dialog */}
        <Dialog 
          open={dialogOpen} 
          onClose={handleDialogClose} 
          fullWidth 
          maxWidth="md"
        >
          <DialogTitle>
            Öğrenci Transkripti
            {studentTranscript && (
              <Typography variant="body2" color="text.secondary">
                {studentTranscript.studentInfo.name} - {studentTranscript.studentInfo.id}
              </Typography>
            )}
          </DialogTitle>
          <DialogContent dividers>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Typography color="error">
                Transkript verileri yüklenirken bir hata oluştu: {error.message}
              </Typography>
            ) : studentTranscript ? (
              <>
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Öğrenci Adı:</Typography>
                    <Typography variant="body1" fontWeight={500}>{studentTranscript.studentInfo.name}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Öğrenci No:</Typography>
                    <Typography variant="body1" fontWeight={500}>{studentTranscript.studentInfo.id}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Bölüm:</Typography>
                    <Typography variant="body1" fontWeight={500}>{studentTranscript.studentInfo.department}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">GANO:</Typography>
                    <Typography variant="h6" fontWeight={600} color="primary">{studentTranscript.gpa}</Typography>
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
                      {studentTranscript.courses.map((course) => (
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
            ) : (
              <Typography>Transkript verisi bulunamadı.</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Kapat</Button>
            {studentTranscript && (
              <Button variant="contained">
                PDF İndir
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Box>
    </AdvisorDashboardLayout>
  );
};

export default TranscriptsPage; 