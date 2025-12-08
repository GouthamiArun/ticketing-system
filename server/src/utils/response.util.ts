export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

export const successResponse = <T = any>(
  message: string,
  data?: T,
  pagination?: { page: number; limit: number; total: number; totalPages: number }
): ApiResponse<T> => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };

  if (pagination) {
    response.page = pagination.page;
    response.limit = pagination.limit;
    response.total = pagination.total;
    response.totalPages = pagination.totalPages;
  }

  return response;
};

export const errorResponse = (message: string, error?: any): ApiResponse => {
  return {
    success: false,
    message,
    error,
  };
};
