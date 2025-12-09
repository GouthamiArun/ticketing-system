import { ApiResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface FetchOptions extends RequestInit {
  data?: any;
}

// Token management
export const tokenManager = {
  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  },
  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },
};

async function fetchAPI<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const { data, ...fetchOptions } = options;

  const config: RequestInit = {
    ...fetchOptions,
  };

  // Get token from localStorage
  const token = tokenManager.getToken();

  // Handle FormData separately (for file uploads)
  if (data instanceof FormData) {
    config.body = data;
    // Don't set Content-Type for FormData - browser will set it with boundary
    config.headers = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...fetchOptions.headers,
    };
  } else {
    // Regular JSON data
    config.headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...fetchOptions.headers,
    };
    if (data) {
      config.body = JSON.stringify(data);
    }
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const result = await response.json();

    if (!response.ok) {
      const error: any = new Error(result.message || 'API request failed');
      error.code = result.code;
      error.status = response.status;
      throw error;
    }

    return result;
  } catch (error: any) {
    throw error;
  }
}

export const api = {
  get: <T = any>(endpoint: string, options?: FetchOptions) =>
    fetchAPI<T>(endpoint, { ...options, method: 'GET' }),

  post: <T = any>(endpoint: string, data?: any, options?: FetchOptions) =>
    fetchAPI<T>(endpoint, { ...options, method: 'POST', data }),

  patch: <T = any>(endpoint: string, data?: any, options?: FetchOptions) =>
    fetchAPI<T>(endpoint, { ...options, method: 'PATCH', data }),

  delete: <T = any>(endpoint: string, options?: FetchOptions) =>
    fetchAPI<T>(endpoint, { ...options, method: 'DELETE' }),
};
