// API Base URLs
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api'

// Auth API endpoints
export const AUTH_URLS = {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/register',
    VERIFY: '/auth/verify',
    RESEND_OTP: '/auth/resend-otp',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH_TOKEN: '/auth/refresh',
} as const

// User API endpoints
export const USER_URLS = {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
    AVATAR: '/users/avatar',
} as const

// Question API endpoints
export const QUESTION_URLS = {
    LIST: '/questions',
    CREATE: '/questions',
    DETAIL: (id: string) => `/questions/${id}`,
    UPDATE: (id: string) => `/questions/${id}`,
    DELETE: (id: string) => `/questions/${id}`,
    UPVOTE: (id: string) => `/questions/${id}/upvote`,
    DOWNVOTE: (id: string) => `/questions/${id}/downvote`,
} as const

// Document API endpoints
export const DOCUMENT_URLS = {
    LIST: '/documents',
    CREATE: '/documents',
    DETAIL: (id: string) => `/documents/${id}`,
    UPDATE: (id: string) => `/documents/${id}`,
    DELETE: (id: string) => `/documents/${id}`,
    DOWNLOAD: (id: string) => `/documents/${id}/download`,
    SHARE: (id: string) => `/documents/${id}/share`,
} as const

// Notification API endpoints
export const NOTIFICATION_URLS = {
    LIST: '/notifications',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
    DELETE: (id: string) => `/notifications/${id}`,
} as const

// Search API endpoints
export const SEARCH_URLS = {
    SEARCH: '/search',
    USERS: '/search/users',
    QUESTIONS: '/search/questions',
    DOCUMENTS: '/search/documents',
} as const
