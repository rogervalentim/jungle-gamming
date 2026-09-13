import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardTitle } from '../ui/card'
import { Wallet } from '../wallet'
import { cartItems, useCart, useQuote } from '#/api/cart'
import { useWallets } from '#/api/account'
import { multiplyEth } from '#/lib/eth'
import type { QuoteResponse } from '#/api/cart'
import { useRealtimeNotice } from '#/lib/realtime'

export function NftOrderSummary({
  coupon,
  pending,
  error,
  onConfirm,
}: {
  coupon: string
  pending: boolean
  error: string
  onConfirm: (walletId: string, provider: string, quote: QuoteResponse) => void
}) {
  const cart = useCart()
  const items = cartItems(cart)
  const quote = useQuote(coupon)
  const realtimeNotice = useRealtimeNotice()
  const wallets = useWallets()

  const [walletId, setWalletId] = useState('')
  const [provider, setProvider] = useState('')

  const selectedWallet =
    walletId ||
    wallets.data?.items.find((item) => item.primary)?.id ||
    wallets.data?.items[0]?.id ||
    ''

  return (
    <aside className="w-full max-w-101.25 text-[#F5F1EB]">
      <h4 className="mb-3 text-base font-bold leading-4 text-[#F5F1EB]">
        Seus NFTs
      </h4>

      <div className="mb-3 flex w-full justify-between border-b-[0.3px] border-[#D28A4C] pb-3">
        <h4 className="text-base font-bold leading-4 text-[#F5F1EB]">NFTs</h4>

        <h4 className="text-base font-bold leading-4 text-[#F5F1EB]">
          Subtotal
        </h4>
      </div>

      {items.map((item) => (
        <Card
          key={item.key}
          className="mb-3 w-full max-w-101.25 bg-[#241612] p-0 ring-0"
        >
          <CardContent className="flex w-full flex-row items-center gap-5 p-0 pr-6">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <img
                src={item.image}
                alt={item.name}
                width="70"
                height="70"
                className="h-17.5 w-17.5 shrink-0 rounded-md object-cover"
              />

              <div className="min-w-0 flex-1">
                <CardTitle className="truncate text-base font-bold text-[#F5F1EB]">
                  {item.name}
                </CardTitle>

                <CardDescription className="text-sm font-normal leading-4 text-[#B39463]">
                  Edição {item.edition}
                </CardDescription>
              </div>

              <span className="shrink-0 text-right text-sm leading-4 text-[#CFB28C]">
                (x {item.quantity})
              </span>
            </div>

            <span className="shrink-0 text-base font-bold leading-4 text-[#E89B55]">
              {multiplyEth(item.price, item.quantity)} ETH
            </span>
          </CardContent>
        </Card>
      ))}

      {!items.length && (
        <p className="mb-4 text-sm text-[#CFB28C]">Seu carrinho está vazio.</p>
      )}

      <div>
        <p className="mb-3 text-center text-sm font-normal text-[#F5F1EB]">
          Tem um código promocional? Aplique aqui
        </p>

        <ul>
          <li className="mb-3.5 flex items-center justify-between">
            <span className="text-base font-normal text-[#F5F1EB]">
              Subtotal
            </span>

            <span className="text-right text-[18px] leading-4 text-[#F5F1EB]">
              {quote.data?.subtotal ?? '—'} ETH
            </span>
          </li>

          <li className="mb-3.5 flex items-center justify-between">
            <span className="text-base font-normal text-[#F5F1EB]">
              Desconto do lançamento
            </span>

            <span className="text-right text-[18px] leading-4 text-[#F5F1EB]">
              (-) {quote.data?.discount ?? '0'} ETH
            </span>
          </li>

          <li className="mb-3.5 flex items-center justify-between">
            <span className="text-base font-normal text-[#F5F1EB]">
              Taxa de rede
            </span>

            <span className="text-right text-[18px] leading-4 text-[#F5F1EB]">
              {quote.data?.networkFee ?? '—'} ETH
            </span>
          </li>
        </ul>

        <div className="mb-3 w-full border-b-[0.3px] border-[#D28A4C] pb-3">
          <p className="text-center text-sm font-normal leading-4 text-[#E89B55]">
            Taxa estimada
          </p>
        </div>

        <ul className="mb-3">
          <li className="flex justify-between px-10.5">
            <span className="text-base font-bold leading-4 text-[#F5F1EB]">
              Total
            </span>

            <span className="text-right text-[18px] font-bold leading-4 text-[#E89B55]">
              {quote.data?.total ?? '—'} ETH
            </span>
          </li>
        </ul>

        <h3 className="mb-5 text-center text-base font-bold leading-4 text-[#F5F1EB]">
          Carteira e rede
        </h3>

        {wallets.data?.items.length ? (
          <div className="mb-4">
            <label
              htmlFor="wallet-select"
              className="mb-2 block text-base font-normal text-[#F5F1EB]"
            >
              Carteira cadastrada
            </label>

            <select
              id="wallet-select"
              value={selectedWallet}
              onChange={(event) => setWalletId(event.target.value)}
              className="h-11.25 w-full rounded-[3px] border border-[#3F2319] bg-[#140D0A] px-3 text-sm text-[#F5F1EB] outline-none focus:border-[#D28A4C]"
            >
              {wallets.data.items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label} · {item.network}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <p className="mb-4 text-sm text-[#CFB28C]">
            Cadastre uma carteira em{' '}
            <Link to="/carteiras" className="text-[#E89B55] underline">
              Minhas carteiras
            </Link>{' '}
            para concluir.
          </p>
        )}

        <fieldset>
          <legend className="sr-only">Selecionar provedor da carteira</legend>

          <ul className="mb-6">
            <li className="mb-4 flex h-11.25 w-full items-center gap-2.5 rounded-[3px] border border-[#3F2319] pl-3 has-checked:border-[#D28A4C]">
              <input
                type="radio"
                name="payment-wallet"
                value="WalletConnect"
                aria-label="WalletConnect"
                checked={provider === 'WalletConnect'}
                onChange={() => setProvider('WalletConnect')}
                className="
                  h-4
                  w-4
                  cursor-pointer
                  appearance-none
                  rounded-full
                  border-[1.2px]
                  border-[#D28A4C]
                  bg-transparent
                  checked:bg-[#D28A4C]
                  checked:shadow-[inset_0_0_0_2px_#140D0A]
                "
              />

              <Wallet />
            </li>

            <li className="mb-4 flex h-11.25 w-full items-center gap-2.5 rounded-[3px] border border-[#3F2319] pl-3 has-checked:border-[#D28A4C]">
              <input
                type="radio"
                name="payment-wallet"
                value="MetaMask"
                aria-label="MetaMask"
                checked={provider === 'MetaMask'}
                onChange={() => setProvider('MetaMask')}
                className="
                  h-4
                  w-4
                  cursor-pointer
                  appearance-none
                  rounded-full
                  border-[1.2px]
                  border-[#D28A4C]
                  bg-transparent
                  checked:bg-[#D28A4C]
                  checked:shadow-[inset_0_0_0_2px_#140D0A]
                "
              />

              <span className="text-base leading-4 text-[#F5F1EB]">
                MetaMask
              </span>
            </li>

            <li className="flex h-11.25 w-full items-center gap-2.5 rounded-[3px] border border-[#3F2319] pl-3 has-checked:border-[#D28A4C]">
              <input
                type="radio"
                name="payment-wallet"
                value="Coinbase Wallet"
                aria-label="Coinbase Wallet"
                checked={provider === 'Coinbase Wallet'}
                onChange={() => setProvider('Coinbase Wallet')}
                className="
                  h-4
                  w-4
                  cursor-pointer
                  appearance-none
                  rounded-full
                  border-[1.2px]
                  border-[#D28A4C]
                  bg-transparent
                  checked:bg-[#D28A4C]
                  checked:shadow-[inset_0_0_0_2px_#140D0A]
                "
              />

              <span className="text-base leading-4 text-[#F5F1EB]">
                Coinbase Wallet
              </span>
            </li>
          </ul>
        </fieldset>

        <Button
          disabled={
            !items.length ||
            !selectedWallet ||
            !provider ||
            !quote.data ||
            quote.isFetching ||
            pending
          }
          onClick={() => {
            if (quote.data) {
              onConfirm(selectedWallet, provider, quote.data)
            }
          }}
          className="flex h-11.25 w-full max-w-101.25 items-center justify-center rounded-lg bg-[#D28A4C] text-base font-bold leading-4 text-[#140D0A] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? 'Confirmando…' : 'Confirmar compra'}
        </Button>

        {(error || quote.isError) && (
          <p role="alert" className="mt-3 text-center text-sm text-[#E89B55]">
            {error || 'A cotação precisa ser atualizada. Volte ao carrinho.'}
          </p>
        )}

        {realtimeNotice && <p role="status" className="mt-3 text-center text-sm text-[#E89B55]">{realtimeNotice}</p>}

        {!selectedWallet && (
          <p className="mt-2 text-center text-xs text-[#B39463]">
            Selecione uma carteira para continuar.
          </p>
        )}
      </div>
    </aside>
  )
}
