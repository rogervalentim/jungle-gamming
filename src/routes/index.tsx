import { Blog } from '#/components/blog/blog'
import { Collection } from '#/components/collection'
import { Footer } from '#/components/footer'
import { CardFeature } from '#/components/home/card-feature'
import { FilterSidebar } from '#/components/home/filter-sidebar'
import { Hero } from '#/components/home/hero'
import { Navbar } from '#/components/navbar'
import { NftCategory } from '#/components/nft/nft-category'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import type { SearchSchemaInput } from '@tanstack/react-router'
import { parseCatalogSearch } from '#/lib/catalog-search'
import type { CatalogSearch } from '#/lib/catalog-search'

export const Route = createFileRoute('/')({
  validateSearch: (raw: Partial<CatalogSearch> & SearchSchemaInput) =>
    parseCatalogSearch(raw),
  component: Home,
})

function Home() {
  const search = Route.useSearch()
  const navigate = useNavigate({ from: '/' })
  const updateSearch = (patch: Partial<CatalogSearch>, resetPage = true) => {
    void navigate({
      search: (previous) => ({
        ...previous,
        ...patch,
        page: resetPage ? 1 : (patch.page ?? previous.page),
      }),
    })
  }
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <section
          id="explorar"
          className="m-auto flex w-full max-w-300 gap-12 pb-4 min-[601px]:max-[900px]:flex-col min-[601px]:max-[900px]:gap-6 min-[601px]:max-[900px]:px-6"
        >
          <div className="w-full max-w-77.5 min-[601px]:max-[900px]:max-w-full min-[601px]:max-[900px]:min-w-0">
            <FilterSidebar search={search} onChange={updateSearch} />
            <CardFeature />
          </div>
          <div className="w-full max-w-full min-[601px]:max-[900px]:min-w-0">
            <NftCategory search={search} onChange={updateSearch} />
          </div>
        </section>
        <Collection />
        <Blog />
      </main>
      <Footer />
    </>
  )
}
