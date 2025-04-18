import api from './api';

// Types
export interface User {
  id: number;
  username: string;
  email: string;
  userType: 'student' | 'institute' | 'faculty';
  phone?: string;
  collegeId?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  userType: 'student' | 'institute' | 'faculty';
  phone?: string;
}

// Auth service
const AuthService = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<User> => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      // If the response contains both user and token properties
      const userData = response.data.user || response.data;
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    }
    throw new Error('Failed to login: Invalid response format');
  },

  // Register user
  register: async (data: RegisterData): Promise<User> => {
    const response = await api.post('/auth/register', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      // If the response contains both user and token properties
      const userData = response.data.user || response.data;
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    }
    throw new Error('Failed to register: Invalid response format');
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: (): User | null => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch (e) {
        return null;
      }
    }
    return null;
  },

  // Get user profile
  getUserProfile: async (): Promise<User> => {
    const response = await api.get('/auth/profile');
    return response.data;
  }
};

export default AuthService;
