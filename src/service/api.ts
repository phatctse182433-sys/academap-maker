// API configuration and utilities
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = process.env.NODE_ENV === 'development' ? '/api' : 'http://localhost:8080/api';

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// JWT Token interface
export interface DecodedToken {
  sub: string; // email
  id?: number; // user ID from token
  role: Array<{ authority: string }>;
  iat: number;
  exp: number;
}

// Auth response interfaces
export interface LoginResponse {
  accessToken: string;
  tokenType: string;
}

// Token utilities
export const tokenUtils = {
  decode: (token: string): DecodedToken => {
    return jwtDecode<DecodedToken>(token);
  },
  
  getUserRole: (token: string): string => {
    const decoded = tokenUtils.decode(token);
    return decoded.role[0]?.authority || 'ROLE_USER';
  },
  
  isTokenExpired: (token: string): boolean => {
    const decoded = tokenUtils.decode(token);
    return decoded.exp * 1000 < Date.now();
  },
    getUserEmail: (token: string): string => {
    const decoded = tokenUtils.decode(token);
    return decoded.sub;
  },
    getUserId: (token: string): number | null => {
    const decoded = tokenUtils.decode(token);
    return decoded.id || null;
  },
  
  store: (token: string) => {
    localStorage.setItem('accessToken', token);
  },
  
  get: (): string | null => {
    return localStorage.getItem('accessToken');
  },
  
  remove: () => {
    localStorage.removeItem('accessToken');
  },
};

// Auth API endpoints
export const authAPI = {
  register: async (userData: {
    mail: string;
    fullName: string;
    username: string;
    password: string;
    role: string;
  }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: apiConfig.headers,
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      const result = await response.text();
      return { success: true, message: result };
    } catch (error) {
      console.error('Registration API error:', error);
      throw error;
    }
  },
  login: async (credentials: {
    mail: string;
    password: string;
  }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: apiConfig.headers,
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      const result: LoginResponse = await response.json();
      
      // Store token in localStorage
      tokenUtils.store(result.accessToken);
        return { success: true, data: result };
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }  },
};

// General API utility functions
export const handleAPIError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof Error) {
    return error.message.includes('fetch') || error.message.includes('network');
  }
  return false;
};
