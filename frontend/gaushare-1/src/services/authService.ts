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

export interface LoginResponse {
    userId: string
    accessToken: string
    refreshToken: string
    permissions: string[]
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
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>(AUTH_URLS.LOGIN, credentials)
        const data = getResponseData<LoginResponse>(response)

        // Store tokens and user info
        if (data.accessToken) {
            localStorage.setItem('accessToken', data.accessToken)
        }
        if (data.refreshToken) {
            localStorage.setItem('refreshToken', data.refreshToken)
        }
        if (data.userId) {
            localStorage.setItem('userId', data.userId)
        }
        if (data.permissions) {
            localStorage.setItem('permissions', JSON.stringify(data.permissions))
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
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('userId')
            localStorage.removeItem('permissions')
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
    refreshToken: async (): Promise<{ accessToken: string }> => {
        const response = await api.post<{ accessToken: string }>(AUTH_URLS.REFRESH_TOKEN, {
            refreshToken: localStorage.getItem('refreshToken'),
        })
        const data = getResponseData(response)

        if (data.accessToken) {
            localStorage.setItem('accessToken', data.accessToken)
        }

        return data
    },
}
