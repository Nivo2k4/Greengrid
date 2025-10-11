import axios from 'axios';
import { useContext } from 'react';
import AuthContext from '../context/authContext.tsx';

const apiUrl = import.meta.env.VITE_BASE_URL
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
export const registerUser = async (userDetails:any) => {
    const response = await axios.post(`${apiUrl}/auth/register`, userDetails);
    return response.data;
}
export const login = async (credentials: any) => {
  const response = await axios.post<{ accessToken: string }>(`${apiUrl}/auth/login`, credentials, { withCredentials: true });
  return response.data;
};