import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { loginUser, validateToken, type User } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored token on mount
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      // Validate the token with our service function
      const verifyToken = async () => {
        try {
          const userData = await validateToken(storedToken);
          setUser(userData);
          setToken(storedToken);
        } catch (error) {
          console.error('Token validation failed', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('authUser');
        }
      };
      
      verifyToken();
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Use our auth service to log in
      const { user: userData, token: authToken } = await loginUser(email, password);
      
      setUser(userData);
      setToken(authToken);
      
      // Store token and user in localStorage for persistence
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('authUser', JSON.stringify(userData));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  };
  
  const value = {
    user,
    token,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 