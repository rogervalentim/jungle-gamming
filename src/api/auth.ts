import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { api, queryClient } from './nfts'
import { setAuthToken, useAuthToken } from '#/lib/auth-token'

export interface AuthUser {
  id: string
  email: string
  profile: { name: string; avatar: string | null }
}

interface SessionResponse {
  user: AuthUser
  expiresAt: string
}

interface AuthResponse extends SessionResponse {
  token: string
}

function acceptSession(session: AuthResponse) {
  queryClient.clear()
  setAuthToken(session.token)
  queryClient.setQueryData<SessionResponse>(
    ['auth', 'session', session.token],
    { user: session.user, expiresAt: session.expiresAt },
  )
  return session.user
}

export async function login(email: string, password: string) {
  const response = await api.post<AuthResponse>('/auth/login', {
    email,
    password,
  })
  return acceptSession(response.data)
}

export async function register(name: string, email: string, password: string) {
  const response = await api.post<AuthResponse>('/auth/register', {
    name,
    email,
    password,
  })
  return acceptSession(response.data)
}

export async function logout() {
  try {
    await api.post('/auth/logout')
  } finally {
    queryClient.clear()
    setAuthToken(null)
  }
}

export function useSession() {
  const token = useAuthToken()
  const query = useQuery({
    queryKey: ['auth', 'session', token],
    enabled: Boolean(token),
    queryFn: async ({ signal }) => {
      const response = await api.get<SessionResponse>('/auth/session', {
        signal,
      })
      return response.data
    },
    staleTime: 0,
    retry: false,
    refetchOnWindowFocus: true,
  })

  useEffect(() => {
    if (!token || !query.data) return
    const remaining = Date.parse(query.data.expiresAt) - Date.now()
    if (remaining <= 0) {
      queryClient.clear()
      setAuthToken(null)
      return
    }
    const timeout = window.setTimeout(() => {
      queryClient.clear()
      setAuthToken(null)
    }, remaining)
    return () => window.clearTimeout(timeout)
  }, [token, query.data])

  useEffect(() => {
    if (
      token &&
      query.isError &&
      axios.isAxiosError(query.error) &&
      query.error.response?.status === 401
    ) {
      queryClient.clear()
      setAuthToken(null)
    }
  }, [token, query.isError, query.error])

  return {
    user: token ? (query.data?.user ?? null) : null,
    isLoading: Boolean(token) && query.isPending,
    isError: Boolean(token) && query.isError,
  }
}

export function authErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as { message?: unknown } | undefined)
      ?.message
    if (typeof message === 'string') return message
  }
  return 'Não foi possível concluir a solicitação. Tente novamente.'
}
