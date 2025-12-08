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
export declare const successResponse: <T = any>(message: string, data?: T, pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}) => ApiResponse<T>;
export declare const errorResponse: (message: string, error?: any) => ApiResponse;
//# sourceMappingURL=response.util.d.ts.map