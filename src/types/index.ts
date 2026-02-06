// User types
export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActivated: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

// File/Folder types
export interface FileItem {
  _id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  mimeType?: string;
  s3Key?: string;
  s3Url?: string;
  parentId: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface FolderPath {
  _id: string;
  name: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface FilesResponse {
  success: boolean;
  files: FileItem[];
  path: FolderPath[];
}

export interface UploadResponse {
  success: boolean;
  message: string;
  file: FileItem;
}

// Auth context types
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<AuthResponse>;
  resetPassword: (token: string, password: string) => Promise<AuthResponse>;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
