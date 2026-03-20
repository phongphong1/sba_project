import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService, type VerifyRequest, type VerifyResponse } from '../services/authService'
import type { ApiError } from '../lib/apiClient'

export const useOtp = (email: string) => {
    const navigate = useNavigate()
    const [otp, setOtp] = useState('')
    const [isVerifying, setIsVerifying] = useState(false)
    const [isResending, setIsResending] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [resendMessage, setResendMessage] = useState<string | null>(null)

    const validateOtp = (otpValue: string): boolean => {
        if (!otpValue || otpValue.length !== 6) {
            setError('Please enter the complete verification code')
            return false
        }

        // Check if OTP contains only digits
        if (!/^\d{6}$/.test(otpValue)) {
            setError('Verification code must contain only numbers')
            return false
        }

        return true
    }

    const verifyOtp = async (otpValue?: string): Promise<VerifyResponse | null> => {
        const otpToVerify = otpValue || otp

        setError(null)

        // Validate OTP
        if (!validateOtp(otpToVerify)) {
            return null
        }

        setIsVerifying(true)

        try {
            const verifyData: VerifyRequest = {
                email,
                otpCode: otpToVerify,
            }

            // Call API
            const response = await authService.verifyOtp(verifyData)

            // Navigate to login after successful verification
            navigate('/login')

            return response
        } catch (err) {
            const apiError = err as ApiError

            // Handle specific error cases
            if (apiError.statusCode === 400) {
                setError('Invalid verification code. Please try again.')
            } else if (apiError.statusCode === 401) {
                setError('Verification code has expired. Please request a new one.')
            } else {
                setError(apiError.message || 'Verification failed. Please try again.')
            }

            return null
        } finally {
            setIsVerifying(false)
        }
    }

    const resendOtp = async (): Promise<boolean> => {
        // Clear previous messages
        setError(null)
        setResendMessage(null)

        if (!email) {
            setError('Email is required to resend verification code')
            return false
        }

        setIsResending(true)

        try {
            const response = await authService.resendOtp(email)
            setResendMessage(response.message || 'Verification code has been resent to your email.')

            // Clear OTP input
            setOtp('')

            return true
        } catch (err) {
            const apiError = err as ApiError

            if (apiError.statusCode === 429) {
                setError('Too many requests. Please wait a moment before requesting a new code.')
            } else {
                setError(apiError.message || 'Failed to resend verification code. Please try again.')
            }

            return false
        } finally {
            setIsResending(false)
        }
    }

    const handleOtpChange = (value: string) => {
        setOtp(value)
        // Clear error when user types
        if (error) {
            setError(null)
        }
    }

    const clearError = () => {
        setError(null)
        setResendMessage(null)
    }

    return {
        otp,
        setOtp,
        handleOtpChange,
        verifyOtp,
        resendOtp,
        isVerifying,
        isResending,
        error,
        resendMessage,
        clearError,
    }
}
