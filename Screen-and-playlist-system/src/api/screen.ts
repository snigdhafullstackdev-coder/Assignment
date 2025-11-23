import { Screen, PaginatedResponse } from '../types';
import { apiClient } from './client.ts';

export const screensApi = {
  getScreens: async (search: string = '', page: number = 1, limit: number = 10): Promise<PaginatedResponse<Screen>> => {
    const response = await apiClient.get(`/screens?search=${search}&page=${page}&limit=${limit}`);
    return response.data;
  },

  toggleScreen: async (id: string): Promise<{ screen: Screen }> => {
    const response = await apiClient.put(`/screens/${id}`);
    return response.data;
  },
};