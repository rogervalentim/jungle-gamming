import { ethToWei, isEthAmount } from './eth'

export const genres = [
  { value: 'all', label: 'Todas as coleções' },
  { value: 'arte-digital', label: 'Arte digital' },
  { value: 'fotografia', label: 'Fotografia' },
  { value: 'musica', label: 'Música' },
  { value: 'arte-3d', label: 'Arte 3D' },
] as const

export const networks = [
  { value: 'all', label: 'Todas as redes' },
  { value: 'ethereum', label: 'Ethereum' },
  { value: 'polygon', label: 'Polygon' },
  { value: 'solana', label: 'Solana' },
] as const

export const sorts = [
  { value: 'recent', label: 'Listados recentemente' },
  { value: 'price-asc', label: 'Menor preço' },
  { value: 'price-desc', label: 'Maior preço' },
] as const

export type Genre = (typeof genres)[number]['value']
export type Network = (typeof networks)[number]['value']
export type Sort = (typeof sorts)[number]['value']
export type Category = 'all' | 'new' | 'trending'

export interface CatalogSearch {
  q: string
  genre: Genre
  network: Network
  category: Category
  sort: Sort
  minPrice: string
  maxPrice: string
  page: number
}

export const defaultCatalogSearch: CatalogSearch = {
  q: '',
  genre: 'all',
  network: 'all',
  category: 'all',
  sort: 'recent',
  minPrice: '0.02',
  maxPrice: '12.3',
  page: 1,
}

// Preserva valores monetários da URL como texto antes de qualquer conversão numérica.
export function parseRouterSearch(
  searchString: string,
): Record<string, string> {
  return Object.fromEntries(new URLSearchParams(searchString))
}

function object(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function among<T extends string>(
  value: unknown,
  choices: readonly T[],
  fallback: T,
): T {
  return typeof value === 'string' && choices.includes(value as T)
    ? (value as T)
    : fallback
}

export function parseCatalogSearch(raw: unknown): CatalogSearch {
  const input = object(raw)
  const min = isEthAmount(input.minPrice)
    ? input.minPrice
    : defaultCatalogSearch.minPrice
  const max = isEthAmount(input.maxPrice)
    ? input.maxPrice
    : defaultCatalogSearch.maxPrice
  const validRange = ethToWei(min) <= ethToWei(max)
  const page =
    typeof input.page === 'number'
      ? input.page
      : typeof input.page === 'string' && /^\d+$/.test(input.page)
        ? Number(input.page)
        : 1
  return {
    q: typeof input.q === 'string' ? input.q.slice(0, 100) : '',
    genre: among(
      input.genre,
      genres.map((item) => item.value),
      'all',
    ),
    network: among(
      input.network,
      networks.map((item) => item.value),
      'all',
    ),
    category: among(input.category, ['all', 'new', 'trending'], 'all'),
    sort: among(
      input.sort,
      sorts.map((item) => item.value),
      'recent',
    ),
    minPrice: validRange ? min : defaultCatalogSearch.minPrice,
    maxPrice: validRange ? max : defaultCatalogSearch.maxPrice,
    page: Number.isSafeInteger(page) && page >= 1 ? page : 1,
  }
}

export function catalogParams(search: CatalogSearch) {
  return {
    minPrice: search.minPrice,
    maxPrice: search.maxPrice,
    category: search.category,
    search: search.q.trim(),
    genre: search.genre,
    network: search.network,
    sort: search.sort,
    page: search.page,
    pageSize: 8,
  }
}
