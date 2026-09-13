import { http, HttpResponse } from 'msw'
import { ethToWei, weiToEth } from '#/lib/eth'
import { changeDatabase, readDatabase, listNfts } from './database'
import { respond, sessionFor } from './auth-handlers'
import { ownerCart } from './cart-handlers'
import { publishNftUpdated, publishOrderUpdated } from './realtime'
import type { MockDatabase, MockOrder } from './database'

const fail = (code: string, message: string, status: number) =>
  HttpResponse.json({ code, message }, { status })

const NETWORK_FEE = ethToWei('0.016')
const PROVIDERS = ['WalletConnect', 'MetaMask', 'Coinbase Wallet']

function applyConfirmedPurchase(db: MockDatabase, order: MockOrder) {
  for (const item of order.items) {
    const nft = db.nfts.find((entry) => entry.id === item.nftId)!
    const edition = nft.editions.find((entry) => entry.id === item.editionId)!
    edition.availableQuantity -= item.quantity
    edition.version += 1
    nft.version += 1
  }
  const cart = db.userData[order.userId].cartItems
  for (const item of order.items) {
    const line = cart.find((entry) =>
      entry.nftId === item.nftId && entry.editionId === item.editionId)
    if (line) line.quantity -= item.quantity
  }
  db.userData[order.userId].cartItems = cart.filter((item) => item.quantity > 0)
}

function settlePendingOrder(id: string): MockOrder | null {
  if (!(id in readDatabase().orders)) return null
  const current = readDatabase().orders[id]
  if (current.status !== 'pending' ||
      !current.settleAt || Date.now() < current.settleAt) return current
  const db = changeDatabase((draft) => {
    const order = draft.orders[id]
    if (order.status !== 'pending') return
    const available = order.items.every((item) => {
      const edition = draft.nfts.find((nft) => nft.id === item.nftId)
        ?.editions.find((entry) => entry.id === item.editionId)
      return edition && edition.availableQuantity >= item.quantity
    })
    order.status = available ? 'confirmed' : 'declined'
    order.version += 1
    if (available) applyConfirmedPurchase(draft, order)
  })
  const settled = db.orders[id]
  publishOrderUpdated(settled)
  for (const item of settled.items) {
    const nft = listNfts(db).find((entry) => entry.id === item.nftId)
    if (nft) publishNftUpdated(nft)
  }
  return settled
}

interface Quote {
  hash: string
  items: MockOrder['items']
  subtotal: string
  discount: string
  networkFee: string
  total: string
  coupon: string | null
}

function cartOwner(request: Request, db: MockDatabase) {
  const auth = request.headers.get('authorization')
  const session = sessionFor(request, db)
  if (auth && !session) return null
  return session?.user.id ?? 'guest'
}

async function quoteFor(
  db: MockDatabase,
  userId: string,
  coupon: string,
): Promise<{ error: Response } | Quote> {
  const cart = ownerCart(db, userId)
  if (!cart.length)
    return { error: fail('EMPTY_CART', 'O carrinho está vazio.', 422) }
  if (coupon && coupon !== 'KURIO10')
    return {
      error: fail(
        coupon === 'EXPIRADO' ? 'COUPON_EXPIRED' : 'COUPON_INVALID',
        coupon === 'EXPIRADO'
          ? 'Este cupom expirou.'
          : 'Cupom não encontrado.',
        422,
      ),
    }
  let subtotalWei = 0n
  const items: MockOrder['items'] = []
  const versions: Array<[string, string, number, number]> = []
  for (const item of cart) {
    const nft = db.nfts.find((candidate) => candidate.id === item.nftId)
    const edition = nft?.editions.find(
      (candidate) => candidate.id === item.editionId,
    )
    if (!nft || !edition || item.quantity > edition.availableQuantity)
      return {
        error: fail(
          'OUT_OF_STOCK',
          'O estoque mudou. Revise o carrinho antes de continuar.',
          409,
        ),
      }
    subtotalWei += ethToWei(edition.price) * BigInt(item.quantity)
    items.push({
      nftId: item.nftId,
      editionId: item.editionId,
      quantity: item.quantity,
      name: nft.name,
      price: edition.price,
    })
    versions.push([
      item.nftId,
      item.editionId,
      item.quantity,
      edition.version,
    ])
  }
  const discountWei = coupon ? subtotalWei / 10n : 0n
  const totalWei = subtotalWei - discountWei + NETWORK_FEE
  const fingerprint = JSON.stringify({ userId, versions, coupon })
  const bytes = new TextEncoder().encode(fingerprint)
  const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)),
    (byte) => byte.toString(16).padStart(2, '0')).join('')
  return {
    hash,
    items,
    subtotal: weiToEth(subtotalWei),
    discount: weiToEth(discountWei),
    networkFee: weiToEth(NETWORK_FEE),
    total: weiToEth(totalWei),
    coupon: coupon || null,
  }
}

export const checkoutHandlers = [
  http.get('/api/checkout/quote', ({ request }) =>
    respond(async (db) => {
      const userId = cartOwner(request, db)
      if (!userId) return fail('SESSION_INVALID', 'Sessão inválida.', 401)
      const coupon = new URL(request.url).searchParams.get('coupon')?.trim().toUpperCase() ?? ''
      const quote = await quoteFor(db, userId, coupon)
      if ('error' in quote) return quote.error
      const expiresAt = Date.now() + 5 * 60_000
      return HttpResponse.json({
        ...quote,
        quoteId: `${quote.hash}.${expiresAt}`,
        expiresAt: new Date(expiresAt).toISOString(),
      })
    }),
  ),
  http.get('/api/orders', ({ request }) =>
    respond((db) => {
      const session = sessionFor(request, db)
      if (!session) return fail('SESSION_INVALID', 'Entre para ver pedidos.', 401)
      for (const id of db.userData[session.user.id].orderIds) settlePendingOrder(id)
      const current = readDatabase()
      return HttpResponse.json({
        items: current.userData[session.user.id].orderIds.map((id) => current.orders[id]),
      })
    }),
  ),
  http.get('/api/orders/:id', ({ request, params }) =>
    respond((db) => {
      const session = sessionFor(request, db)
      if (!session) return fail('SESSION_INVALID', 'Entre para ver pedidos.', 401)
      const order = db.orders[String(params.id)]
      if (!(String(params.id) in db.orders)) return fail('NOT_FOUND', 'Pedido não encontrado.', 404)
      if (order.userId !== session.user.id)
        return fail('FORBIDDEN', 'Este pedido pertence a outra conta.', 403)
      return HttpResponse.json(settlePendingOrder(order.id))
    }),
  ),
  http.post('/api/orders', ({ request }) =>
    respond(async (db) => {
      const session = sessionFor(request, db)
      if (!session) return fail('SESSION_INVALID', 'Entre para comprar.', 401)
      const body: unknown = await request.json().catch(() => null)
      if (
        typeof body !== 'object' ||
        body === null ||
        !('idempotencyKey' in body) ||
        !('quoteId' in body) ||
        !('walletId' in body) ||
        !('provider' in body) ||
        typeof body.idempotencyKey !== 'string' ||
        typeof body.quoteId !== 'string' ||
        typeof body.walletId !== 'string' ||
        typeof body.provider !== 'string' ||
        !PROVIDERS.includes(body.provider)
      )
        return fail('VALIDATION_ERROR', 'Dados do pedido inválidos.', 422)
      const existing = Object.values(db.orders).find(
        (order) =>
          order.userId === session.user.id &&
          order.idempotencyKey === body.idempotencyKey,
      )
      if (existing)
        return existing.quoteId === body.quoteId &&
          existing.walletId === body.walletId &&
          existing.provider === body.provider
          ? HttpResponse.json(settlePendingOrder(existing.id))
          : fail('IDEMPOTENCY_CONFLICT', 'Esta tentativa já tem outro conteúdo.', 409)
      const wallet = db.wallets[body.walletId]
      if (!(body.walletId in db.wallets) || wallet.userId !== session.user.id)
        return fail('WALLET_REQUIRED', 'Cadastre e selecione uma carteira.', 422)
      const [hash, expiry] = body.quoteId.split('.')
      const coupon = new URL(request.url).searchParams.get('coupon')?.trim().toUpperCase() ?? ''
      const quote = await quoteFor(db, session.user.id, coupon)
      if ('error' in quote) return quote.error
      if (
        hash !== quote.hash ||
        !/^\d+$/.test(expiry) ||
        Date.now() > Number(expiry)
      )
        return fail('QUOTE_CHANGED', 'A cotação mudou. Revise os valores.', 409)
      const order: MockOrder = {
        id: crypto.randomUUID(),
        userId: session.user.id,
        idempotencyKey: body.idempotencyKey,
        quoteId: body.quoteId,
        walletId: body.walletId,
        provider: body.provider,
        version: 1,
        status: db.config.scenario === 'declined' ? 'declined' :
          db.config.scenario === 'pending' || db.config.scenario === 'timeout'
            ? 'pending' : 'confirmed',
        settleAt: db.config.scenario === 'pending' || db.config.scenario === 'timeout'
          ? Date.now() + 2000 : undefined,
        createdAt: new Date().toISOString(),
        items: quote.items,
        subtotal: quote.subtotal,
        discount: quote.discount,
        networkFee: quote.networkFee,
        total: quote.total,
      }
      changeDatabase((draft) => {
        draft.orders[order.id] = order
        draft.userData[session.user.id].orderIds.push(order.id)
        if (order.status === 'confirmed') applyConfirmedPurchase(draft, order)
      })
      publishOrderUpdated(order)
      if (order.status === 'confirmed') {
        const current = readDatabase()
        for (const item of order.items) {
          const nft = listNfts(current).find((entry) => entry.id === item.nftId)
          if (nft) publishNftUpdated(nft)
        }
      }
      if (order.status === 'pending') {
        window.setTimeout(() => settlePendingOrder(order.id), 2100)
      }
      if (db.config.scenario === 'timeout') return HttpResponse.error()
      return HttpResponse.json(order, { status: 201 })
    }),
  ),
]
