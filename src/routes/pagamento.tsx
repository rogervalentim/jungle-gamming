import { BreadcrumbComponent } from '#/components/breadcrumb'
import { Footer } from '#/components/footer'
import { Navbar } from '#/components/navbar'
import { createFileRoute } from '@tanstack/react-router'
import { CollectorProfileForm } from '#/components/payment/collector-profile-form'
import { NftOrderSummary } from '#/components/payment/nft-order-summary'

export const Route = createFileRoute('/pagamento')({
  component: RouteComponent,
})

function RouteComponent() {
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
          <CollectorProfileForm />
          <NftOrderSummary />
        </section>
      </main>
      <Footer />
    </>
  )
}
