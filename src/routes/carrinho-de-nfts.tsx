import { BreadcrumbComponent } from '#/components/breadcrumb'
import { Footer } from '#/components/footer'
import { Navbar } from '#/components/navbar'
import { createFileRoute } from '@tanstack/react-router'
import { MoreCollection } from '#/components/more-collection'
import { ShoppingCart } from '#/components/shopping-cart'

export const Route = createFileRoute('/carrinho-de-nfts')({
  component: CartNfts,
})

function CartNfts() {
  return (
    <>
      <Navbar />
      <main className="m-auto w-full max-w-300">
        <div className="pt-8 mb-3">
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
                label: 'Carrinho',
              },
            ]}
          />
        </div>

        <ShoppingCart />
        <MoreCollection title="Colecionadores também viram" />
      </main>
      <Footer />
    </>
  )
}
