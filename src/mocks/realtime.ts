import { ws } from 'msw'
import { toSocketIo } from '@mswjs/socket.io-binding'
import type { NftDto } from '#/api/nfts'
import type { MockOrder } from './database'
import { readDatabase } from './database'

const socketLink = ws.link(/^wss?:\/\/[^/]+\/?$/)
type BoundClient = ReturnType<typeof toSocketIo>['client']
const clients = new Set<{ connection: BoundClient; userId: string | null }>()

export const realtimeHandler = socketLink.addEventListener('connection', (raw) => {
  const bound = toSocketIo(raw)
  const client = { connection: bound.client, userId: null as string | null }
  clients.add(client)
  raw.client.addEventListener('close', () => clients.delete(client))

  bound.client.on('subscribe', (_event, payload: unknown) => {
    const token =
      typeof payload === 'object' && payload !== null && 'token' in payload &&
      typeof payload.token === 'string' ? payload.token : null
    const db = readDatabase()
    const session = token ? db.sessions[token] : null
    client.userId = session && Date.parse(session.expiresAt) > Date.now()
      ? session.userId : null
    bound.client.emit('subscribed', { revision: db.revision })
  })
})

export function publishNftUpdated(nft: NftDto) {
  const event = { id: nft.id, version: nft.version, nft }
  for (const client of clients) client.connection.emit('nft.updated', event)
}

export function publishOrderUpdated(order: MockOrder) {
  const event = {
    id: order.id,
    userId: order.userId,
    version: order.version,
    order,
  }
  for (const client of clients) {
    if (client.userId === order.userId)
      client.connection.emit('order.updated', event)
  }
}
