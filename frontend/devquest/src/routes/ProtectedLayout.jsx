import { Navigate, useLocation } from 'react-router-dom'
import BaseLayout from '@/layouts/BaseLayout'
import { AUTH_TOKEN_KEY } from '@/constants/auth'

const getRedirectTarget = (location) => `${location.pathname}${location.search}${location.hash}`

export default function ProtectedLayout() {
  const location = useLocation()
  const token = localStorage.getItem(AUTH_TOKEN_KEY)

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          authNotice: {
            type: 'error',
            message: 'Please log in to continue.',
          },
          redirectTo: getRedirectTarget(location),
        }}
      />
    )
  }

  return <BaseLayout />
}
