import { http, HttpResponse } from 'msw'
import { changeDatabase, listNfts } from './database'
import { respond, sessionFor } from './auth-handlers'
import type { MockCartItem, MockDatabase } from './database'

const fail = (code: string, message: string, status: number) =>
  HttpResponse.json({ code, message }, { status })

function owner(request: Request, db: MockDatabase) {
  const authorization = request.headers.get('authorization')
  const session = sessionFor(request, db)
  if (authorization && !session) return null
  return session?.user.id ?? 'guest'
}

export function ownerCart(db: MockDatabase, userId: string) {
  return userId === 'guest' ? db.guestCart : db.userData[userId].cartItems
}

export function cartResponse(db: MockDatabase, userId: string) {
  const nfts = listNfts(db)
  return {
    items: ownerCart(db, userId).map((item) => {
      const nft = nfts.find((candidate) => candidate.id === item.nftId)!
      const edition = nft.editions.find(
        (candidate) => candidate.id === item.editionId,
      )!
      return {
        ...item,
        key: `${item.nftId}:${item.editionId}`,
        name: nft.name,
        image: nft.image,
        edition: edition.label,
        price: edition.price,
        availableQuantity: edition.availableQuantity,
        version: edition.version,
      }
    }),
  }
}

export function mergeGuestCart(draft: MockDatabase, userId: string) {
  const destination = draft.userData[userId].cartItems
  for (const guest of draft.guestCart) {
    const edition = draft.nfts
      .find((nft) => nft.id === guest.nftId)
      ?.editions.find((item) => item.id === guest.editionId)
    if (!edition) continue
    const existing = destination.find(
      (item) =>
        item.nftId === guest.nftId && item.editionId === guest.editionId,
    )
    const quantity = Math.min(
      edition.availableQuantity,
      (existing?.quantity ?? 0) + guest.quantity,
    )
    if (existing) existing.quantity = quantity
    else if (quantity > 0) destination.push({ ...guest, quantity })
  }
  draft.userData[userId].cartItems = destination.filter(
    (item) => item.quantity > 0,
  )
  draft.guestCart = []
}

function parseItem(value: unknown): MockCartItem | null {
  if (
    typeof value !== 'object' ||
    value === null ||
    !('nftId' in value) ||
    !('editionId' in value) ||
    !('quantity' in value) ||
    typeof value.nftId !== 'string' ||
    typeof value.editionId !== 'string' ||
    typeof value.quantity !== 'number' ||
    !Number.isSafeInteger(value.quantity) ||
    value.quantity < 0
  )
    return null
  return {
    nftId: value.nftId,
    editionId: value.editionId,
    quantity: value.quantity,
  }
}

function saveItem(
  db: MockDatabase,
  userId: string,
  item: MockCartItem,
  add: boolean,
) {
  const nft = db.nfts.find((candidate) => candidate.id === item.nftId)
  const edition = nft?.editions.find(
    (candidate) => candidate.id === item.editionId,
  )
  if (!edition) return fail('NOT_FOUND', 'NFT ou edição não encontrado.', 404)
  const current = ownerCart(db, userId).find(
    (candidate) =>
      candidate.nftId === item.nftId && candidate.editionId === item.editionId,
  )
  const quantity = add ? (current?.quantity ?? 0) + item.quantity : item.quantity
  if (!Number.isSafeInteger(quantity) || quantity > edition.availableQuantity)
    return fail('OUT_OF_STOCK', 'Quantidade indisponível nesta edição.', 409)
  const next = changeDatabase((draft) => {
    const cart = ownerCart(draft, userId)
    const index = cart.findIndex(
      (candidate) =>
        candidate.nftId === item.nftId && candidate.editionId === item.editionId,
    )
    if (index >= 0 && quantity === 0) cart.splice(index, 1)
    else if (index >= 0) cart[index].quantity = quantity
    else if (quantity > 0) cart.push({ ...item, quantity })
  })
  return HttpResponse.json(cartResponse(next, userId))
}

export const cartHandlers = [
  http.get('/api/cart', ({ request }) =>
    respond((db) => {
      const userId = owner(request, db)
      return userId
        ? HttpResponse.json(cartResponse(db, userId))
        : fail('SESSION_INVALID', 'Sessão inválida.', 401)
    }),
  ),
  http.post('/api/cart/items', ({ request }) =>
    respond(async (db) => {
      const userId = owner(request, db)
      if (!userId) return fail('SESSION_INVALID', 'Sessão inválida.', 401)
      const item = parseItem(await request.json().catch(() => null))
      if (!item || item.quantity < 1)
        return fail('VALIDATION_ERROR', 'Item inválido.', 422)
      return saveItem(db, userId, item, true)
    }),
  ),
  http.put('/api/cart/items', ({ request }) =>
    respond(async (db) => {
      const userId = owner(request, db)
      if (!userId) return fail('SESSION_INVALID', 'Sessão inválida.', 401)
      const item = parseItem(await request.json().catch(() => null))
      if (!item) return fail('VALIDATION_ERROR', 'Item inválido.', 422)
      return saveItem(db, userId, item, false)
    }),
  ),
]
