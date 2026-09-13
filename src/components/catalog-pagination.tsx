import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '#/components/ui/pagination'

const pageClass =
  'min-w-6 rounded-[3px] border border-[#3f2a1e] bg-transparent p-0 text-xs font-normal leading-none text-[#cfb28c] hover:border-[#d28a4c] hover:bg-[#332019] hover:text-[#f5f1eb] data-[active=true]:border-[#d28a4c] data-[active=true]:bg-[#d28a4c] data-[active=true]:text-[#140d0a] data-[active=true]:hover:bg-[#d28a4c] data-[active=true]:hover:text-[#140d0a] [&_svg]:size-[13px]'

interface CatalogPaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function CatalogPagination({
  page,
  totalPages,
  onPageChange,
}: CatalogPaginationProps) {
  if (totalPages <= 1) return null

  const firstPage = Math.max(1, Math.min(page - 1, totalPages - 3))
  const visiblePages = Array.from(
    { length: Math.min(4, totalPages) },
    (_, index) => firstPage + index,
  )

  const hrefForPage = (targetPage: number) => {
    const url = new URL(window.location.href)
    if (targetPage === 1) url.searchParams.delete('page')
    else url.searchParams.set('page', String(targetPage))
    return `${url.pathname}${url.search}${url.hash}`
  }

  const navigateTo = (
    event: React.MouseEvent<HTMLAnchorElement>,
    targetPage: number,
  ) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return
    event.preventDefault()
    if (targetPage !== page) onPageChange(targetPage)
  }

  return (
    <Pagination
      aria-label="Paginação do catálogo"
      className="mt-8 text-[#f5f1eb] flex justify-end max-[600px]:mt-5 mb-2"
    >
      <PaginationContent className="gap-1.5">
        {page > 1 && (
          <PaginationItem>
            <PaginationLink
              size="icon-xs"
              className={pageClass}
              href={hrefForPage(page - 1)}
              aria-label="Página anterior"
              onClick={(event) => navigateTo(event, page - 1)}
            >
              <ChevronLeft aria-hidden="true" />
            </PaginationLink>
          </PaginationItem>
        )}
        {visiblePages.map((number) => (
          <PaginationItem key={number}>
            <PaginationLink
              size="icon-xs"
              className={pageClass}
              href={hrefForPage(number)}
              aria-label={`Página ${number}`}
              isActive={number === page}
              onClick={(event) => navigateTo(event, number)}
            >
              {number}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          {page < totalPages ? (
            <PaginationLink
              size="icon-xs"
              className={pageClass}
              href={hrefForPage(page + 1)}
              aria-label="Próxima página"
              onClick={(event) => navigateTo(event, page + 1)}
            >
              <ChevronRight aria-hidden="true" />
            </PaginationLink>
          ) : (
            <span
              className="inline-flex size-6 min-w-6 items-center justify-center rounded-[3px] border border-[#3f2a1e] text-[#cfb28c] opacity-50"
              aria-hidden="true"
            >
              <ChevronRight className="size-3.25" />
            </span>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
