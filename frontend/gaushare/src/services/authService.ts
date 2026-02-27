import { api, getResponseData } from '../lib/apiClient'
import { AUTH_URLS } from '../const/apiUrls'

// Types
export interface LoginRequest {
    username: string
    password: string
}

export interface SignUpRequest {
    fullname: string
    email: string
    username: string
    dob: string
    password: string
}

export interface VerifyRequest {
    email: string
    otpCode: string
}

export interface AuthResponse {
    token: string
    user: {
        id: string
        username: string
        email: string
        name: string
    }
}

export interface RegisterResponse {
    message: string,
    userId: string
}

export interface VerifyResponse {
    message: string,
    success: boolean,
    userId: string
}

// Auth Service
export const authService = {
    /**
     * Login user
     */
    login: async (credentials: LoginRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>(AUTH_URLS.LOGIN, credentials)
        const data = getResponseData<AuthResponse>(response)

        // Store token
        if (data.token) {
            localStorage.setItem('token', data.token)
        }

        return data
    },

    /**
     * Sign up new user
     */
    signUp: async (userData: SignUpRequest): Promise<RegisterResponse> => {
        const response = await api.post<RegisterResponse>(AUTH_URLS.SIGNUP, userData)
        const data = getResponseData<RegisterResponse>(response)

        return data
    },

    /**
     * Verify OTP
     */
    verifyOtp: async (verifyData: VerifyRequest): Promise<VerifyResponse> => {
        const response = await api.post<VerifyResponse>(AUTH_URLS.VERIFY, verifyData)
        const data = getResponseData<VerifyResponse>(response)

        return data
    },

    /**
     * Resend OTP
     */
    resendOtp: async (email: string): Promise<{ message: string }> => {
        const response = await api.post<{ message: string }>(AUTH_URLS.RESEND_OTP, { email })
        return getResponseData(response)
    },

    /**
     * Logout user
     */
    logout: async (): Promise<void> => {
        try {
            await api.post(AUTH_URLS.LOGOUT)
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            localStorage.removeItem('token')
        }
    },

    /**
     * Get current user
     */
    getCurrentUser: async (): Promise<AuthResponse['user']> => {
        const response = await api.get<AuthResponse['user']>(AUTH_URLS.ME)
        return getResponseData(response)
    },

    /**
     * Refresh token
     */
    refreshToken: async (): Promise<{ token: string }> => {
        const response = await api.post<{ token: string }>(AUTH_URLS.REFRESH_TOKEN)
        const data = getResponseData(response)

        if (data.token) {
            localStorage.setItem('token', data.token)
        }

        return data
    },
}
