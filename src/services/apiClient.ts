import { ApiError } from '@/types/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }
 
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    // If headers is an empty object, don't set default Content-Type (for FormData)
    const shouldSetContentType = !(options.headers && Object.keys(options.headers).length === 0);
    
    const config: RequestInit = {
      headers: shouldSetContentType ? {
        'Content-Type': 'application/json',
        ...options.headers,
      } : {
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    // Handle FormData separately (don't stringify, don't set Content-Type)
    if (data instanceof FormData) {
      return this.request<T>(endpoint, {
        method: 'POST',
        body: data,
        headers: {}, // Don't set Content-Type for FormData, browser will set it automatically with boundary
      });
    }
    
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    // Handle FormData separately (don't stringify, don't set Content-Type)
    if (data instanceof FormData) {
      return this.request<T>(endpoint, {
        method: 'PUT',
        body: data,
        headers: {}, // Don't set Content-Type for FormData, browser will set it automatically with boundary
      });
    }
    
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async uploadFile(endpoint: string, file: File): Promise<unknown> {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('authToken');
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(errorData.message || `Upload failed with status ${response.status}`);
    }

    return await response.json();
  }
}

export const apiClient = new ApiClient(API_BASE_URL);