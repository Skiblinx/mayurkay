import { apiClient } from './apiClient';

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'user';
  permissions: string[];
  isActive: boolean;
  lastLogin?: string;
  profileImage?: string;
  phone?: string;
  createdBy?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  updatedBy?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'admin' | 'manager' | 'user';
  permissions?: string[];
  isActive?: boolean;
  phone?: string;
}

export interface UpdateUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: 'admin' | 'manager' | 'user';
  permissions?: string[];
  isActive?: boolean;
  phone?: string;
  profileImage?: string;
  password?: string;
}

export interface UserStats {
  totalActive: number;
  totalInactive: number;
  totalAdmins: number;
  totalManagers: number;
  totalUsers: number;
  newUsersLastMonth: number;
  total: number;
}

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Get all users with pagination and filters
export const getAllUsersAdmin = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: string;
}): Promise<UsersResponse> => {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.search) searchParams.append('search', params.search);
  if (params?.role) searchParams.append('role', params.role);
  if (params?.isActive) searchParams.append('isActive', params.isActive);

  const response = await apiClient.get(`/admin/users?${searchParams}`);
  return response.data;
};

// Get user by ID
export const getUserById = async (id: string): Promise<User> => {
  const response = await apiClient.get(`/admin/users/${id}`);
  return response.data;
};

// Create new user
export const createUser = async (userData: CreateUserData): Promise<User> => {
  const response = await apiClient.post('/admin/users', userData);
  return response.data;
};

// Update user
export const updateUser = async (id: string, userData: UpdateUserData): Promise<User> => {
  const response = await apiClient.put(`/admin/users/${id}`, userData);
  return response.data;
};

// Update user password
export const updateUserPassword = async (id: string, newPassword: string): Promise<void> => {
  await apiClient.patch(`/admin/users/${id}/password`, { newPassword });
};

// Delete user (soft delete)
export const deleteUser = async (id: string): Promise<void> => {
  await apiClient.delete(`/admin/users/${id}`);
};

// Permanently delete user
export const permanentDeleteUser = async (id: string): Promise<void> => {
  await apiClient.delete(`/admin/users/${id}/permanent`);
};

// Get user statistics
export const getUserStats = async (): Promise<UserStats> => {
  const response = await apiClient.get('/admin/users/stats');
  return response.data;
};