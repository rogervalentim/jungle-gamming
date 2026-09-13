import { useEffect, useRef, useState } from 'react'
import { useNavigate, useRouterState } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeft,
  Heart,
  Home,
  Search,
  ScanLine,
  Settings2,
  ShoppingCart,
  UserRound,
  Plus,
  Minus,
  Eye,
  EyeOff,
  ArrowRight,
} from 'lucide-react'
import emerald from '#/assets/hero-image.webp'
import violet from '#/assets/card-feature.webp'
import {
  addToCart,
  cartItemCount,
  cartItems,
  cartSubtotal,
  cartTotal,
  changeQuantity,
  useCart,
  useQuote,
} from '#/api/cart'
import { useFavorite, useFavorites } from '#/api/favorites'
import { useWallets } from '#/api/account'
import { createOrder, recoverOrderAttempt, useOrder } from '#/api/orders'
import { useRealtimeNotice } from '#/lib/realtime'
import { ethToWei, isEthAmount, multiplyEth } from '#/lib/eth'
import { isNftNotFound, nftDetailOptions, nftListOptions } from '#/api/nfts'
import {
  legacyPurchaseAvailability,
  useNftEdition,
} from '#/lib/use-nft-edition'
import {
  catalogParams,
  genres,
  networks,
  parseCatalogSearch,
  sorts,
} from '#/lib/catalog-search'
import type {
  CatalogSearch,
  Category,
  Genre,
  Network,
  Sort,
} from '#/lib/catalog-search'
import { Collection } from '#/components/collection'
import { Blog } from '#/components/blog/blog'
import { CatalogPagination } from '#/components/catalog-pagination'
import {
  authErrorMessage,
  login,
  logout,
  register,
  useSession,
} from '#/api/auth'

const primaryButton =
  'min-h-[60px] w-full rounded-xl border-0 bg-[#d28a4c] text-base font-bold text-[#1d130e]'
const catalogMessage = 'my-5 text-[#cfb28c] leading-[1.5]'
const catalogMessageButton =
  'mt-2.5 min-h-11 rounded-lg border border-[#d28a4c] bg-[#241612] px-4 py-2 text-[#f5f1eb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e89b55]'
const selectionIndicator =
  'size-4 shrink-0 rounded-full border border-[#8c542f]'
const selectedIndicator =
  'border-[#e89b55] bg-[#e89b55] shadow-[inset_0_0_0_3px_#2a1d17]'
const shimmer =
  'bg-[linear-gradient(90deg,#241612_25%,#493023_50%,#241612_75%)] bg-size-[200%_100%] animate-catalog-shimmer motion-reduce:animate-none'
const navButton =
  'absolute top-8 grid h-8 w-10 -translate-x-1/2 shrink-0 place-items-center border-0 bg-transparent p-0 leading-none text-[#e2bf97] [&_svg]:size-5 [&_svg]:stroke-[1.5]'
const roundButton =
  'grid size-9 shrink-0 place-items-center rounded-full border border-[#4b3022] bg-[#312019] p-0 leading-none text-[#d39a64]'
const quantityButton =
  'grid h-7 w-[22px] shrink-0 place-items-center rounded-[14px] border-0 bg-[#d28a4c] p-0 leading-none text-[#21150f] disabled:cursor-not-allowed disabled:opacity-50'
const header = 'mt-2 mb-5 flex items-center gap-6'
const cartRow = 'my-[13px] flex justify-between text-sm'
const authInput =
  'h-[50px] w-full rounded-[11px] border border-[#513020] bg-transparent px-4 text-sm text-[#f5f1eb] placeholder:text-[#b99a6a]'
const socialButton =
  'mb-[15px] h-[41px] rounded-md border border-[#513020] bg-transparent text-sm text-[#cbb090]'

type Page =
  | 'inicio'
  | 'detalhes'
  | 'carrinho'
  | 'pagamento'
  | 'login'
  | 'cadastro'
  | 'indisponivel'
const categories: { key: Category; label: string }[] = [
  { key: 'all', label: 'Todos os NFTs' },
  { key: 'new', label: 'Novos lançamentos' },
  { key: 'trending', label: 'Em alta' },
]

function pageForPath(pathname: string): Page {
  switch (pathname) {
    case '/':
      return 'inicio'
    case '/mercado':
      return 'detalhes'
    case '/carrinho-de-nfts':
      return 'carrinho'
    case '/pagamento':
      return 'pagamento'
    case '/login':
      return 'login'
    case '/cadastro':
      return 'cadastro'
    default:
      return 'indisponivel'
  }
}

function MobileFavoriteButton({
  id,
  name,
  className,
  size = 17,
}: {
  id: string
  name: string
  className: string
  size?: number
}) {
  const favorite = useFavorite(id)
  return (
    <button
      type="button"
      className={className}
      aria-label={`Favoritar ${name}`}
      aria-pressed={favorite.active}
      onClick={favorite.toggle}
    >
      <Heart size={size} fill={favorite.active ? 'currentColor' : 'none'} />
    </button>
  )
}

export function MobileFlow() {
  const href = useRouterState({ select: (state) => state.location.href })
  const currentUrl = new URL(href, window.location.origin)
  const page = pageForPath(currentUrl.pathname)
  const catalogSearch = parseCatalogSearch(
    Object.fromEntries(currentUrl.searchParams),
  )
  const navigate = useNavigate()
  const { user, isLoading: sessionLoading } = useSession()
  const cart = useCart()
  const cartCount = cartItemCount(cart)
  const favorites = useFavorites()
  const [showFavorites, setShowFavorites] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [priceDraft, setPriceDraft] = useState({
    min: catalogSearch.minPrice,
    max: catalogSearch.maxPrice,
  })
  useEffect(() => {
    setPriceDraft({ min: catalogSearch.minPrice, max: catalogSearch.maxPrice })
  }, [catalogSearch.minPrice, catalogSearch.maxPrice])
  const wallets = useWallets()
  const [wallet, setWallet] = useState('')
  const [provider, setProvider] = useState('')
  const [promo, setPromo] = useState('')
  const [promoMessage, setPromoMessage] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState('')
  const [cartMessage, setCartMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [authMessage, setAuthMessage] = useState('')
  const [authPending, setAuthPending] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(
    () => currentUrl.searchParams.get('order'),
  )
  const [orderPending, setOrderPending] = useState(false)
  const [orderError, setOrderError] = useState('')
  const idempotencyKey = useRef(crypto.randomUUID())
  const coupon = page === 'pagamento'
    ? currentUrl.searchParams.get('coupon') ?? ''
    : appliedCoupon
  const quote = useQuote(coupon)
  const order = useOrder(orderId)
  const realtimeNotice = useRealtimeNotice()
  useEffect(() => {
    if (page !== 'pagamento' || orderId) return
    void recoverOrderAttempt().then((restored) => {
      if (!restored) return
      const url = new URL(window.location.href)
      url.searchParams.set('order', restored.id)
      window.history.replaceState(window.history.state, '', url)
      setOrderId(restored.id)
    }).catch(() => { /* retry remains available when the network returns */ })
  }, [page, orderId])
  const selectedWallet = wallet || wallets.data?.items.find((item) => item.primary)?.id || wallets.data?.items[0]?.id || ''
  const updateCatalog = (patch: Partial<CatalogSearch>, resetPage = true) => {
    void navigate({
      to: '/',
      search: (previous) => ({
        ...parseCatalogSearch(previous),
        ...patch,
        page: resetPage ? 1 : (patch.page ?? previous.page),
      }),
    })
  }
  const query = useQuery({
    ...nftListOptions(catalogParams(catalogSearch)),
    enabled: page === 'inicio',
  })
  const selectedKey = currentUrl.searchParams.get('item')
  const detailQuery = useQuery({
    ...nftDetailOptions(selectedKey ?? ''),
    enabled: page === 'detalhes' && Boolean(selectedKey),
  })
  const selectedNft = detailQuery.data
  const { edition, quantity, selectEdition, setQuantity } =
    useNftEdition(selectedNft)
  const purchase =
    selectedNft && edition
      ? legacyPurchaseAvailability(selectedNft, edition.id, cart)
      : null
  const maxQuantity = edition
    ? purchase?.supported
      ? purchase.remaining
      : edition.availableQuantity
    : 0
  const safeQuantity = Math.min(quantity, maxQuantity)
  const go = (next: Exclude<Page, 'indisponivel'>, item?: string) => {
    const path = {
      inicio: '/',
      detalhes: '/mercado',
      carrinho: '/carrinho-de-nfts',
      pagamento: '/pagamento',
      login: '/login',
      cadastro: '/cadastro',
    } as const
    if (next === 'detalhes' && item) {
      void navigate({ to: '/mercado', search: { item } })
    } else if (next === 'pagamento') {
      void navigate({ to: '/pagamento', search: coupon ? { coupon } : {} })
    } else {
      void navigate({ to: path[next] })
    }
    window.scrollTo(0, 0)
  }
  const subtotal = quote.data?.subtotal ?? cartSubtotal(cart)
  const total = quote.data?.total ?? cartTotal(cart)
  const submitOrder = () => {
    if (!quote.data || quote.isFetching || !selectedWallet || !provider) return
    setOrderPending(true)
    setOrderError('')
    void createOrder({
      idempotencyKey: idempotencyKey.current,
      quoteId: quote.data.quoteId,
      walletId: selectedWallet,
      provider,
      coupon,
    })
      .then((created) => {
        const url = new URL(window.location.href)
        url.searchParams.set('order', created.id)
        window.history.replaceState(window.history.state, '', url)
        setOrderId(created.id)
      })
      .catch((error: unknown) => setOrderError(authErrorMessage(error)))
      .finally(() => setOrderPending(false))
  }
  const back = () => go(page === 'pagamento' ? 'carrinho' : 'inicio')
  const button = (label: string, action: () => void, extra = '') => (
    <button
      type="button"
      className={`${primaryButton} ${extra}`}
      disabled={extra.includes('disabled')}
      onClick={action}
    >
      {label}
    </button>
  )
  const listedNfts = (query.data?.items ?? []).filter(
    (nft) => !showFavorites || favorites.data?.ids.includes(nft.id),
  )
  const validPriceDraft =
    isEthAmount(priceDraft.min) &&
    isEthAmount(priceDraft.max) &&
    ethToWei(priceDraft.min) <= ethToWei(priceDraft.max)

  return (
    <div className="mobile-flow hidden min-h-dvh overflow-hidden bg-[#1b130e] px-6 pt-6 pb-[34px] font-['Roboto_Mono',monospace] text-[#f7f3ee] max-[600px]:block [&_*]:font-[inherit] [&_button]:cursor-pointer [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-offset-2 [&_button:focus-visible]:outline-[#e89b55] [&_input:focus-visible]:outline-2 [&_input:focus-visible]:outline-offset-2 [&_input:focus-visible]:outline-[#e89b55]">
      {page === 'inicio' && (
        <>
          <div className="my-4 flex items-center gap-2">
            <label className="flex h-[46px] flex-1 items-center gap-2.5 rounded-xl bg-[#2a1d17] px-3.5 text-[#cfb28c]">
              <Search size={20} />
              <input
                className="w-full border-0 bg-transparent text-sm font-bold text-[#f7f3ee] outline-0 placeholder:text-[#bd9b6f]"
                aria-label="Explorar coleções"
                placeholder="Explorar coleções"
                value={catalogSearch.q}
                onChange={(e) => updateCatalog({ q: e.target.value })}
              />
            </label>
            <button
              type="button"
              className="grid size-[46px] place-items-center rounded-[14px] border-0 bg-[#cd8b50] text-[#1b130e]"
              aria-label="Filtrar"
              aria-expanded={filtersOpen}
              aria-controls="m-catalog-filters"
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <Settings2 size={21} />
            </button>
          </div>
          {filtersOpen && (
            <div
              id="m-catalog-filters"
              className="mx-5 mb-[18px] grid gap-3 rounded-xl border border-[#76543c] bg-[#241612] p-4 text-[#f5f1eb]"
            >
              <label className="grid gap-[5px] text-sm">
                Coleção
                <select
                  className="min-h-11 w-full rounded-lg border border-[#76543c] bg-[#140d0a] px-2.5 py-2 text-[#f5f1eb]"
                  aria-label="Coleção"
                  value={catalogSearch.genre}
                  onChange={(e) =>
                    updateCatalog({ genre: e.target.value as Genre })
                  }
                >
                  {genres.map((genre) => (
                    <option key={genre.value} value={genre.value}>
                      {genre.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-[5px] text-sm">
                Rede
                <select
                  className="min-h-11 w-full rounded-lg border border-[#76543c] bg-[#140d0a] px-2.5 py-2 text-[#f5f1eb]"
                  aria-label="Rede"
                  value={catalogSearch.network}
                  onChange={(e) =>
                    updateCatalog({ network: e.target.value as Network })
                  }
                >
                  {networks.map((network) => (
                    <option key={network.value} value={network.value}>
                      {network.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-[5px] text-sm">
                Ordenar por
                <select
                  className="min-h-11 w-full rounded-lg border border-[#76543c] bg-[#140d0a] px-2.5 py-2 text-[#f5f1eb]"
                  aria-label="Ordenar por"
                  value={catalogSearch.sort}
                  onChange={(e) =>
                    updateCatalog({ sort: e.target.value as Sort })
                  }
                >
                  {sorts.map((sort) => (
                    <option key={sort.value} value={sort.value}>
                      {sort.label}
                    </option>
                  ))}
                </select>
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <label className="grid gap-[5px] text-sm">
                  Preço mínimo em ETH
                  <input
                    className="min-h-11 w-full rounded-lg border border-[#76543c] bg-[#140d0a] px-2.5 py-2 text-[#f5f1eb]"
                    aria-label="Preço mínimo em ETH"
                    inputMode="decimal"
                    value={priceDraft.min}
                    onChange={(e) =>
                      setPriceDraft({ ...priceDraft, min: e.target.value })
                    }
                  />
                </label>
                <label className="grid gap-[5px] text-sm">
                  Preço máximo em ETH
                  <input
                    className="min-h-11 w-full rounded-lg border border-[#76543c] bg-[#140d0a] px-2.5 py-2 text-[#f5f1eb]"
                    aria-label="Preço máximo em ETH"
                    inputMode="decimal"
                    value={priceDraft.max}
                    onChange={(e) =>
                      setPriceDraft({ ...priceDraft, max: e.target.value })
                    }
                  />
                </label>
              </div>
              <button
                type="button"
                className="min-h-11 rounded-lg border border-[#d28a4c] bg-[#241612] px-3 py-2 text-[#f5f1eb] disabled:opacity-50"
                disabled={!validPriceDraft}
                onClick={() =>
                  updateCatalog({
                    minPrice: priceDraft.min,
                    maxPrice: priceDraft.max,
                  })
                }
              >
                Aplicar preço
              </button>
            </div>
          )}
          <section className="relative h-[188px] overflow-hidden rounded-[30px] bg-[linear-gradient(120deg,#6b4a31,#332116)] px-4 py-2.5">
            <div className="relative z-[2] max-w-[56%]">
              <small className="text-xs">Bem-vindo à Kurio</small>
              <h1 className="my-1.5 text-[17px] leading-[1.65] font-extrabold">
                SEJA DONO DA
                <br /> CULTURA DIGITAL
              </h1>
              <p className="text-xs leading-[1.45] text-[#d4bda1]">
                Descubra NFTs selecionados de criadores do mundo todo.
              </p>
              <button
                className="flex items-center gap-2.5 border-0 bg-transparent p-0 text-xs font-bold text-[#f3ad65]"
                onClick={() =>
                  document
                    .getElementById('m-products')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                EXPLORA <ArrowRight size={14} />
              </button>
            </div>
            <img
              className="absolute top-2.5 right-4 size-[138px] rounded-[18px] object-cover"
              src={emerald}
              alt="Emerald Ape"
            />
            <img
              className="absolute top-[94px] right-[66px] size-[74px] rounded-[18px] object-cover"
              src={violet}
              alt="Violet Nomad"
            />
            <span className="absolute bottom-px left-[46%] text-xs tracking-[3px] text-[#e89b55]">
              ● ● ●
            </span>
          </section>
          <section id="m-products" aria-label="Catálogo de NFTs">
            <div className="mt-4 mb-[14px] flex gap-[5px] overflow-auto whitespace-nowrap">
              {categories.map((tab) => (
                <button
                  type="button"
                  key={tab.key}
                  aria-pressed={catalogSearch.category === tab.key}
                  className={`border-0 border-b-2 bg-transparent px-0 pb-1 text-sm ${catalogSearch.category === tab.key ? 'border-[#e89b55] font-bold text-[#e89b55]' : 'border-transparent text-[#eee4da]'}`}
                  onClick={() =>
                    updateCatalog({
                      category: tab.key,
                      sort: tab.key === 'trending' ? 'price-desc' : 'recent',
                    })
                  }
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {query.isPending && (
              <div
                className="grid grid-cols-2 gap-4 pb-8"
                role="status"
                aria-label="Carregando NFTs"
              >
                {Array.from({ length: 8 }, (_, i) => (
                  <div key={i} aria-hidden="true" className="m-product-skeleton min-w-0">
                    <span
                      className={`${shimmer} catalog-skeleton mb-2.5 block aspect-square w-full rounded-[20px]`}
                    />
                    <span
                      className={`${shimmer} mx-2 mb-2 block h-[14px] w-3/4 rounded-lg`}
                    />
                    <span
                      className={`${shimmer} mx-2 block h-4 w-[48%] rounded-lg`}
                    />
                  </div>
                ))}
              </div>
            )}
            {query.isError && (
              <div className={catalogMessage} role="alert">
                <p>Não foi possível carregar os NFTs.</p>
                <button
                  type="button"
                  className={catalogMessageButton}
                  disabled={query.isFetching}
                  onClick={() => void query.refetch()}
                >
                  Tentar novamente
                </button>
              </div>
            )}
            {!query.isPending && query.isFetching && (
              <p role="status" className={catalogMessage}>
                Atualizando NFTs…
              </p>
            )}
            <div
              className="grid grid-cols-2 gap-4 pb-8"
              aria-busy={query.isFetching}
            >
              {listedNfts.map((nft, i) => (
                <div
                  className="relative min-w-0 text-left text-sm text-[#f5f1eb]"
                  key={nft.id}
                >
                  <button
                    type="button"
                    className="m-product-view block w-full min-w-0 cursor-pointer border-0 bg-transparent p-0 text-left text-inherit"
                    onClick={() => go('detalhes', nft.id)}
                  >
                    <span className="relative mb-2.5 block rounded-[20px] bg-[#2a1d17] p-[5px]">
                      <img
                        className="aspect-square w-full rounded-2xl object-cover"
                        src={nft.image}
                        alt={nft.name}
                      />
                      {i === 2 && (
                        <em className="absolute top-4 left-0 bg-[#d28a4c] p-[7px] text-xs not-italic text-[#1b130e]">
                          RARO
                        </em>
                      )}
                    </span>
                    <span className="block truncate px-2">{nft.name}</span>
                    <strong className="block px-2 text-base text-[#e89b55]">
                      {nft.price} ETH
                    </strong>
                  </button>
                  {i === 0 && (
                    <MobileFavoriteButton
                      id={nft.id}
                      name={nft.name}
                      className="absolute top-2.5 right-2.5 cursor-pointer rounded-full border-0 bg-[#2a1d17] p-[5px] text-[#e89b55]"
                    />
                  )}
                </div>
              ))}
            </div>
            {query.isSuccess && listedNfts.length === 0 && (
              <p role="status" className={catalogMessage}>
                Nenhum NFT encontrado.
              </p>
            )}
            {query.isSuccess && (
              <CatalogPagination
                page={query.data.page}
                totalPages={query.data.totalPages}
                onPageChange={(nextPage) =>
                  updateCatalog({ page: nextPage }, false)
                }
              />
            )}
          </section>
          <div className="pb-[105px]">
            <Collection />
            <Blog />
          </div>
          <nav
            className="fixed bottom-0 left-0 z-10 h-[calc(96px+env(safe-area-inset-bottom))] w-full rounded-t-[30px] bg-[#2a1d17] before:absolute before:-top-[42px] before:left-1/2 before:size-[90px] before:-translate-x-1/2 before:rounded-full before:bg-[#1b130e] before:content-['']"
            aria-label="Navegação principal"
          >
            <button
              className={`${navButton} left-[10%] text-[#e89b55]`}
              aria-label="Início"
              onClick={() => go('inicio')}
            >
              <Home fill="currentColor" />
            </button>
            <button
              className={`${navButton} left-[28%]`}
              aria-label="Favoritos"
              aria-pressed={showFavorites}
              onClick={() => {
                if (!user) go('login')
                else setShowFavorites(!showFavorites)
              }}
            >
              <Heart fill="currentColor" />
            </button>
            <button
              className="absolute -top-8 left-1/2 z-[1] grid size-16 -translate-x-1/2 shrink-0 place-items-center rounded-full border-0 bg-[#b97a45] p-0 leading-none text-white [&_svg]:size-7 [&_svg]:stroke-[1.5]"
              aria-label="Explorar"
              onClick={() =>
                document
                  .getElementById('m-products')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              <ScanLine />
            </button>
            <button
              className={`${navButton} left-[72%]`}
              aria-label={`Carrinho, ${cartCount} ${cartCount === 1 ? 'produto' : 'produtos'}`}
              onClick={() => go('carrinho')}
            >
              <ShoppingCart fill="currentColor" />
              {cartCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -top-[7px] right-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#d28a4c] px-0.5 text-[10px] leading-none font-bold text-[#140d0a]"
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>
            <button
              className={`${navButton} left-[87%]`}
              aria-label={user ? `Conta de ${user.profile.name}` : 'Entrar'}
              onClick={() => go('login')}
            >
              <UserRound fill="currentColor" />
            </button>
          </nav>
        </>
      )}
      {page === 'detalhes' &&
        (!selectedKey || isNftNotFound(detailQuery.error) ? (
          <div role="alert" className={catalogMessage}>
            <p>NFT não encontrado.</p>
            <button
              className={catalogMessageButton}
              type="button"
              onClick={() => go('inicio')}
            >
              Voltar ao catálogo
            </button>
          </div>
        ) : detailQuery.isPending ? (
          <div role="status" className={catalogMessage}>
            Carregando NFT…
          </div>
        ) : detailQuery.isError ? (
          <div role="alert" className={catalogMessage}>
            <p>Não foi possível carregar o NFT.</p>
            <button
              className={catalogMessageButton}
              type="button"
              onClick={() => void detailQuery.refetch()}
            >
              Tentar novamente
            </button>
          </div>
        ) : selectedNft && edition ? (
          <>
            <div className="relative z-[2] flex justify-between">
              <button
                className={roundButton}
                aria-label="Voltar"
                onClick={back}
              >
                <ArrowLeft size={20} />
              </button>
            <MobileFavoriteButton
              id={selectedNft.id}
              name={selectedNft.name}
              className={roundButton}
              size={19}
            />
            </div>
            <img
              className="mt-2 h-[355px] w-full rounded-3xl object-cover"
              src={selectedNft.image}
              alt={selectedNft.name}
            />
            <div className="relative -mx-6 -mt-[30px] -mb-[34px] rounded-t-[32px] bg-[#2a1d17] px-6 pt-8 pb-[34px]">
              <div className="flex items-center justify-between gap-2">
                <h1 className="whitespace-nowrap text-[19px] font-extrabold">
                  {selectedNft.name}
                </h1>
                <span className="whitespace-nowrap rounded-[20px] border border-[#b6763e] p-1 text-[13px] text-[#efb46b]">
                  ★ 4.8⁽¹⁹⁾
                </span>
              </div>
              <p className="mt-[14px] mb-2 text-sm leading-[1.8] text-[#cbb090]">
                Um colecionável digital da coleção Kurio Editions.
              </p>
              <b className="text-sm">Edição:</b>
              <div
                className="mt-1.5 flex gap-2.5"
                role="group"
                aria-label="Edição"
              >
                {selectedNft.editions.map((option) => (
                  <button
                    type="button"
                    key={option.id}
                    aria-label={`Edição ${option.label}${option.availableQuantity === 0 ? ', esgotada' : ''}`}
                    aria-pressed={edition.id === option.id}
                    className={`min-h-9 rounded-[20px] border bg-transparent px-[9px] py-1 text-[13px] ${edition.id === option.id ? 'border-[#d28a4c] font-bold text-[#e89b55]' : 'border-[#523021] text-[#cbb090]'}`}
                    onClick={() => selectEdition(option.id)}
                  >
                    {option.label}
                    {option.availableQuantity === 0 ? ' · Esgotada' : ''}
                  </button>
                ))}
              </div>
              <p className="mt-2 mb-[25px] text-sm leading-[2.2] text-[#b99a6a]">
                Coleção: Kurio Editions
                <br />
                Edição: {edition.label}
                <br />
                Preço: {edition.price} ETH
                <br />
                Disponíveis: {edition.availableQuantity}
              </p>
              <div className="border-t border-[#332219] pt-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[#cfb28c]">Qtd.</span>
                  <button
                    type="button"
                    className={quantityButton}
                    onClick={() => setQuantity(safeQuantity - 1)}
                    aria-label="Diminuir quantidade"
                    disabled={safeQuantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <strong
                    className="text-sm"
                    aria-label="Quantidade selecionada"
                  >
                    {safeQuantity}
                  </strong>
                  <button
                    type="button"
                    className={quantityButton}
                    onClick={() => setQuantity(safeQuantity + 1)}
                    aria-label="Aumentar quantidade"
                    disabled={safeQuantity >= maxQuantity}
                  >
                    <Plus size={16} />
                  </button>
                  <strong className="ml-auto text-xl text-[#e89b55]">
                    {multiplyEth(edition.price, safeQuantity)} ETH
                  </strong>
                </div>
                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    className={`${primaryButton} !w-3/5 !rounded-[40px] disabled:cursor-not-allowed disabled:opacity-50`}
                    disabled={!purchase?.supported || safeQuantity < 1}
                    onClick={() => {
                      setCartMessage('')
                      void addToCart(selectedNft.id, edition.id, safeQuantity)
                        .then(() => go('pagamento'))
                        .catch((error: unknown) => setCartMessage(authErrorMessage(error)))
                    }}
                  >
                    Comprar NFT
                  </button>
                  <button
                    type="button"
                    className="grid size-[60px] shrink-0 place-items-center rounded-full border border-[#4b3022] bg-[#302017] p-0 leading-none text-[#cfb28c] disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Adicionar ao carrinho"
                    disabled={!purchase?.supported || safeQuantity < 1}
                    onClick={() => {
                      setCartMessage('')
                      void addToCart(selectedNft.id, edition.id, safeQuantity)
                        .then(() => go('carrinho'))
                        .catch((error: unknown) => setCartMessage(authErrorMessage(error)))
                    }}
                  >
                    <ShoppingCart size={20} fill="currentColor" />
                  </button>
                </div>
                {cartMessage && <p role="alert" className={catalogMessage}>{cartMessage}</p>}
                {edition.availableQuantity === 0 && (
                  <p role="status" className={catalogMessage}>
                    Esta edição está esgotada.
                  </p>
                )}
                {edition.availableQuantity > 0 && !purchase?.supported && (
                  <p role="status" className={catalogMessage}>
                    A compra desta edição ainda não está disponível.
                  </p>
                )}
                {purchase?.supported && purchase.remaining === 0 && (
                  <p role="status" className={catalogMessage}>
                    O limite de estoque desta edição já está no carrinho.
                  </p>
                )}
              </div>
            </div>
          </>
        ) : (
          <div role="alert" className={catalogMessage}>
            <p>NFT não encontrado.</p>
            <button
              className={catalogMessageButton}
              type="button"
              onClick={() => go('inicio')}
            >
              Voltar ao catálogo
            </button>
          </div>
        ))}
      {page === 'carrinho' && (
        <>
          <header className={header}>
            <button className={roundButton} aria-label="Voltar" onClick={back}>
              <ArrowLeft size={20} />
            </button>
            <h1 className="whitespace-nowrap text-xl font-extrabold">
              Carrinho de NFTs
            </h1>
          </header>
          {realtimeNotice && <p role="status" className={catalogMessage}>{realtimeNotice}</p>}
          <div className="grid gap-5">
            {cartItems(cart).map((nft) => (
              <article
                className="relative flex h-[100px] overflow-hidden rounded-2xl bg-[#2a1d17]"
                key={nft.key}
              >
                <img
                  className="size-[100px] object-cover"
                  src={nft.image}
                  alt={nft.name}
                />
                <div className="min-w-0 px-2 py-3">
                  <h2 className="whitespace-nowrap text-sm">{nft.name}</h2>
                  <p className="whitespace-nowrap text-[13px] text-[#cbb090]">
                    Edição: {nft.edition}
                  </p>
                  <strong className="mt-3 block text-[17px] text-[#e89b55]">
                    {nft.price} ETH
                  </strong>
                </div>
                <div className="absolute top-[39px] right-[14px] flex items-center gap-3">
                  <button
                    className="grid size-6 shrink-0 place-items-center rounded-full border border-[#4b3022] bg-[#342218] p-0 leading-none text-[#eee]"
                    aria-label={`Diminuir ${nft.name}`}
                    onClick={() => void changeQuantity(nft, -1).catch((error: unknown) => setCartMessage(authErrorMessage(error)))}
                  >
                    <Minus size={15} />
                  </button>
                  <span>{nft.quantity}</span>
                  <button
                    className="grid size-6 shrink-0 place-items-center rounded-full border border-[#4b3022] bg-[#342218] p-0 leading-none text-[#eee]"
                    aria-label={`Aumentar ${nft.name}`}
                    disabled={nft.quantity >= nft.availableQuantity}
                    onClick={() => void changeQuantity(nft, 1).catch((error: unknown) => setCartMessage(authErrorMessage(error)))}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </article>
            ))}
            {cartCount === 0 && (
              <p>Seu carrinho está vazio. Explore os NFTs para começar.</p>
            )}
          </div>
          <div className="-mx-6 mt-1 -mb-[34px] min-h-[340px] rounded-t-[30px] bg-[#2a1d17] px-6 pt-6 pb-[34px]">
            <div className="mb-[14px] flex h-[52px] overflow-hidden rounded-[30px] border border-[#4b3022]">
              <input
                className="min-w-0 flex-1 border-0 bg-transparent pl-[15px] text-xs text-[#f5f1eb] placeholder:text-[#bd9b6f]"
                placeholder="Digite o código promocional..."
                aria-label="Código promocional"
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
              />
              <button
                className="rounded-[30px] border-0 bg-[#af7545] px-[18px] font-bold text-white"
                onClick={() => {
                  const next = promo.trim().toUpperCase()
                  setAppliedCoupon(next)
                  setPromoMessage(next ? '' : 'Digite um código')
                }}
              >
                Aplicar
              </button>
            </div>
            {(promoMessage || quote.isError || cartMessage) && (
              <small role="alert" className="text-[#e89b55]">{cartMessage || promoMessage || authErrorMessage(quote.error)}</small>
            )}
            <div className={cartRow}>
              <span>Subtotal</span>
              <span>{subtotal} ETH</span>
            </div>
            <div className={cartRow}>
              <span>Desconto do lançamento</span>
              <span>(-) {quote.data?.discount ?? '0'} ETH</span>
            </div>
            <div className={cartRow}>
              <span>Taxa de rede</span>
              <span>{quote.data?.networkFee ?? (cartCount ? '0.016' : '0')} ETH</span>
            </div>
            <small className="-mt-[14px] block text-right text-[11px]">
              Taxa estimada
            </small>
            <div className="mt-5 mb-7 flex justify-between text-sm">
              <b>Total</b>
              <strong className="text-lg text-[#e89b55]">
                {total} ETH
              </strong>
            </div>
            {button(
              'Conectar e finalizar',
              () => go('pagamento'),
              cartCount && !quote.isError && !quote.isPending && !quote.isFetching ? '!rounded-[40px]' : '!rounded-[40px] disabled',
            )}
          </div>
        </>
      )}
      {page === 'pagamento' && (
        <>
          <header className={header}>
            <button className={roundButton} aria-label="Voltar" onClick={back}>
              <ArrowLeft size={20} />
            </button>
            <h1 className="whitespace-nowrap text-xl font-extrabold">
              Pagamento com carteira
            </h1>
          </header>
          {realtimeNotice && <p role="status" className={catalogMessage}>{realtimeNotice}</p>}
          {orderId ? (
            <div className="mt-[120px] text-center">
              <h2>{order.data?.status === 'declined' ? 'Pagamento recusado' : order.data?.status === 'confirmed' ? 'Pedido confirmado' : order.data?.status === 'pending' ? 'Pedido pendente' : 'Carregando pedido'}</h2>
              <p className="my-5 mb-[30px] text-[#cbb090]">
                {order.isError
                  ? 'Não foi possível recuperar o pedido. Atualize a página para tentar novamente.'
                  : order.data
                    ? `Pedido #${order.data.id.slice(0, 8)} · ${order.data.total} ETH. Esta é uma simulação; nenhuma transação foi enviada à rede.`
                    : 'Carregando pedido…'}
              </p>
              {order.data && (
                <div className="mb-6 text-left text-sm text-[#cbb090]">
                  <p className="mb-2">Referência simulada: SIM-{order.data.id.slice(0, 8)}</p>
                  {order.data.items.map((item) => (
                    <p key={`${item.nftId}:${item.editionId}`} className="mb-2">
                      {item.name} · {item.quantity} × {item.price} ETH
                    </p>
                  ))}
                  <p>Subtotal: {order.data.subtotal} ETH</p>
                  <p>Desconto: {order.data.discount} ETH</p>
                  <p>Taxa de rede: {order.data.networkFee} ETH</p>
                  <p className="font-bold text-[#e89b55]">Total: {order.data.total} ETH</p>
                </div>
              )}
              {button('Voltar ao início', () => go('inicio'))}
            </div>
          ) : (
            <>
              <div className="mb-[14px] flex justify-between text-sm">
                <b>Carteira conectada</b>
                <button
                  className="border-0 bg-transparent font-bold text-[#e89b55]"
                  onClick={() => {
                    const options = wallets.data?.items ?? []
                    const index = options.findIndex((item) => item.id === selectedWallet)
                    setWallet(options[(index + 1) % options.length]?.id ?? '')
                  }}
                >
                  Trocar carteira
                </button>
              </div>
              {(wallets.data?.items ?? []).map((savedWallet) => (
                <button
                  className="mb-5 flex h-[93px] w-full items-center gap-5 rounded-[15px] border-0 bg-[#2a1d17] px-5 py-4 text-left text-[#f5f1eb]"
                  key={savedWallet.id}
                  onClick={() => setWallet(savedWallet.id)}
                >
                  <span
                    className={`${selectionIndicator} ${selectedWallet === savedWallet.id ? selectedIndicator : ''}`}
                  />
                  <div className="flex-1">
                    <b className="text-base">{savedWallet.label}</b>
                    <p className="mt-1 text-sm text-[#cbb090]">
                      {savedWallet.address}
                      <br />
                      Rede {savedWallet.network}
                    </p>
                  </div>
                  <span className="text-[#cfb28c]">⋮</span>
                </button>
              ))}
              {!wallets.data?.items.length && (
                <button type="button" className="mb-5 text-sm text-[#E89B55] underline" onClick={() => window.location.assign('/carteiras')}>
                  Cadastre uma carteira para concluir
                </button>
              )}
              <h2 className="mt-1 mb-3 text-base">Carteira e rede</h2>
              {['WalletConnect', 'MetaMask', 'Coinbase Wallet'].map(
                (name, i) => (
                  <button
                    className="mb-4 flex h-[65px] w-full items-center gap-3 rounded-[15px] border-0 bg-[#2a1d17] px-4 py-3 text-left text-sm text-[#f5f1eb]"
                    key={name}
                    onClick={() => setProvider(name)}
                  >
                    <span className="grid size-[39px] place-items-center rounded-full border border-[#563421] font-bold text-[#e89b55]">
                      {i === 2 ? '◉' : name[0]}
                    </span>
                    {name}
                    <span
                      className={`${selectionIndicator} ml-auto ${provider === name ? selectedIndicator : ''}`}
                    />
                  </button>
                ),
              )}
              <div className="mt-2.5 text-right font-bold">
                Total:{' '}
                <strong className="ml-[18px] text-lg text-[#e89b55]">
                  {quote.data?.total ?? total} ETH
                </strong>
              </div>
              <button
                type="button"
                className={`${primaryButton} fixed bottom-[34px] left-[7%] !w-[86%] !rounded-[40px] disabled:opacity-50`}
                disabled={!quote.data || quote.isFetching || !selectedWallet || !provider || orderPending}
                onClick={submitOrder}
              >
                {orderPending ? 'Confirmando…' : 'Confirmar compra'}
              </button>
              {(orderError || quote.isError) && (
                <p role="alert" className="mt-4 text-sm text-[#E89B55]">{orderError || 'A cotação mudou. Volte ao carrinho.'}</p>
              )}
            </>
          )}
        </>
      )}
      {(page === 'login' || page === 'cadastro') && (
        <div className="flex min-h-[calc(100dvh-48px)] flex-col">
          <h1 className="mt-[100px] text-center text-[32px] tracking-[3px]">
            KURIO
          </h1>
          <h2
            className={`mt-[82px] text-center text-[19px] ${page === 'cadastro' ? 'mb-[34px]' : 'mb-[62px]'}`}
          >
            {page === 'login' ? 'Entrar' : 'Criar perfil de colecionador'}
          </h2>
          {user ? (
            <div className="rounded-xl border border-[#513020] bg-[#241612] p-5 text-center">
              <p>Você está conectado como {user.profile.name}.</p>
              <button
                type="button"
                className={`${primaryButton} mt-6`}
                onClick={() => go('inicio')}
              >
                Continuar
              </button>
              <button
                type="button"
                className="mt-5 text-[#e89b55] underline"
                onClick={() => void logout()}
              >
                Sair
              </button>
            </div>
          ) : sessionLoading ? (
            <p role="status">Verificando sessão…</p>
          ) : (
            <form
              className="flex flex-col gap-3"
              onSubmit={(e) => {
                e.preventDefault()
                const form = e.currentTarget
                const data = new FormData(form)
                const password = String(data.get('password') ?? '')
                if (
                  page === 'cadastro' &&
                  password !== data.get('confirmPassword')
                ) {
                  const confirm = form.elements.namedItem('confirmPassword')
                  if (confirm instanceof HTMLInputElement) {
                    confirm.setCustomValidity('As senhas não coincidem.')
                    confirm.reportValidity()
                  }
                  return
                }
                setAuthPending(true)
                setAuthMessage('')
                void (async () => {
                  try {
                    const email = String(data.get('email') ?? '')
                    if (page === 'cadastro')
                      await register(
                        String(data.get('name') ?? ''),
                        email,
                        password,
                      )
                    else await login(email, password)
                    const next = currentUrl.searchParams.get('next')
                    const target = next
                      ? new URL(next, window.location.origin)
                      : null
                    if (
                      target?.origin === window.location.origin &&
                      !['/login', '/cadastro'].includes(target.pathname)
                    )
                      window.location.assign(
                        `${target.pathname}${target.search}${target.hash}`,
                      )
                    else go('inicio')
                  } catch (error) {
                    setAuthMessage(authErrorMessage(error))
                  } finally {
                    setAuthPending(false)
                  }
                })()
              }}
            >
              {page === 'cadastro' && (
                <input
                  className={authInput}
                  name="name"
                  required
                  minLength={2}
                  maxLength={80}
                  autoComplete="name"
                  placeholder="Nome de usuário"
                  aria-label="Nome de usuário"
                />
              )}
              <input
                className={authInput}
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder={
                  page === 'login' ? 'contato@email.com' : 'Digite seu e-mail'
                }
                aria-label="E-mail"
              />
              <div className="relative">
                <input
                  className={`${authInput} pr-12`}
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={page === 'cadastro' ? 8 : undefined}
                  autoComplete={
                    page === 'cadastro' ? 'new-password' : 'current-password'
                  }
                  placeholder={page === 'login' ? '***********' : 'Senha'}
                  aria-label="Senha"
                />
                <button
                  type="button"
                  className="absolute top-[15px] right-3 border-0 bg-transparent text-[#7b4b2c]"
                  aria-label="Mostrar senha"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              {page === 'cadastro' && (
                <div className="relative">
                  <input
                    className={`${authInput} pr-12`}
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    onInput={(event) =>
                      event.currentTarget.setCustomValidity('')
                    }
                    placeholder="Confirmar senha"
                    aria-label="Confirmar senha"
                  />
                  <button
                    type="button"
                    className="absolute top-[15px] right-3 border-0 bg-transparent text-[#7b4b2c]"
                    aria-label="Mostrar senha"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <EyeOff size={18} />
                  </button>
                </div>
              )}
              {page === 'login' && (
                <button
                  type="button"
                  className="self-end border-0 bg-transparent p-0 text-sm text-[#e89b55]"
                  onClick={() => alert('Recuperação de senha em breve')}
                >
                  Esqueceu a senha?
                </button>
              )}
              <button
                type="submit"
                disabled={authPending}
                className={`${primaryButton} mt-7 disabled:opacity-60`}
              >
                {authPending
                  ? 'Aguarde…'
                  : page === 'login'
                    ? 'Entrar'
                    : 'Criar perfil'}
              </button>
            </form>
          )}
          {authMessage && (
            <p role="alert" className="mt-3 text-sm text-[#f2a368]">
              {authMessage}
            </p>
          )}
          <div className="mt-10 mb-3 flex items-center gap-2.5 whitespace-nowrap text-xs before:h-px before:flex-1 before:bg-[#513020] before:content-[''] after:h-px after:flex-1 after:bg-[#513020] after:content-['']">
            Ou continue com
          </div>
          <button
            className={socialButton}
            onClick={() => setAuthMessage('Login com Google requer OAuth.')}
          >
            <span className="mr-3 font-[Arial,sans-serif] text-[22px] font-extrabold text-[#4285f4]">
              G
            </span>
            Continuar com Google
          </button>
          <button
            className={socialButton}
            onClick={() => setAuthMessage('Login com Facebook requer OAuth.')}
          >
            <span className="mr-3 font-[Arial,sans-serif] text-[22px] font-extrabold text-[#597dba]">
              f
            </span>
            Continuar com Facebook
          </button>
          <button
            className="mx-auto mt-auto border-0 bg-transparent pt-[25px] text-sm text-[#cbb090]"
            onClick={() => go(page === 'login' ? 'cadastro' : 'login')}
          >
            {page === 'login'
              ? 'Novo na Kurio? Crie uma conta'
              : 'Já tem uma conta? Entre'}
          </button>
        </div>
      )}
      {page === 'indisponivel' && (
        <div className={catalogMessage} role="status">
          <p>Esta área ainda não está disponível no celular.</p>
          <button
            className={catalogMessageButton}
            type="button"
            onClick={() => go('inicio')}
          >
            Voltar ao início
          </button>
        </div>
      )}
    </div>
  )
}
