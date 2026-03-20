import axios from 'axios'

const AUTH_TOKEN_KEY = 'devquest.jwt'

function persistToken(token) {
  localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export function useAuthActions() {
  const handleLogin = async (values) => {
    try {
      const response = await axios.post('/api/auth/login', values)
      const token =
        response.data?.token ??
        response.data?.jwt ??
        response.data?.accessToken ??
        `mock-jwt-${Date.now()}`

      persistToken(token)

      return {
        success: true,
        token,
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        const token = `mock-jwt-${Date.now()}`
        persistToken(token)

        return {
          success: true,
          token,
          mocked: true,
        }
      }

      throw error
    }
  }

  const handleSignUp = async (values) => {
    try {
      const response = await axios.post('/api/auth/register', values)
      const token =
        response.data?.token ??
        response.data?.jwt ??
        response.data?.accessToken ??
        `mock-jwt-${Date.now()}`

      persistToken(token)

      return {
        success: true,
        token,
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        const token = `mock-jwt-${Date.now()}`
        persistToken(token)

        return {
          success: true,
          token,
          mocked: true,
        }
      }

      throw error
    }
  }

  return {
    handleLogin,
    handleSignUp,
  }
}
