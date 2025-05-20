import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CardHeader, 
  List, 
  ListItem, 
  ListItemText, 
  Button,
  Divider
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AdvisorDashboardLayout from '../layout/AdvisorDashboardLayout';

const AdvisorDashboardPage = () => {
  const pendingRequests = [
    { id: 1, studentName: 'Ahmet Yılmaz', requestType: 'Transkript İncelemesi', date: '15.08.2023' },
    { id: 2, studentName: 'Ayşe Kaya', requestType: 'Dilekçe', date: '17.08.2023' },
    { id: 3, studentName: 'Mehmet Demir', requestType: 'Mezuniyet İncelemesi', date: '20.08.2023' },
  ];

  const upcomingMeetings = [
    { id: 1, studentName: 'Zeynep Öztürk', topic: 'Ders Seçimi', date: '25.08.2023', time: '14:00' },
    { id: 2, studentName: 'Can Yıldız', topic: 'Staj Danışmanlığı', date: '26.08.2023', time: '10:30' },
  ];

  return (
    <AdvisorDashboardLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Danışman Paneli
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Öğrencileriniz ve inceleme bekleyen taleplerinize genel bakış.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* İstatistikler */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={2}
            sx={{ 
              height: '100%',
              p: 3, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center'
            }}
          >
            <Typography variant="h3" color="primary" gutterBottom>
              42
            </Typography>
            <Typography variant="body1">Danışmanlık Verilen Öğrenci</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={2}
            sx={{ 
              height: '100%',
              p: 3, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center'
            }}
          >
            <Typography variant="h3" color="warning.main" gutterBottom>
              3
            </Typography>
            <Typography variant="body1">Bekleyen Talep</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={2}
            sx={{ 
              height: '100%',
              p: 3, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center'
            }}
          >
            <Typography variant="h3" color="success.main" gutterBottom>
              2
            </Typography>
            <Typography variant="body1">Planlanan Görüşme</Typography>
          </Paper>
        </Grid>

        {/* Bekleyen Talepler */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Bekleyen Talepler" 
              action={
                <Button component={RouterLink} to="/advisor/requests" size="small">
                  Tümünü Gör
                </Button>
              }
            />
            <CardContent>
              <List>
                {pendingRequests.map((request, index) => (
                  <Box key={request.id}>
                    <ListItem>
                      <ListItemText
                        primary={`${request.studentName} - ${request.requestType}`}
                        secondary={`Talep Tarihi: ${request.date}`}
                      />
                      <Button variant="outlined" size="small">
                        İncele
                      </Button>
                    </ListItem>
                    {index < pendingRequests.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Planlanan Görüşmeler */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Planlanan Görüşmeler" 
              action={
                <Button component={RouterLink} to="/advisor/meetings" size="small">
                  Tümünü Gör
                </Button>
              }
            />
            <CardContent>
              <List>
                {upcomingMeetings.map((meeting, index) => (
                  <Box key={meeting.id}>
                    <ListItem>
                      <ListItemText
                        primary={`${meeting.studentName} - ${meeting.topic}`}
                        secondary={`Tarih: ${meeting.date} Saat: ${meeting.time}`}
                      />
                      <Button variant="outlined" size="small">
                        Detaylar
                      </Button>
                    </ListItem>
                    {index < upcomingMeetings.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Hızlı Erişim */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Hızlı Erişim
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Button 
                  component={RouterLink} 
                  to="/advisor/students" 
                  variant="contained" 
                  fullWidth
                >
                  Öğrenci Listesi
                </Button>
              </Grid>
              <Grid item xs={6} md={3}>
                <Button 
                  component={RouterLink} 
                  to="/advisor/transcripts" 
                  variant="contained" 
                  fullWidth
                >
                  Transkript İnceleme
                </Button>
              </Grid>
              <Grid item xs={6} md={3}>
                <Button 
                  component={RouterLink} 
                  to="/advisor/petition" 
                  variant="contained" 
                  fullWidth
                >
                  Dilekçe Oluştur
                </Button>
              </Grid>
              <Grid item xs={6} md={3}>
                <Button 
                  variant="contained" 
                  fullWidth
                  color="secondary"
                >
                  Destek Talebi
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </AdvisorDashboardLayout>
  );
};

export default AdvisorDashboardPage; 