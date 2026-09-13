import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'
import { api, queryClient } from '#/api/nfts'
import { DATABASE_KEY, listNfts, readDatabase } from './database'
import { publishNftUpdated, publishOrderUpdated } from './realtime'
import type { MockDatabase, MockConfig } from './database'
import type { NftDto } from '#/api/nfts'

export const worker = setupWorker(...handlers)

const controls = {
  async state() {
    return (await api.get('/__mock/state')).data as unknown
  },
  async configure(config: Partial<MockConfig>) {
    await api.patch('/__mock/config', config)
    await queryClient.cancelQueries({ queryKey: ['nfts'] })
    await queryClient.invalidateQueries({ queryKey: ['nfts'] })
  },
  async updateNft(
    id: string,
    patch: { price?: string; availableQuantity?: number; editionId?: string },
  ) {
    const response = await api.patch<NftDto>(
      `/__mock/nfts/${encodeURIComponent(id)}`,
      patch,
    )
    await queryClient.cancelQueries({ queryKey: ['nfts'] })
    await queryClient.invalidateQueries({ queryKey: ['nfts'] })
    return response.data
  },
  async reset() {
    await queryClient.cancelQueries()
    await api.post('/__mock/reset')
    queryClient.clear()
    window.location.replace('/')
  },
}

declare global {
  interface Window {
    kurioMocks?: typeof controls
  }
}

export function installMockControls() {
  let resetToken = readDatabase().resetToken
  window.kurioMocks = controls
  const onStorage = (event: StorageEvent) => {
    if (event.key !== DATABASE_KEY) return
    const current = readDatabase()
    const currentToken = current.resetToken
    if (currentToken !== resetToken) {
      resetToken = currentToken
      queryClient.clear()
      // A full reload also releases legacy UI state and session listeners.
      window.location.replace('/')
      return
    }
    try {
      const parsed: unknown = JSON.parse(event.oldValue ?? 'null')
      if (typeof parsed !== 'object' || parsed === null) return
      const previous = parsed as MockDatabase
      for (const nft of listNfts(current)) {
        const older = previous.nfts.find((item) => item.id === nft.id)
        if (older && nft.version > older.version) publishNftUpdated(nft)
      }
      for (const order of Object.values(current.orders)) {
        if (!(order.id in previous.orders) ||
            order.version > previous.orders[order.id].version)
          publishOrderUpdated(order)
      }
    } catch {
      // Invalid external storage writes are recovered by readDatabase().
    }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    window.removeEventListener('storage', onStorage)
    delete window.kurioMocks
  }
}
