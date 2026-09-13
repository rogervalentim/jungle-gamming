import { redirect } from '@tanstack/react-router'
import axios from 'axios'
import { api, queryClient } from '#/api/nfts'
import { getAuthToken, setAuthToken } from '#/lib/auth-token'
import type { AuthUser } from '#/api/auth'

export async function requireSession({
  location,
}: {
  location: { href: string }
}) {
  const token = getAuthToken()
  if (!token) throw redirect({ to: '/login', search: { next: location.href } })
  try {
    const response = await api.get<{ user: AuthUser; expiresAt: string }>(
      '/auth/session',
    )
    queryClient.setQueryData(['auth', 'session', token], response.data)
    return response.data.user
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      queryClient.clear()
      setAuthToken(null)
      throw redirect({ to: '/login', search: { next: location.href } })
    }
    throw error
  }
}
