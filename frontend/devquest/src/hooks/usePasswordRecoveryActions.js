import axios from 'axios'

export function usePasswordRecoveryActions() {
  const handleSendMagicLink = async (values) => {
    try {
      const response = await axios.post('/api/auth/forgot-password', values)

      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        return {
          success: true,
          mocked: true,
        }
      }

      throw error
    }
  }

  const handleResetPassword = async (values) => {
    try {
      const response = await axios.post('/api/auth/reset-password', values)

      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        return {
          success: true,
          mocked: true,
        }
      }

      throw error
    }
  }

  return {
    handleSendMagicLink,
    handleResetPassword,
  }
}
