import type { NFT } from '#/types'
import { Heart, Search, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { addToCart } from '#/api/cart'
import { useFavorite } from '#/api/favorites'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'

type CardNftProps = Omit<NFT, 'id'> & {
  id: string
  editionId?: string
  cartAvailable?: boolean
  onCartClick?: () => void
  onFavoriteClick?: () => void
  onViewClick?: () => void
}

export function CardNft({
  id,
  editionId,
  name,
  price,
  currency,
  image,
  cartAvailable = true,
  onCartClick,
  onFavoriteClick,
  onViewClick,
}: CardNftProps) {
  const favoriteState = useFavorite(id)
  const [cartError, setCartError] = useState('')
  const view = () =>
    window.location.assign(`/mercado?item=${encodeURIComponent(id)}`)
  const add = () => {
    setCartError('')
    void addToCart(id, editionId ?? `${id}-edition-1`)
      .then(() => window.location.assign('/carrinho-de-nfts'))
      .catch(() => setCartError('Não foi possível adicionar ao carrinho.'))
  }

  return (
    <Card className="group w-full max-w-64.5 gap-0 rounded-none p-0 ring-0">
      <CardHeader className="relative mb-3 rounded-none bg-[#241612] px-1 py-6.5">
        <img
          src={image}
          alt={name}
          width="250"
          height="250"
          className="rounded-2xl"
        />

        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
          {cartAvailable && (
            <button
              type="button"
              aria-label={`Adicionar ${name} ao carrinho`}
              onClick={onCartClick ?? add}
              className="bg-[#241612] p-2 text-[#F5F1EB] hover:text-[#E89B55]"
            >
              <ShoppingCart size={18} />
            </button>
          )}
          <button
            type="button"
            aria-label={`Favoritar ${name}`}
            onClick={onFavoriteClick ?? favoriteState.toggle}
            aria-pressed={favoriteState.active}
            className="bg-[#241612] p-2 text-[#F5F1EB] hover:text-[#E89B55]"
          >
            <Heart size={18} fill={favoriteState.active ? 'currentColor' : 'none'} />
          </button>
          <button
            type="button"
            aria-label={`Visualizar ${name}`}
            onClick={onViewClick ?? view}
            className="bg-[#241612] p-2 text-[#F5F1EB] hover:text-[#E89B55]"
          >
            <Search size={18} />
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <CardTitle className="mb-3 p-0 text-base leading-4 font-normal text-[#F5F1EB]">
          {name}
        </CardTitle>
        <CardDescription className="text-[18px] leading-4 font-bold text-[#E89B55]">
          {price} {currency}
        </CardDescription>
        {(cartError || favoriteState.error) && (
          <p role="alert" className="mt-2 text-xs text-[#E89B55]">
            {cartError || 'Não foi possível atualizar o favorito.'}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
