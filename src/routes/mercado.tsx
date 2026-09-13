import { Footer } from '#/components/footer'
import { Navbar } from '#/components/navbar'
import { NftDetailPanel } from '#/components/nft/nft-detail-panel'
import { NftGallery } from '#/components/nft/nft-gallery'

import { createFileRoute, useRouterState } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'

import { BreadcrumbComponent } from '#/components/breadcrumb'
import { MoreCollection } from '#/components/more-collection'
import { isNftNotFound, nftDetailOptions } from '#/api/nfts'

export const Route = createFileRoute('/mercado')({
  component: NftDetails,
})

function NftDetails() {
  const href = useRouterState({ select: (state) => state.location.href })
  const selectedItem = new URL(href, window.location.origin).searchParams.get(
    'item',
  )
  const query = useQuery({
    ...nftDetailOptions(selectedItem ?? ''),
    enabled: Boolean(selectedItem),
  })
  const selectedNft = query.data
  const networkName = selectedNft
    ? selectedNft.network[0].toUpperCase() + selectedNft.network.slice(1)
    : ''

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
                label: 'Detalhes do NFT',
              },
            ]}
          />
        </div>
        {!selectedItem || isNftNotFound(query.error) ? (
          <div role="status" className="mb-24 text-[#F5F1EB]">
            <p>NFT não encontrado.</p>
            <a href="/" className="mt-3 inline-block underline">
              Voltar ao catálogo
            </a>
          </div>
        ) : query.isPending ? (
          <div role="status" aria-label="Carregando detalhes do NFT" className="mb-24 min-h-[1400px] text-[#F5F1EB]">
            <p className="mb-5">Carregando detalhes do NFT…</p>
            <div className="flex gap-8" aria-hidden="true">
              <div className="h-112.5 w-1/2 animate-catalog-shimmer rounded-xl bg-[linear-gradient(90deg,#241612_25%,#493023_50%,#241612_75%)] bg-size-[200%_100%] motion-reduce:animate-none" />
              <div className="w-1/2 space-y-5">
                <div className="h-10 w-3/4 animate-catalog-shimmer rounded bg-[linear-gradient(90deg,#241612_25%,#493023_50%,#241612_75%)] bg-size-[200%_100%] motion-reduce:animate-none" />
                <div className="h-72 animate-catalog-shimmer rounded bg-[linear-gradient(90deg,#241612_25%,#493023_50%,#241612_75%)] bg-size-[200%_100%] motion-reduce:animate-none" />
              </div>
            </div>
          </div>
        ) : query.isError ? (
          <div role="alert" className="mb-24 text-[#F5F1EB]">
            <p>Não foi possível carregar os detalhes do NFT.</p>
            <button
              type="button"
              disabled={query.isFetching}
              onClick={() => void query.refetch()}
              className="mt-3 underline focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              Tentar novamente
            </button>
          </div>
        ) : selectedNft ? (
          <>
            <div className="flex gap-8 mb-24">
              <NftGallery image={selectedNft.image} name={selectedNft.name} />
              <NftDetailPanel nft={selectedNft} />
            </div>
            <div className="flex items-center gap-8 pb-3 border-b-[0.3px] border-[#D28A4C] mb-3">
              <span className="text-[17px] font-normal text-[#F5F1EB]">
                Detalhes do NFT
              </span>
              <span className="text-[17px] font-normal text-[#F5F1EB]">
                Avaliações de colecionadores (19)
              </span>
            </div>

            <article className="mb-24">
              <p className="text-sm leading-6 font-normal text-[#CFB28C] mb-6">
                {selectedNft.name} é uma obra digital {selectedNft.edition}{' '}
                finalizada à mão da coleção Kurio Editions. Cada atributo fica
                armazenado nos metadados do token e verificado na {networkName}.
                A obra explora identidade, movimento e luz em um mundo digital
                sem fronteiras.
              </p>

              <p className="text-sm leading-6 font-normal text-[#CFB28C] mb-3">
                A propriedade inclui a arte em alta resolução, lançamentos
                exclusivos para colecionadores e um registro permanente de
                procedência registrada na rede. Nova Sato recebe 5% de direitos
                autorais nas vendas secundárias, apoiando novos trabalhos e
                lançamentos da comunidade.
              </p>

              <p className="text-sm leading-6 font-bold text-[#F5F1EB]">
                Rede:
              </p>
              <p className="text-sm leading-6 font-normal text-[#CFB28C] mb-3">
                Cunhado na {networkName} com procedência imutável e metadados
                armazenados no IPFS.
              </p>

              <p className="text-sm leading-6 font-bold text-[#F5F1EB]">
                Contrato:
              </p>
              <p className="text-sm leading-6 font-normal text-[#CFB28C] mb-3">
                Direitos autorais do criador: 5% nas vendas secundárias, pagos
                automaticamente pelos mercados compatíveis.
              </p>

              <p className="text-sm leading-6 font-bold text-[#F5F1EB]">
                Direitos autorais:
              </p>

              <p className="text-sm leading-6 font-normal text-[#CFB28C]">
                {selectedNft.network === 'ethereum'
                  ? '0x7A42...19E8 • Contrato inteligente ERC-721 verificado.'
                  : `Edição ${selectedNft.editionId} registrada na ${networkName}.`}
              </p>
            </article>

            <MoreCollection
              title="Mais desta coleção"
              currentId={selectedNft.id}
              genre={selectedNft.genre}
            />
          </>
        ) : null}
      </main>
      <Footer />
    </>
  )
}
