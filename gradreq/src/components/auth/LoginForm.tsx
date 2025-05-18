import { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent,
  Link,
  InputAdornment,
  IconButton,
  Stack,
  Alert,
  CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import iyteLogoPng from '../../assets/iyte-logo.png';
import theme from '../../styles/theme';
import { useNavigate } from 'react-router-dom';

interface LoginFormProps {
  onForgotPasswordClick: () => void;
  onRegisterClick: () => void;
}

// Dummy student credentials
const STUDENT_EMAIL = "student@example.com";
const STUDENT_PASSWORD = "student123";
const SECRETARY_EMAIL = "secretary@example.com";
const SECRETARY_PASSWORD = "secretary123";
const DEANS_OFFICE_EMAIL = "deansoffice@example.com";
const DEANS_OFFICE_PASSWORD = "deansoffice123";

const LoginForm = ({ onForgotPasswordClick, onRegisterClick }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email.trim() || !password) {
      setError('Email and password are required');
      return;
    }

    try {
      setLoading(true);
      
      // Check for dummy student credentials
      if (email === STUDENT_EMAIL && password === STUDENT_PASSWORD) {
        await login(email, password);
        navigate('/student'); // Navigate to student dashboard
      } else if (email === SECRETARY_EMAIL && password === SECRETARY_PASSWORD) {
        await login(email, password);
        navigate('/secretary'); // Navigate to secretary dashboard
      } else if (email === DEANS_OFFICE_EMAIL && password === DEANS_OFFICE_PASSWORD) {
        await login(email, password);
        navigate('/deans-office'); // Navigate to Dean's Office dashboard
      } else {
        // For demo purposes, throw an error for non-student credentials
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card 
      sx={{ 
        width: '100%', 
        maxWidth: '400px',
        boxShadow: 3,
        borderRadius: 2,
        overflow: 'visible',
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <CardContent 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
        }}
      >
        <Box 
          component="img" 
          src={iyteLogoPng} 
          alt="IYTE Logo" 
          sx={{ 
            width: 150, 
            height: 'auto', 
            mb: 2
          }}
        />
        
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
          Graduation Management System
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 3, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress size={22} color="inherit" thickness={4} sx={{ mr: 1 }} />
                Logging in...
              </Box>
            ) : 'Log In'}
          </Button>
          
          <Stack 
            direction="row" 
            justifyContent="space-between" 
            alignItems="center"
            spacing={2}
            sx={{ mt: 1 }}
          >
            <Link 
              href="#" 
              variant="body2" 
              sx={{ fontSize: '0.875rem' }}
              onClick={(e) => { 
                e.preventDefault(); 
                onForgotPasswordClick();
              }}
            >
              Forgot password?
            </Link>
            <Link 
              href="#" 
              variant="body2" 
              sx={{ fontSize: '0.875rem' }}
              onClick={(e) => {
                e.preventDefault();
                onRegisterClick();
              }}
            >
              Register
            </Link>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LoginForm;