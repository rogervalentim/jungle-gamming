import { useQuery } from '@tanstack/react-query'
import { api, queryClient } from './nfts'
import { getAuthToken, useAuthToken } from '#/lib/auth-token'
import { ethToWei, weiToEth } from '#/lib/eth'

export interface CartLine {
  key: string
  nftId: string
  editionId: string
  quantity: number
  name: string
  image: string
  edition: string
  price: string
  availableQuantity: number
  version: number
}

export interface CartResponse {
  items: CartLine[]
}

export interface QuoteResponse {
  quoteId: string
  expiresAt: string
  subtotal: string
  discount: string
  networkFee: string
  total: string
  coupon: string | null
}

const emptyCart: CartResponse = { items: [] }
const cartKey = (token: string | null) => ['cart', token ?? 'guest'] as const

function isCartResponse(value: unknown): value is CartResponse {
  return typeof value === 'object' && value !== null &&
    'items' in value && Array.isArray(value.items)
}

async function fetchCart(signal?: AbortSignal) {
  const response = await api.get<CartResponse>('/cart', { signal })
  if (!isCartResponse(response.data))
    throw new Error('Resposta inválida da API de carrinho. Ative os mocks ou configure o backend.')
  return response.data
}

export function useCartQuery() {
  const token = useAuthToken()
  return useQuery({
    queryKey: cartKey(token),
    queryFn: ({ signal }) => fetchCart(signal),
  })
}

export function useCart() {
  const data = useCartQuery().data
  return isCartResponse(data) ? data : emptyCart
}

export function getCart() {
  const data = queryClient.getQueryData<CartResponse>(cartKey(getAuthToken()))
  return isCartResponse(data) ? data : emptyCart
}

function acceptCart(cart: CartResponse) {
  if (!isCartResponse(cart))
    throw new Error('Resposta inválida da API de carrinho. Ative os mocks ou configure o backend.')
  queryClient.setQueryData(cartKey(getAuthToken()), cart)
  void queryClient.invalidateQueries({ queryKey: ['quote'] })
  return cart
}

export async function addToCart(
  nftId: string,
  editionId: string,
  quantity = 1,
) {
  const response = await api.post<CartResponse>('/cart/items', {
    nftId,
    editionId,
    quantity,
  })
  return acceptCart(response.data)
}

export async function setCartQuantity(line: CartLine, quantity: number) {
  const response = await api.put<CartResponse>('/cart/items', {
    nftId: line.nftId,
    editionId: line.editionId,
    quantity,
  })
  return acceptCart(response.data)
}

export async function changeQuantity(line: CartLine, delta: number) {
  return setCartQuantity(line, Math.max(0, line.quantity + delta))
}

export const cartItems = (cart: CartResponse) => cart.items
export const cartItemCount = (cart: CartResponse) =>
  cart.items.reduce((count, item) => count + item.quantity, 0)
export const cartSubtotal = (cart: CartResponse) =>
  weiToEth(
    cart.items.reduce(
      (total, item) =>
        total + ethToWei(item.price) * BigInt(item.quantity),
      0n,
    ),
  )
export const cartTotal = (cart: CartResponse) =>
  weiToEth(
    ethToWei(cartSubtotal(cart)) +
      (cart.items.length ? ethToWei('0.016') : 0n),
  )

export function useQuote(coupon = '') {
  const token = useAuthToken()
  const cart = useCart()
  return useQuery({
    queryKey: ['quote', token ?? 'guest', coupon],
    enabled: cart.items.length > 0,
    queryFn: async ({ signal }) =>
      (
        await api.get<QuoteResponse>('/checkout/quote', {
          params: { coupon },
          signal,
        })
      ).data,
  })
}
