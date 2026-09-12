import { Footer } from '#/components/footer'
import { Navbar } from '#/components/navbar'
import { NftData } from '#/components/nft/nft-data'
import { NftGallery } from '#/components/nft/nft-gallery'

import { createFileRoute } from '@tanstack/react-router'

import { BreadcrumbComponent } from '#/components/breadcrumb'
import { MoreCollection } from '#/components/more-collection'

export const Route = createFileRoute('/mercado')({
  component: NftDetails,
})

function NftDetails() {
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
        <div className="flex gap-8 mb-24">
          <NftGallery />
          <NftData />
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
            Emerald Ape #042 é uma obra digital 1/50 finalizada à mão da coleção
            Kurio Editions. Cada atributo fica armazenado nos metadados do token
            e verificado na Ethereum. A obra explora identidade, movimento e luz
            em um mundo digital sem fronteiras.
          </p>

          <p className="text-sm leading-6 font-normal text-[#CFB28C] mb-3">
            A propriedade inclui a arte em alta resolução, lançamentos
            exclusivos para colecionadores e um registro permanente de
            procedência registrada na rede. Nova Sato recebe 5% de direitos
            autorais nas vendas secundárias, apoiando novos trabalhos e
            lançamentos da comunidade.
          </p>

          <p className="text-sm leading-6 font-bold text-[#F5F1EB]">Rede:</p>
          <p className="text-sm leading-6 font-normal text-[#CFB28C] mb-3">
            Cunhado na Ethereum com procedência imutável e metadados armazenados
            no IPFS.
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
            0x7A42...19E8 • Contrato inteligente ERC-721 verificado.
          </p>
        </article>

        <MoreCollection title="Mais desta coleção" />
      </main>
      <Footer />
    </>
  )
}
