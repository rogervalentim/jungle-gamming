import { Blog } from '#/components/blog/blog'
import { Collection } from '#/components/collection'
import { Footer } from '#/components/footer'
import { CardFeature } from '#/components/home/card-feature'
import { FilterSidebar } from '#/components/home/filter-sidebar'
import { Hero } from '#/components/home/hero'
import { Navbar } from '#/components/navbar'
import { NftCategory } from '#/components/nft/nft-category'
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
