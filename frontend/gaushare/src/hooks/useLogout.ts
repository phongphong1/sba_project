import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'

export const useLogout = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)

    const logout = async () => {
        setIsLoading(true)
        try {
            await authService.logout()
            navigate('/login')
        } catch (error) {
            console.error('Failed to logout:', error)
            // Still navigate to login even if API call fails
            navigate('/login')
        } finally {
            setIsLoading(false)
        }
    }

    return {
        logout,
        isLoading,
    }
}
