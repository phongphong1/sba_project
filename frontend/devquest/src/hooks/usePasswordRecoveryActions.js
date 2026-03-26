import authApi from '@/api/authApi'

export function usePasswordRecoveryActions() {
  const handleSendMagicLink = async (values) => {
    const data = await authApi.forgotPassword(values)

    return {
      success: true,
      data,
    }
  }

  const handleResetPassword = async (values) => {
    const data = await authApi.resetPassword(values)

    return {
      success: true,
      data,
    }
  }

  return {
    handleSendMagicLink,
    handleResetPassword,
  }
}
