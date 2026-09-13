import { useSyncExternalStore } from 'react'
import type { Socket } from 'socket.io-client'
import { queryClient } from '#/api/nfts'
import { getAuthToken } from './auth-token'
import type { NftDto } from '#/api/nfts'
import type { Order } from '#/api/orders'

interface NftEvent { id: string; version: number; nft: NftDto }
interface OrderEvent { id: string; userId: string; version: number; order: Order }

let activeSocket: Socket | null = null
let notice = ''
const noticeSubscribers = new Set<() => void>()
const nftVersions = new Map<string, number>()
const orderVersions = new Map<string, number>()

function setNotice(value: string) {
  notice = value
  noticeSubscribers.forEach((subscriber) => subscriber())
}

export function useRealtimeNotice() {
  return useSyncExternalStore(
    (subscriber) => {
      noticeSubscribers.add(subscriber)
      return () => { noticeSubscribers.delete(subscriber) }
    },
    () => notice,
    () => '',
  )
}

export async function connectRealtime(token: string | null) {
  // Import after MSW starts so Engine.IO captures its intercepted WebSocket.
  const { io } = await import('socket.io-client')
  const socket = io(window.location.origin, {
    path: '/socket.io',
    transports: ['websocket'],
    reconnection: true,
    autoConnect: true,
  })
  activeSocket = socket

  const reconcile = () => {
    if (getAuthToken() !== token) return
    socket.emit('subscribe', { token })
    void Promise.all([
      queryClient.invalidateQueries({ queryKey: ['nfts'] }),
      queryClient.invalidateQueries({ queryKey: ['cart'] }),
      queryClient.invalidateQueries({ queryKey: ['quote'] }),
      queryClient.invalidateQueries({ queryKey: ['orders'] }),
    ])
  }

  socket.on('connect', reconcile)
  socket.on('nft.updated', (event: NftEvent) => {
    if (getAuthToken() !== token || event.id !== event.nft.id ||
        !Number.isSafeInteger(event.version)) return
    const currentVersion = nftVersions.get(event.id) ?? 0
    if (event.version <= currentVersion) return
    nftVersions.set(event.id, event.version)
    setNotice('O preço ou a disponibilidade de um NFT mudou. Revise o carrinho e a cotação.')
    void Promise.all([
      queryClient.invalidateQueries({ queryKey: ['nfts'] }),
      queryClient.invalidateQueries({ queryKey: ['cart'] }),
      queryClient.invalidateQueries({ queryKey: ['quote'] }),
    ])
  })
  socket.on('order.updated', (event: OrderEvent) => {
    if (getAuthToken() !== token || !token ||
        event.id !== event.order.id || event.userId !== event.order.userId ||
        !Number.isSafeInteger(event.version)) return
    const currentVersion = orderVersions.get(event.id) ?? 0
    if (event.version <= currentVersion) return
    orderVersions.set(event.id, event.version)
    queryClient.setQueryData(['orders', token, event.id], event.order)
    void queryClient.invalidateQueries({ queryKey: ['orders', token] })
  })

  window.kurioRealtime = {
    connected: () => socket.connected,
    nftVersion: (id: string) => nftVersions.get(id) ?? 0,
    orderVersion: (id: string) => orderVersions.get(id) ?? 0,
    disconnect: () => socket.disconnect(),
    connect: () => socket.connect(),
  }
  return () => {
    socket.removeAllListeners()
    socket.disconnect()
    if (activeSocket === socket) activeSocket = null
    delete window.kurioRealtime
  }
}

declare global {
  interface Window {
    kurioRealtime?: {
      connected: () => boolean
      nftVersion: (id: string) => number
      orderVersion: (id: string) => number
      disconnect: () => void
      connect: () => void
    }
  }
}
