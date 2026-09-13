import { useQuery } from '@tanstack/react-query'
import { api, queryClient } from './nfts'
import { getAuthToken, useAuthToken } from '#/lib/auth-token'
import axios from 'axios'

export interface Order {
  id: string
  userId: string
  idempotencyKey: string
  quoteId: string
  walletId: string
  provider: string
  version: number
  status: 'pending' | 'confirmed' | 'declined'
  settleAt?: number
  createdAt: string
  items: Array<{
    nftId: string
    editionId: string
    quantity: number
    name: string
    price: string
  }>
  subtotal: string
  discount: string
  networkFee: string
  total: string
}

interface OrderAttempt {
  token: string
  input: {
    idempotencyKey: string
    quoteId: string
    walletId: string
    provider: string
    coupon: string
  }
}

const attemptKey = 'kurio-order-attempt'

function savedAttempt(): OrderAttempt | null {
  try {
    const parsed: unknown = JSON.parse(sessionStorage.getItem(attemptKey) ?? 'null')
    if (typeof parsed !== 'object' || parsed === null || !('token' in parsed) ||
        !('input' in parsed) || typeof parsed.token !== 'string' ||
        typeof parsed.input !== 'object' || parsed.input === null ||
        !('idempotencyKey' in parsed.input) ||
        typeof parsed.input.idempotencyKey !== 'string') return null
    return parsed as OrderAttempt
  } catch { return null }
}

export async function recoverOrderAttempt(): Promise<Order | null> {
  const attempt = savedAttempt()
  if (!attempt || attempt.token !== getAuthToken()) return null
  const response = await api.get<{ items: Order[] }>('/orders')
  const order = response.data.items.find((item) =>
    item.idempotencyKey === attempt.input.idempotencyKey)
  if (order) sessionStorage.removeItem(attemptKey)
  return order ?? null
}

export function useOrder(id: string | null) {
  const token = useAuthToken()
  return useQuery({
    queryKey: ['orders', token, id],
    enabled: Boolean(token && id),
    queryFn: async ({ signal }) =>
      (await api.get<Order>(`/orders/${encodeURIComponent(id ?? '')}`, { signal })).data,
    refetchInterval: (query) => query.state.data?.status === 'pending' ? 1000 : false,
  })
}

export function useOrders() {
  const token = useAuthToken()
  return useQuery({
    queryKey: ['orders', token],
    enabled: Boolean(token),
    queryFn: async ({ signal }) =>
      (await api.get<{ items: Order[] }>('/orders', { signal })).data,
  })
}

export async function createOrder(input: {
  idempotencyKey: string
  quoteId: string
  walletId: string
  provider: string
  coupon: string
}) {
  const token = getAuthToken()
  const previous = savedAttempt()
  if (previous?.token === token) {
    try {
      const recovered = await recoverOrderAttempt()
      if (recovered) return recovered
    } catch { /* retry the same attempt after a transient failure */ }
  }
  const submission = previous?.token === token ? previous.input : input
  if (token) sessionStorage.setItem(attemptKey, JSON.stringify({ token, input: submission }))
  let order: Order
  try {
    const response = await api.post<Order>('/orders', submission, {
      params: { coupon: submission.coupon },
    })
    order = response.data
    sessionStorage.removeItem(attemptKey)
  } catch (error) {
    try {
      const recovered = await recoverOrderAttempt()
      if (recovered) order = recovered
      else throw error
    } catch {
      if (axios.isAxiosError(error) && error.response?.status === 409)
        sessionStorage.removeItem(attemptKey)
      throw error
    }
  }
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: ['orders'] }),
    queryClient.invalidateQueries({ queryKey: ['cart'] }),
    queryClient.invalidateQueries({ queryKey: ['quote'] }),
    queryClient.invalidateQueries({ queryKey: ['nfts'] }),
  ])
  return order
}
