import { useState } from 'react'
import { addToCart, useCart } from '#/api/cart'
import { useFavorite } from '#/api/favorites'
import { multiplyEth } from '#/lib/eth'
import {
  legacyPurchaseAvailability,
  useNftEdition,
} from '#/lib/use-nft-edition'
import type { NftDto } from '#/api/nfts'

// Ícones importados do layout original (primeiro código)
import Star from '#/assets/icons/star.svg'
import Minus from '#/assets/icons/minus-icon.svg'
import Plus from '#/assets/icons/plus-icon.svg'
import Heart from '#/assets/icons/heart.svg'
import LinkedinWhite from '#/assets/icons/linkedin-white.svg'
import Message from '#/assets/icons/message.svg'
import TwitterWhite from '#/assets/icons/twitter-white.svg'

import { Button } from '@base-ui/react/button'

export function NftDetailPanel({ nft }: { nft: NftDto }) {
  const cart = useCart()
  const { edition, quantity, selectEdition, setQuantity } = useNftEdition(nft)
  const favorite = useFavorite(nft.id)
  const [cartError, setCartError] = useState('')

  if (!edition) return null

  const purchase = legacyPurchaseAvailability(nft, edition.id, cart)
  const maxQuantity = purchase.supported
    ? purchase.remaining
    : edition.availableQuantity
  const safeQuantity = Math.min(quantity, maxQuantity)
  const networkName = nft.network[0].toUpperCase() + nft.network.slice(1)

  return (
    <section role="region" aria-label={`Detalhes de ${nft.name}`} className="w-full max-w-[50%]">
      <h2 className="text-[28px] font-bold text-[#F5F1EB] mb-3">{nft.name}</h2>

      <div className="flex justify-between items-center border-b-[0.3px] mb-[13.37px] pb-3 border-[#D28A4C]">
        <p className="text-[22px] font-bold leading-4 text-[#E89B55]">
          {multiplyEth(edition.price, safeQuantity)} ETH
        </p>

        <div className="flex gap-2">
          <div className="flex items-center gap-1">
            <img src={Star} alt="icone estrela" />
            <img src={Star} alt="icone estrela" />
            <img src={Star} alt="icone estrela" />
            <img src={Star} alt="icone estrela" />
          </div>
          <span className="text-base font-regular text-[#F5F1EB]">
            19 avaliações de colecionadores
          </span>
        </div>
      </div>

      <h4 className="text-base font-bold leading-4 text-[#F5F1EB] mb-3">
        Sobre este NFT:
      </h4>
      <p className="text-sm font-normal text-[#CFB28C] leading-6 mb-[13.38px]">
        {nft.name} é um colecionável digital da coleção Kurio Editions na rede{' '}
        {networkName}.
      </p>

      <h4 className="text-base font-bold leading-4 text-[#F5F1EB] mb-3">
        Edição:
      </h4>

      <div
        role="group"
        aria-label="Edição"
        className="flex gap-1 mb-[13.37px] flex-wrap"
      >
        {nft.editions.map((option) => {
          const isSelected = edition.id === option.id
          const isSoldOut = option.availableQuantity === 0

          return (
            <button
              key={option.id}
              type="button"
              aria-label={`Edição ${option.label}${isSoldOut ? ', esgotada' : ''}`}
              aria-pressed={isSelected}
              onClick={() => selectEdition(option.id)}
              className={`px-3 py-1.5 rounded-full flex items-center justify-center border text-sm leading-4 transition-colors ${
                isSelected
                  ? 'border-[#D28A4C] font-medium text-[#E89B55]'
                  : 'border-[#3F2319] font-normal text-[#CFB28C]'
              } ${isSoldOut ? 'opacity-70' : ''}`}
            >
              {option.label}
              {isSoldOut ? ' · Esgotada' : ''}
            </button>
          )
        })}
      </div>

      {/* Avisos dinâmicos sobre quantidade / disponibilidade */}
      {edition.availableQuantity === 0 ? (
        <p role="status" className="mb-[13.38px] text-sm text-[#E89B55]">
          Esta edição está esgotada.
        </p>
      ) : (
        <p role="status" className="mb-[13.38px] text-sm text-[#CFB28C]">
          {edition.availableQuantity} disponível(is) nesta edição.
        </p>
      )}

      <div className="flex justify-between items-center mb-[13.38px]">
        <div className="flex gap-3 items-center w-full">
          <Button
            type="button"
            aria-label="Diminuir quantidade"
            disabled={safeQuantity <= 1}
            onClick={() => setQuantity(safeQuantity - 1)}
            className="w-8.25 h-[49.5px] flex justify-center items-center rounded-[33px] bg-[#D28A4C] disabled:opacity-50"
          >
            <img src={Minus} alt="minus icon" />
          </Button>
          <span aria-label="Quantidade selecionada" className="text-[20px] leading-7 font-normal text-[#F5F1EB]">
            {safeQuantity}
          </span>
          <Button
            type="button"
            aria-label="Aumentar quantidade"
            disabled={safeQuantity >= maxQuantity}
            onClick={() => setQuantity(safeQuantity + 1)}
            className="w-8.25 h-[49.5px] flex justify-center items-center rounded-[33px] bg-[#D28A4C] disabled:opacity-50"
          >
            <img src={Plus} alt="plus icon" />
          </Button>
        </div>

        <div className="flex items-center gap-2 w-full">
          <Button
            type="button"
            disabled={!purchase.supported || safeQuantity < 1}
            onClick={() => {
              setCartError('')
              void addToCart(nft.id, edition.id, safeQuantity)
                .then(() => window.location.assign('/pagamento'))
                .catch(() => setCartError('Não foi possível adicionar ao carrinho.'))
            }}
            className="h-10 w-full max-w-32.5 flex items-center justify-center rounded-md bg-[#D28A4C] font-bold text-sm leading-5 text-[#140D0A] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Comprar
          </Button>
          <Button
            type="button"
            onClick={favorite.toggle}
            aria-pressed={favorite.active}
            className={`h-10 w-full max-w-32.5 flex items-center gap-2 justify-center rounded-md border border-[#D28A4C] font-medium text-sm leading-5 ${
              favorite.active ? 'bg-[#D28A4C]/10 text-[#E89B55]' : 'text-[#E89B55]'
            }`}
          >
            <span>
              <img src={Heart} alt="icone de coração" />
            </span>
            {favorite.active ? 'Favoritado' : 'Favoritar'}
          </Button>
        </div>
      </div>

      {(cartError || favorite.error) && (
        <p role="alert" className="mb-3 text-sm text-[#E89B55]">
          {cartError || 'Não foi possível atualizar o favorito.'}
        </p>
      )}

      {!purchase.supported && edition.availableQuantity > 0 && (
        <p role="status" className="mb-[13.38px] text-sm text-[#E89B55]">
          A compra desta edição ainda não está disponível.
        </p>
      )}
      {purchase.supported && purchase.remaining === 0 && (
        <p role="status" className="mb-[13.38px] text-sm text-[#E89B55]">
          O limite de estoque desta edição já está no carrinho.
        </p>
      )}

      <p className="text-base font-normal text-[#B39463]">
        ID do token: #{nft.id}
      </p>
      <p className="text-base font-normal text-[#B39463]">
        Rede: {networkName}
      </p>
      <p className="text-base font-normal text-[#B39463] mb-2">
        Atributos: Óculos, Esmeralda, Raro
      </p>

      <div className="flex items-center gap-2">
        <h4 className="text-[#F7F3EC] font-bold text-base leading-4">
          Compartilhar este NFT:
        </h4>
        <ul className="flex items-center gap-2">
          <li>
            <a href="#">
              <img src={LinkedinWhite} alt="icone do linkedin branco" />
            </a>
          </li>
          <li>
            <a href="#">
              <img src={Message} alt="icone do email branco" />
            </a>
          </li>
          <li>
            <a href="#">
              <img src={TwitterWhite} alt="icone do twitter branco" />
            </a>
          </li>
        </ul>
      </div>
    </section>
  )
}
