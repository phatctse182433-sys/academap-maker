import { useEffect, useState } from 'react';
import { tokenUtils } from '@/lib/api';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
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
        }

        // Token is valid
        const role = tokenUtils.getUserRole(token);
        const email = tokenUtils.getUserEmail(token);
        
        setIsAuthenticated(true);
        setUserRole(role);
        setUserEmail(email);
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
    window.location.href = '/login';
  };

  return {
    isAuthenticated,
    userRole,
    userEmail,
    loading,
    logout,
    isAdmin: userRole === 'ROLE_ADMIN',
    isUser: userRole === 'ROLE_USER',
  };
};
