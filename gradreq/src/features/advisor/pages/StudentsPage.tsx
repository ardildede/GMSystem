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
  Card,
  CardContent,
  Tabs,
  Tab,
  Avatar,
  Divider,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  Search as SearchIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  CalendarMonth as CalendarIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AdvisorDashboardLayout from '../layout/AdvisorDashboardLayout';
import { useStudents } from '../hooks/useStudents';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`students-tabpanel-${index}`}
      aria-labelledby={`students-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const StudentsPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);

  const { 
    students, 
    isLoading, 
    error, 
    sendEmail,
    emailSending,
    emailSuccess,
    emailError 
  } = useStudents();
  
  const navigate = useNavigate();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleDepartmentChange = (event: SelectChangeEvent) => {
    setDepartmentFilter(event.target.value);
  };

  const handleViewTranscript = (studentId: string) => {
    navigate(`/advisor/transcripts?student=${studentId}`);
  };

  const handleEmailDialogOpen = (studentId: string) => {
    setSelectedStudent(studentId);
    setEmailDialogOpen(true);
  };

  const handleEmailDialogClose = () => {
    setEmailDialogOpen(false);
  };

  const handleSendEmail = async () => {
    if (selectedStudent) {
      await sendEmail(selectedStudent, 'Danışman Bildirisi', 'Bu bir otomatik bildirim mesajıdır. Lütfen danışman ofisiyle iletişime geçiniz.');
      if (emailSuccess) {
        handleEmailDialogClose();
      }
    }
  };

  // Filter students based on search query and department filter
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           student.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === '' || student.department === departmentFilter;
    const matchesTab = (
      (tabValue === 0) || // Tümü
      (tabValue === 1 && student.status === 'Normal Öğrenim') || // Normal
      (tabValue === 2 && student.status === 'Şartlı Geçme') || // Şartlı
      (tabValue === 3 && student.status === 'Mezuniyet Aşaması') // Mezun adayı
    );
    return matchesSearch && matchesDepartment && matchesTab;
  });

  // Get unique departments for filter dropdown
  const departments = [...new Set(students.map(student => student.department))];

  return (
    <AdvisorDashboardLayout>
      <Box>
        <Typography variant="h4" gutterBottom>
          Öğrenci Listem
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Danışmanlık verdiğiniz öğrencilerin listesi ve detaylarını görebilirsiniz.
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label={`Tümü (${students.length})`} />
            <Tab label={`Normal (${students.filter(s => s.status === 'Normal Öğrenim').length})`} />
            <Tab label={`Şartlı (${students.filter(s => s.status === 'Şartlı Geçme').length})`} />
            <Tab label={`Mezun Adayı (${students.filter(s => s.status === 'Mezuniyet Aşaması').length})`} />
          </Tabs>
        </Box>
        
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

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Öğrenci verileri yüklenirken bir hata oluştu: {error.message}
          </Alert>
        )}

        {isLoading ? (
          <Typography>Yükleniyor...</Typography>
        ) : (
          <TabPanel value={tabValue} index={tabValue}>
            <Grid container spacing={3}>
              {filteredStudents.map((student) => (
                <Grid item key={student.id} xs={12} md={6} lg={4}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar 
                          sx={{ 
                            width: 60, 
                            height: 60,
                            bgcolor: 
                              student.status === 'Normal Öğrenim' ? 'success.main' :
                              student.status === 'Şartlı Geçme' ? 'warning.main' : 
                              'primary.main'
                          }}
                        >
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <Box sx={{ ml: 2, flexGrow: 1 }}>
                          <Typography variant="h6">{student.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {student.id} - {student.department}
                          </Typography>
                          <Chip 
                            label={student.status} 
                            size="small"
                            color={
                              student.status === 'Normal Öğrenim' ? 'success' :
                              student.status === 'Şartlı Geçme' ? 'warning' : 'info'
                            }
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                        <IconButton>
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                      
                      <Divider sx={{ my: 1.5 }} />
                      
                      <Box sx={{ my: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <EmailIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                          <Typography variant="body2">
                            {student.email || 'student@example.com'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <PhoneIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                          <Typography variant="body2">
                            {student.phone || '+90 555 123 4567'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                          <Typography variant="body2">
                            {`Son Görüşme: ${student.lastMeeting || 'Henüz görüşme yapılmadı'}`}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Divider sx={{ my: 1.5 }} />
                      
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button 
                          startIcon={<VisibilityIcon />} 
                          size="small"
                          onClick={() => handleViewTranscript(student.id)}
                        >
                          Transkript
                        </Button>
                        <Button 
                          startIcon={<MailIcon />} 
                          size="small"
                          color="primary"
                          onClick={() => handleEmailDialogOpen(student.id)}
                        >
                          E-posta
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              
              {filteredStudents.length === 0 && (
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography>Filtrelere uygun öğrenci bulunamadı.</Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </TabPanel>
        )}

        {/* Email Dialog */}
        <Dialog open={emailDialogOpen} onClose={handleEmailDialogClose}>
          <DialogTitle>E-posta Gönder</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Seçilen öğrenciye otomatik bildirim e-postası gönderilecektir.
              Bu işlem, öğrencinin sistem üzerindeki e-posta adresine bir bildirim gönderir.
            </DialogContentText>
            {emailError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {emailError.message}
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEmailDialogClose}>İptal</Button>
            <Button 
              onClick={handleSendEmail} 
              variant="contained"
              disabled={emailSending}
            >
              {emailSending ? 'Gönderiliyor...' : 'Gönder'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdvisorDashboardLayout>
  );
};

export default StudentsPage; 