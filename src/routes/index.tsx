import { Blog } from '#/components/blog/blog'
import { CardFeature } from '#/components/card-feature'
import { Collection } from '#/components/collection'
import { FilterSidebar } from '#/components/filter-sidebar'
import { Footer } from '#/components/footer'
import { Hero } from '#/components/hero'
import { Navbar } from '#/components/navbar'
import { NftCategory } from '#/components/nft-category'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <section className="m-auto flex gap-12 w-full max-w-300 pb-4">
          <div className="w-full max-w-77.5">
            <FilterSidebar />
            <CardFeature />
          </div>
          <div className="w-full max-w-full">
            <NftCategory />
          </div>
        </section>
        <Collection />
        <Blog />
      </main>
      <Footer />
    </>
  )
}
