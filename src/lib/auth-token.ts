import { useSyncExternalStore } from 'react'

export const AUTH_TOKEN_KEY = 'kurio-auth-token'
const eventName = 'kurio-auth-change'

let token =
  typeof window === 'undefined' ? null : localStorage.getItem(AUTH_TOKEN_KEY)

export const getAuthToken = () => token

export function setAuthToken(next: string | null) {
  token = next
  if (next) localStorage.setItem(AUTH_TOKEN_KEY, next)
  else localStorage.removeItem(AUTH_TOKEN_KEY)
  window.dispatchEvent(new Event(eventName))
}

function subscribe(callback: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== AUTH_TOKEN_KEY) return
    token = event.newValue
    callback()
  }
  window.addEventListener(eventName, callback)
  window.addEventListener('storage', onStorage)
  return () => {
    window.removeEventListener(eventName, callback)
    window.removeEventListener('storage', onStorage)
  }
}

export const useAuthToken = () =>
  useSyncExternalStore(subscribe, getAuthToken, () => null)
