import { delay, http, HttpResponse } from 'msw'
import {
  readDatabase,
  changeDatabase,
  resetDatabase,
  getConfig,
  isScenario,
  isLatency,
  listNfts,
} from './database'
import { ethToWei, isEthAmount } from '#/lib/eth'
import type { NftListResponse } from '#/api/nfts'
import { authHandlers } from './auth-handlers'
import { favoriteHandlers } from './favorite-handlers'
import { cartHandlers } from './cart-handlers'
import { checkoutHandlers } from './checkout-handlers'
import { accountHandlers } from './account-handlers'
import { realtimeHandler, publishNftUpdated } from './realtime'

function error(code: string, message: string, status: number) {
  return HttpResponse.json({ code, message }, { status })
}

async function safely(run: () => Response | Promise<Response>) {
  try {
    return await run()
  } catch {
    return error(
      'MOCK_STORAGE_ERROR',
      'Não foi possível acessar os dados simulados neste navegador.',
      503,
    )
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function positiveInteger(value: string): number | null {
  if (!/^[1-9]\d*$/.test(value)) return null
  const parsed = Number(value)
  return Number.isSafeInteger(parsed) ? parsed : null
}

function normalizeSearch(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
}

export const handlers = [
  realtimeHandler,
  ...authHandlers,
  ...favoriteHandlers,
  ...cartHandlers,
  ...checkoutHandlers,
  ...accountHandlers,
  http.get('/api/nfts', ({ request }) =>
    safely(async () => {
      const url = new URL(request.url)
      const min = url.searchParams.get('minPrice') ?? '0'
      const max =
        url.searchParams.get('maxPrice') ?? '999999999999.999999999999999999'
      const category = url.searchParams.get('category') ?? 'all'
      const search = url.searchParams.get('search') ?? ''
      const genre = url.searchParams.get('genre') ?? 'all'
      const network = url.searchParams.get('network') ?? 'all'
      const sort =
        url.searchParams.get('sort') ??
        (category === 'trending' ? 'price-desc' : 'recent')
      const page = positiveInteger(url.searchParams.get('page') ?? '1')
      const pageSize = positiveInteger(url.searchParams.get('pageSize') ?? '8')
      if (
        !isEthAmount(min) ||
        !isEthAmount(max) ||
        ethToWei(min) > ethToWei(max) ||
        !['all', 'new', 'trending'].includes(category) ||
        search.length > 120 ||
        !['all', 'arte-digital', 'fotografia', 'musica', 'arte-3d'].includes(
          genre,
        ) ||
        !['all', 'ethereum', 'polygon', 'solana'].includes(network) ||
        !['recent', 'price-asc', 'price-desc'].includes(sort) ||
        page === null ||
        pageSize === null ||
        pageSize > 50
      ) {
        return HttpResponse.json(
          { code: 'VALIDATION_ERROR', message: 'Filtros inválidos.' },
          { status: 422 },
        )
      }
      const before = readDatabase()
      const { scenario, latencyMs } = getConfig(before)
      await delay(latencyMs ?? (scenario === 'slow' ? 2500 : scenario === 'variable' ? (search.length % 2 ? 100 : 1400) : 50))
      const db = readDatabase()
      if (db.resetToken !== before.resetToken)
        return error(
          'SCENARIO_RESET',
          'O cenário foi reiniciado. Tente novamente.',
          409,
        )
      if (scenario === 'error') {
        return HttpResponse.json(
          {
            code: 'UNAVAILABLE',
            message: 'Catálogo temporariamente indisponível.',
          },
          { status: 503 },
        )
      }
      if (scenario === 'offline') return HttpResponse.error()
      const normalizedSearch = normalizeSearch(search.trim())
      const matchingOtherFilters =
        scenario === 'empty'
          ? []
          : listNfts(db).filter(
              (item) =>
                ethToWei(item.price) >= ethToWei(min) &&
                ethToWei(item.price) <= ethToWei(max) &&
                (category !== 'new' || item.isNew) &&
                (network === 'all' || item.network === network) &&
                normalizeSearch(item.name).includes(normalizedSearch),
            )
      const genreCounts: Record<string, number> = { all: matchingOtherFilters.length }
      for (const item of matchingOtherFilters)
        genreCounts[item.genre] = (genreCounts[item.genre] ?? 0) + 1
      const filtered = matchingOtherFilters.filter(
        (item) => genre === 'all' || item.genre === genre,
      )
      if (sort !== 'recent')
        filtered.sort((a, b) => {
          const aPrice = ethToWei(a.price)
          const bPrice = ethToWei(b.price)
          const difference = aPrice > bPrice ? 1 : aPrice < bPrice ? -1 : 0
          return (
            (sort === 'price-desc' ? -difference : difference) ||
            a.id.localeCompare(b.id)
          )
        })
      const total = filtered.length
      const items = filtered.slice((page - 1) * pageSize, page * pageSize)
      return HttpResponse.json<NftListResponse>({
        items,
        total,
        genreCounts,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      })
    }),
  ),
  http.get('/api/nfts/:id', ({ params }) =>
    safely(async () => {
      const before = readDatabase()
      const { scenario, latencyMs } = getConfig(before)
      await delay(latencyMs ?? (scenario === 'slow' ? 2500 : 50))
      const db = readDatabase()
      if (db.resetToken !== before.resetToken)
        return error(
          'SCENARIO_RESET',
          'O cenário foi reiniciado. Tente novamente.',
          409,
        )
      if (scenario === 'error')
        return error(
          'UNAVAILABLE',
          'Detalhes temporariamente indisponíveis.',
          503,
        )
      if (scenario === 'offline') return HttpResponse.error()
      const key = String(params.id)
      const nft =
        scenario === 'empty'
          ? undefined
          : listNfts(db).find((item) => item.id === key || item.name === key)
      if (!nft) return error('NOT_FOUND', 'NFT inexistente.', 404)
      return HttpResponse.json(nft)
    }),
  ),
  // Scenario administration exists only when MSW is enabled; no real backend.
  http.get('/api/__mock/state', () =>
    safely(() => {
      const db = readDatabase()
      return HttpResponse.json({
        schemaVersion: db.schemaVersion,
        revision: db.revision,
        config: getConfig(db),
        users: db.users.map((user) => ({
          id: user.id,
          email: user.email,
          name: user.profile.name,
        })),
        counts: {
          nfts: db.nfts.length,
          wallets: Object.keys(db.wallets).length,
          orders: Object.keys(db.orders).length,
          sessions: Object.keys(db.sessions).length,
        },
      })
    }),
  ),
  http.patch('/api/__mock/config', ({ request }) =>
    safely(async () => {
      const resetToken = readDatabase().resetToken
      const body: unknown = await request.json().catch(() => null)
      if (readDatabase().resetToken !== resetToken)
        return error(
          'SCENARIO_RESET',
          'O cenário foi reiniciado. Tente novamente.',
          409,
        )
      if (
        !isObject(body) ||
        !Object.keys(body).length ||
        Object.keys(body).some(
          (key) => !['scenario', 'latencyMs'].includes(key),
        ) ||
        ('scenario' in body && !isScenario(body.scenario)) ||
        ('latencyMs' in body && !isLatency(body.latencyMs))
      )
        return error(
          'VALIDATION_ERROR',
          'Configuração de cenário inválida.',
          422,
        )
      const db = changeDatabase((draft) => {
        if (isScenario(body.scenario)) draft.config.scenario = body.scenario
        if (isLatency(body.latencyMs)) draft.config.latencyMs = body.latencyMs
      })
      localStorage.removeItem('kurio-mock-scenario')
      return HttpResponse.json(db.config)
    }),
  ),
  http.patch('/api/__mock/nfts/:id', ({ request, params }) =>
    safely(async () => {
      const resetToken = readDatabase().resetToken
      const body: unknown = await request.json().catch(() => null)
      if (readDatabase().resetToken !== resetToken)
        return error(
          'SCENARIO_RESET',
          'O cenário foi reiniciado. Tente novamente.',
          409,
        )
      if (
        !isObject(body) ||
        (!('price' in body) && !('availableQuantity' in body)) ||
        Object.keys(body).some(
          (key) => !['price', 'availableQuantity', 'editionId'].includes(key),
        ) ||
        ('price' in body && !isEthAmount(body.price)) ||
        ('availableQuantity' in body &&
          (typeof body.availableQuantity !== 'number' ||
            !Number.isSafeInteger(body.availableQuantity) ||
            body.availableQuantity < 0)) ||
        ('editionId' in body && typeof body.editionId !== 'string')
      )
        return error('VALIDATION_ERROR', 'Preço ou quantidade inválidos.', 422)
      const nft = readDatabase().nfts.find((item) => item.id === params.id)
      if (!nft) return error('NOT_FOUND', 'NFT inexistente.', 404)
      const editionId = body.editionId ?? nft.editions[0].id
      if (!nft.editions.some((edition) => edition.id === editionId))
        return error('NOT_FOUND', 'Edição inexistente.', 404)
      const db = changeDatabase((draft) => {
        const item = draft.nfts.find((entry) => entry.id === params.id)!
        const edition = item.editions.find((entry) => entry.id === editionId)!
        if (isEthAmount(body.price)) edition.price = body.price
        if (typeof body.availableQuantity === 'number')
          edition.availableQuantity = body.availableQuantity
        edition.version += 1
        item.version += 1
      })
      const updated = listNfts(db).find((item) => item.id === params.id)!
      publishNftUpdated(updated)
      return HttpResponse.json(updated)
    }),
  ),
  http.post('/api/__mock/reset', () =>
    safely(() => {
      resetDatabase()
      return HttpResponse.json({ reset: true })
    }),
  ),
]
