import { Playlist, PlaylistForm, PaginatedResponse } from '../types';
import { apiClient } from './client.ts';

export const playlistsApi = {
  getPlaylists: async (search: string = '', page: number = 1, limit: number = 10): Promise<PaginatedResponse<Playlist>> => {
    const response = await apiClient.get(`/playlists?search=${search}&page=${page}&limit=${limit}`);
    return response.data;
  },

  createPlaylist: async (playlist: PlaylistForm): Promise<{ playlist: Playlist }> => {
    const response = await apiClient.post('/playlists', playlist);
    return response.data;
  },
};