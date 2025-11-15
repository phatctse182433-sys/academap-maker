import { useEffect, useState } from 'react';
import { tokenUtils } from '@/service/api';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = tokenUtils.get();
      
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        // Check if token is expired
        if (tokenUtils.isTokenExpired(token)) {
          tokenUtils.remove();
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }        // Token is valid
        const role = tokenUtils.getUserRole(token);
        const email = tokenUtils.getUserEmail(token);
        const id = tokenUtils.getUserId(token);
        
        setIsAuthenticated(true);
        setUserRole(role);
        setUserEmail(email);
        setUserId(id);
        setLoading(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        tokenUtils.remove();
        setIsAuthenticated(false);
        setLoading(false);
      }
    };

    checkAuth();
  }, []);
  const logout = () => {
    tokenUtils.remove();
    setIsAuthenticated(false);
    setUserRole('');
    setUserEmail('');
    setUserId(null);
    window.location.href = '/login';
  };
  return {
    isAuthenticated,
    userRole,
    userEmail,
    userId,
    loading,
    logout,
    isAdmin: userRole === 'ROLE_ADMIN',
    isUser: userRole === 'ROLE_USER',
  };
};
