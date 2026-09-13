import { useState } from 'react'
import type { CartResponse } from '#/api/cart'
import type { NftDto } from '#/api/nfts'

export function useNftEdition(nft: NftDto | undefined) {
  const [requestedEditionId, setRequestedEditionId] = useState<string | null>(
    null,
  )
  const [requestedQuantity, setRequestedQuantity] = useState(1)
  const edition =
    nft?.editions.find((item) => item.id === requestedEditionId) ??
    nft?.editions[0]
  const stock = edition?.availableQuantity ?? 0
  const quantity =
    stock > 0 ? Math.min(stock, Math.max(1, requestedQuantity)) : 0

  const selectEdition = (id: string) => {
    setRequestedEditionId(id)
    setRequestedQuantity(1)
  }
  const setQuantity = (value: number) => {
    setRequestedQuantity(Math.min(stock, Math.max(1, value)))
  }

  return { edition, quantity, selectEdition, setQuantity }
}

export function legacyPurchaseAvailability(
  nft: NftDto,
  editionId: string,
  cart: CartResponse,
) {
  const edition = nft.editions.find((item) => item.id === editionId)
  const supported = edition !== undefined
  const remaining = Math.max(
    0,
    (edition?.availableQuantity ?? 0) -
      (cart.items.find(
        (item) => item.nftId === nft.id && item.editionId === editionId,
      )?.quantity ?? 0),
  )
  return { supported, remaining }
}
