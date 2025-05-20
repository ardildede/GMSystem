import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';

export interface EmailDialogProps {
  open: boolean;
  studentName?: string;
  sending: boolean;
  error: Error | null;
  onClose: () => void;
  onSend: (subject: string, message: string) => Promise<boolean>;
}

const EmailDialog = ({ 
  open, 
  studentName, 
  sending, 
  error, 
  onClose, 
  onSend 
}: EmailDialogProps) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [templateType, setTemplateType] = useState('');

  const handleSubjectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(event.target.value);
  };

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleTemplateChange = (event: SelectChangeEvent) => {
    const selectedTemplate = event.target.value;
    setTemplateType(selectedTemplate);
    
    switch (selectedTemplate) {
      case 'appointment':
        setSubject('Danışmanlık Görüşmesi Hatırlatması');
        setMessage(`Değerli öğrencimiz,\n\nDanışmanlık görüşmesi için ofisimize gelmeniz gerekmektedir. Lütfen en kısa sürede randevu alınız.\n\nSaygılarımla,`);
        break;
      case 'warning':
        setSubject('Akademik Durum Hakkında Uyarı');
        setMessage(`Değerli öğrencimiz,\n\nAkademik durumunuzla ilgili bazı önemli hususları görüşmemiz gerekmektedir. Lütfen en kısa sürede ofisime uğrayınız.\n\nSaygılarımla,`);
        break;
      case 'info':
        setSubject('Bilgilendirme');
        setMessage(`Değerli öğrencimiz,\n\nBölümümüzdeki yeni uygulamalarla ilgili bilgi vermek istiyorum. Detaylar için lütfen danışman ofisine uğrayınız.\n\nSaygılarımla,`);
        break;
      default:
        setSubject('');
        setMessage('');
    }
  };

  const handleSend = async () => {
    const success = await onSend(subject, message);
    if (success) {
      setSubject('');
      setMessage('');
      setTemplateType('');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {studentName 
          ? `${studentName} için E-posta Gönder`
          : 'E-posta Gönder'
        }
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Öğrenciye iletmek istediğiniz mesajı aşağıya yazabilir veya hazır şablonlardan seçebilirsiniz.
        </DialogContentText>
        
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="email-template-label">E-posta Şablonu</InputLabel>
          <Select
            labelId="email-template-label"
            id="email-template"
            value={templateType}
            label="E-posta Şablonu"
            onChange={handleTemplateChange}
          >
            <MenuItem value=""><em>Şablon Yok</em></MenuItem>
            <MenuItem value="appointment">Görüşme Hatırlatması</MenuItem>
            <MenuItem value="warning">Akademik Uyarı</MenuItem>
            <MenuItem value="info">Genel Bilgilendirme</MenuItem>
          </Select>
        </FormControl>
        
        <TextField
          margin="dense"
          id="email-subject"
          label="Konu"
          fullWidth
          variant="outlined"
          value={subject}
          onChange={handleSubjectChange}
          sx={{ mb: 2 }}
        />
        
        <TextField
          id="email-message"
          label="Mesaj"
          multiline
          rows={6}
          fullWidth
          value={message}
          onChange={handleMessageChange}
        />
        
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error.message}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>İptal</Button>
        <Button 
          onClick={handleSend} 
          variant="contained"
          disabled={sending || !subject.trim() || !message.trim()}
        >
          {sending ? (
            <>
              <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
              Gönderiliyor...
            </>
          ) : 'Gönder'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailDialog; 