import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { API_BASE_URL } from '../const/apiUrls'

// API Response types
export interface ApiResponse<T = any> {
    data: T
    message?: string
    success?: boolean
}

export interface ApiError {
    message: string
    errors?: Record<string, string[]>
    statusCode?: number
}

// Create axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    },
})

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // Get token from localStorage or wherever you store it
        const token = localStorage.getItem('token')

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        // Log request in development
        if (import.meta.env.DEV) {
            console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
                params: config.params,
                data: config.data,
            })
        }

        return config
    },
    (error) => {
        console.error('[API Request Error]', error)
        return Promise.reject(error)
    }
)

// Response interceptor
apiClient.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
        // Log response in development
        if (import.meta.env.DEV) {
            console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
                status: response.status,
                data: response.data,
            })
        }

        // Return data directly if response has a data property
        return response
    },
    (error: AxiosError<ApiError>) => {
        // Handle common errors
        if (error.response) {
            const { status, data } = error.response

            // Handle 401 Unauthorized - redirect to login
            if (status === 401) {
                localStorage.removeItem('token')
                // Redirect to login page
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login'
                }
            }

            // Handle 403 Forbidden
            if (status === 403) {
                console.error('[API Error] Forbidden:', data?.message || 'Access denied')
            }

            // Handle 404 Not Found
            if (status === 404) {
                console.error('[API Error] Not Found:', data?.message || 'Resource not found')
            }

            // Handle 500 Server Error
            if (status >= 500) {
                console.error('[API Error] Server Error:', data?.message || 'Internal server error')
            }

            // Return error with message
            const apiError: ApiError = {
                message: data?.message || error.message || 'An error occurred',
                errors: data?.errors,
                statusCode: status,
            }

            return Promise.reject(apiError)
        }

        // Handle network errors
        if (error.request) {
            console.error('[API Error] Network Error:', 'No response received from server')
            return Promise.reject({
                message: 'Network error. Please check your internet connection.',
                statusCode: 0,
            } as ApiError)
        }

        // Handle other errors
        console.error('[API Error]', error.message)
        return Promise.reject({
            message: error.message || 'An unexpected error occurred',
            statusCode: 0,
        } as ApiError)
    }
)

// API methods
export const api = {
    get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
        return apiClient.get<ApiResponse<T>>(url, config)
    },

    post: <T = any>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<ApiResponse<T>>> => {
        return apiClient.post<ApiResponse<T>>(url, data, config)
    },

    put: <T = any>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<ApiResponse<T>>> => {
        return apiClient.put<ApiResponse<T>>(url, data, config)
    },

    patch: <T = any>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<ApiResponse<T>>> => {
        return apiClient.patch<ApiResponse<T>>(url, data, config)
    },

    delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
        return apiClient.delete<ApiResponse<T>>(url, config)
    },
}

// Helper function to extract data from response
export const getResponseData = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
    // If response.data has a nested data property, use it; otherwise use response.data itself
    if ('data' in response.data && response.data.data !== undefined) {
        return response.data.data as T
    }
    return response.data as unknown as T
}

// Export the axios instance for advanced usage
export default apiClient
