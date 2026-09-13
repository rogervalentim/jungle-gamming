import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardTitle } from './ui/card'
import {
  cartItems,
  cartSubtotal,
  cartTotal,
  setCartQuantity,
  useCart,
  useQuote,
} from '#/api/cart'
import { multiplyEth } from '#/lib/eth'
import { authErrorMessage } from '#/api/auth'
import { useRealtimeNotice } from '#/lib/realtime'
import Minus from '#/assets/icons/minus-icon.svg'
import Plus from '#/assets/icons/plus-icon.svg'
import Trash from '#/assets/icons/delete.svg'

export function ShoppingCart() {
  const cart = useCart()
  const items = cartItems(cart)

  const [promo, setPromo] = useState('')
  const [promoMessage, setPromoMessage] = useState('')
  const [coupon, setCoupon] = useState('')
  const [cartError, setCartError] = useState('')

  const quote = useQuote(coupon)
  const realtimeNotice = useRealtimeNotice()

  const subtotal = quote.data?.subtotal ?? cartSubtotal(cart)
  const discount = quote.data?.discount ?? '0'
  const networkFee = quote.data?.networkFee ?? (items.length ? '0.016' : '0')
  const total = quote.data?.total ?? cartTotal(cart)

  const updateQuantity = (item: (typeof items)[number], quantity: number) => {
    setCartError('')

    void setCartQuantity(item, quantity).catch((error: unknown) =>
      setCartError(authErrorMessage(error)),
    )
  }

  return (
    <section
      className="mb-24 flex justify-between gap-8 max-[1180px]:flex-col"
      aria-label="Carrinho de NFTs"
    >
      {/* LISTA DE NFTS */}
      <div className="w-full max-w-195.5">
        {/* HEADER */}
        <div className="mb-3 flex items-center gap-[61.25px] border-b-[0.3px] border-[#D28A4C] pb-3 max-[780px]:hidden">
          <span className="w-full max-w-62.5 text-base font-bold text-[#F5F1EB]">
            NFTs
          </span>

          <div className="flex items-center gap-[89.25px]">
            <span className="text-base font-bold text-[#F5F1EB]">Preço</span>

            <span className="text-base font-bold text-[#F5F1EB]">Edições</span>

            <span className="text-base font-bold text-[#F5F1EB]">Total</span>
          </div>
        </div>

        {items.length === 0 ? (
          <p className="rounded-md bg-[#241612] p-8 text-[#CFB28C]">
            Seu carrinho está vazio.
          </p>
        ) : (
          items.map((item) => {
            const tokenNumber = item.name.match(/#(\d+)/)?.[1]?.padStart(4, '0')

            return (
              <Card
                key={item.key}
                className="mb-3 w-full bg-[#241612] p-0 ring-0"
              >
                <CardContent className="flex w-full flex-row items-center gap-[61.25px] p-0 pr-6 max-[780px]:flex-col max-[780px]:items-stretch max-[780px]:gap-4 max-[780px]:p-3">
                  {/* NFT */}
                  <div className="flex w-full max-w-62.5 items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      width="70"
                      height="70"
                      className="h-17.5 w-17.5 shrink-0 rounded-md object-cover"
                    />

                    <div className="w-full max-w-154.5 min-w-0">
                      <CardTitle className="truncate text-base font-bold text-[#F5F1EB]">
                        {item.name}
                      </CardTitle>

                      {tokenNumber && (
                        <CardDescription className="text-sm font-normal leading-4 text-[#B39463]">
                          ID do token: #{tokenNumber}
                        </CardDescription>
                      )}
                    </div>
                  </div>

                  {/* DADOS */}
                  <div className="flex flex-1 items-center gap-14.5 max-[780px]:justify-between max-[780px]:gap-3">
                    {/* PREÇO */}
                    <span className="w-full max-w-19.25 whitespace-nowrap text-base font-bold leading-4 text-[#E89B55]">
                      {item.price} ETH
                    </span>

                    {/* QUANTIDADE */}
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        aria-label={`Diminuir ${item.name}`}
                        onClick={() => updateQuantity(item, item.quantity - 1)}
                        className="flex h-[49.5px] w-8.25 items-center justify-center rounded-[33px] bg-[#D28A4C] p-0"
                      >
                        <img src={Minus} alt="" />
                      </Button>

                      <span className="text-[20px] font-normal leading-7 text-[#F5F1EB]">
                        {item.quantity}
                      </span>

                      <Button
                        type="button"
                        aria-label={`Aumentar ${item.name}`}
                        disabled={item.quantity >= item.availableQuantity}
                        onClick={() => updateQuantity(item, item.quantity + 1)}
                        className="flex h-[49.5px] w-8.25 items-center justify-center rounded-[33px] bg-[#D28A4C] p-0 disabled:opacity-50"
                      >
                        <img src={Plus} alt="" />
                      </Button>
                    </div>

                    {/* TOTAL */}
                    <span className="w-full whitespace-nowrap text-base font-bold leading-4 text-[#E89B55]">
                      {multiplyEth(item.price, item.quantity)} ETH
                    </span>

                    {/* REMOVER */}
                    <Button
                      type="button"
                      variant="ghost"
                      aria-label={`Remover ${item.name}`}
                      onClick={() => updateQuantity(item, 0)}
                      className="h-auto w-auto p-0"
                    >
                      <img src={Trash} alt="icone da lixeira" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}

        {cartError && (
          <p role="alert" className="mt-3 text-sm text-[#E89B55]">
            {cartError}
          </p>
        )}
      </div>

      {/* RESUMO */}
      <aside
        className="w-full max-w-82.5 text-[#F5F1EB]"
        aria-label="Resumo da carteira"
      >
        <div className="mb-6 border-b-[0.3px] border-[#D28A4C] pb-3">
          <h3 className="text-[18px] leading-4 text-[#F5F1EB]">
            Resumo da carteira
          </h3>
        </div>

        {realtimeNotice && <p role="status" className="mb-3 text-sm text-[#E89B55]">{realtimeNotice}</p>}

        <h4 className="mb-2 text-sm font-bold leading-4 text-[#F5F1EB]">
          Código promocional
        </h4>

        {/* CUPOM */}
        <div className="mb-6 flex w-full max-w-82.5 overflow-hidden rounded-[3px] border-[0.3px] border-[#D28A4C]">
          <input
            id="cart-promo"
            type="text"
            value={promo}
            onChange={(event) => setPromo(event.target.value)}
            placeholder="Digite o código promocional..."
            className="
              h-10
              min-w-0
              flex-1
              bg-transparent
              px-2
              text-[#F5F1EB]
              outline-none
              placeholder:text-xs
              placeholder:font-normal
              placeholder:leading-4
              placeholder:text-[#B39463]
            "
          />

          <button
            type="button"
            onClick={() => {
              const next = promo.trim().toUpperCase()

              setCoupon(next)

              setPromoMessage(next ? '' : 'Digite um código promocional.')
            }}
            className="h-10 w-25.5 shrink-0 bg-[#D28A4C] text-base leading-4 text-[#140D0A]"
          >
            Aplicar
          </button>
        </div>

        {(promoMessage || (coupon && quote.isError)) && (
          <p role="status" className="-mt-3 mb-5 text-xs text-[#E89B55]">
            {promoMessage || authErrorMessage(quote.error)}
          </p>
        )}

        {coupon && quote.isSuccess && (
          <p role="status" className="-mt-3 mb-5 text-xs text-[#E89B55]">
            Cupom {coupon} aplicado.
          </p>
        )}

        {/* VALORES */}
        <ul>
          <li className="mb-3 flex items-center justify-between">
            <span className="text-sm font-normal text-[#F5F1EB]">Subtotal</span>

            <span className="text-right text-[18px] font-normal leading-4 text-[#F5F1EB]">
              {subtotal} ETH
            </span>
          </li>

          <li className="mb-3 flex items-center justify-between">
            <span className="text-sm font-normal text-[#F5F1EB]">
              Desconto do lançamento
            </span>

            <span className="text-right text-[18px] font-normal leading-4 text-[#F5F1EB]">
              (-) {discount} ETH
            </span>
          </li>

          <li className="mb-3.5 flex items-center justify-between">
            <span className="text-sm font-normal text-[#F5F1EB]">
              Taxa de rede
            </span>

            <span className="text-right text-[18px] font-normal leading-4 text-[#F5F1EB]">
              {networkFee} ETH
            </span>
          </li>

          <li className="mb-6 flex justify-end">
            <span className="text-sm font-normal leading-4 text-[#E89B55]">
              Taxa estimada
            </span>
          </li>

          <li className="mb-6 flex items-center justify-between">
            <span className="text-base font-bold leading-4 text-[#F5F1EB]">
              Total
            </span>

            <span className="text-right text-[18px] font-bold leading-4 text-[#E89B55]">
              {total} ETH
            </span>
          </li>
        </ul>

        {/* AÇÕES */}
        <div className="flex flex-col items-center justify-center">
          <Button
            type="button"
            disabled={!items.length || quote.isPending || quote.isFetching || quote.isError}
            onClick={() =>
              window.location.assign(
                `/pagamento${
                  coupon ? `?coupon=${encodeURIComponent(coupon)}` : ''
                }`,
              )
            }
            className="mb-3 flex h-10 w-full max-w-83 items-center justify-center bg-[#D28A4C] text-base font-bold leading-4 text-[#140D0A] disabled:opacity-50"
          >
            Conectar e finalizar
          </Button>

          <a href="/" className="text-base text-[#E89B55]">
            Continuar explorando
          </a>
        </div>
      </aside>
    </section>
  )
}
