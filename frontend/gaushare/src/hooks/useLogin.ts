import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService, type LoginRequest, type LoginResponse } from '../services/authService'
import type { ApiError } from '../lib/apiClient'

export interface LoginFormData {
    username: string
    password: string
}

export interface LoginErrors {
    username?: string
    password?: string
    general?: string
}

export const useLogin = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [errors, setErrors] = useState<LoginErrors>({})

    const validateForm = (formData: LoginFormData): boolean => {
        const newErrors: LoginErrors = {}

        // Validate username
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required'
        }

        // Validate password
        if (!formData.password) {
            newErrors.password = 'Password is required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const login = async (formData: LoginFormData): Promise<LoginResponse | null> => {
        // Clear previous errors
        setError(null)
        setErrors({})

        // Validate form
        if (!validateForm(formData)) {
            return null
        }

        setIsLoading(true)

        try {
            // Prepare request data
            const loginData: LoginRequest = {
                username: formData.username.trim(),
                password: formData.password,
            }

            // Call API
            const response = await authService.login(loginData)

            // Navigate to home page after successful login
            navigate('/')

            return response
        } catch (err) {
            const apiError = err as ApiError

            // Handle validation errors from server
            if (apiError.errors) {
                const serverErrors: LoginErrors = {}
                Object.keys(apiError.errors).forEach((key) => {
                    const fieldName = key as keyof LoginErrors
                    if (apiError.errors?.[key]?.[0]) {
                        serverErrors[fieldName] = apiError.errors[key][0]
                    }
                })
                setErrors(serverErrors)
            } else {
                setError(apiError.message || 'Login failed. Please try again.')
            }

            return null
        } finally {
            setIsLoading(false)
        }
    }

    const clearErrors = () => {
        setError(null)
        setErrors({})
    }

    return {
        login,
        isLoading,
        error,
        errors,
        clearErrors,
    }
}
