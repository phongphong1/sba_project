import authApi from '@/api/authApi'
import { AUTH_TOKEN_KEY } from '@/constants/auth'

const persistToken = (token) => localStorage.setItem(AUTH_TOKEN_KEY, token)

const resolveToken = (payload) => payload?.token ?? payload?.jwt ?? payload?.accessToken

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
  }
}
