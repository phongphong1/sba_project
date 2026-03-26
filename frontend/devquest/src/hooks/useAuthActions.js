import authApi from '@/api/authApi'
import { AUTH_TOKEN_KEY } from '@/constants/auth'

const persistToken = (token) => localStorage.setItem(AUTH_TOKEN_KEY, token)
const clearToken = () => localStorage.removeItem(AUTH_TOKEN_KEY)

const resolveToken = (payload) => payload?.token ?? payload?.jwt ?? payload?.accessToken
const resolveMessage = (payload, fallbackMessage) =>
  payload?.message ?? payload?.data?.message ?? fallbackMessage

export function useAuthActions() {
  return {
    handleLogin: async (values) => {
      const data = await authApi.login(values)
      const token = resolveToken(data)

      if (token) {
        persistToken(token)
      }

      return {
        success: true,
        token,
        data,
      }
    },
    handleSignUp: async (values) => {
      const data = await authApi.register(values)

      return {
        success: true,
        data,
      }
    },
    handleVerifyEmail: async (token) => {
      const data = await authApi.verifyEmail(token)

      return {
        success: true,
        data,
      }
    },
    handleLogout: async () => {
      try {
        const data = await authApi.logout()

        return {
          success: true,
          data,
          message: resolveMessage(data, 'You have been logged out successfully.'),
        }
      } finally {
        clearToken()
      }
    },
  }
}
