import { LoginForm, User } from '../types';
import { apiClient } from './client.ts';

export const authApi = {
  login: async (credentials: LoginForm): Promise<{ token: string; user: User }> => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },
};