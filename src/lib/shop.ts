import { useSyncExternalStore } from 'react'
import emerald from '#/assets/hero-image.webp'
import violet from '#/assets/card-feature.webp'
import ivory from '#/assets/image-3.webp'
import golden from '#/assets/image-4.webp'

export const catalog = [
  { name: 'Emerald Ape #042', price: 1.19, edition: '1/50', image: emerald },
  { name: 'Violet Nomad #314', price: 1.39, edition: '1/1', image: violet },
  { name: 'Ivory Baron #088', price: 3.58, edition: '1/10', image: ivory },
  { name: 'Golden Beat #207', price: 1.98, edition: '1/50', image: golden },
  { name: 'Sage Nomad #009', price: 1.69, edition: '1/1', image: violet },
  { name: 'Neon Vessel #552', price: 1.99, edition: '1/10', image: ivory },
  { name: 'Cosmic Bloom #118', price: 1.29, edition: '1/50', image: violet },
  { name: 'Golden Signal #160', price: 0.39, edition: '1/50', image: golden },
] as const

export type Cart = Record<string, number>
const key = 'kurio-cart-v2'
const eventName = 'kurio-cart-change'
const initialCart: Cart = {
  'Emerald Ape #042': 1,
  'Violet Nomad #314': 1,
  'Ivory Baron #088': 2,
  'Golden Beat #207': 2,
}

function loadCart(): Cart {
  if (typeof window === 'undefined') return initialCart
  try {
    const saved = localStorage.getItem(key)
    if (saved) return JSON.parse(saved) as Cart
    const older = JSON.parse(localStorage.getItem('kurio-cart') || 'null') as number[] | null
    if (Array.isArray(older)) {
      return Object.fromEntries(catalog.slice(0, 4).map((item, index) => [item.name, older[index] || 0]))
    }
  } catch { /* use initial cart */ }
  return initialCart
}

let snapshot = loadCart()
export const getCart = () => snapshot
const subscribe = (callback: () => void) => {
  addEventListener(eventName, callback)
  return () => removeEventListener(eventName, callback)
}
export const useCart = () => useSyncExternalStore(subscribe, getCart, () => initialCart)

export function setCart(next: Cart) {
  snapshot = next
  localStorage.setItem(key, JSON.stringify(next))
  dispatchEvent(new Event(eventName))
}

export function changeQuantity(name: string, delta: number) {
  setCart({ ...snapshot, [name]: Math.max(0, (snapshot[name] || 0) + delta) })
}

export function addToCart(name: string, quantity = 1) {
  changeQuantity(name, quantity)
}

export const cartItems = (cart: Cart) => catalog.filter(item => (cart[item.name] || 0) > 0)
export const cartItemCount = (cart: Cart) => catalog.reduce((count, item) => {
  const quantity = cart[item.name]
  return count + (Number.isSafeInteger(quantity) && quantity > 0 ? quantity : 0)
}, 0)
export const cartSubtotal = (cart: Cart) => cartItems(cart).reduce((total, item) => total + item.price * cart[item.name], 0)
export const cartTotal = (cart: Cart) => cartSubtotal(cart) + (cartSubtotal(cart) > 0 ? 0.016 : 0)

const favoriteKey = 'kurio-favorites'
export function getFavorites(): string[] {
  try { return JSON.parse(localStorage.getItem(favoriteKey) || '[]') as string[] } catch { return [] }
}
export function toggleFavorite(name: string) {
  const current = getFavorites()
  const next = current.includes(name) ? current.filter(item => item !== name) : [...current, name]
  localStorage.setItem(favoriteKey, JSON.stringify(next))
  dispatchEvent(new Event('kurio-favorites-change'))
  return next.includes(name)
}
