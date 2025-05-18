import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Delete as DeleteIcon,
  PictureAsPdf as PdfIcon,
  InsertDriveFile as FileIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import DeansOfficeDashboardLayout from '../../components/layout/DeansOfficeDashboard';

interface UploadedFile {
  id: string;
  name: string;
  status: 'pending' | 'uploaded' | 'error';
  file: File;
}

const FacultyRankingPage = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [rankingGenerated, setRankingGenerated] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    const newFiles: UploadedFile[] = Array.from(files).map((file, index) => {
      // Basic validation (can be extended for specific types like Excel, CSV, PDF)
      const allowedTypes = ['application/pdf', 'text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      if (!allowedTypes.includes(file.type)) {
        setErrorMessage(`File ${file.name} has an unsupported format. Please upload PDF, CSV, or Excel files.`);
        return {
          id: `file-${Date.now()}-${index}`,
          name: file.name,
          status: 'error' as 'error',
          file,
        };
      }
      return {
        id: `file-${Date.now()}-${index}`,
        name: file.name,
        status: 'uploaded' as 'uploaded',
        file,
      };
    });

    setUploadedFiles(prevFiles => [...prevFiles, ...newFiles.filter(f => f.status === 'uploaded')]);
    if (newFiles.some(f => f.status === 'uploaded')) {
        setSuccessMessage(`${newFiles.filter(f => f.status === 'uploaded').length} file(s) uploaded successfully.`);
    }
    
    // Clear messages after some time
    setTimeout(() => {
        setSuccessMessage(null);
        setErrorMessage(null);
    }, 5000);
  };

  const handleDeleteFile = (fileId: string) => {
    setUploadedFiles(prevFiles => prevFiles.filter(f => f.id !== fileId));
  };

  const handleGenerateRanking = async () => {
    if (uploadedFiles.length === 0) {
      setErrorMessage('Please upload department ranking files first.');
      return;
    }
    setProcessing(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setRankingGenerated(false);

    // Simulate API call and processing
    try {
      // 1. Dekanlık fakülte sıralamalarını oluşturmak için sisteme girer (already in this page)
      // 2. Dekanlığın önünde açılan sayfada Bölüm Sıralamalarını Yükle butonuna tıklanır (handleFileUpload)
      // 3. Dosya seçim sekmesi açılır (input type file)
      // 4. Dekanlık bölüm dosyalarını seçer ve dosyaları aç'a tıklar (onChange of input)
      // 5. Sistem dosyaların yüklendiğine dair bildirim gönderir (successMessage in handleFileUpload)
      // 6. Sistem sıralamaların başarılı bir şekilde alındığına dair bildirim gönderir (covered by file upload success)
      // 7. Dekanlık fakülte sıralamalarını oluştur butonuna basar (this function)
      console.log('Generating faculty rankings with files:', uploadedFiles.map(f => f.name));
      // 8. Sistem bölüm sıralamalarını birleştirir (Simulated)
      // 9. Sistem öğrencilerin GANO'suna göre fakülte sıralamalarını oluşturur (Simulated)
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate processing time

      // Simulate potential errors during processing
      // if (Math.random() < 0.2) { // 20% chance of error
      //   throw new Error("Failed to process ranking files. Please check file integrity and try again.");
      // }

      // 10. Sistem sürecin sonunu bildirir ve fakülte sıralamasını dekanlığa dosya olarak gösterir
      setRankingGenerated(true);
      setSuccessMessage('Faculty ranking list generated successfully! You can download it now.');
      // In a real app, provide a download link for the generated file.
      // For now, we'll just show a success message.

    } catch (error: any) {
      console.error('Error generating faculty ranking:', error);
      setErrorMessage(error.message || 'An unexpected error occurred while generating the ranking.');
      // İstisnalar: 2. Sistem süreci başlatmaz:
      //   1. Sistem işlemin başlatılamadığına dair bir bildirim gönderir (this errorMessage)
      //   2. Normal akışın 3. adımına geri dönülür (user can try uploading again or re-triggering)
    } finally {
      setProcessing(false);
    }
  };
  
  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.pdf')) return <PdfIcon color="error" />;
    if (fileName.endsWith('.csv')) return <FileIcon color="success" />;
    if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) return <FileIcon color="primary" />;
    return <FileIcon />;
  };


  return (
    <DeansOfficeDashboardLayout>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Faculty Graduation Ranking
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary">
          Upload department ranking lists to generate the overall faculty graduation ranking.
          The system will combine these lists based on student GPAs.
        </Typography>

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMessage(null)}>
            {errorMessage}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage(null)}>
            {successMessage}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* File Upload Section */}
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                1. Upload Department Rankings
              </Typography>
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                sx={{ mb: 2 }}
                disabled={processing}
              >
                Upload Files
                <input
                  type="file"
                  accept=".pdf,.csv,.xls,.xlsx,application/pdf,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  hidden
                  multiple
                  onChange={handleFileUpload}
                />
              </Button>
              <Typography variant="caption" display="block" color="text.secondary" sx={{mb:1}}>
                Supported formats: PDF, CSV, Excel.
              </Typography>

              {uploadedFiles.length > 0 && (
                <List dense>
                  {uploadedFiles.map((uploadedFile) => (
                    <ListItem
                      key={uploadedFile.id}
                      secondaryAction={
                        <Tooltip title="Delete File">
                          <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteFile(uploadedFile.id)} disabled={processing}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      }
                      sx={{ 
                        bgcolor: 'action.hover', 
                        mb: 1, 
                        borderRadius: 1,
                        borderLeft: `4px solid ${uploadedFile.status === 'error' ? theme.palette.error.main : theme.palette.success.main}`
                       }}
                    >
                      <ListItemIcon sx={{minWidth: '36px'}}>
                        {getFileIcon(uploadedFile.name)}
                      </ListItemIcon>
                      <ListItemText
                        primary={uploadedFile.name}
                        primaryTypographyProps={{ variant: 'body2', noWrap: true, maxWidth: 'calc(100% - 40px)'}}
                        secondary={
                            <Chip 
                                label={uploadedFile.status} 
                                size="small" 
                                color={uploadedFile.status === 'uploaded' ? 'success' : uploadedFile.status === 'error' ? 'error' : 'default'}
                                sx={{height: 'auto', '& .MuiChip-label': { py: '2px', fontSize: '0.7rem'}}}
                            />
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
               {uploadedFiles.length === 0 && !processing && (
                <Typography variant="body2" color="text.secondary" sx={{mt: 2}}>
                  No files uploaded yet.
                </Typography>
              )}
            </Paper>
          </Grid>

          {/* Ranking Generation Section */}
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                2. Generate Faculty Ranking
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleGenerateRanking}
                disabled={processing || uploadedFiles.filter(f => f.status === 'uploaded').length === 0}
                startIcon={processing ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
                sx={{ mb: 2 }}
              >
                {processing ? 'Generating...' : 'Generate Faculty Ranking'}
              </Button>
              
              {rankingGenerated && (
                <Box mt={2}>
                    <Alert severity="success" icon={<CheckCircleIcon fontSize="inherit" />}>
                        Faculty ranking list has been successfully generated.
                        <Button size="small" variant="outlined" sx={{ml:2}}>Download Ranking List</Button> 
                        {/* This button is for UI demonstration; actual download logic would be needed */}
                    </Alert>
                </Box>
              )}
               {!rankingGenerated && !processing && uploadedFiles.filter(f => f.status === 'uploaded').length > 0 && (
                 <Typography variant="body2" color="text.secondary" sx={{mt: 2}}>
                    Once files are uploaded, click the button above to generate the faculty-wide ranking.
                  </Typography>
               )}
               {!rankingGenerated && !processing && uploadedFiles.length === 0 && (
                 <Typography variant="body2" color="text.secondary" sx={{mt: 2}}>
                    Please upload department ranking files to enable generation.
                  </Typography>
               )}
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Process Overview & Requirements
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Upload Department Lists" 
                secondary="Upload all individual department ranking lists. Ensure they are in a supported format (PDF, CSV, Excel)." 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Data Integrity" 
                secondary="The system will attempt to validate data for completeness and consistency (e.g., no duplicate entries, valid GPAs)." 
              />
            </ListItem>
             <ListItem>
              <ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Standardized Algorithm" 
                secondary="A transparent algorithm merges lists and ranks students by GPA. Tie-breaking rules (e.g., alphabetical by name) are applied if necessary." 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Generate & Download" 
                secondary="After processing, the final faculty ranking list will be available for download." 
              />
            </ListItem>
             <ListItem>
              <ListItemIcon><ErrorIcon color="warning" /></ListItemIcon>
              <ListItemText 
                primary="Error Handling" 
                secondary="If files are not accepted or processing fails, you will be notified to check and re-upload files or retry." 
              />
            </ListItem>
          </List>
        </Box>
      </Paper>
    </DeansOfficeDashboardLayout>
  );
};

export default FacultyRankingPage;
