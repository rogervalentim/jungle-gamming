import axios from 'axios'
import { QueryClient, queryOptions } from '@tanstack/react-query'
import { getAuthToken } from '#/lib/auth-token'

export interface NftDto {
  id: string
  name: string
  price: string
  currency: 'ETH'
  image: string
  edition: string
  isNew: boolean
  genre: string
  network: string
  editionId: string
  availableQuantity: number
  version: number
  editions: {
    id: string
    label: string
    price: string
    availableQuantity: number
    version: number
  }[]
}

export interface NftListResponse {
  items: NftDto[]
  total: number
  genreCounts?: Record<string, number>
  page: number
  pageSize: number
  totalPages: number
}

function isNftListResponse(value: unknown): value is NftListResponse {
  if (typeof value !== 'object' || value === null || !('items' in value))
    return false
  return Array.isArray(value.items)
}

export interface NftListParams {
  minPrice: string
  maxPrice: string
  category: 'all' | 'new' | 'trending'
  search?: string
  genre?: string
  network?: string
  sort?: 'recent' | 'price-asc' | 'price-desc'
  page?: number
  pageSize?: number
}

export const api = axios.create({ baseURL: '/api', timeout: 10_000 })
api.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) config.headers.set('Authorization', `Bearer ${token}`)
  return config
})
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: false },
    mutations: { retry: false },
  },
})

export function nftListOptions(params: NftListParams) {
  return queryOptions({
    queryKey: ['nfts', 'list', params],
    queryFn: async ({ signal }) => {
      const response = await api.get<NftListResponse>('/nfts', {
        params,
        signal,
      })
      if (!isNftListResponse(response.data))
        throw new Error('Resposta inválida do catálogo. Ative os mocks ou configure o backend.')
      return response.data
    },
  })
}

export function nftDetailOptions(id: string) {
  return queryOptions({
    queryKey: ['nfts', 'detail', id],
    queryFn: async ({ signal }) => {
      const response = await api.get<NftDto>(
        `/nfts/${encodeURIComponent(id)}`,
        {
          signal,
        },
      )
      return response.data
    },
  })
}

export function isNftNotFound(error: unknown) {
  return axios.isAxiosError(error) && error.response?.status === 404
}
