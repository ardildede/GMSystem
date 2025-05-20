import {
  Card,
  CardContent,
  Box,
  Avatar,
  Typography,
  Chip,
  Divider,
  IconButton,
  Button,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  CalendarMonth as CalendarIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import type { Student } from '../services/studentService';

interface StudentCardProps {
  student: Student;
  onViewTranscript: (studentId: string) => void;
  onSendEmail: (studentId: string) => void;
}

const StudentCard = ({ student, onViewTranscript, onSendEmail }: StudentCardProps) => {
  return (
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
            onClick={() => onViewTranscript(student.id)}
          >
            Transkript
          </Button>
          <Button 
            startIcon={<MailIcon />} 
            size="small"
            color="primary"
            onClick={() => onSendEmail(student.id)}
          >
            E-posta
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StudentCard; 