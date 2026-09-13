import { useQuery } from '@tanstack/react-query'
import { CardNft } from '../card-nft'
import { CatalogPagination } from '../catalog-pagination'
import { nftListOptions } from '#/api/nfts'
import { catalogParams, sorts } from '#/lib/catalog-search'
import type { CatalogSearch, Category, Sort } from '#/lib/catalog-search'

const skeletonClass =
  'animate-catalog-shimmer bg-[linear-gradient(90deg,#241612_25%,#493023_50%,#241612_75%)] bg-size-[200%_100%] motion-reduce:animate-none'

const tabs: { value: Category; label: string }[] = [
  { value: 'all', label: 'Todos os NFTs' },
  { value: 'new', label: 'Novos lançamentos' },
  { value: 'trending', label: 'Em alta' },
]

interface NftCategoryProps {
  search: CatalogSearch
  onChange: (patch: Partial<CatalogSearch>, resetPage?: boolean) => void
}

export function NftCategory({ search, onChange }: NftCategoryProps) {
  const query = useQuery(nftListOptions(catalogParams(search)))
  const page = query.data?.page ?? search.page
  const totalPages = query.data?.totalPages ?? 0

  return (
    <section aria-label="Catálogo de NFTs" className="w-full mb-24">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 w-full">
        <div role="tablist" className="flex flex-wrap items-center gap-5">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={search.category === tab.value}
              onClick={() =>
                onChange(
                  {
                    category: tab.value,
                    sort: tab.value === 'trending' ? 'price-desc' : 'recent',
                    page: 1, // Reseta a página ao trocar de categoria
                  },
                  true,
                )
              }
              className={`border-b-2 pb-1 text-base font-medium transition-colors ${
                search.category === tab.value
                  ? 'border-[#E89B55] text-[#E89B55]'
                  : 'border-transparent text-[#F5F1EB] hover:text-[#E89B55]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="search"
            aria-label="Buscar NFTs"
            value={search.q}
            onChange={(event) => onChange({ q: event.target.value, page: 1 }, true)}
            placeholder="Buscar NFTs"
            className="min-h-11 w-44 rounded-md border border-[#76543C] bg-[#241612] px-3 text-sm text-[#F5F1EB] placeholder:text-[#B39463] focus-visible:outline-2 focus-visible:outline-[#E89B55]"
          />
        <label className="flex shrink-0 items-center gap-2 text-base text-[#F5F1EB]">
          <span>Ordenar por:</span>
          <select
            aria-label="Ordenar por"
            value={search.sort}
            onChange={(event) =>
              onChange({ sort: event.target.value as Sort, page: 1 }, true)
            }
            className="min-h-11 rounded-md border border-[#76543C] bg-[#241612] px-2 text-[#F5F1EB] focus-visible:outline-2 focus-visible:outline-[#E89B55]"
          >
            {sorts.map((sort) => (
              <option key={sort.value} value={sort.value}>
                {sort.label}
              </option>
            ))}
          </select>
        </label>
        </div>
      </div>

      {query.isPending && (
        <div
          role="status"
          aria-label="Carregando NFTs"
          className="grid grid-cols-3 gap-8.5"
        >
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} aria-hidden="true" className="w-full max-w-64.5">
              <div className={`${skeletonClass} catalog-skeleton mb-3 h-75.5`} />
              <div className={`${skeletonClass} mb-3 h-4 w-3/4`} />
              <div className={`${skeletonClass} h-4 w-1/3`} />
            </div>
          ))}
        </div>
      )}

      {query.isError && (
        <div role="alert" className="my-6 text-[#F5F1EB]">
          <p>Não foi possível carregar os NFTs.</p>
          <button
            type="button"
            disabled={query.isFetching}
            onClick={() => void query.refetch()}
            className="mt-3 underline focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {query.isSuccess && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <p role="status" className="text-sm text-[#CFB28C]">
              {query.data.total}{' '}
              {query.data.total === 1
                ? 'NFT encontrado'
                : 'NFTs encontrados'}
            </p>
            {query.isFetching && (
              <span role="status" className="text-xs text-[#CFB28C]">
                Atualizando NFTs…
              </span>
            )}
          </div>

          {query.data.items.length > 0 ? (
            <div
              className="grid grid-cols-3 gap-8"
              aria-busy={query.isFetching}
            >
              {query.data.items.map((item) => (
                <CardNft
                  key={item.id}
                  id={item.id}
                  editionId={item.editionId}
                  name={item.name}
                  price={item.price}
                  currency={item.currency}
                  image={item.image}
                  cartAvailable={item.availableQuantity > 0}
                />
              ))}
            </div>
          ) : (
            <p role="status" className="mt-4 text-[#CFB28C]">
              Nenhum NFT encontrado.
            </p>
          )}

          <CatalogPagination
            page={page}
            totalPages={totalPages}
            onPageChange={(nextPage) => onChange({ page: nextPage }, false)}
          />
        </>
      )}
    </section>
  )
}
