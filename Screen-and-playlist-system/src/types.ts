export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'EDITOR';
}

export interface Screen {
  _id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
}

export interface Playlist {
  _id: string;
  name: string;
  itemCount: number;
  itemUrls?: string[];
  createdAt: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface PlaylistForm {
  name: string;
  itemUrls: string[];
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  screens?: T[];
  playlists?: T[];
  totalPages: number;
  currentPage: number;
  total: number;
}