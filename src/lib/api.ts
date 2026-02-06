import { 
  AuthResponse, 
  RegisterData, 
  ApiResponse, 
  FilesResponse, 
  FileItem,
  UploadResponse 
} from '@/types';

// Configure your backend URL here
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://googledrive-backend.vercel.app/api';

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }

    return data;
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async activateAccount(token: string): Promise<AuthResponse> {
    return this.request(`/auth/activate/${token}`, {
      method: 'GET',
    });
  }

  async forgotPassword(email: string): Promise<AuthResponse> {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, password: string): Promise<AuthResponse> {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  }

  async getProfile(): Promise<ApiResponse> {
    return this.request('/auth/profile');
  }

  // File/Folder endpoints
  async getFiles(folderId: string | null = null): Promise<FilesResponse> {
    const query = folderId ? `?parentId=${folderId}` : '';
    return this.request(`/files${query}`);
  }

  async createFolder(name: string, parentId: string | null = null): Promise<ApiResponse<FileItem>> {
    return this.request('/files/folder', {
      method: 'POST',
      body: JSON.stringify({ name, parentId }),
    });
  }

  async uploadFile(file: File, parentId: string | null = null): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    if (parentId) {
      formData.append('parentId', parentId);
    }

    const headers: Record<string, string> = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}/files/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }

    return data;
  }

  async deleteFile(fileId: string): Promise<ApiResponse> {
    return this.request(`/files/${fileId}`, {
      method: 'DELETE',
    });
  }

  async downloadFile(fileId: string): Promise<{ url: string }> {
    return this.request(`/files/download/${fileId}`);
  }

  async renameFile(fileId: string, name: string): Promise<ApiResponse<FileItem>> {
    return this.request(`/files/${fileId}`, {
      method: 'PATCH',
      body: JSON.stringify({ name }),
    });
  }
}

export const apiClient = new ApiClient();
