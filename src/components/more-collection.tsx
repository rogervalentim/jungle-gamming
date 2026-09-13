import { useQuery } from '@tanstack/react-query'
import { nftListOptions } from '#/api/nfts'
import { CardNft } from './card-nft'

interface MoreCollectionProps {
  title: string
  currentId?: string
  genre?: string
}

export function MoreCollection({
  title,
  currentId,
  genre = 'all',
}: MoreCollectionProps) {
  const query = useQuery(
    nftListOptions({
      minPrice: '0',
      maxPrice: '999999999999.999999999999999999',
      category: 'all',
      genre,
      page: 1,
      pageSize: 8,
    }),
  )
  const items =
    query.data?.items.filter((item) => item.id !== currentId).slice(0, 5) ?? []

  return (
    <section aria-label={title}>
      <div className="border-b-[0.3px] border-[#D28A4C] pb-3 mb-8">
        <h2 className="text-[17px] leading-4 font-bold text-[#E89B55]">
          {title}
        </h2>
      </div>
      {query.isPending && (
        <p role="status" className="mb-24 text-[#CFB28C]">
          Carregando sugestões…
        </p>
      )}
      {query.isError && (
        <p role="status" className="mb-24 text-[#CFB28C]">
          Sugestões indisponíveis no momento.
        </p>
      )}
      {query.isSuccess && (
        <div className="grid grid-cols-5 gap-6.5 mb-24">
          {items.map((item) => (
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
      )}
    </section>
  )
}
