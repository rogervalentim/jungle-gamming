import { BreadcrumbComponent } from '#/components/breadcrumb'
import { Footer } from '#/components/footer'
import { Navbar } from '#/components/navbar'
import { createFileRoute } from '@tanstack/react-router'
import { CollectorProfileForm } from '#/components/payment/collector-profile-form'
import { NftOrderSummary } from '#/components/payment/nft-order-summary'
import { OrderConfirmation } from '#/components/payment/order-confirmation'
import { useEffect, useRef, useState } from 'react'
import { requireSession } from '#/lib/require-session'
import { createOrder, recoverOrderAttempt, useOrder } from '#/api/orders'
import { useWallets } from '#/api/account'
import { authErrorMessage } from '#/api/auth'
import { queryClient } from '#/api/nfts'
import type { QuoteResponse } from '#/api/cart'

export const Route = createFileRoute('/pagamento')({
  beforeLoad: requireSession,
  component: RouteComponent,
})

function RouteComponent() {
  const [orderId, setOrderId] = useState(
    () => new URLSearchParams(window.location.search).get('order'),
  )
  const coupon = new URLSearchParams(window.location.search).get('coupon') ?? ''
  const order = useOrder(orderId)
  const wallets = useWallets()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const idempotencyKey = useRef(crypto.randomUUID())
  useEffect(() => {
    if (orderId) return
    void recoverOrderAttempt().then((restored) => {
      if (!restored) return
      const url = new URL(window.location.href)
      url.searchParams.set('order', restored.id)
      window.history.replaceState(window.history.state, '', url)
      setOrderId(restored.id)
    }).catch(() => { /* the user can retry when the network returns */ })
  }, [orderId])
  const confirm = (walletId: string, provider: string, quote: QuoteResponse) => {
    setPending(true)
    setError('')
    void createOrder({
      walletId,
      provider,
      quoteId: quote.quoteId,
      coupon,
      idempotencyKey: idempotencyKey.current,
    })
      .then((created) => {
        const url = new URL(window.location.href)
        url.searchParams.set('order', created.id)
        window.history.replaceState(window.history.state, '', url)
        setOrderId(created.id)
      })
      .catch((cause: unknown) => {
        setError(authErrorMessage(cause))
        void queryClient.invalidateQueries({ queryKey: ['quote'] })
      })
      .finally(() => setPending(false))
  }
  return (
    <>
      <Navbar />
      <main className="m-auto w-full max-w-300">
        <div className="pt-8 mb-8">
          <BreadcrumbComponent
            items={[
              {
                label: 'Início',
                href: '/',
              },
              {
                label: 'Mercado',
                href: '/mercado',
              },
              {
                label: 'Pagamento',
              },
            ]}
          />
        </div>
        <section className="flex gap-8 mb-24">
          {orderId && order.data ? (
            <OrderConfirmation
              order={order.data}
              wallet={wallets.data?.items.find((item) => item.id === order.data.walletId)?.label ?? order.data.walletId}
            />
          ) : orderId ? (
            <p role={order.isError ? 'alert' : 'status'} className="text-[#F5F1EB]">
              {order.isError ? 'Não foi possível recuperar o pedido.' : 'Carregando pedido…'}
            </p>
          ) : (
            <>
              <CollectorProfileForm />
              <NftOrderSummary coupon={coupon} pending={pending} error={error} onConfirm={confirm} />
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
