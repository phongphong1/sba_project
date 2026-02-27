import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService, type SignUpRequest, type RegisterResponse } from '../services/authService'
import type { ApiError } from '../lib/apiClient'

export interface RegisterFormData {
    fullname: string
    email: string
    username: string
    dob: string
    password: string
    confirmPassword: string
}

export interface RegisterErrors {
    fullname?: string
    email?: string
    username?: string
    dob?: string
    password?: string
    confirmPassword?: string
    general?: string
}

export const useRegister = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [errors, setErrors] = useState<RegisterErrors>({})

    const validateForm = (formData: RegisterFormData): boolean => {
        const newErrors: RegisterErrors = {}

        // Validate fullname
        if (!formData.fullname.trim()) {
            newErrors.fullname = 'Full name is required'
        }

        // Validate email
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid'
        }

        // Validate username
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required'
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters'
        }

        // Validate date of birth
        if (!formData.dob.trim()) {
            newErrors.dob = 'Date of birth is required'
        } else {
            // Validate date format DD/MM/YYYY
            const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/
            if (!dateRegex.test(formData.dob)) {
                newErrors.dob = 'Please enter date in format DD/MM/YYYY'
            } else {
                const [, day, month, year] = formData.dob.match(dateRegex) || []
                const dayNum = parseInt(day, 10)
                const monthNum = parseInt(month, 10)
                const yearNum = parseInt(year, 10)

                // Basic validation
                if (dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12 || yearNum < 1900 || yearNum > new Date().getFullYear()) {
                    newErrors.dob = 'Please enter a valid date'
                }
            }
        }

        // Validate password
        if (!formData.password) {
            newErrors.password = 'Password is required'
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
        }

        // Validate confirm password
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password'
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const register = async (formData: RegisterFormData): Promise<RegisterResponse | null> => {
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
            const signUpData: SignUpRequest = {
                fullname: formData.fullname.trim(),
                email: formData.email.trim(),
                username: formData.username.trim(),
                dob: formData.dob,
                password: formData.password,
            }

            // Call API
            const response = await authService.signUp(signUpData)

            // Navigate to verify page with email
            navigate('/verify', {
                state: { email: formData.email },
            })

            return response
        } catch (err) {
            const apiError = err as ApiError

            // Handle validation errors from server
            if (apiError.errors) {
                const serverErrors: RegisterErrors = {}
                Object.keys(apiError.errors).forEach((key) => {
                    const fieldName = key as keyof RegisterErrors
                    if (apiError.errors?.[key]?.[0]) {
                        serverErrors[fieldName] = apiError.errors[key][0]
                    }
                })
                setErrors(serverErrors)
            } else {
                setError(apiError.message || 'Registration failed. Please try again.')
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
        register,
        isLoading,
        error,
        errors,
        clearErrors,
    }
}
