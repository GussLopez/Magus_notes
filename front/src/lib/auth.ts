import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
      correo: email,
      password
    });

    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      return response.data;
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function register(userData: {
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  password: string;
}): Promise<AuthResponse> {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, userData);

    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      return response.data;
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

export function logout() {
  localStorage.removeItem('token');
}

export function getToken(): string | null {
  return localStorage.getItem('token');
}

export async function getCurrentUser(): Promise<User | null> {
  const token = getToken();
  if (!token) return null;

  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.user;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}

export async function sendResetPasswordEmail(email: string) {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/send-reset-code`, { correo: email });
    return response.data;
  } catch (error) {
    console.error('Error sending reset password email:', error);
    throw error;
  }
}

export async function resetPassword(email: string, verificationCode: string, newPassword: string) {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
      correo: email,
      verificationCode,
      newPassword
    });
    return response.data;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
}