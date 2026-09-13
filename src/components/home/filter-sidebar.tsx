import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Slider } from '../ui/slider'
import { genres, networks } from '#/lib/catalog-search'
import { catalogParams } from '#/lib/catalog-search'
import type { CatalogSearch } from '#/lib/catalog-search'
import { nftListOptions } from '#/api/nfts'
import { useQuery } from '@tanstack/react-query'

interface FilterSidebarProps {
  search: CatalogSearch
  onChange: (patch: Partial<CatalogSearch>) => void
}

export function FilterSidebar({ search, onChange }: FilterSidebarProps) {
  const catalog = useQuery(nftListOptions(catalogParams(search)))
  const [priceRange, setPriceRange] = useState([
    Number(search.minPrice),
    Number(search.maxPrice),
  ])
  useEffect(() => {
    setPriceRange([Number(search.minPrice), Number(search.maxPrice)])
  }, [search.minPrice, search.maxPrice])

  return (
    <aside className="p-5 bg-[#241612] w-full max-w-77.5 mb-6">
      <div role="group" aria-label="Coleções">
        <h2 className="text-[18px] leading-4 font-bold text-[#F5F1EB] mb-3">
          Coleções
        </h2>
        <ul className="mb-10">
          {genres.map((genre) => (
            <li key={genre.value} className="w-full max-w-61.5 px-3">
              <button
                type="button"
                aria-pressed={search.genre === genre.value}
                onClick={() => onChange({ genre: genre.value })}
                className={`flex justify-between w-full items-center text-left text-base leading-10 hover:text-[#E89B55] ${search.genre === genre.value ? 'text-[#E89B55]' : 'text-[#CFB28C]'}`}
              >
                {genre.label}
                <span>
                  {catalog.data?.genreCounts &&
                    ` (${catalog.data.genreCounts[genre.value] ?? 0})`}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <h3 className="text-[18px] font-bold text-[#F5F1EB] mb-3">
        Faixa de preço
      </h3>
      <Slider
        aria-label="Faixa de preço em ETH"
        min={0.02}
        max={16.4}
        step={0.01}
        value={priceRange}
        onValueChange={(value) =>
          setPriceRange(Array.isArray(value) ? [...value] : [value, value])
        }
        className="mb-3 mt-5 w-full px-1 **:data-[slot=slider-track]:h-0.75 [&_[data-slot=slider-range]]:bg-[#D28A4C] [&_[data-slot=slider-track]]:bg-[#D28A4C] [&_[data-slot=slider-thumb]]:size-4 [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-thumb]]:border-[#241612] [&_[data-slot=slider-thumb]]:bg-[#D28A4C] [&_[data-slot=slider-thumb]]:focus-visible:ring-[#D28A4C]/50"
      />
      <p className="text-base font-normal text-[#F5F1EB] mb-3">
        Preço: {priceRange[0].toFixed(2).replace('.', ',')} -{' '}
        {priceRange[1].toFixed(2).replace('.', ',')} ETH
      </p>
      <Button
        onClick={() =>
          onChange({
            minPrice: priceRange[0].toFixed(2),
            maxPrice: priceRange[1].toFixed(2),
          })
        }
        className="min-w-23 h-9 flex justify-center items-center rounded-md bg-[#D28A4C] text-[#140D0A] text-base font-bold mb-10"
      >
        Aplicar preço
      </Button>

      <div role="group" aria-label="Rede">
        <h3 className="text-[18px] leading-4 font-bold text-[#F5F1EB]">Rede</h3>
        <ul>
          {networks.map((network) => (
            <li key={network.value} className="w-full max-w-61.5 px-3">
              <button
                type="button"
                aria-pressed={search.network === network.value}
                onClick={() => onChange({ network: network.value })}
                className={`flex w-full items-center text-left text-base leading-10 hover:text-[#E89B55] ${search.network === network.value ? 'text-[#E89B55]' : 'text-[#CFB28C]'}`}
              >
                {network.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
